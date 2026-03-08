import React from 'react';
import styled from 'styled-components';
import { Globe, Eye } from 'lucide-react';
import { LocaleCode, LOCALE_META, TranslatedBy } from '../../../../../types/i18n/i18nTypes';

interface TranslationBannerProps {
    originalLocale: LocaleCode;
    currentLocale: LocaleCode;
    translatedBy: TranslatedBy | null;
    aiModel?: string | null;
    onViewOriginal: () => void;
}

const TranslationBanner: React.FC<TranslationBannerProps> = ({
    originalLocale,
    currentLocale,
    translatedBy,
    aiModel,
    onViewOriginal,
}) => {
    if (originalLocale === currentLocale) return null;

    const fromLang = LOCALE_META[originalLocale]?.nativeName || originalLocale;
    const toLang = LOCALE_META[currentLocale]?.nativeName || currentLocale;
    const isReviewed = translatedBy === 'ai+human' || translatedBy === 'human';

    return (
        <Banner>
            <BannerContent>
                <Globe size={16} />
                <BannerText>
                    This post was automatically translated from {fromLang} to {toLang}.
                </BannerText>
                {isReviewed && <ReviewedBadge>Reviewed by author</ReviewedBadge>}
            </BannerContent>
            <ViewOriginalButton onClick={onViewOriginal}>
                <Eye size={14} />
                View Original
            </ViewOriginalButton>
        </Banner>
    );
};

export default TranslationBanner;

// Styled Components

const Banner = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px 16px;
    margin-bottom: 16px;
    background: rgba(196, 149, 106, 0.08);
    border: 1px solid rgba(196, 149, 106, 0.2);
    border-radius: 8px;
    font-size: 13px;
    color: #8b7355;
`;

const BannerContent = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
`;

const BannerText = styled.span`
    color: #5a4a3a;
`;

const ReviewedBadge = styled.span`
    font-size: 11px;
    font-weight: 600;
    color: #38a169;
    background: rgba(56, 161, 105, 0.1);
    padding: 2px 8px;
    border-radius: 10px;
`;

const ViewOriginalButton = styled.button`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    border: 1px solid #c4956a;
    border-radius: 6px;
    background: transparent;
    color: #c4956a;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;

    &:hover {
        background: rgba(196, 149, 106, 0.1);
    }
`;
