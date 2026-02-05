# Koraveler 프로젝트 개발 가이드

## 1. 프로젝트 개요
한국 여행 블로그 플랫폼 Koraveler 개발. Google AdSense 수익화 목표.

## 2. 기술 스택

### Backend
- Spring Boot 3.2.5
- MongoDB (Spring Data MongoDB) v5
- Spring Security + JWT (stateless)
- Redis (ElastiCache/Local)
- AWS (EC2, S3, Lambda, CloudWatch)

### Frontend
- React 18 + TypeScript
- Chakra UI v3
- TanStack React Query (서버 상태 관리)
- Jotai (복잡한 로컬 상태)
- TipTap Editor (리치 콘텐츠)

---

## 3. 아키텍처 원칙

### 개발 순서
**Backend First 원칙**: Model → Repository → Service → Controller → Frontend

### 레이어 분리
```
Backend:
  model/      - MongoDB Document 엔티티
  dto/        - 데이터 전송 객체
  repo/       - Spring Data MongoDB Repository
  service/    - 비즈니스 로직 인터페이스
  service/serviceImpl/ - 구현체
  controller/ - REST API 엔드포인트

Frontend:
  endpoints/  - API 호출 함수 (axios)
  hooks/      - React Query hooks (useXxxQueries)
  components/ - Presentational 컴포넌트 + Custom hooks (useXxx)
  stores/     - Jotai atoms (복잡한 상태만)
  types/      - TypeScript 타입 정의
```

---

## 4. 코딩 컨벤션

### 4.1 Backend 패턴

#### Model (MongoDB Document)
```java
@Document(collection = "collection_name")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EntityName extends CommonDTO {
    @Id
    private String id;
    
    @Field(targetType = FieldType.OBJECT_ID)
    @Indexed
    private String foreignKeyId;  // 참조 ID는 @Indexed
    
    // 비정규화된 count 필드 (성능 최적화)
    private int likeCount;
    private int viewCount;
}
```

#### Repository
```java
@Repository
public interface EntityRepo extends MongoRepository<Entity, String> {
    // 단일 조회
    Optional<Entity> findByFieldAndOtherField(String field, String otherField);
    
    // 존재 여부 (boolean 필드는 "is" 생략!)
    boolean existsByFieldAndOtherField(String field, String otherField);
    
    // 페이징 조회 (삭제되지 않은 것만)
    Page<Entity> findByParentIdAndDeletedFalse(String parentId, Pageable pageable);
    
    // 벌크 조회 (N+1 방지)
    List<Entity> findByIdInAndUserId(List<String> ids, String userId);
}
```

#### Service Interface
```java
public interface EntityService {
    EntityDTO create(EntityDTO dto, String userId) throws Exception;
    EntityDTO update(String id, EntityDTO dto, String userId) throws Exception;
    void delete(String id, String userId) throws Exception;
    EntityDTO getById(String id) throws Exception;
    Page<EntityDTO> getList(Pageable pageable) throws Exception;
}
```

#### Service Implementation
```java
@Service
@Slf4j
@RequiredArgsConstructor  // 생성자 주입 선호
public class EntityServiceImpl implements EntityService {
    
    private final EntityRepo entityRepo;
    
    @Override
    public EntityDTO create(EntityDTO dto, String userId) throws Exception {
        // 1. 검증
        // 2. Entity 생성
        // 3. 저장
        // 4. DTO 변환 후 반환
    }
}
```

#### Controller
```java
@RestController
@RequestMapping("/api/v1/entities")
@RequiredArgsConstructor
@Slf4j
public class EntityController {
    
    private final EntityService entityService;
    
    // 인증 필요 엔드포인트
    @PostMapping("")
    public ResponseEntity<?> create(
            @RequestBody EntityDTO dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        EntityDTO result = entityService.create(dto, userDetails.getUserId());
        return ResponseEntity.ok(result);
    }
    
    // 비인증 허용 엔드포인트 (ps = public service)
    @GetMapping("/ps/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return ResponseEntity.ok(entityService.getById(id));
    }
}
```

### 4.2 Frontend 패턴

#### API Endpoints (endpoints/xxx-endpoints.ts)
```typescript
import { FuncProps } from "../utils/useAuthEP";
import { request } from "../appConfig/request-response";
import { AxiosResponse } from "axios";

export interface EntityDTO {
  id?: string;
  fieldName: string;
  // ...
}

// 인증 필요 API
export async function createEntity(props: FuncProps) {
  return (await request.post(
    "api/v1/entities",
    props.reqBody,
    {
      headers: { Authorization: `Bearer ${props.accessToken}` }
    }
  )) as AxiosResponse<EntityDTO>;
}

// 비인증 허용 API
export async function getEntity(props: FuncProps) {
  const config = props.accessToken
    ? { headers: { Authorization: `Bearer ${props.accessToken}` } }
    : {};
    
  return (await request.get(
    `api/v1/entities/ps/${props.params.id}`,
    config
  )) as AxiosResponse<EntityDTO>;
}
```

