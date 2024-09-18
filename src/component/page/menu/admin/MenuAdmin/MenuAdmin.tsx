import styled from "styled-components";
import {Route, Routes} from "react-router-dom";
import CusGrid from "../../../../../common/elements/CusGrid";
import useMenuAdmin from "./useMenuAdmin";
import {MenuAdminColumnDefsInit} from "../../../../../init/menus/MenuAdminColumnDefsInit";
import HeaderButtons from "../../../../../common/layout/HeaderButtons";
import CusModal from "../../../../../common/elements/CusModal";
import MenuModalBody from "./MenuModalBody";
import CusButton from "../../../../../common/elements/buttons/CusButton";
import CusModalFooter from "../../../../../common/elements/CusModal/CusModalFooter";
import {CellClickedEvent} from "ag-grid-community";

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
      <HeaderButtons
        onCreate={createModalOpen}
        // onEdit={editModalOpen}
      />
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
      <CusModal
        title={"Editor"}
        isOpen={modalOpen.isOpen!}
        onClose={() => {
          setModalOpen({
            isOpen: false,
            type: null,
            data: null
          })
        }}
        footer={(
          <CusModalFooter
            types={["create", "cancel","delete"]}
            createText={"save"}
            cancelText={"cancel"}
            deleteText={"delete"}
            doCreate={saveMenu}
            doCancel={modalClose}
            doDelete={deleteMenu}
          />
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
  height: 100%;
`;