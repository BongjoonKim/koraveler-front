import React from 'react';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { Check, Globe } from 'lucide-react';
import { preferredLocaleAtom } from '../../../stores/jotai/localeAtom';
import { LocaleCode, LOCALE_META, SUPPORTED_LOCALES } from '../../../types/i18n/i18nTypes';

interface LanguageSettingModalProps {
    onClose: () => void;
}

function LanguageSettingModal({ onClose }: LanguageSettingModalProps) {
    const [preferredLocale, setPreferredLocale] = useAtom(preferredLocaleAtom);

    const handleSelect = (locale: LocaleCode) => {
        setPreferredLocale(locale);
        onClose();
    };

    return (
        <Container>
            <Header>
                <Globe size={18} color="#8b7355" />
                <Title>Default Language</Title>
            </Header>
            <Description>
                Choose your preferred language for viewing blog posts.
                You can still switch languages on individual posts.
            </Description>
            <OptionList>
                {SUPPORTED_LOCALES.map((locale) => {
                    const meta = LOCALE_META[locale];
                    const isSelected = preferredLocale === locale;

                    return (
                        <OptionItem
                            key={locale}
                            $isSelected={isSelected}
                            onClick={() => handleSelect(locale)}
                        >
                            <OptionLeft>
                                <Flag>{meta.flag}</Flag>
                                <OptionLabel>
                                    <NativeName>{meta.nativeName}</NativeName>
                                    <EnglishName>{meta.name}</EnglishName>
                                </OptionLabel>
                            </OptionLeft>
                            {isSelected && <Check size={16} color="#c4956a" />}
                        </OptionItem>
                    );
                })}
            </OptionList>
        </Container>
    );
}

export default LanguageSettingModal;

// Styled Components

const Container = styled.div`
    padding: 24px;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
`;

const Title = styled.h3`
    font-size: 18px;
    font-weight: 600;
    color: #2c2520;
    margin: 0;
`;

const Description = styled.p`
    font-size: 13px;
    color: #8b7355;
    margin: 0 0 20px 0;
    line-height: 1.5;
`;

const OptionList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const OptionItem = styled.button<{ $isSelected: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 12px 16px;
    border-radius: 10px;
    border: 1.5px solid ${({ $isSelected }) =>
        $isSelected ? '#c4956a' : 'rgba(139, 115, 85, 0.12)'};
    background: ${({ $isSelected }) =>
        $isSelected ? 'rgba(196, 149, 106, 0.06)' : 'transparent'};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: rgba(196, 149, 106, 0.04);
        border-color: ${({ $isSelected }) =>
            $isSelected ? '#c4956a' : 'rgba(139, 115, 85, 0.25)'};
    }
`;

const OptionLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const Flag = styled.span`
    font-size: 22px;
    line-height: 1;
`;

const OptionLabel = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1px;
`;

const NativeName = styled.span`
    font-size: 15px;
    font-weight: 500;
    color: #2c2520;
`;

const EnglishName = styled.span`
    font-size: 12px;
    color: #a09080;
`;
