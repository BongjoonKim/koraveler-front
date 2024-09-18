import styled from "styled-components";
import HeaderLayout from "../HeaderLayout";
import MenuHeader from "../MenuHeader";
import MenuTab from "../TabLayout";
import {ReactNode} from "react";

interface AdminLayoutProps {
  children : ReactNode;
};

function AdminLayout(props: AdminLayoutProps) {
  
  return (
    <StyledAdminLayout>
      <HeaderLayout notHome={true} />
      <MenuTab>
        {props.children}
      </MenuTab>
      
    </StyledAdminLayout>
  )
};

export default AdminLayout;

const StyledAdminLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
