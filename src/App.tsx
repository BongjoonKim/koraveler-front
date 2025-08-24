// App.tsx
import React from 'react';
import styled from "styled-components";
import RoutersTree from "./RoutersTree";
import {ChakraProvider, defaultSystem} from "@chakra-ui/react";
import {useRecoilValue} from "recoil";
import recoil from "./stores/recoil";
import posthog from 'posthog-js'
import { PostHogProvider} from 'posthog-js/react'
import {AuthProvider} from "./appConfig/AuthProvider";

if (typeof window !== 'undefined') {
  posthog.init(process.env.REACT_APP_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    }
  })
}

function App() {
  // isLoadingGlobal이 없다면 주석 처리하거나 다른 값으로 대체
  // const isLoadingGlobal = useRecoilValue(recoil.isLoadingGlobal);
  
  return (
    <PostHogProvider client={posthog}>
      <AuthProvider>
        <ChakraProvider value={defaultSystem}>
          <StyledApp className={"app"}>
            <RoutersTree/>
          </StyledApp>
        </ChakraProvider>
      </AuthProvider>
    </PostHogProvider>
  );
}

export default App;

const StyledApp = styled.div``;