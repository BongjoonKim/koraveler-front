// App.tsx
import React, {useEffect} from 'react';
import styled from "styled-components";
import RoutersTree from "./RoutersTree";
import {ChakraProvider, defaultSystem} from "@chakra-ui/react";
import {useRecoilValue} from "recoil";
import recoil from "./stores/recoil";
import posthog from 'posthog-js'
import { PostHogProvider} from 'posthog-js/react'
import {AuthProvider} from "./appConfig/AuthProvider";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

// if (typeof window !== 'undefined') {
//   posthog.init(process.env.REACT_APP_PUBLIC_POSTHOG_KEY!, {
//     api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
//     person_profiles: 'identified_only',
//     loaded: (posthog) => {
//       if (process.env.NODE_ENV === 'development') posthog.debug()
//     }
//   })
// }
//
// QueryClient를 컴포넌트 밖에서 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    // <PostHogProvider client={posthog}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ChakraProvider value={defaultSystem}>
            <StyledApp className={"app"}>
              <RoutersTree/>
            </StyledApp>
          </ChakraProvider>
        </AuthProvider>
      </QueryClientProvider>
    // </PostHogProvider>
  );
}

export default App;

const StyledApp = styled.div``;