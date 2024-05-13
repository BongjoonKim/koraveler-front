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

interface MenuAdminProps {

}

function MenuAdmin(props : MenuAdminProps) {
  const {
    rowData,
    modalOpen,
    setModalOpen,
    createModalOpen,
    editModalOpen
  } = useMenuAdmin();
  
  
  
  return (
    <StyledMenuAdmin>
      <HeaderButtons
        onCreate={createModalOpen}
        onEdit={editModalOpen}
      />
      <CusGrid
        columnDefs={MenuAdminColumnDefsInit}
        rowData={rowData}
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
            types={} comon={} createText={} editText={} cancelText={} deleteText={}
        )}
      >
        <MenuModalBody />
      </CusModal>
    </StyledMenuAdmin>
  )
}

export default MenuAdmin;

const StyledMenuAdmin = styled.div`
  width: 100%;
  height: 100%;
`;