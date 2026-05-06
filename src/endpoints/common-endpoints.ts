import {request} from "../appConfig/request-response";
import {AxiosResponse} from "axios/index";
import {OgMetadataDTO} from "../types/common/OgMetadataDTO";

export async function getWeather() {
  return (await request.get('/ps/commons/weather')) as AxiosResponse<any>
}

/**
 * URL의 OpenGraph 메타데이터 조회 (에디터 북마크/멘션 카드용)
 */
export async function getOgMetadata(url: string) {
  return (await request.get('/ps/commons/og-metadata', {
    params: { url },
  })) as AxiosResponse<OgMetadataDTO>;
}