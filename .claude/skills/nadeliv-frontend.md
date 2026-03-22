# Nadeliv Frontend - 프로젝트 개발 가이드

> Claude Code 및 Claude AI가 nadeliv-frontend 프로젝트를 이해하고
> 일관된 코드를 생성할 수 있도록 작성된 통합 지침서입니다.

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | Nadeliv (코라벨러) |
| 설명 | 서울 외 지역 한국 여행지를 외국인에게 소개하는 여행 블로그 플랫폼 |
| 수익화 | Google AdSense |
| 프론트엔드 | React 18 + TypeScript |
| 백엔드 | Spring Boot 3.2.5 + MongoDB v5 + Redis |
| 배포 | AWS EC2 (nginx) + S3 (이미지) |
| 도메인 | www.nadeliv.com |

---

## 2. 기술 스택

### Backend
- Spring Boot 3.2.5
- MongoDB (Spring Data MongoDB) v5
- Spring Security + JWT (stateless)
- Redis (ElastiCache/Local)
- AWS (EC2, S3, Lambda, CloudWatch)

### Frontend
```
React 18.3.1 + TypeScript
├── UI Framework:     Chakra UI v3 + Styled Components
├── Data Fetching:    TanStack React Query v5
├── HTTP Client:      Axios
├── Routing:          React Router DOM v6
├── State Management: Jotai (로컬 상태) / Recoil (레거시) / Redux (테마 전용)
├── Rich Editor:      TipTap v3 (현재 사용)
├── Maps:             Naver Maps, Kakao Maps
├── Icons:            Lucide React, React Icons
├── Animation:        Framer Motion
├── WebSocket:        STOMP.js + SockJS
├── Analytics:        PostHog, Google Analytics
└── Build:            React Scripts (CRA), PORT=3002
```

---

## 3. 폴더 구조

```
src/
├── appConfig/              # 앱 설정 (Axios 인스턴스, Auth Provider, AWS S3)
│   ├── request-response.ts     # Axios 인스턴스 (request, securityReq)
│   ├── AuthProvider.tsx         # 인증 컨텍스트 프로바이더
│   └── awsS3Config.ts           # AWS S3 설정
├── component/
│   └── page/               # 페이지 컴포넌트 (기능별 폴더)
│       ├── blog/               # BlogPage, CreateBlogPost, EditBlogPost, ViewBlog, SaveBlogPost
│       ├── travel/             # 여행 정보
│       ├── tech/               # 기술 블로그
│       ├── messenger/          # 메신저
│       ├── admin/              # 관리자 (Feature/components/)
│       ├── LoginPage/          # 로그인
│       ├── SignUpPage/         # 회원가입
│       ├── MainPage/           # 메인
│       ├── homePage/           # 홈 (FeaturedSection)
│       ├── menu/               # 메뉴 관리
│       └── error/              # 에러 페이지
├── common/                 # 공유 컴포넌트
│   ├── layout/                 # MainLayout, BlogLayout, EmptyLayout, HeaderLayout, Sidebar 등
│   ├── elements/               # 재사용 UI (Cus* 접두사)
│   │   ├── CusEditor/          # 커스텀 에디터 (TipTap)
│   │   ├── CusModal/           # 커스텀 모달
│   │   ├── CusSelect/          # 커스텀 셀렉트
│   │   ├── CusTab/             # 커스텀 탭
│   │   ├── CusAvatar/          # 커스텀 아바타
│   │   ├── CusGrid/            # 커스텀 그리드 (AG Grid)
│   │   ├── CusFormCtrl/        # 커스텀 폼 컨트롤
│   │   ├── CusRadio/           # 커스텀 라디오
│   │   └── buttons/            # 버튼 컴포넌트
│   └── widget/                 # 위젯
│       ├── maps/               # NaverMaps, KakaoMaps, MapSearch
│       ├── CusWeather/         # 날씨
│       ├── FolderTree/         # 폴더 트리
│       ├── BlogPostSetting/    # 블로그 글 설정
│       ├── FindRoute/          # 경로 찾기
│       ├── LocationFinder/     # 위치 찾기
│       ├── LanguageHelp/       # 언어 도움
│       └── Transport/          # 교통 정보
├── endpoints/              # API 호출 함수 (도메인별 파일)
├── hooks/                  # 커스텀 훅 (React Query 기반)
├── stores/                 # 상태 관리
│   ├── jotai/                  # Jotai atoms (신규 전역 상태용)
│   ├── recoil/                 # Recoil atoms (레거시: userData, errMsg)
│   ├── reduxThunk/             # Redux store (레거시: 테마 전용)
│   └── messengerStore/         # 메신저 상태
├── types/                  # TypeScript 타입/인터페이스 (도메인별 폴더)
│   ├── blog/                   # blogTypes.ts
│   ├── users/                  # UsersDTO.d.ts
│   ├── documents/              # DocumentsDTO.d.ts, CommentDTO.d.ts, PaginationDTO.d.ts
│   ├── common/                 # CommonDTO.d.ts, commonTypes.d.ts
│   ├── token/                  # TokenDTO.d.ts
│   ├── folders/                # FoldersDTO.d.ts
│   ├── bookmark/               # Bookmark.d.ts
│   ├── place/                  # placeTypes.ts
│   ├── maps/                   # mapTypes.ts
│   ├── translation/            # translationTypes.ts
│   ├── messenger/              # messengerTypes.ts
│   ├── menus/                  # MenusDTO.d.ts
│   └── weather/                # weather.d.ts
├── utils/                  # 유틸리티 함수
│   ├── useAuthEP.ts            # 인증 래퍼 (자동 토큰 갱신)
│   ├── awsS3Utils.ts           # S3 업로드
│   ├── commonUtils.ts          # 공통 유틸
│   ├── cookieUtils.ts          # 쿠키
│   ├── loadKakaoMapScript.ts   # 카카오 맵 스크립트 로더
│   └── loadNaverMapScript.ts   # 네이버 맵 스크립트 로더
├── constants/              # 상수 정의
│   ├── constants.ts            # BLOG_PAGE_TYPE, BLOG_SAVE_TYPE 등
│   ├── ErrorCode.ts            # 에러 코드
│   └── RegexConstants.ts       # 정규식 상수
├── RoutersTree/            # 라우팅 설정 (기능별 중첩 라우트)
│   ├── index.tsx               # 메인 라우터
│   ├── BlogRoutes/
│   ├── TravelRoutes/
│   ├── TechRoutes/
│   ├── ChatRoutes/
│   ├── LoginRoutes/
│   ├── AdminRoutes/
│   ├── UserRoutes/
│   ├── SettingRoutes/
│   └── ProtectedRoute.tsx      # 인증 보호 라우트
├── init/                   # 초기화 데이터
└── error/                  # 에러 처리 (errorLog.ts)
```

