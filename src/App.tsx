import React, {Suspense} from 'react';
import logo from './logo.svg';
import './App.css';
import styled from "styled-components";
import RoutersTree from "./RoutersTree";
import {ChakraProvider} from "@chakra-ui/react";
import {AuthProvider} from "./appConfig/AuthContext";
import UniversalLayout from "./common/layout/UniversalLayout";

function App() {
  return (
    <AuthProvider>
      <ChakraProvider>
        <StyledApp className={"app"}>
          <UniversalLayout>
            <RoutersTree/>
          </UniversalLayout>
        </StyledApp>
      </ChakraProvider>
    </AuthProvider>
  );
}

export default App;

const StyledApp = styled.div`
  height: 100%;
  width : 100%;
`;
