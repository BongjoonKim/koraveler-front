import {Tab, TabList, TabsProps, Tabs} from "@chakra-ui/react";
import styled from "styled-components";

interface CusTabProps extends TabsProps {
  menus : MenusDTO[];
}

function CusTab(props : CusTabProps) {
  return (
    <StyledCusTab>
      <Tabs
        isLazy={true}
        onChange={props.onChange}
      >
        <TabList>
          {props.menus.map((menu : MenusDTO) => {
            return (
              <Tab>{menu.label}</Tab>
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