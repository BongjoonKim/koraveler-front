import {Tab, TabList, TabsProps, Tabs, TabPanels, TabPanel} from "@chakra-ui/react";
import styled from "styled-components";
import {ReactNode} from "react";

interface CusTabProps {
  tabs : any[];
  onChange ?: (index : number) => void;
}

function CusTab(props : CusTabProps) {
  
  return (
    <StyledCusTab>
      <Tabs
        isLazy={true}
        onChange={props.onChange}
      >
        <TabList>
          {props?.tabs?.map((tab : any) => {
            return (
              <Tab>{tab.label}</Tab>
            )
          })}
        </TabList>
      </Tabs>
    </StyledCusTab>
  )
}

export default CusTab;

const StyledCusTab = styled.div`
  display: flex;
`;