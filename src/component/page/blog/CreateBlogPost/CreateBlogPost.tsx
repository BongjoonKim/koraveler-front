import styled from "styled-components";
import CreateEditor from "../../../../common/layout/BlogLayout/Documents/MakingDocLayout/CreateEditor";
import MakeDocLayout from "../../../../common/layout/BlogLayout/Documents/MakingDocLayout/MakeDocLayout";
import useSaveBlogPost from "../SaveBlogPost/useSaveBlogPost";
import CusModal from "../../../../common/elements/CusModal";
import BlogPostSetting from "../../../../common/widget/BlogPostSetting/BlogPostSetting";
import CusModalFooter from "../../../../common/elements/CusModal/CusModalFooter";
import {BLOG_SAVE_TYPE} from "../../../../constants/constants";

export interface CreateBlogPostProps {

};

function CreateBlogPost(props: CreateBlogPostProps) {
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
    autoSaveStatus,
    lastSavedAt,
  } = useSaveBlogPost(props)

  return (
    <StyledCreateBlogPost>
      <MakeDocLayout
        type={"CREATE"}
        document={document}
        setDocument={setDocument}
        handleSave={(saveOrDraft : string) => handleEdit(saveOrDraft)}
        handleSaveModalOpen={handleSaveModalOpen}
        handleCancel={goBack}
        autoSaveStatus={autoSaveStatus}
        lastSavedAt={lastSavedAt}
      >
        <CreateEditor
          ref={editorRef}
          {...document}
        />
      </MakeDocLayout>
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
    </StyledCreateBlogPost>
  )
};

export default CreateBlogPost;

const StyledCreateBlogPost = styled.div`
  flex:1;
  display: flex;
  flex-direction: column;
  //height: 100%;
  min-height: 0;
  overflow-y: hidden;
  width: 100%;
  max-width: 80rem;  /* 7xl — Viewer와 동일 폭 */
  margin: 0 auto;
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