---

## 4. 아키텍처 원칙

### 개발 순서
**Backend First 원칙**: Model → Repository → Service → Controller → Frontend

### 레이어 분리 (필수 준수)

새로운 기능 개발 시 반드시 아래 순서와 레이어를 따릅니다:

```
Backend:
  model/ → dto/ → repo/ → service/ → service/serviceImpl/ → controller/

Frontend:
  types/ → endpoints/ → hooks/ → component/
  (DTO 정의)  (API 함수)  (Query Hook)  (UI 컴포넌트)
```

각 레이어는 명확히 분리되며, **컴포넌트에서 직접 API를 호출하지 않습니다.**

---

## 5. 코딩 컨벤션

### 5.1 타입 정의 (types/)

**위치**: `src/types/{도메인}/`
**파일명**: `{Domain}DTO.d.ts` (declare) 또는 `{domain}Types.ts` (export)

```typescript
// src/types/documents/DocumentsDTO.d.ts — declare interface (전역 사용)
declare interface DocumentDTO {
  id?: string;
  title?: string;
  content?: string;
  userId?: string;
  folderId?: string;
  tags?: string[];
  likeCount?: number;
  viewCount?: number;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// src/types/blog/blogTypes.ts — export interface (import 필요)
export interface ViewStatsDTO {
  documentId: string;
  totalViews: number;
  uniqueViews: number;
  todayViews: number;
  weekViews: number;
  dailyStats: DailyViewCount[];
}
```

**규칙**:
- `.d.ts` 파일: `declare interface` → import 없이 전역 사용
- `.ts` 파일: `export interface` → import하여 사용
- 모든 필드는 `optional (?)` 처리가 기본
- 도메인별 폴더 분리

---

### 5.2 API Endpoints (endpoints/)

**위치**: `src/endpoints/{domain}-endpoints.ts`

