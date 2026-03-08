import { request } from "../appConfig/request-response";
import { AxiosResponse } from "axios";
import { FuncProps } from "../utils/useAuthEP";
import {
    AvailableLocale,
    TranslatedPostDTO,
    TranslationDetailDTO,
    TranslationStatusOverviewDTO,
    RetranslateResponse,
} from "../types/i18n/i18nTypes";

// ─── 독자용 (비인증) ───

// 번역된 글 조회
export async function getTranslatedPost(props: FuncProps) {
    const locale = props.params?.locale ? `?locale=${props.params.locale}` : '';
    return (await request.get(
        `api/v1/i18n/ps/posts/${props.params.postId}${locale}`
    )) as AxiosResponse<TranslatedPostDTO>;
}

// 지원 언어 목록
export async function getSupportedLocales(props: FuncProps) {
    return (await request.get(
        `api/v1/i18n/ps/locales`
    )) as AxiosResponse<AvailableLocale[]>;
}

// ─── 작성자용 (인증 필요) ───

// 전체 번역 상태 조회
export async function getTranslationStatus(props: FuncProps) {
    return (await request.get(
        `api/v1/i18n/posts/${props.params.postId}/translations`,
        { headers: { Authorization: `Bearer ${props.accessToken}` } }
    )) as AxiosResponse<TranslationStatusOverviewDTO>;
}

// 특정 번역본 상세 조회 (편집용)
export async function getTranslationDetail(props: FuncProps) {
    return (await request.get(
        `api/v1/i18n/posts/${props.params.postId}/translations/${props.params.locale}`,
        { headers: { Authorization: `Bearer ${props.accessToken}` } }
    )) as AxiosResponse<TranslationDetailDTO>;
}

// 번역본 수동 수정
export async function updateTranslation(props: FuncProps) {
    return (await request.put(
        `api/v1/i18n/posts/${props.params.postId}/translations/${props.params.locale}`,
        props.reqBody,
        { headers: { Authorization: `Bearer ${props.accessToken}` } }
    )) as AxiosResponse<TranslationDetailDTO>;
}

// 특정 언어 재번역
export async function retranslate(props: FuncProps) {
    return (await request.post(
        `api/v1/i18n/posts/${props.params.postId}/translations/${props.params.locale}/retranslate`,
        props.reqBody || {},
        { headers: { Authorization: `Bearer ${props.accessToken}` } }
    )) as AxiosResponse<RetranslateResponse>;
}

// 전체 재번역
export async function retranslateAll(props: FuncProps) {
    return (await request.post(
        `api/v1/i18n/posts/${props.params.postId}/translations/retranslate-all`,
        {},
        { headers: { Authorization: `Bearer ${props.accessToken}` } }
    )) as AxiosResponse<void>;
}
