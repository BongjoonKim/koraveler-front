import styled from "styled-components";
import {Avatar, AvatarGroup} from "@chakra-ui/react";

interface CusAvatarProps {
    users ?: UsersDTO[];
    user? : UsersDTO;
};

function CusAvatar(props: CusAvatarProps) {
  
  return (
    <StyledCusAvatar>
      {
        props.users
          ? (
            <AvatarGroup>
    
            </AvatarGroup>
          ) : (
            <Avatar
              name={props.user?.email}
              src={props.user?.src || props.user?.userId}
            />
          )
      }
    </StyledCusAvatar>
  )
};

export default CusAvatar;

const StyledCusAvatar = styled.div`

`;