```typescript
import { FuncProps } from "../utils/useAuthEP";
import { request } from "../appConfig/request-response";
import { AxiosResponse } from "axios";

// 인증 필요 API
export async function createDocument(props: FuncProps) {
  return (await request.post(
    "blog/document",
    props.reqBody,
    { headers: { Authorization: `Bearer ${props.accessToken}` } }
  )) as AxiosResponse;
}

// 비인증 허용 API (URL에 /ps/ 포함)
export async function getDocument(props: FuncProps) {
  const config = props.accessToken
    ? { headers: { Authorization: `Bearer ${props.accessToken}` } }
    : {};
  return (await request.get(
    `blog/ps/document`,
    { params: { id: props.params.id }, ...config }
  )) as AxiosResponse;
}
```

**핵심 규칙**:
- 모든 함수는 `FuncProps` 타입의 단일 파라미터: `{ accessToken?, params?, reqBody? }`
- Axios 인스턴스: `request` (일반) / `securityReq` (인증 전용)
- 인증 필요 시 `Authorization: Bearer ${props.accessToken}` 헤더
- 반환: `AxiosResponse<T>`

**기존 endpoint 파일**:

| 파일 | 도메인 |
|------|--------|
| `blog-endpoints.ts` | 블로그/문서 CRUD, 조회수, 추천 |
| `users-endpoints.ts` | 사용자 조회/검색 |
| `login-endpoints.ts` | 로그인/토큰 |
| `comment-endpoints.ts` | 댓글 CRUD |
| `document-like-endpoints.ts` | 문서 좋아요 |
| `comment-like-endpoints.ts` | 댓글 좋아요 |
| `bookmark-endpoints.ts` | 북마크 |
| `place-endpoints.ts` | 장소 |
| `translation-endpoints.ts` | 번역 |
| `messenger-endpoints.ts` | 메신저 |
| `menus-endpoints.ts` | 메뉴 |
| `folders-endpoints.ts` | 폴더 |
| `common-endpoints.ts` | 공통 |

---

### 5.3 React Query Hooks (hooks/)

**위치**: `src/hooks/use{Domain}Queries.ts`

```typescript
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthEP from "../utils/useAuthEP";

// Query Keys (선택적 — 복잡한 도메인에서 사용)
export const entityKeys = {
  all: ["entities"] as const,
  detail: (id: string) => [...entityKeys.all, "detail", id] as const,
  list: (params: object) => [...entityKeys.all, "list", params] as const,
};

// 조회 Hook (useQuery)
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
    staleTime: 1000 * 60 * 5,
  });
};

// Mutation Hook (useMutation)
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
      queryClient.invalidateQueries({ queryKey: entityKeys.all });
    },
  });
};
```

**핵심 규칙**:
- `useAuthEP()` 훅으로 API 호출 래핑 (자동 토큰 갱신)
- `queryKey`: 문자열 배열로 도메인 + 식별자
- `enabled` 옵션으로 조건부 쿼리 실행
- `staleTime` 기본: 5분 (App.tsx 전역 설정)
- Mutation 성공 시 `queryClient.invalidateQueries()`로 캐시 무효화
- 비인증 공개 API는 `useAuthEP()` 없이 직접 호출도 가능

**기존 hook 파일**:

| 파일 | 설명 |
|------|------|
| `useBlogQueries.ts` | 블로그 글 CRUD, 조회수, 추천 |
| `useUserQueries.ts` | 사용자 조회/검색 |
| `useCommentQueries.ts` | 댓글 CRUD |
| `useDocumentLikeQueries.ts` | 문서 좋아요 토글 |
| `useCommentLikeQueries.ts` | 댓글 좋아요 토글 |
| `useCurrentUser.ts` | 현재 로그인 사용자 정보 |
| `useMessengerQueries.ts` | 메신저 |
| `useFolderQueries.ts` | 폴더 |
| `usePlaceQueries.ts` | 장소 |
| `useTranslationQueries.ts` | 번역 |
| `useFeaturedQueries.ts` | 추천 글 |
| `useSearchInfoQueries.ts` | 검색 |
| `useWebSocket.ts` | WebSocket 연결 |
| `useChatManager.ts` | 채팅 관리 |
| `useTravelMessenger.ts` | 여행 메신저 |
| `useFileUploadInDoc.ts` | 문서 내 파일 업로드 |

---

### 5.4 컴포넌트 패턴 (커스텀 훅 분리)

#### 폴더 구조

