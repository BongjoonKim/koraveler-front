// /admin/users — 아직 사용자 관리 기능이 없어 브랜드 톤의 준비중 화면만 노출
import { EmptyBox } from "../adminUi";

function UsersAdmin() {
  return (
    <EmptyBox>
      <p className="empty-title">User management is coming soon</p>
      <p className="empty-sub">
        사용자 목록·권한 관리 기능을 준비 중입니다. 완료되면 이 탭에서
        가입자 조회와 역할 변경을 할 수 있습니다.
      </p>
    </EmptyBox>
  );
}

export default UsersAdmin;
