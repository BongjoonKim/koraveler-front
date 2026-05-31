import React from "react";
import styled from "styled-components";
import SearchWidget from "./SearchWidget";
import FollowingFeedWidget from "./FollowingFeedWidget";
import CategoriesWidget from "./CategoriesWidget";
import PopularPostsWidget from "./PopularPostsWidget";
import {useCurrentUser} from "../../../../../hooks/useCurrentUser";

function BlogSidebar() {
  const {data: currentUser} = useCurrentUser();
  const isLoggedIn = !!currentUser?.id;

  return (
    <StyledSidebar>
      <SearchWidget />
      <Divider />
      <FollowingFeedWidget enabled={isLoggedIn} />
      {isLoggedIn && <Divider />}
      <CategoriesWidget />
      <Divider />
      <PopularPostsWidget />
    </StyledSidebar>
  );
}

export default BlogSidebar;

const StyledSidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
`;
