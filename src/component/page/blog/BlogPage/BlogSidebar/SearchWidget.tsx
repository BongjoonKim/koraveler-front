import React, {useState} from "react";
import styled from "styled-components";
import {Search} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {useCurrentUser} from "../../../../../hooks/useCurrentUser";

/**
 * 사이드바 상단 검색 + Welcome 인사 묶음.
 * 실제 ⌘K 모달은 후속 작업. 이 단계에서는 검색어 제출 시 검색 결과 페이지로 이동.
 */
function SearchWidget() {
  const [value, setValue] = useState("");
  const {data: currentUser} = useCurrentUser();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    navigate(`/blog/home?q=${encodeURIComponent(q)}`);
  };

  return (
    <StyledWrap>
      {(() => {
        // nickname 우선, 없으면 username, 그것도 없으면 인사 자체를 숨김
        const greetingName = currentUser?.nickname || (currentUser as any)?.username || currentUser?.id;
        if (!greetingName) return null;
        return (
          <Welcome>
            <span className="hello">Welcome back, </span>
            <strong>{greetingName}</strong>
          </Welcome>
        );
      })()}
      <Form onSubmit={handleSubmit}>
        <Search size={14} aria-hidden />
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search posts, places, writers…"
          aria-label="Search posts"
        />
        <Shortcut aria-hidden>⌘K</Shortcut>
      </Form>
    </StyledWrap>
  );
}

export default SearchWidget;

const StyledWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Welcome = styled.div`
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.85rem;
  .hello { font-weight: 400; }
  strong { color: white; font-weight: 600; }
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.75rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.5rem;
  color: rgba(255, 255, 255, 0.65);
  transition: border-color 0.15s ease, background 0.15s ease;

  &:focus-within {
    border-color: rgba(255, 255, 255, 0.25);
    background: rgba(255, 255, 255, 0.06);
  }

  input {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: none;
    outline: none;
    color: white;
    font-size: 0.85rem;
    &::placeholder { color: rgba(255, 255, 255, 0.4); }
  }
`;

const Shortcut = styled.span`
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.55);
`;