#### React Query Hooks (hooks/useEntityQueries.ts)
```typescript
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthEP from "../utils/useAuthEP";

// Query Keys
export const entityKeys = {
  all: ["entities"] as const,
  detail: (id: string) => [...entityKeys.all, "detail", id] as const,
  list: (params: object) => [...entityKeys.all, "list", params] as const,
};

// 조회 Hook
export const useEntity = (id?: string) => {
  const authEP = useAuthEP();
  
  return useQuery<EntityDTO>({
    queryKey: entityKeys.detail(id!),
    queryFn: async () => {
      const res = await authEP({
        func: getEntity,
        params: { id }
      });
      return res.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// Mutation Hook
export const useCreateEntity = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation<EntityDTO, Error, Partial<EntityDTO>>({
    mutationFn: async (data) => {
      const res = await authEP({
        func: createEntity,
        reqBody: data
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: entityKeys.all
      });
    },
  });
};
```

#### Component Custom Hook (useComponent.ts)
```typescript
export interface UseComponentProps {
  entityId: string;
  onSuccess?: () => void;
}

export default function useComponent({ entityId, onSuccess }: UseComponentProps) {
  const { data: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  
  // React Query hooks
  const { data, isLoading } = useEntity(entityId);
  const createMutation = useCreateEntity();
  
  // 로컬 상태 (필요한 경우만)
  const [localState, setLocalState] = useState<string>("");
  
  // 핸들러
  const handleSubmit = useCallback(async () => {
    createMutation.mutate(
      { /* data */ },
      { onSuccess }
    );
  }, [createMutation, onSuccess]);
  
  return {
    data,
    isLoading,
    localState,
    handleSubmit,
    isSubmitting: createMutation.isPending,
  };
}
```

#### Presentational Component
```tsx
interface ComponentProps {
  entityId: string;
}

export default function Component({ entityId }: ComponentProps) {
  const {
    data,
    isLoading,
    handleSubmit,
    isSubmitting
  } = useComponent({ entityId });
  
  if (isLoading) return <Spinner />;
  
  return (
    <VStack gap={4}>
      {/* Chakra UI v3 컴포넌트 사용 */}
    </VStack>
  );
}
```

---

## 5. 주요 기능 명세

### 5.1 좋아요 (Like)
- **대상**: Document(블로그 글), Comment
- **권한**: 로그인 사용자만 (본인 글에도 가능)
- **동작**: 토글 방식 (좋아요/취소)
- **저장**: 별도 컬렉션 + 원본에 likeCount 비정규화

### 5.2 태그 (Tag)
- **공유**: 모든 사용자가 등록된 태그 사용 가능
- **대소문자**: 구분함 (food ≠ Food)
- **등록**: 글 작성 시 태그 입력 후 엔터 → 자동 생성/조회
- **필드**: tagName, slug(URL용), usageCount, color

### 5.3 댓글 (Comment)
- **깊이**: 최대 3depth (a → b → c)
- **에디터**: TipTap (글, 이미지, 첨부파일)
- **기능**: 생성, 수정, 삭제, 숨김처리, 좋아요
- **조회**: 1depth만 초기 로드 → 대댓글 펼치기로 하위 로드
- **규칙**: c 댓글에 대댓글 → 자동으로 b의 대댓글로 처리

### 5.4 조회수 (View)
- **기준**: IP 주소 기반 (로그인 여부 무관)
- **중복 방지**: Redis TTL 24시간
- **저장**: DocumentView 컬렉션 + Redis 캐시

---

## 6. URL 패턴

### 인증 필요
```
POST   /api/v1/xxx          - 생성
PUT    /api/v1/xxx/{id}     - 수정
DELETE /api/v1/xxx/{id}     - 삭제
PATCH  /api/v1/xxx/{id}/xxx - 부분 수정
```

### 비인증 허용 (ps = public service)
```
GET    /api/v1/xxx/ps/{id}      - 단일 조회
GET    /api/v1/xxx/ps/list      - 목록 조회
```

---

## 7. 인증 처리

### Backend
```java
// Controller에서 사용자 정보 가져오기
@AuthenticationPrincipal CustomUserDetails userDetails
userDetails.getUserId()  // 사용자 ID
```

### Frontend
```typescript
// useAuthEP 훅 사용
const authEP = useAuthEP();
const res = await authEP({
  func: apiFunction,
  params: { id: "123" },
  reqBody: { data: "value" }
});
```

---

## 8. 개발 시 주의사항

1. **Boolean 필드 쿼리**: Repository 메서드에서 `isDeleted` → `deletedFalse` (is 생략)
2. **N+1 방지**: 목록 조회 시 `findByIdIn()` 사용
3. **비정규화 활용**: 자주 조회되는 count 필드는 원본 문서에 저장
4. **Redis TTL**: 실시간(1분), 통계(5분), 중복방지(24시간)
5. **에러 처리**: Backend는 Exception, Frontend는 React Query의 onError 활용