import styled from "styled-components";
import CusGrid from "../../../../../common/elements/CusGrid";
import useMenuAdmin from "./useMenuAdmin";
import {MenuAdminColumnDefsInit} from "../../../../../init/menus/MenuAdminColumnDefsInit";
import CusModal from "../../../../../common/elements/CusModal";
import MenuModalBody from "./MenuModalBody";
import {CellClickedEvent} from "ag-grid-community";
import {
  PrimaryButton,
  GhostButton,
  DangerButton,
  homeTokens,
} from "../../../admin/adminUi";

const t = homeTokens;

interface MenuAdminProps {

}

function MenuAdmin(props : MenuAdminProps) {
  const {
    rowData,
    modalOpen,
    setModalOpen,
    createModalOpen,
    modalClose,
    editModalOpen,
    menuData,
    setMenuData,
    saveMenu,
    deleteMenu
  } = useMenuAdmin();

  return (
    <StyledMenuAdmin>
      <div className="toolbar">
        <span className="toolbar-count">
          {rowData?.length ?? 0} menus
        </span>
        <PrimaryButton type="button" onClick={createModalOpen}>
          + New menu
        </PrimaryButton>
      </div>
      <div className="grid-wrap">
        <CusGrid
          columnDefs={MenuAdminColumnDefsInit}
          rowData={rowData}
          onCellClicked={(params: CellClickedEvent<MenusDTO>) => {
            setModalOpen({
              type: "edit",
              isOpen: true,
              data: params.data
            })
            setMenuData(
              params.data!
            )
          }}
        />
      </div>
      <CusModal
        title={modalOpen.type === "create" ? "New menu" : "Edit menu"}
        variant="dark"
        isOpen={modalOpen.isOpen!}
        onClose={() => {
          setModalOpen({
            isOpen: false,
            type: null,
            data: null
          })
        }}
        footer={(
          <ModalFooter>
            {modalOpen.type === "edit" && (
              <DangerButton type="button" onClick={deleteMenu}>
                Delete
              </DangerButton>
            )}
            <GhostButton type="button" onClick={modalClose}>
              Cancel
            </GhostButton>
            <PrimaryButton type="button" onClick={saveMenu}>
              Save
            </PrimaryButton>
          </ModalFooter>
        )}
      >
        <MenuModalBody
          data={menuData}
          setData={setMenuData}
        />
      </CusModal>
    </StyledMenuAdmin>
  )
}

export default MenuAdmin;

const StyledMenuAdmin = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 14px;

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .toolbar-count {
    font-size: 13px;
    color: ${t.color.textMuted};
    letter-spacing: 0.03em;
  }

  .grid-wrap {
    height: 560px;
    border: 1px solid ${t.color.border};
    border-radius: ${t.radius.lg};
    overflow: hidden;
    background: ${t.color.surface};

    /* ag-grid quartz 테마 → 다크 세이지-그린 브랜드 톤 */
    .ag-theme-quartz {
      --ag-background-color: transparent;
      --ag-foreground-color: ${t.color.text};
      --ag-header-background-color: ${t.color.surface2};
      --ag-header-foreground-color: ${t.color.textSoft};
      --ag-border-color: ${t.color.border};
      --ag-secondary-border-color: ${t.color.border};
      --ag-row-border-color: ${t.color.border};
      --ag-row-hover-color: rgba(143, 191, 148, 0.08);
      --ag-selected-row-background-color: rgba(143, 191, 148, 0.16);
      --ag-odd-row-background-color: transparent;
      --ag-font-family: ${t.font.sans};
      --ag-font-size: 13.5px;
      --ag-header-column-resize-handle-color: ${t.color.border2};
      --ag-wrapper-border-radius: 0;
    }

    .ag-root-wrapper {
      border: none;
    }

    .ag-row {
      cursor: pointer;
    }
  }
`;

const ModalFooter = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  gap: 10px;
`;