```
ComponentName/
├── ComponentName.tsx      # 프레젠테이션 컴포넌트 (UI만)
├── index.ts               # re-export
├── useComponentName.ts    # 컴포넌트 전용 커스텀 훅 (로직 분리)
└── SubComponent/          # 하위 컴포넌트 (필요 시)
```

#### 커스텀 훅 — 비즈니스 로직 담당

```typescript
// useComponent.ts
export interface UseComponentProps {
  entityId: string;
  onSuccess?: () => void;
}

export default function useComponent({ entityId, onSuccess }: UseComponentProps) {
  const { data: currentUser } = useCurrentUser();
  const { data, isLoading } = useEntity(entityId);
  const createMutation = useCreateEntity();
  const [localState, setLocalState] = useState<string>("");

  const handleSubmit = useCallback(async () => {
    createMutation.mutate({ /* data */ }, { onSuccess });
  }, [createMutation, onSuccess]);

  return {
    data, isLoading, localState,
    handleSubmit, isSubmitting: createMutation.isPending,
  };
}
```

#### 프레젠테이션 컴포넌트 — UI 렌더링만

```tsx
// Component.tsx
export default function Component({ entityId }: { entityId: string }) {
  const { data, isLoading, handleSubmit, isSubmitting } = useComponent({ entityId });

  if (isLoading) return <Spinner />;

  return (
    <VStack gap={4}>
      {/* Chakra UI v3 컴포넌트 사용 */}
    </VStack>
  );
}
```

#### 네이밍 컨벤션

| 접두사/접미사 | 용도 | 예시 |
|--------------|------|------|
| `*Page` | 전체 페이지 컴포넌트 | `BlogPage`, `LoginPage` |
| `*Layout` | 레이아웃 래퍼 | `MainLayout`, `BlogLayout` |
| `Cus*` | 커스텀 공유 UI 요소 | `CusModal`, `CusEditor`, `CusSelect` |
| `*Routes` | 라우트 정의 | `BlogRoutes`, `AdminRoutes` |
| `use*` | 커스텀 훅 | `useBlogQueries`, `useComponent` |

---

### 5.5 라우팅 패턴 (RoutersTree/)

```typescript
// src/RoutersTree/index.tsx — 메인 라우터
<Routes>
  <Route path="/*" element={<MainPage/>}/>
  <Route path="/blog/*" element={<BlogRoutes/>}/>
  <Route path="/travel/*" element={<TravelRoutes/>}/>
  <Route path="/tech/*" element={<TechRoutes/>}/>
  <Route path="/chat/*" element={<ChatRoutes/>}/>
  <Route path="/login/*" element={<LoginRoutes/>}/>
  <Route path="/admin/*" element={<AdminRoutes />} />
  <Route path="/user/*" element={<UserRoutes />} />
  <Route path="/error/403" element={<ForbiddenPage />} />
</Routes>
```

```typescript
// 중첩 라우트 예시 (BlogRoutes)
<Routes>
  <Route element={<MainLayout showHero={false} />}>
    <Route path="/view/:id" element={<ViewBlog />} />
    <Route path="/home" element={<BlogPage />} />
    <Route path="/:type" element={<BlogPage />} />
  </Route>
  <Route element={<EmptyLayout/>}>
    <Route path="/create/:id" element={<CreateBlogPost />} />
    <Route path="/edit/:id" element={<EditBlogPost />} />
  </Route>
</Routes>
```

**규칙**:
- 기능별 `*Routes` 컴포넌트로 중첩 라우팅
- `<Outlet />` 기반 레이아웃 중첩
- 인증 필요 페이지는 `<ProtectedRoute>` 래핑

---

### 5.6 스타일링 패턴

**Chakra UI v3** (레이아웃, 반응형, 기본 UI 우선) + **Styled Components** (커스텀 스타일)

