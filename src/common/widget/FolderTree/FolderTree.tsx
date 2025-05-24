import styled from "styled-components";
import {StaticTreeDataProvider, Tree, UncontrolledTreeEnvironment} from "react-complex-tree";
import useFolderTree from "./useFolderTree";
import 'react-complex-tree/lib/style-modern.css';


export interface FolderTreeViewProps {
  onFolderSelect?: (folder: FoldersDTO) => void;
  showPublicOnly?: boolean;
}

function FolderTreeView(props: FolderTreeViewProps) {
  const {
    folders,
    rootItems,
    treeItems,
  } = useFolderTree(props);
  
  const handleFolderSelect = (items: any) => {
    console.log('Selected items:', items);
    if (props.onFolderSelect && items.length > 0) {
      const selectedItem = treeItems[items[0]];
      if (selectedItem && selectedItem.data) {
        props.onFolderSelect(selectedItem.data);
      }
    }
  };
  
  // 트리 아이템이 비어있으면 로딩 상태 표시
  // if (Object.keys(treeItems).length <= 1) {
  //   return (
  //     <StyledFolderTree>
  //       <div>Loading folders... or no folders found</div>
  //       <div>Tree items count: {Object.keys(treeItems).length}</div>
  //       <div>Folders count: {folders.length}</div>
  //     </StyledFolderTree>
  //   );
  // }
  
  return (
    <StyledFolderTree>
      <UncontrolledTreeEnvironment
        dataProvider={new StaticTreeDataProvider(treeItems, (item, path) => ({ ...item, path }))}
        getItemTitle={item => item.data?.name || 'Untitled'}
        viewState={{
          ['tree-1']: {
            expandedItems: ['root'], // 루트는 기본적으로 확장
            selectedItems: []
          }
        }}
        canDragAndDrop={false}
        canDropOnFolder={false}
        canReorderItems={false}
        onSelectItems={handleFolderSelect}
        renderItemArrow={({ item, context }) => (
          item.isFolder && item.children && item.children.length > 0 ? (
            context.isExpanded ? (
              <span className="folder-open-icon">📂</span>
            ) : (
              <span className="folder-closed-icon">📁</span>
            )
          ) : (
            <span className="folder-empty-icon">📄</span>
          )
        )}
        renderItemTitle={({ item }) => (
          <span className="folder-name">
            {item.data?.name || 'Untitled'}
            {item.data?.public && (
              <span className="public-indicator" title="공개 폴더">🌐</span>
            )}
          </span>
        )}
      >
        <Tree treeId="tree-1" rootItem="root" treeLabel="폴더 구조" />
      </UncontrolledTreeEnvironment>
    </StyledFolderTree>
  );
}

export default FolderTreeView;

const StyledFolderTree = styled.div`
    .folder-name {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .public-indicator {
        font-size: 12px;
    }

    .folder-open-icon,
    .folder-closed-icon,
    .folder-empty-icon {
        margin-right: 4px;
    }
`;