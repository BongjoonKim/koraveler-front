import styled from "styled-components";
import {Avatar, AvatarBadgeProps, AvatarGroup, AvatarGroupProps, AvatarProps} from "@chakra-ui/react";
import {MouseEventHandler} from "react";

interface CusAvatarProps extends AvatarProps {
    users ?: UsersDTO[];
    user? : UsersDTO;
    // onClick : (event: MouseEventHandler<HTMLSpanElement>) => void
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
              name={props?.name}
              src={props.user?.src || props.user?.userId}
              onClick={props.onClick}
            />
          )
      }
    </StyledCusAvatar>
  )
};

export default CusAvatar;

const StyledCusAvatar = styled.div`

`;
