import { useState, useCallback } from 'react';
import { LocaleCode } from '../../../../types/i18n/i18nTypes';
import { useTranslationDetail, useUpdateTranslation, useRetranslate } from '../../../../hooks/useI18nQueries';

export default function useTranslationEditor(postId: string, locale: LocaleCode) {
    const { data: detail, isLoading, refetch } = useTranslationDetail(postId, locale);
    const updateMutation = useUpdateTranslation(postId, locale);
    const retranslateMutation = useRetranslate(postId, locale);

    const [editedTitle, setEditedTitle] = useState<string>('');
    const [editedContent, setEditedContent] = useState<string>('');
    const [editedSummary, setEditedSummary] = useState<string>('');
    const [isEditing, setIsEditing] = useState(false);
    const [showRetranslateWarning, setShowRetranslateWarning] = useState(false);

    // 편집 시작
    const startEditing = useCallback(() => {
        if (detail) {
            setEditedTitle(detail.title || '');
            setEditedContent(detail.content || '');
            setEditedSummary(detail.summary || '');
            setIsEditing(true);
        }
    }, [detail]);

    // 편집 취소
    const discardChanges = useCallback(() => {
        setIsEditing(false);
        setEditedTitle('');
        setEditedContent('');
        setEditedSummary('');
    }, []);

    // 저장
    const saveChanges = useCallback(async () => {
        await updateMutation.mutateAsync({
            title: editedTitle,
            content: editedContent,
            summary: editedSummary || undefined,
        });
        setIsEditing(false);
        refetch();
    }, [editedTitle, editedContent, editedSummary, updateMutation, refetch]);

    // 재번역
    const handleRetranslate = useCallback(async (confirmed = false) => {
        try {
            const result = await retranslateMutation.mutateAsync({ confirmed });
            if (result.requiresConfirmation) {
                setShowRetranslateWarning(true);
            } else {
                setShowRetranslateWarning(false);
                refetch();
            }
        } catch (error) {
            console.error('재번역 요청 실패:', error);
        }
    }, [retranslateMutation, refetch]);

    const confirmRetranslate = useCallback(async () => {
        await retranslateMutation.mutateAsync({ confirmed: true });
        setShowRetranslateWarning(false);
        refetch();
    }, [retranslateMutation, refetch]);

    return {
        detail,
        isLoading,
        isEditing,
        editedTitle,
        editedContent,
        editedSummary,
        setEditedTitle,
        setEditedContent,
        setEditedSummary,
        startEditing,
        discardChanges,
        saveChanges,
        isSaving: updateMutation.isPending,
        handleRetranslate,
        confirmRetranslate,
        isRetranslating: retranslateMutation.isPending,
        showRetranslateWarning,
        setShowRetranslateWarning,
    };
}
