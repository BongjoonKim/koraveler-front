import { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslationStatus, useRetranslateAll } from '../../../../hooks/useI18nQueries';
import { LocaleCode, SUPPORTED_LOCALES } from '../../../../types/i18n/i18nTypes';
import { useRecoilState } from 'recoil';
import recoil from '../../../../stores/recoil';
import { getDocument } from '../../../../endpoints/blog-endpoints';
import { useEffect } from 'react';

export default function useTranslationManage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);

    // query param에서 locale 읽기 (Edit 버튼에서 전달됨)
    const initialLocale = searchParams.get('locale') as LocaleCode | null;

    // 원본 문서 정보
    const [document, setDocument] = useState<DocumentDTO>({});
    const [selectedLocale, setSelectedLocale] = useState<LocaleCode | null>(initialLocale);

    // 번역 상태
    const { data: statusOverview, isLoading: isStatusLoading } = useTranslationStatus(id);
    const retranslateAllMutation = useRetranslateAll(id!);

    // 원본 글 조회
    useEffect(() => {
        const fetchDoc = async () => {
            try {
                if (id) {
                    const res = await getDocument({ params: { id } });
                    if (res.status === 200) {
                        setDocument(res.data);
                    }
                }
            } catch (e) {
                setErrorMsg({ status: 'error', msg: 'Failed to load document' });
            }
        };
        fetchDoc();
    }, [id]);

    // 타겟 locale만 필터 (원본 제외)
    const targetLocales = useMemo(() => {
        const original = statusOverview?.originalLocale || 'ko';
        return SUPPORTED_LOCALES.filter(l => l !== original);
    }, [statusOverview?.originalLocale]);

    // 전체 재번역
    const handleRetranslateAll = useCallback(async () => {
        try {
            await retranslateAllMutation.mutateAsync();
        } catch (e) {
            setErrorMsg({ status: 'error', msg: 'Re-translate all failed' });
        }
    }, [retranslateAllMutation]);

    // 뒤로 가기
    const handleBack = useCallback(() => {
        navigate(`/blog/view/${initialLocale || 'ko'}/${id}`);
    }, [navigate, id, initialLocale]);

    return {
        postId: id!,
        document,
        statusOverview,
        isStatusLoading,
        targetLocales,
        selectedLocale,
        setSelectedLocale,
        handleRetranslateAll,
        isRetranslatingAll: retranslateAllMutation.isPending,
        handleBack,
    };
}
