import React, {Suspense} from 'react';
import logo from './logo.svg';
import './App.css';
import styled from "styled-components";
import RoutersTree from "./RoutersTree";
import {ChakraProvider} from "@chakra-ui/react";
import {AuthProvider} from "./appConfig/AuthContext";

function App() {
  return (
    <AuthProvider>
      <ChakraProvider>
        <StyledApp className={"app"}>
          <RoutersTree/>
        </StyledApp>
      </ChakraProvider>
    </AuthProvider>
  );
}

export default App;

const StyledApp = styled.div`
  height: 100vh;
  width : 100vw;
`;
