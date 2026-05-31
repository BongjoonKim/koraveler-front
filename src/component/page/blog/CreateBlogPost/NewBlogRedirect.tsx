import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import useAuthEP from "../../../../utils/useAuthEP";
import { createDocument } from "../../../../endpoints/blog-endpoints";
import recoil from "../../../../stores/recoil";

// /blog/create-new 진입 시 빈 draft 문서를 생성하고 /blog/create/{id}로 교체 이동.
// ProtectedRoute 로 감싸져 있어 비로그인 사용자는 /login 으로 우회 후
// state.from 메커니즘으로 이 경로에 자동 복귀해 글 생성 흐름이 이어진다.
function NewBlogRedirect() {
  const navigate = useNavigate();
  const authEP = useAuthEP();
  const [, setErrorMsg] = useRecoilState(recoil.errMsg);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    (async () => {
      try {
        const res = await authEP({
          func: createDocument,
          reqBody: { contents: "", draft: true } as DocumentDTO,
        });
        navigate(`/blog/create/${res.data.id}`, { replace: true });
      } catch (e) {
        setErrorMsg({
          status: "error",
          msg: "글 생성에 실패했습니다.",
        });
        navigate("/blog/home", { replace: true });
      }
    })();
  }, [authEP, navigate, setErrorMsg]);

  return (
    <Flex h="60vh" align="center" justify="center" direction="column" gap={3}>
      <Spinner size="lg" color="#7fb89a" />
      <Text color="#94a3a0" fontSize="sm">새 글 준비 중...</Text>
    </Flex>
  );
}

export default NewBlogRedirect;
