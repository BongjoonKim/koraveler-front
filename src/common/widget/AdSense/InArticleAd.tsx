// src/common/widget/AdSense/InArticleAd.tsx
// 블로그 본문 끝 ~ 댓글 사이에 넣는 인아티클(반응형) 광고.
// 게시자 ID/슬롯이 없으면 운영에서는 통째로 렌더되지 않음(빈 라벨 노출 방지).

import styled from "styled-components";
import GoogleAd from "./GoogleAd";

const ADSENSE_CLIENT = process.env.REACT_APP_ADSENSE_CLIENT || "";
const IN_ARTICLE_SLOT = process.env.REACT_APP_ADSENSE_SLOT_IN_ARTICLE || "";

// 설정 여부: 개발에서는 자리표시자 확인용으로 항상 노출, 운영에서는 값이 있을 때만
const isConfigured = Boolean(ADSENSE_CLIENT && IN_ARTICLE_SLOT);

function InArticleAd() {
  if (!isConfigured && process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <AdWrap>
      <AdLabel>Advertisement</AdLabel>
      <GoogleAd slot={IN_ARTICLE_SLOT} layout="in-article" format="fluid" />
    </AdWrap>
  );
}

export default InArticleAd;

const AdWrap = styled.div`
    margin: 2rem 0;
    padding-top: 1.25rem;
    border-top: 1px solid rgba(80, 107, 92, 0.25);
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const AdLabel = styled.span`
    align-self: center;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #7f938b;
`;
