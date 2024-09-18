import styled from "styled-components";
import {Avatar, AvatarBadgeProps, AvatarGroup, AvatarGroupProps, AvatarProps} from "@chakra-ui/react";
import {ForwardedRef, forwardRef, MouseEventHandler} from "react";

interface CusAvatarProps extends AvatarProps {
    users ?: UsersDTO[];
    user? : UsersDTO;
    // onClick : (event: MouseEventHandler<HTMLSpanElement>) => void
};

function CusAvatar(props: CusAvatarProps, ref : ForwardedRef<HTMLDivElement>) {
  return (
    <StyledCusAvatar ref={ref}>
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

export default forwardRef(CusAvatar);

const StyledCusAvatar = styled.div`
  cursor: pointer;
  user-select: none;
  &:hover {
    [role="img"] {
      color:#aecafb;
    }
  }
`;
