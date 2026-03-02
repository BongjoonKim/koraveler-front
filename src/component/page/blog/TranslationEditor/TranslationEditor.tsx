import React from 'react';
import styled from 'styled-components';
import { Save, RefreshCw, X, Edit3, AlertTriangle } from 'lucide-react';
import { LocaleCode, LOCALE_META } from '../../../../types/i18n/i18nTypes';
import useTranslationEditor from './useTranslationEditor';

interface TranslationEditorProps {
    postId: string;
    locale: LocaleCode;
    originalTitle: string;
    originalContent: string;
}

const TranslationEditor: React.FC<TranslationEditorProps> = ({
    postId,
    locale,
    originalTitle,
    originalContent,
}) => {
    const {
        detail,
        isLoading,
        isEditing,
        editedTitle,
        editedContent,
        setEditedTitle,
        setEditedContent,
        startEditing,
        discardChanges,
        saveChanges,
        isSaving,
        handleRetranslate,
        confirmRetranslate,
        isRetranslating,
        showRetranslateWarning,
        setShowRetranslateWarning,
    } = useTranslationEditor(postId, locale);

    const meta = LOCALE_META[locale];

    if (isLoading) {
        return <LoadingContainer>Loading translation...</LoadingContainer>;
    }

    return (
        <Container>
            <Header>
                <HeaderTitle>
                    <span>{meta.flag}</span> {meta.nativeName} Translation
                    {detail?.status && (
                        <StatusChip $status={detail.status}>{detail.status}</StatusChip>
                    )}
                </HeaderTitle>
                <HeaderActions>
                    {!isEditing ? (
                        <>
                            <ActionButton onClick={startEditing} disabled={!detail}>
                                <Edit3 size={14} /> Edit
                            </ActionButton>
                            <ActionButton
                                $variant="secondary"
                                onClick={() => handleRetranslate(false)}
                                disabled={isRetranslating}
                            >
                                <RefreshCw size={14} /> Re-translate
                            </ActionButton>
                        </>
                    ) : (
                        <>
                            <ActionButton $variant="primary" onClick={saveChanges} disabled={isSaving}>
                                <Save size={14} /> {isSaving ? 'Saving...' : 'Save'}
                            </ActionButton>
                            <ActionButton $variant="danger" onClick={discardChanges}>
                                <X size={14} /> Discard
                            </ActionButton>
                        </>
                    )}
                </HeaderActions>
            </Header>

            {/* 재번역 경고 모달 */}
            {showRetranslateWarning && (
                <WarningBanner>
                    <AlertTriangle size={16} />
                    <span>This translation has been manually edited. Re-translating will overwrite your changes.</span>
                    <WarningActions>
                        <ActionButton $variant="danger" onClick={confirmRetranslate} disabled={isRetranslating}>
                            Confirm
                        </ActionButton>
                        <ActionButton onClick={() => setShowRetranslateWarning(false)}>
                            Cancel
                        </ActionButton>
                    </WarningActions>
                </WarningBanner>
            )}

            <Panels>
                {/* 왼쪽: 원본 (읽기 전용) */}
                <Panel>
                    <PanelLabel>Original (한국어)</PanelLabel>
                    <PanelTitle>{originalTitle}</PanelTitle>
                    <PanelContent dangerouslySetInnerHTML={{ __html: originalContent }} />
                </Panel>

                <Divider />

                {/* 오른쪽: 번역 (편집 가능) */}
                <Panel>
                    <PanelLabel>{meta.nativeName} Translation</PanelLabel>
                    {isEditing ? (
                        <>
                            <EditableTitle
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                placeholder="Translated title..."
                            />
                            <EditableContent
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                placeholder="Translated content (HTML)..."
                            />
                        </>
                    ) : (
                        <>
                            <PanelTitle>{detail?.title || '(No translation yet)'}</PanelTitle>
                            <PanelContent
                                dangerouslySetInnerHTML={{ __html: detail?.content || '' }}
                            />
                        </>
                    )}
                </Panel>
            </Panels>
        </Container>
    );
};

export default TranslationEditor;

// Styled Components

const Container = styled.div`
    border: 1px solid rgba(139, 115, 85, 0.2);
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px 20px;
    background: rgba(196, 149, 106, 0.06);
    border-bottom: 1px solid rgba(139, 115, 85, 0.1);
`;

const HeaderTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 600;
    color: #2c2520;
`;

const StatusChip = styled.span<{ $status: string }>`
    font-size: 11px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 10px;
    background: ${({ $status }) => {
        switch ($status) {
            case 'completed': return 'rgba(56, 161, 105, 0.12)';
            case 'manually_edited': return 'rgba(49, 130, 206, 0.12)';
            case 'pending':
            case 'translating': return 'rgba(214, 158, 46, 0.12)';
            case 'failed': return 'rgba(229, 62, 62, 0.12)';
            default: return 'rgba(160, 174, 192, 0.12)';
        }
    }};
    color: ${({ $status }) => {
        switch ($status) {
            case 'completed': return '#38a169';
            case 'manually_edited': return '#3182ce';
            case 'pending':
            case 'translating': return '#d69e2e';
            case 'failed': return '#e53e3e';
            default: return '#a0aec0';
        }
    }};
`;

const HeaderActions = styled.div`
    display: flex;
    gap: 8px;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid;

    ${({ $variant }) => {
        switch ($variant) {
            case 'primary':
                return `
                    background: #c4956a;
                    color: #fff;
                    border-color: #c4956a;
                    &:hover:not(:disabled) { background: #b08058; }
                `;
            case 'danger':
                return `
                    background: transparent;
                    color: #e53e3e;
                    border-color: #e53e3e;
                    &:hover:not(:disabled) { background: rgba(229, 62, 62, 0.06); }
                `;
            case 'secondary':
                return `
                    background: transparent;
                    color: #8b7355;
                    border-color: #8b7355;
                    &:hover:not(:disabled) { background: rgba(139, 115, 85, 0.06); }
                `;
            default:
                return `
                    background: transparent;
                    color: #2c2520;
                    border-color: rgba(139, 115, 85, 0.3);
                    &:hover:not(:disabled) { background: rgba(139, 115, 85, 0.06); }
                `;
        }
    }}

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const WarningBanner = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    padding: 12px 20px;
    background: rgba(229, 62, 62, 0.06);
    border-bottom: 1px solid rgba(229, 62, 62, 0.15);
    color: #c53030;
    font-size: 13px;
`;

const WarningActions = styled.div`
    display: flex;
    gap: 6px;
    margin-left: auto;
`;

const Panels = styled.div`
    display: flex;
    min-height: 400px;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const Panel = styled.div`
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    max-height: 600px;
`;

const Divider = styled.div`
    width: 1px;
    background: rgba(139, 115, 85, 0.15);

    @media (max-width: 768px) {
        width: 100%;
        height: 1px;
    }
`;

const PanelLabel = styled.div`
    font-size: 11px;
    font-weight: 600;
    color: #8b7355;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
`;

const PanelTitle = styled.h2`
    font-size: 20px;
    font-weight: 600;
    color: #2c2520;
    margin-bottom: 16px;
    font-family: 'Playfair Display', serif;
`;

const PanelContent = styled.div`
    font-size: 15px;
    line-height: 1.7;
    color: #3d3530;

    img { max-width: 100%; height: auto; border-radius: 8px; }
    p { margin-bottom: 12px; }
    h2, h3 { margin: 20px 0 10px; color: #2c2520; }
    a { color: #c4956a; }
`;

const EditableTitle = styled.input`
    width: 100%;
    font-size: 20px;
    font-weight: 600;
    color: #2c2520;
    font-family: 'Playfair Display', serif;
    border: 1px solid rgba(139, 115, 85, 0.3);
    border-radius: 6px;
    padding: 8px 12px;
    margin-bottom: 12px;
    outline: none;

    &:focus { border-color: #c4956a; }
`;

const EditableContent = styled.textarea`
    width: 100%;
    min-height: 300px;
    font-size: 13px;
    line-height: 1.6;
    color: #3d3530;
    font-family: 'Menlo', 'Monaco', monospace;
    border: 1px solid rgba(139, 115, 85, 0.3);
    border-radius: 6px;
    padding: 12px;
    resize: vertical;
    outline: none;

    &:focus { border-color: #c4956a; }
`;

const LoadingContainer = styled.div`
    padding: 40px;
    text-align: center;
    color: #8b7355;
`;
