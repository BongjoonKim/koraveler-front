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
      <HeaderLayout />
      <MenuTab>
        {props.children}
      </MenuTab>
      
    </StyledAdminLayout>
  )
};

export default AdminLayout;

const StyledAdminLayout = styled.div`
  width: 100%;
  height: 100%;
`;
