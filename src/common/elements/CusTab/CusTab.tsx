import {Tab, TabList, TabsProps, Tabs} from "@chakra-ui/react";
import styled from "styled-components";
import {ReactNode} from "react";

interface CusTabProps extends TabsProps {
  children : any[];
}

function CusTab(props : CusTabProps) {
  return (
    <StyledCusTab>
      <Tabs
        isLazy={true}
        onChange={props.onChange}
      >
        <TabList>
          {props.children.map((children : any) => {
            return (
              <Tab>{children.label}</Tab>
            )
          })}
        </TabList>
      </Tabs>
    </StyledCusTab>
  )
}

export default CusTab;

const StyledCusTab = styled.div`
`;