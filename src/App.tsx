import React, {Suspense} from 'react';
import logo from './logo.svg';
import './App.css';
import styled from "styled-components";
import RoutersTree from "./RoutersTree";
import {Alert, ChakraProvider} from "@chakra-ui/react";
import {AuthProvider} from "./appConfig/AuthContext";
import UniversalLayout from "./common/layout/UniversalLayout";
// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react"
import {useRecoilValue} from "recoil";
import recoil from "./stores/recoil";

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
  colors: {
    brand: {
      100: "#f7fafc",
      900: "#1a202c",
    },
  },
})

function App() {
  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <StyledApp className={"app"}>
          {/*<UniversalLayout>*/}
            <RoutersTree/>
          {/*</UniversalLayout>*/}
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
