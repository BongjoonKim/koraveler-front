import styled from "styled-components";
import useEditBlogPost from "./useEditBlogPost";
import MakeDocLayout from "../../../../common/layout/BlogLayout/Documents/MakingDocLayout/MakeDocLayout";
import UpdateEditor from "../../../../common/layout/BlogLayout/Documents/MakingDocLayout/UpdateEditor";
import useSaveBlogPost from "../SaveBlogPost/useSaveBlogPost";
import CusModal from "../../../../common/elements/CusModal";
import BlogPostSetting from "../../../../common/widget/BlogPostSetting/BlogPostSetting";
import CusModalFooter from "../../../../common/elements/CusModal/CusModalFooter";
import {BLOG_SAVE_TYPE} from "../../../../constants/constants";

export interface EditBlogPostProps {

};

function EditBlogPost(props: EditBlogPostProps) {
  // const {
  //   editorRef,
  //   document,
  //   setDocument,
  //   handleEdit
  // } = useSaveBlogPost(props);
  
  const {
    editorRef,
    document,
    setDocument,
    handleEdit,
    modalClose,
    openBlogPostingModal,
    handleSaveModalOpen,
    folders,
    setFolders,
    selectedFolder,
    setSelectedFolder,
    disclose,
    setDisclose,
    goBack,
    isTranslationEdit,
    autoSaveStatus,
    lastSavedAt,
  } = useSaveBlogPost(props)

  // 번역 편집 시: Save 버튼 클릭 → 모달 없이 바로 저장
  const handleSaveModalOpenOrDirect = isTranslationEdit
    ? () => handleEdit(BLOG_SAVE_TYPE.SAVE)
    : handleSaveModalOpen;

  return (
    <StyledEditBlogPost className={"StyledEditBlogPost"}>
      <MakeDocLayout
        type={"UPDATE"}
        document={document}
        setDocument={setDocument}
        handleSave={(saveOrDraft : string) => handleEdit(saveOrDraft)}
        handleSaveModalOpen={handleSaveModalOpenOrDirect}
        handleCancel={goBack}
        autoSaveStatus={isTranslationEdit ? undefined : autoSaveStatus}
        lastSavedAt={isTranslationEdit ? undefined : lastSavedAt}
      >
        <UpdateEditor
          ref={editorRef}
          {...document}
        />
      </MakeDocLayout>
      {!isTranslationEdit && (
        <CusModal
          isOpen={openBlogPostingModal}
          onClose={modalClose}
          title={"Saving Blog Post"}
          footer={
            <CusModalFooter
              types={["create", "cancel"]}
              createText={"save"}
              cancelText={"cancel"}
              doCreate={() => handleEdit(BLOG_SAVE_TYPE.SAVE)}
              doCancel={modalClose}
            />
          }
        >
          <BlogPostSetting
            folders={folders}
            setFolders={setFolders}
            selectedFolder={selectedFolder}
            setSelectedFolder={setSelectedFolder}
            disclose={disclose}
            setDisclose={setDisclose}
            openBlogPostingModal={openBlogPostingModal}
          />
        </CusModal>
      )}
    </StyledEditBlogPost>
  )
};

export default EditBlogPost;

const StyledEditBlogPost = styled.div`
    flex: 1;
    width: 100%;
    max-width: 80rem; /* 7xl — Viewer와 동일 폭 */
    margin: 0 auto;   /* 중앙 정렬 */
    min-height: 0;
    height: calc(100vh - 64px);  /* 헤더 높이만큼 빼기 */
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0 16px;
    background: #0a0c0c;
    color: #e8eaeb;

    /* EmptyLayout 부모는 흰 배경을 가지므로, 화면 양옆까지 다크로 채우기 위한 형제 보정. */
    &::before {
      content: "";
      position: fixed;
      inset: 0;
      background: #0a0c0c;
      z-index: -1;
      pointer-events: none;
    }

    @media (min-width: 640px) {
        padding: 0 24px;
    }

    @media (min-width: 1024px) {
        padding: 0 32px;
    }
`;
