import styled from "styled-components";
import {Route, Routes} from "react-router-dom";
import CusGrid from "../../../../../common/elements/CusGrid";
import useMenuAdmin from "./useMenuAdmin";
import {MenuAdminColumnDefsInit} from "../../../../../init/menus/MenuAdminColumnDefsInit";
import HeaderButtons from "../../../../../common/layout/HeaderButtons";
import CusModal from "../../../../../common/elements/CusModal";

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
        isOpen={modalOpen.isOpen!}
        onClose={() => {
          setModalOpen({
            isOpen: false,
            type: null,
            data: null
          })
        }}
      >
        <>sdfsdfsf</>
      </CusModal>
    </StyledMenuAdmin>
  )
}

export default MenuAdmin;

const StyledMenuAdmin = styled.div`
  width: 100%;
  height: 100%;
`;