```tsx
// Chakra UI — 레이아웃, 반응형
<Box h="calc(100vh - 3rem)" pb="2rem">
  <Container maxW="7xl" px={{ base: 4, sm: 4, lg: 4 }}>
    <VStack gap={4}>
      <Button colorScheme="blue">Submit</Button>
    </VStack>
  </Container>
</Box>

// Styled Components — 복잡한 커스텀 스타일
const StyledBlogPage = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;

  .blog-title {
    height: 3rem;
    display: flex;
    justify-content: center;
  }

  @media (min-width: 1800px) {
    .blog-title { justify-content: center; }
  }
`;
```

**규칙**:
- 레이아웃/반응형 → Chakra UI 우선
- 복잡한 커스텀 스타일 → Styled Components
- Chakra UI 반응형: `px={{ base: 4, md: 6, lg: 8 }}`
- Chakra UI **v3 문법** 사용 (v2와 다름에 주의)

---

## 6. 인증 시스템

### 토큰 관리

| 토큰 | 저장소 | 생명주기 |
|------|--------|---------|
| Access Token | React State (AuthContext) | 브라우저 탭 닫으면 소멸 |
| Refresh Token | localStorage | 브라우저 닫아도 유지 |

### 인증 흐름

```
1. 앱 로드 → localStorage에서 refreshToken 확인
2. refreshToken 존재 → accessToken 자동 갱신
3. API 호출 → useAuthEP()가 accessToken 자동 주입
4. 401 에러 → refreshTokenIfNeeded() 호출 → 재시도
5. 토큰 갱신 실패 → 로그아웃 처리
```

### Frontend — useAuthEP() 사용법

```typescript
const authEP = useAuthEP();
const res = await authEP({
  func: apiFunction,        // endpoint 함수
  params: { id: "123" },    // URL 파라미터
  reqBody: { data: "value" } // 요청 바디
});
```

### Backend — Controller에서 사용자 정보

```java
@AuthenticationPrincipal CustomUserDetails userDetails
userDetails.getUserId()  // 사용자 ID
```

---

## 7. 상태 관리 전략

| 용도 | 도구 | 위치 |
|------|------|------|
| 서버 데이터 (API 응답) | **TanStack React Query** | `hooks/use*Queries.ts` |
| 복잡한 클라이언트 상태 | **Jotai** | `stores/jotai/` |
| 사용자 데이터 (레거시) | Recoil | `stores/recoil/` |
| 테마 (레거시) | Redux | `stores/reduxThunk/` |
| 컴포넌트 로컬 상태 | React useState | 각 컴포넌트 내부 |

**원칙**:
- 새로운 서버 상태는 **반드시 React Query** 사용
- 새로운 클라이언트 전역 상태는 **Jotai** 사용
- Recoil, Redux는 레거시 — **새 기능에는 사용 금지**

### React Query 전역 설정

```typescript
// App.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,       // 5분
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

---

## 8. 백엔드 연동 규칙

### 8.1 URL 패턴

```
인증 필요:
  POST   /api/v1/{domain}              - 생성
  PUT    /api/v1/{domain}/{id}         - 전체 수정
  PATCH  /api/v1/{domain}/{id}/{sub}   - 부분 수정
  DELETE /api/v1/{domain}/{id}         - 삭제

비인증 허용 (ps = public service):
  GET    /api/v1/{domain}/ps/{id}      - 단일 조회
  GET    /api/v1/{domain}/ps/list      - 목록 조회

레거시 (blog 도메인):
  POST   /blog/document               - 문서 생성
  GET    /blog/ps/documents            - 문서 목록
  GET    /blog/ps/document?id=xxx      - 문서 조회
```

### 8.2 Axios 인스턴스

```typescript
// src/appConfig/request-response.ts
const request = axios.create({
  withCredentials: true,
  baseURL: process.env["REACT_APP_BACKEND_URI"],
  headers: { 'Content-Type': 'application/json;charset=UTF-8' }
});
```

- 개발: `http://localhost:3003`
- 프로덕션: `https://www.nadeliv-backend.com`

### 8.3 Backend 코드 패턴

#### Model (MongoDB Document)
```java
@Document(collection = "collection_name")
@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class EntityName extends CommonDTO {
    @Id
    private String id;

    @Field(targetType = FieldType.OBJECT_ID)
    @Indexed
    private String foreignKeyId;  // 참조 ID는 @Indexed

    private int likeCount;        // 비정규화된 count 필드
    private int viewCount;
}
```

#### Repository
```java
@Repository
public interface EntityRepo extends MongoRepository<Entity, String> {
    Optional<Entity> findByFieldAndOtherField(String field, String otherField);
    boolean existsByFieldAndOtherField(String field, String otherField);  // boolean: "is" 생략
    Page<Entity> findByParentIdAndDeletedFalse(String parentId, Pageable pageable);
    List<Entity> findByIdInAndUserId(List<String> ids, String userId);   // N+1 방지
}
```

