import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { AvailableLocale, LocaleCode, LOCALE_META } from '../../../../../types/i18n/i18nTypes';

interface LanguageSwitcherProps {
    availableLocales: AvailableLocale[];
    currentLocale: LocaleCode;
    onLocaleChange: (locale: LocaleCode) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
    availableLocales,
    currentLocale,
    onLocaleChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentMeta = LOCALE_META[currentLocale];

    // 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (locale: LocaleCode) => {
        onLocaleChange(locale);
        setIsOpen(false);
    };

    return (
        <Container ref={containerRef}>
            <TriggerButton onClick={() => setIsOpen(prev => !prev)} $isOpen={isOpen}>
                <Globe size={14} />
                <TriggerLabel>{currentMeta?.nativeName || currentLocale}</TriggerLabel>
                <ChevronDown size={12} style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                }} />
            </TriggerButton>

            {isOpen && (
                <Dropdown>
                    {availableLocales.map((loc) => {
                        const meta = LOCALE_META[loc.code];
                        const isActive = loc.code === currentLocale;
                        const isAvailable = loc.status === 'original' || loc.status === 'completed' || loc.status === 'manually_edited';
                        const isPending = loc.status === 'pending' || loc.status === 'translating';
                        const isFailed = loc.status === 'failed';

                        return (
                            <DropdownItem
                                key={loc.code}
                                $isActive={isActive}
                                $isAvailable={isAvailable}
                                onClick={() => isAvailable && handleSelect(loc.code)}
                                disabled={!isAvailable}
                            >
                                <ItemLeft>
                                    <span>{meta.flag}</span>
                                    <ItemLabel>{meta.nativeName}</ItemLabel>
                                    {loc.isOriginal && <OriginalTag>Original</OriginalTag>}
                                </ItemLeft>
                                <ItemRight>
                                    {isPending && <Spinner />}
                                    {isFailed && <FailedText>Failed</FailedText>}
                                    {isActive && isAvailable && <Check size={14} color="#c4956a" />}
                                </ItemRight>
                            </DropdownItem>
                        );
                    })}
                </Dropdown>
            )}
        </Container>
    );
};

export default LanguageSwitcher;

// Styled Components

const Container = styled.div`
    position: relative;
    display: inline-flex;
`;

const TriggerButton = styled.button<{ $isOpen: boolean }>`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 8px;
    border: 1px solid ${({ $isOpen }) => ($isOpen ? '#c4956a' : 'rgba(139, 115, 85, 0.25)')};
    background: ${({ $isOpen }) => ($isOpen ? 'rgba(196, 149, 106, 0.06)' : 'transparent')};
    color: #5a4a3a;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: #c4956a;
        background: rgba(196, 149, 106, 0.04);
    }
`;

const TriggerLabel = styled.span`
    line-height: 1;
`;

const Dropdown = styled.div`
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    min-width: 200px;
    background: #fff;
    border: 1px solid rgba(139, 115, 85, 0.15);
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(44, 37, 32, 0.12);
    z-index: 100;
    overflow: hidden;
    padding: 4px;
`;

const DropdownItem = styled.button<{ $isActive: boolean; $isAvailable: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    background: ${({ $isActive }) => ($isActive ? 'rgba(196, 149, 106, 0.08)' : 'transparent')};
    cursor: ${({ $isAvailable }) => ($isAvailable ? 'pointer' : 'default')};
    opacity: ${({ $isAvailable }) => ($isAvailable ? 1 : 0.45)};
    transition: background 0.15s ease;
    font-size: 13px;

    &:hover:not(:disabled) {
        background: ${({ $isActive }) =>
            $isActive ? 'rgba(196, 149, 106, 0.12)' : 'rgba(139, 115, 85, 0.05)'};
    }
`;

const ItemLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const ItemLabel = styled.span`
    color: #2c2520;
    font-weight: 500;
`;

const OriginalTag = styled.span`
    font-size: 10px;
    color: #8b7355;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    padding: 1px 5px;
    border-radius: 4px;
    background: rgba(139, 115, 85, 0.08);
`;

const ItemRight = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`;

const FailedText = styled.span`
    font-size: 11px;
    color: #e53e3e;
    font-weight: 500;
`;

const spin = keyframes`
    to { transform: rotate(360deg); }
`;

const Spinner = styled.span`
    width: 12px;
    height: 12px;
    border: 1.5px solid #d69e2e;
    border-top-color: transparent;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
`;
