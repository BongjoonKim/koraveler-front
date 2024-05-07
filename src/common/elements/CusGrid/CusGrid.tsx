import styled from "styled-components";
// import {AgGridReact, AgGridReactProps} from "@ag-grid-community/react";
import 'ag-grid-community/styles/ag-grid.css'
import {AgGridReact, AgGridReactProps} from "ag-grid-react";
interface CusGridProps extends AgGridReactProps{

}

function CusGrid(props : CusGridProps) {
  return (
    <StyledCusGrid
      className="ag-theme-quartz"
      style={{
        height: 500
      }}
    >
      <AgGridReact
        {...props}
      />
    </StyledCusGrid>
  )
}

export default CusGrid;

const StyledCusGrid = styled.div`
`;