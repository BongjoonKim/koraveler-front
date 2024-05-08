import styled from "styled-components";
import {Route, Routes} from "react-router-dom";
import CusGrid from "../../../../../common/elements/CusGrid";
import useMenuAdmin from "./useMenuAdmin";

interface MenuAdminProps {

}

function MenuAdmin(props : MenuAdminProps) {
  const {
    rowData
  } = useMenuAdmin();
  
  
  
  return (
    <StyledMenuAdmin>
      <CusGrid
        columnDefs={[
          {
            headerName: "gogo",
            field : "value"
          },
          {
            headerName: "애애",
            field : "value"
          }
        ]}
        rowData={rowData}
      />
    </StyledMenuAdmin>
  )
}

export default MenuAdmin;

const StyledMenuAdmin = styled.div`
  width: 100%;
  height: 100%;
`;