import {FuncProps} from "../utils/useAuthEP";
import {request} from "../appConfig/request-response";
import {AxiosResponse} from "axios";
import {PlaceSearchResponse} from "../types/place/placeTypes";

export async function searchPlaces(props : FuncProps) {
  return (await request.post(
    "api/place/search",
    props.reqBody,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`
      }
    }
  )) as AxiosResponse<PlaceSearchResponse>;
}