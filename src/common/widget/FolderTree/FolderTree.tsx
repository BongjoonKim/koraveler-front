import styled from "styled-components";
import {StaticTreeDataProvider, Tree, UncontrolledTreeEnvironment} from "react-complex-tree";
import useFolderTree from "./useFolderTree";

export interface FolderTreeViewProps {

};

function FolderTreeView(props: any) {
  const {
      folders,
      rootItems,
      treeItems,
  } = useFolderTree(props);
  return (
    <StyledFolderTree>
        <UncontrolledTreeEnvironment
          dataProvider={new StaticTreeDataProvider(treeItems, (item, path) => ({ ...item, path }))}
          getItemTitle={item => item.data.name}
          viewState={{
              ['tree-1']: {
                  expandedItems: [],
                  selectedItems: []
              }
          }}
          canDragAndDrop={false}
          canDropOnFolder={false}
          canReorderItems={false}
          // onSelectItems={handleFolderSelect}
          renderItemArrow={({ item, context }) => (
            item.isFolder ? (
              context.isExpanded ? (
                <span className="folder-open-icon">📂</span>
              ) : (
                <span className="folder-closed-icon">📁</span>
              )
            ) : null
          )}
          renderItemTitle={({ item }) => (
            <span className="folder-name">
            {item.data.name}
                {item.data.is_public && (
                  <span className="public-indicator" title="공개 폴더">🌐</span>
                )}
          </span>
          )}
        >
            <Tree treeId="tree-1" rootItem="root" treeLabel="폴더 구조" />
        </UncontrolledTreeEnvironment>
    </StyledFolderTree>
  )
};

export default FolderTreeView;

const StyledFolderTree = styled.div`

`;
