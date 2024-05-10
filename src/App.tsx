import React from 'react';
import logo from './logo.svg';
import './App.css';
import styled from "styled-components";
import RoutersTree from "./RoutersTree";
import {ChakraProvider} from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider>
      <StyledApp className={"app"}>
        <RoutersTree/>
      </StyledApp>
    </ChakraProvider>
  );
}

export default App;

const StyledApp = styled.div`
  height: 100%;
  width : 100%;
`;
