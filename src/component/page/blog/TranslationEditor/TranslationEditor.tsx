import React, { useRef } from 'react';
import styled from 'styled-components';
import { Save, RefreshCw, X, Edit3, AlertTriangle } from 'lucide-react';
import { Editor } from '@tiptap/react';
import { LocaleCode, LOCALE_META } from '../../../../types/i18n/i18nTypes';
import useTranslationEditor from './useTranslationEditor';
import TiptapEditor from '../../../../common/elements/CusEditor/TipTapEditor';
import { homeTokens as t } from '../../MainPage/MainBody/homeTokens';

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
    const editorRef = useRef<Editor | null>(null);
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
                            <EditorWrapper>
                                <TiptapEditor
                                    ref={editorRef}
                                    initialValue={editedContent}
                                    onChange={setEditedContent}
                                    placeholder="Translated content..."
                                />
                            </EditorWrapper>
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
    border: 1px solid ${t.color.border};
    border-radius: ${t.radius.lg};
    overflow: hidden;
    background: ${t.color.surface};
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px 20px;
    background: ${t.color.surface2};
    border-bottom: 1px solid ${t.color.border};
`;

const HeaderTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 600;
    color: ${t.color.text};
    font-family: ${t.font.serif};
`;

const StatusChip = styled.span<{ $status: string }>`
    font-size: 11px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: ${t.radius.pill};
    background: ${({ $status }) => {
        switch ($status) {
            case 'completed': return 'rgba(127, 214, 164, 0.16)';
            case 'manually_edited': return 'rgba(143, 192, 240, 0.16)';
            case 'pending':
            case 'translating': return 'rgba(230, 192, 104, 0.16)';
            case 'failed': return 'rgba(240, 128, 128, 0.16)';
            default: return 'rgba(154, 163, 153, 0.16)';
        }
    }};
    color: ${({ $status }) => {
        switch ($status) {
            case 'completed': return '#7fd6a4';
            case 'manually_edited': return '#8fc0f0';
            case 'pending':
            case 'translating': return '#e6c068';
            case 'failed': return '#f08080';
            default: return '#9aa399';
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
    font-family: ${t.font.sans};

    ${({ $variant }) => {
        switch ($variant) {
            case 'primary':
                return `
                    background: ${t.color.accentStrong};
                    color: #ffffff;
                    border-color: ${t.color.accentStrong};
                    &:hover:not(:disabled) { background: ${t.color.accent}; border-color: ${t.color.accent}; color: ${t.color.bg}; }
                `;
            case 'danger':
                return `
                    background: transparent;
                    color: #f08080;
                    border-color: rgba(240, 128, 128, 0.5);
                    &:hover:not(:disabled) { background: rgba(240, 128, 128, 0.12); }
                `;
            case 'secondary':
                return `
                    background: transparent;
                    color: ${t.color.accent};
                    border-color: rgba(143, 191, 148, 0.4);
                    &:hover:not(:disabled) { background: rgba(143, 191, 148, 0.12); }
                `;
            default:
                return `
                    background: transparent;
                    color: ${t.color.textSoft};
                    border-color: ${t.color.border2};
                    &:hover:not(:disabled) { background: ${t.color.surface3}; color: ${t.color.text}; }
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
    background: rgba(240, 128, 128, 0.1);
    border-bottom: 1px solid rgba(240, 128, 128, 0.25);
    color: #f0a0a0;
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
    background: ${t.color.border};

    @media (max-width: 768px) {
        width: 100%;
        height: 1px;
    }
`;

const PanelLabel = styled.div`
    font-size: 11px;
    font-weight: 600;
    color: ${t.color.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
`;

const PanelTitle = styled.h2`
    font-size: 20px;
    font-weight: 600;
    color: ${t.color.text};
    margin-bottom: 16px;
    font-family: ${t.font.serif};
`;

const PanelContent = styled.div`
    font-size: 15px;
    line-height: 1.7;
    color: ${t.color.textSoft};

    img { max-width: 100%; height: auto; border-radius: 8px; }
    p { margin-bottom: 12px; }
    h2, h3 { margin: 20px 0 10px; color: ${t.color.text}; }
    a { color: ${t.color.accent}; }
`;

const EditableTitle = styled.input`
    width: 100%;
    font-size: 20px;
    font-weight: 600;
    color: ${t.color.text};
    background: ${t.color.surface2};
    font-family: ${t.font.serif};
    border: 1px solid ${t.color.border2};
    border-radius: ${t.radius.md};
    padding: 8px 12px;
    margin-bottom: 12px;
    outline: none;

    &::placeholder { color: ${t.color.textFaint}; }
    &:focus { border-color: ${t.color.accent}; }
`;

const EditorWrapper = styled.div`
    min-height: 300px;
    display: flex;
    flex-direction: column;
    background: ${t.color.surface2};
    border: 1px solid ${t.color.border2};
    border-radius: ${t.radius.md};
    overflow: hidden;
    padding: 0 12px;

    > div {
        flex: 1;
        height: auto;
        min-height: 300px;
    }
`;

const LoadingContainer = styled.div`
    padding: 40px;
    text-align: center;
    color: ${t.color.textMuted};
`;
