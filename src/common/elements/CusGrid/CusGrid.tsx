import styled from "styled-components";
// import {AgGridReact, AgGridReactProps} from "@ag-grid-community/react";
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {AgGridReact, AgGridReactProps} from "ag-grid-react";

interface CusGridProps extends AgGridReactProps{

}

function CusGrid(props : CusGridProps) {
  return (
    <StyledCusGrid
      className="ag-theme-quartz"
    >
      <AgGridReact
        {...props}
      />
    </StyledCusGrid>
  )
}

export default CusGrid;

const StyledCusGrid = styled.div`
  height: 100%;
  width: 100%;
`;