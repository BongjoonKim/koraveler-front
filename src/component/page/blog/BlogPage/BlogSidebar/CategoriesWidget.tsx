import React from "react";
import styled from "styled-components";

/**
 * 카테고리 위젯. 카테고리 카운트 백엔드 엔드포인트가 없는 동안은
 * 시안과 동일한 정적 셋을 노출하여 자리만 잡아 둔다. 실제 데이터로 교체할 때
 * 부모에서 categories prop 을 내려주면 그대로 그릴 수 있는 구조.
 */
interface CategoryRow {
  label: string;
  count?: number;
}

const DEFAULT_CATEGORIES: CategoryRow[] = [
  {label: "Destinations", count: 24},
  {label: "Food", count: 18},
  {label: "Culture", count: 12},
  {label: "Nature", count: 9},
];

function CategoriesWidget({categories = DEFAULT_CATEGORIES}: {categories?: CategoryRow[]}) {
  return (
    <StyledWrap>
      <Header>CATEGORIES</Header>
      {categories.map((c) => (
        <Row key={c.label}>
          <span className="label">{c.label}</span>
          {typeof c.count === "number" && <span className="count">{c.count}</span>}
        </Row>
      ))}
    </StyledWrap>
  );
}

export default CategoriesWidget;

const StyledWrap = styled.section`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0.4rem 0;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.85);

  .label { font-size: 0.9rem; }
  .count { color: rgba(255, 255, 255, 0.35); font-size: 0.85rem; }

  &:hover .label { color: white; }
`;
