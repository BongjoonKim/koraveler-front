import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import useAuthEP from "../utils/useAuthEP";
import { currentLocaleAtom } from "../stores/jotai/localeAtom";
import {
    TranslatedPostDTO,
    TranslationStatusOverviewDTO,
    TranslationDetailDTO,
    TranslationEditRequest,
    RetranslateResponse,
    AvailableLocale,
    LocaleCode,
} from "../types/i18n/i18nTypes";
import {
    getTranslatedPost,
    getSupportedLocales,
    getTranslationStatus,
    getTranslationDetail,
    updateTranslation,
    retranslate,
    retranslateAll,
} from "../endpoints/i18n-endpoints";

// ─── Query Keys ───

export const i18nKeys = {
    all: ["i18n"] as const,
    translatedPost: (postId: string, locale: LocaleCode) =>
        [...i18nKeys.all, "post", postId, locale] as const,
    locales: () => [...i18nKeys.all, "locales"] as const,
    translationStatus: (postId: string) =>
        [...i18nKeys.all, "status", postId] as const,
    translationDetail: (postId: string, locale: LocaleCode) =>
        [...i18nKeys.all, "detail", postId, locale] as const,
};

// ─── 독자용 Hooks ───

// 번역된 글 조회 (현재 locale 기반)
export const useTranslatedPost = (postId?: string) => {
    const locale = useAtomValue(currentLocaleAtom);

    return useQuery<TranslatedPostDTO>({
        queryKey: i18nKeys.translatedPost(postId!, locale),
        queryFn: async () => {
            const res = await getTranslatedPost({
                params: { postId, locale },
            });
            return res.data;
        },
        enabled: !!postId,
        staleTime: 1000 * 60 * 5, // 5분
    });
};

// 지원 언어 목록
export const useSupportedLocales = () => {
    return useQuery<AvailableLocale[]>({
        queryKey: i18nKeys.locales(),
        queryFn: async () => {
            const res = await getSupportedLocales({});
            return res.data;
        },
        staleTime: 1000 * 60 * 60, // 1시간 (잘 안 변함)
    });
};

// ─── 작성자용 Hooks ───

// 전체 번역 상태 (대시보드, 폴링 지원)
export const useTranslationStatus = (postId?: string) => {
    const authEP = useAuthEP();

    return useQuery<TranslationStatusOverviewDTO>({
        queryKey: i18nKeys.translationStatus(postId!),
        queryFn: async () => {
            const res = await authEP({
                func: getTranslationStatus,
                params: { postId },
            });
            return res.data;
        },
        enabled: !!postId,
        // pending/translating 있으면 10초마다 폴링
        refetchInterval: (query) => {
            const data = query.state.data;
            const hasPending = data?.translations.some(
                (t) => t.status === "pending" || t.status === "translating"
            );
            return hasPending ? 10_000 : false;
        },
    });
};

// 특정 번역본 상세 (편집용)
export const useTranslationDetail = (postId?: string, locale?: LocaleCode) => {
    const authEP = useAuthEP();

    return useQuery<TranslationDetailDTO>({
        queryKey: i18nKeys.translationDetail(postId!, locale!),
        queryFn: async () => {
            const res = await authEP({
                func: getTranslationDetail,
                params: { postId, locale },
            });
            return res.data;
        },
        enabled: !!postId && !!locale,
    });
};

// 번역본 수동 수정
export const useUpdateTranslation = (postId: string, locale: LocaleCode) => {
    const authEP = useAuthEP();
    const queryClient = useQueryClient();

    return useMutation<TranslationDetailDTO, Error, TranslationEditRequest>({
        mutationFn: async (data) => {
            const res = await authEP({
                func: updateTranslation,
                params: { postId, locale },
                reqBody: data,
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: i18nKeys.translationStatus(postId),
            });
            queryClient.invalidateQueries({
                queryKey: i18nKeys.translationDetail(postId, locale),
            });
            queryClient.invalidateQueries({
                queryKey: i18nKeys.translatedPost(postId, locale),
            });
        },
    });
};

// 특정 언어 재번역
export const useRetranslate = (postId: string, locale: LocaleCode) => {
    const authEP = useAuthEP();
    const queryClient = useQueryClient();

    return useMutation<RetranslateResponse, Error, { confirmed?: boolean }>({
        mutationFn: async (data) => {
            const res = await authEP({
                func: retranslate,
                params: { postId, locale },
                reqBody: data,
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: i18nKeys.translationStatus(postId),
            });
        },
    });
};

// 전체 재번역
export const useRetranslateAll = (postId: string) => {
    const authEP = useAuthEP();
    const queryClient = useQueryClient();

    return useMutation<void, Error>({
        mutationFn: async () => {
            await authEP({
                func: retranslateAll,
                params: { postId },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: i18nKeys.translationStatus(postId),
            });
        },
    });
};
