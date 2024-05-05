import React from 'react';
import logo from './logo.svg';
import './App.css';
import styled from "styled-components";
import RoutersTree from "./routersTree";

function App() {
  return (
    <StyledApp className={"app"}>
      <RoutersTree/>
    </StyledApp>
  );
}

export default App;

const StyledApp = styled.div`
  height: 100%;
  width : 100%;
`;
