// common/elements/CusAvatar/CusAvatar.tsx
import React from "react";
import styled from "styled-components";
import {Avatar, AvatarGroup} from "@chakra-ui/react";
import {ForwardedRef, forwardRef, MouseEventHandler} from "react";

interface CusAvatarProps {
  user?: {
    src?: string;
    userId?: string;
  };
  name?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const CusAvatar = forwardRef<HTMLDivElement, CusAvatarProps>((props, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <StyledCusAvatar ref={ref}>
      {
        Array.isArray(props.user) ? (
          <AvatarGroup>
            {/* 여러 아바타 처리 */}
          </AvatarGroup>
        ) : (
          <Avatar.Root onClick={props.onClick}>
            <Avatar.Fallback>{props?.name}</Avatar.Fallback>
            <Avatar.Image src={props.user?.src || props.user?.userId} />
          </Avatar.Root>
        )
      }
    </StyledCusAvatar>
  );
});

export default CusAvatar;

const StyledCusAvatar = styled.div``;