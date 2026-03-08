import React from 'react';
import styled from 'styled-components';
import { Container, VStack, Text, HStack, Box } from '@chakra-ui/react';
import { ArrowLeft, RefreshCw, Globe } from 'lucide-react';
import useTranslationManage from './useTranslationManage';
import TranslationEditor from '../TranslationEditor';
import TranslationStatusBadges from '../common/TranslationStatusBadges';
import { LOCALE_META, LocaleCode } from '../../../../types/i18n/i18nTypes';

function TranslationManage() {
    const {
        postId,
        document,
        statusOverview,
        isStatusLoading,
        targetLocales,
        selectedLocale,
        setSelectedLocale,
        handleRetranslateAll,
        isRetranslatingAll,
        handleBack,
    } = useTranslationManage();

    if (isStatusLoading) {
        return (
            <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} py={8}>
                <LoadingText>Loading translation status...</LoadingText>
            </Container>
        );
    }

    return (
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} py={{ base: 4, sm: 6, lg: 8 }}>
            <VStack gap={6} align="stretch">
                {/* 헤더 */}
                <PageHeader>
                    <BackButton onClick={handleBack}>
                        <ArrowLeft size={18} />
                        Back to post
                    </BackButton>
                    <HeaderRight>
                        <RetranslateAllButton
                            onClick={handleRetranslateAll}
                            disabled={isRetranslatingAll}
                        >
                            <RefreshCw size={14} />
                            {isRetranslatingAll ? 'Queuing...' : 'Re-translate All'}
                        </RetranslateAllButton>
                    </HeaderRight>
                </PageHeader>

                {/* 글 정보 */}
                <PostInfo>
                    <Globe size={18} color="#8b7355" />
                    <PostInfoText>
                        <PostTitle>{document.title || 'Untitled'}</PostTitle>
                        <PostSubtitle>Manage translations for this post</PostSubtitle>
                    </PostInfoText>
                </PostInfo>

                {/* 번역 상태 요약 */}
                {statusOverview && (
                    <StatusSection>
                        <SectionLabel>Translation Status</SectionLabel>
                        <TranslationStatusBadges
                            translations={statusOverview.translations}
                        />
                    </StatusSection>
                )}

                {/* 언어별 탭 */}
                <LocaleTabs>
                    {targetLocales.map((locale) => {
                        const meta = LOCALE_META[locale];
                        const status = statusOverview?.translations.find(t => t.locale === locale);
                        const isActive = selectedLocale === locale;

                        return (
                            <LocaleTab
                                key={locale}
                                $isActive={isActive}
                                onClick={() => setSelectedLocale(isActive ? null : locale)}
                            >
                                <span>{meta.flag}</span>
                                <TabLabel>{meta.nativeName}</TabLabel>
                                {status && (
                                    <TabStatus $status={status.status}>
                                        {status.status === 'completed' ? '✅' :
                                         status.status === 'manually_edited' ? '✏️' :
                                         status.status === 'pending' || status.status === 'translating' ? '⏳' :
                                         status.status === 'failed' ? '❌' : '➖'}
                                    </TabStatus>
                                )}
                            </LocaleTab>
                        );
                    })}
                </LocaleTabs>

                {/* 선택된 언어의 번역 에디터 */}
                {selectedLocale && (
                    <TranslationEditor
                        postId={postId}
                        locale={selectedLocale}
                        originalTitle={document.title || ''}
                        originalContent={document.contents || ''}
                    />
                )}

                {/* 미선택 시 안내 */}
                {!selectedLocale && (
                    <EmptyState>
                        <Globe size={40} color="#d4c5b5" />
                        <EmptyText>Select a language above to view or edit the translation</EmptyText>
                    </EmptyState>
                )}
            </VStack>
        </Container>
    );
}

export default TranslationManage;

// Styled Components

const PageHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
`;

const BackButton = styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: #8b7355;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: rgba(139, 115, 85, 0.08);
    }
`;

const HeaderRight = styled.div`
    display: flex;
    gap: 8px;
`;

const RetranslateAllButton = styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid #c4956a;
    background: transparent;
    color: #c4956a;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        background: rgba(196, 149, 106, 0.08);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const PostInfo = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px 20px;
    background: rgba(196, 149, 106, 0.04);
    border: 1px solid rgba(196, 149, 106, 0.12);
    border-radius: 12px;
`;

const PostInfoText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const PostTitle = styled.div`
    font-size: 18px;
    font-weight: 600;
    color: #2c2520;
    font-family: 'Playfair Display', serif;
`;

const PostSubtitle = styled.div`
    font-size: 13px;
    color: #8b7355;
`;

const StatusSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const SectionLabel = styled.div`
    font-size: 12px;
    font-weight: 600;
    color: #8b7355;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const LocaleTabs = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
`;

const LocaleTab = styled.button<{ $isActive: boolean }>`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 10px;
    border: 1.5px solid ${({ $isActive }) => ($isActive ? '#c4956a' : 'rgba(139, 115, 85, 0.2)')};
    background: ${({ $isActive }) => ($isActive ? 'rgba(196, 149, 106, 0.08)' : 'transparent')};
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;

    &:hover {
        border-color: #c4956a;
        background: rgba(196, 149, 106, 0.04);
    }
`;

const TabLabel = styled.span`
    font-weight: 500;
    color: #2c2520;
`;

const TabStatus = styled.span<{ $status: string }>`
    font-size: 14px;
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 60px 20px;
    border: 1px dashed rgba(139, 115, 85, 0.2);
    border-radius: 12px;
`;

const EmptyText = styled.div`
    font-size: 14px;
    color: #a09080;
`;

const LoadingText = styled.div`
    text-align: center;
    padding: 40px;
    color: #8b7355;
    font-size: 14px;
`;
