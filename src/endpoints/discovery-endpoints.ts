import { request } from "../appConfig/request-response";
import { AxiosResponse } from "axios";
import { FuncProps } from "../utils/useAuthEP";
import { DiscoveryDigestResponse } from "../types/discovery/discoveryTypes";

// 목적지 다이제스트 조회 (비인증 허용 — ps 경로)
export async function getDiscoveryDigest(props: {
  params: { query: string; locale?: string };
}) {
  const { query, locale } = props.params;
  return (await request.get(
    `api/v1/discovery/ps/digest?query=${encodeURIComponent(query)}&locale=${locale ?? "en"}`
  )) as AxiosResponse<DiscoveryDigestResponse>;
}

// 목적지 정보 수집 요청 (인증 필요). force=true 면 신선한 캐시가 있어도 재수집.
export async function requestDiscoveryCollect(props: FuncProps) {
  const force = props.params?.force ? "true" : "false";
  return (await request.post(
    `api/v1/discovery/collect?force=${force}`,
    props.reqBody,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<DiscoveryDigestResponse>;
}