#### Service Interface → Implementation
```java
public interface EntityService {
    EntityDTO create(EntityDTO dto, String userId) throws Exception;
    EntityDTO update(String id, EntityDTO dto, String userId) throws Exception;
    void delete(String id, String userId) throws Exception;
    EntityDTO getById(String id) throws Exception;
    Page<EntityDTO> getList(Pageable pageable) throws Exception;
}

@Service @Slf4j @RequiredArgsConstructor
public class EntityServiceImpl implements EntityService {
    private final EntityRepo entityRepo;
    // 1. 검증 → 2. Entity 생성 → 3. 저장 → 4. DTO 변환 후 반환
}
```

#### Controller
```java
@RestController
@RequestMapping("/api/v1/entities")
@RequiredArgsConstructor @Slf4j
public class EntityController {
    private final EntityService entityService;

    @PostMapping("")  // 인증 필요
    public ResponseEntity<?> create(
            @RequestBody EntityDTO dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(entityService.create(dto, userDetails.getUserId()));
    }

    @GetMapping("/ps/{id}")  // 비인증 허용
    public ResponseEntity<?> getById(@PathVariable String id) {
        return ResponseEntity.ok(entityService.getById(id));
    }
}
```

---

## 9. 비즈니스 기능 명세

### 9.1 블로그 글 (Document)
- CRUD + 임시저장(Draft) + 발행
- TipTap 에디터로 리치 콘텐츠 작성
- AWS S3 이미지 업로드
- 태그 시스템 (공유 태그, 대소문자 구분)
- 폴더 분류

### 9.2 좋아요 (Like)
- **대상**: Document, Comment
- **권한**: 로그인 사용자만 (본인 글에도 가능)
- **동작**: 토글 방식 (좋아요/취소)
- **저장**: 별도 컬렉션 + 원본에 likeCount 비정규화

### 9.3 태그 (Tag)
- **공유**: 모든 사용자가 등록된 태그 사용 가능
- **대소문자**: 구분함 (food ≠ Food)
- **등록**: 글 작성 시 태그 입력 후 엔터 → 자동 생성/조회
- **필드**: tagName, slug(URL용), usageCount, color

### 9.4 댓글 (Comment)
- **깊이**: 최대 3depth (a → b → c), c에 대댓글 → b의 대댓글로 처리
- **에디터**: TipTap (글, 이미지, 첨부파일)
- **기능**: 생성, 수정, 삭제, 숨김처리, 좋아요
- **조회**: 1depth만 초기 로드 → 펼치기로 하위 로드

### 9.5 조회수 (View)
- **기준**: IP 주소 기반 (로그인 여부 무관)
- **중복 방지**: Redis TTL 24시간
- **저장**: DocumentView 컬렉션 + Redis 캐시
- **통계**: 일별/주간/총 조회수

### 9.6 북마크 (Bookmark)
- 로그인 사용자가 글을 저장

### 9.7 추천 글 (Featured)
- 관리자가 특정 글을 추천으로 설정
- 홈페이지 FeaturedSection에 노출

### 9.8 메신저 (Messenger)
- WebSocket 기반 (STOMP + SockJS)
- 실시간 채팅

### 9.9 회원 프로필 (User Profile)

**엔드포인트** (모두 인증 필수):
```
GET    /api/v1/user/profile    → 내 프로필 조회
PUT    /api/v1/user/profile    → 프로필 수정
PUT    /api/v1/user/password   → 비밀번호 변경
DELETE /api/v1/user/account    → 회원 탈퇴 (Soft Delete)
```

**타입**:
```typescript
interface UserProfileResponse {
  id: string; userId: string; email: string; name: string;
  src: string; birthday: string; roles: string[];
  created: string; updated: string;
}

interface UserUpdateRequest {
  name?: string; email?: string; src?: string; birthday?: string;
}

interface PasswordChangeRequest {
  currentPassword: string; newPassword: string;
}

interface UserDeleteRequest {
  password: string;  // 본인 확인용
}
```

**에러 코드**:

| 코드 | 상황 | 프론트엔드 처리 |
|------|------|----------------|
| `USER_001` (404) | 사용자 없음 | 로그아웃 처리 |
| `USER_004` (400) | 비밀번호 불일치 | "현재 비밀번호가 올바르지 않습니다" |
| `USER_005` (409) | 이메일 중복 | "이미 사용 중인 이메일입니다" |
| `USER_006` (403) | 비활성화 계정 | 로그인 페이지로 리다이렉트 |

