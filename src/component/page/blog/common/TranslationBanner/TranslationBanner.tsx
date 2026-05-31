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
    background: rgba(46, 87, 62, 0.18);
    border: 1px solid rgba(80, 107, 92, 0.35);
    border-radius: 8px;
    font-size: 13px;
    color: #b6d4c1;
`;

const BannerContent = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
`;

const BannerText = styled.span`
    color: #e8eaeb;
`;

const ReviewedBadge = styled.span`
    font-size: 11px;
    font-weight: 600;
    color: #7fb89a;
    background: rgba(46, 87, 62, 0.32);
    padding: 2px 8px;
    border-radius: 10px;
`;

const ViewOriginalButton = styled.button`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    border: 1px solid rgba(80, 107, 92, 0.55);
    border-radius: 6px;
    background: transparent;
    color: #b6d4c1;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;

    &:hover {
        background: rgba(46, 87, 62, 0.22);
        color: #d8ead8;
        border-color: rgba(80, 107, 92, 0.75);
    }
`;
