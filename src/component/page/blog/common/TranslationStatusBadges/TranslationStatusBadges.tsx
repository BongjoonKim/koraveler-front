import React from 'react';
import styled, { keyframes } from 'styled-components';
import { TranslationStatusItemDTO, LOCALE_META, LocaleCode } from '../../../../../types/i18n/i18nTypes';

interface TranslationStatusBadgesProps {
    translations: TranslationStatusItemDTO[];
}

const statusConfig: Record<string, { icon: string; color: string; tooltip: string }> = {
    completed: { icon: '\u2705', color: '#38a169', tooltip: 'Completed' },
    manually_edited: { icon: '\u270f\ufe0f', color: '#3182ce', tooltip: 'Reviewed by author' },
    pending: { icon: '\u23f3', color: '#d69e2e', tooltip: 'Pending' },
    translating: { icon: '\u23f3', color: '#d69e2e', tooltip: 'Translating...' },
    failed: { icon: '\u274c', color: '#e53e3e', tooltip: 'Failed' },
    none: { icon: '\u2796', color: '#a0aec0', tooltip: 'Not started' },
};

const TranslationStatusBadges: React.FC<TranslationStatusBadgesProps> = ({ translations }) => {
    if (!translations || translations.length === 0) return null;

    return (
        <Container>
            {translations.map((t) => {
                const config = statusConfig[t.status] || statusConfig.none;
                const meta = LOCALE_META[t.locale as LocaleCode];
                const isPending = t.status === 'pending' || t.status === 'translating';

                return (
                    <Badge
                        key={t.locale}
                        $color={config.color}
                        title={`${meta?.nativeName || t.locale}: ${config.tooltip}`}
                    >
                        <span>{meta?.flag}</span>
                        {isPending ? <SpinnerIcon /> : <span>{config.icon}</span>}
                    </Badge>
                );
            })}
        </Container>
    );
};

export default TranslationStatusBadges;

// Styled Components

const Container = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const Badge = styled.span<{ $color: string }>`
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 2px 6px;
    border-radius: 4px;
    background: ${({ $color }) => `${$color}10`};
    font-size: 12px;
    line-height: 1;
    cursor: default;
`;

const spin = keyframes`
    to { transform: rotate(360deg); }
`;

const SpinnerIcon = styled.span`
    display: inline-block;
    width: 8px;
    height: 8px;
    border: 1.5px solid #d69e2e;
    border-top-color: transparent;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
`;