**주의**: 탈퇴는 Soft Delete (isEnabled=false), 비밀번호 변경/탈퇴 시 현재 비밀번호 확인 필수

---

## 10. 환경 변수

| 변수 | 용도 |
|------|------|
| `REACT_APP_BACKEND_URI` | 백엔드 API 기본 URL |
| `REACT_APP_URI` | 프론트엔드 URL |
| `REACT_APP_AWS_S3_URI` | S3 이미지 버킷 URL |
| `REACT_APP_AWS_S3_THUMBNAIL_URI` | S3 썸네일 버킷 URL |
| `REACT_APP_AWS_ACCESS_KEY` | AWS 접근 키 |
| `REACT_APP_AWS_SECRET_KEY` | AWS 시크릿 키 |
| `REACT_APP_AWS_FILE_REGION` | AWS 리전 (ap-northeast-2) |
| `REACT_APP_TINY_API_KEY` | TinyMCE API 키 |
| `REACT_APP_NAVER_MAP_CLIENT_ID` | 네이버 지도 클라이언트 ID |
| `REACT_APP_KAKAO_MAP_APP_KEY` | 카카오 지도 앱 키 |
| `REACT_APP_PUBLIC_POSTHOG_KEY` | PostHog 분석 키 |
| `REACT_APP_GOOGLE_ANALYTICS_ID` | GA 추적 ID |

**포트**: 프론트엔드 `3002` / 백엔드 `3003` (개발 환경)

---

## 11. 새 기능 개발 체크리스트

### Step 1: 타입 정의
- [ ] `src/types/{domain}/` 에 DTO 인터페이스 작성
- [ ] 필드는 optional(?) 기본

### Step 2: API Endpoint
- [ ] `src/endpoints/{domain}-endpoints.ts` 에 API 함수 추가
- [ ] `FuncProps` 파라미터 사용
- [ ] 인증 필요 시 Authorization 헤더, 비인증 URL에 `/ps/`

### Step 3: React Query Hook
- [ ] `src/hooks/use{Domain}Queries.ts` 에 Query/Mutation 훅 추가
- [ ] `useAuthEP()` 래핑, 적절한 `queryKey`, Mutation 후 캐시 무효화

### Step 4: 컴포넌트 커스텀 훅
- [ ] `useComponentName.ts` 에 비즈니스 로직 분리
- [ ] Query 훅과 로컬 상태 조합, 핸들러 함수 정의

### Step 5: UI 컴포넌트
- [ ] `ComponentName.tsx` 에 프레젠테이션 로직만
- [ ] Chakra UI v3 컴포넌트 우선, 필요 시 Styled Components

### Step 6: 라우팅
- [ ] 해당 도메인의 `*Routes` 파일에 Route 추가
- [ ] 적절한 Layout 선택, 인증 필요 시 ProtectedRoute

---

## 12. 코드 생성 시 주의사항

1. **레이어 분리 필수**: 컴포넌트에서 직접 axios 호출 금지 → endpoints → hooks → component
2. **useAuthEP() 사용**: 인증 API는 반드시 useAuthEP() 경유
3. **React Query 캐시**: mutation 후 반드시 관련 queryKey 무효화
4. **Chakra UI v3**: v3 문법 사용 (v2와 다름에 주의)
5. **새 전역 상태는 Jotai**: Recoil/Redux는 레거시, 새 코드에서 사용 금지
6. **Optional 필드**: DTO 필드는 `?` 기본
7. **한국어 주석 가능**: 코드 주석은 한국어 허용
8. **PascalCase 컴포넌트**: 파일명과 컴포넌트명 모두 PascalCase
9. **camelCase 함수/변수**: 훅, 함수, 변수는 camelCase
10. **빌드**: `CI=false` 설정으로 warning을 에러로 취급하지 않음
11. **Boolean 필드 쿼리** (Backend): `isDeleted` → `deletedFalse` (is 생략)
12. **N+1 방지** (Backend): 목록 조회 시 `findByIdIn()` 사용
13. **비정규화 활용**: 자주 조회되는 count 필드는 원본 문서에 저장
14. **Redis TTL**: 실시간(1분), 통계(5분), 중복방지(24시간)
15. **에러 처리**: Backend는 Exception, Frontend는 React Query onError
