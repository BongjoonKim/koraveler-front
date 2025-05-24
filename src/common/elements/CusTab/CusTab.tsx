import {Tab, TabList, TabsProps, Tabs, TabPanels, TabPanel} from "@chakra-ui/react";
import styled from "styled-components";
import {ReactNode} from "react";

interface CusTabProps {
  tabs : any[];
  onChange ?: (index : number) => void;
  defaultIndex ?: number;
}

function CusTab(props : CusTabProps) {
  return (
    <StyledCusTab>
      <Tabs
        isLazy={true}
        onChange={props.onChange}
        defaultIndex={props.defaultIndex} // defaultValue 대신 defaultIndex 사용
      >
        <TabList>
          {props?.tabs?.map((tab : any, index: number) => {
            return (
              <Tab key={tab.value}>{tab.label}</Tab> // value 속성 제거
            )
          })}
        </TabList>
        
        {/* TabPanels도 추가해야 함 */}
        <TabPanels>
          {props?.tabs?.map((tab : any, index: number) => {
            return (
              <TabPanel key={tab.value}>
                {/* 각 탭의 콘텐츠 */}
              </TabPanel>
            )
          })}
        </TabPanels>
      </Tabs>
    </StyledCusTab>
  )
}

export default CusTab;

const StyledCusTab = styled.div`
  display: flex;
`;