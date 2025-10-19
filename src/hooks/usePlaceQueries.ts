import useAuthEP from "../utils/useAuthEP";
import {useMutation} from "@tanstack/react-query";
import {PlaceSearchRequest, PlaceSearchResponse} from "../types/place/placeTypes";
import {AxiosResponse} from "axios";
import {searchPlaces} from "../endpoints/place-endpoints";

export const usePlaceQueries = () => {
  const authEP = useAuthEP();
  
  return useMutation<AxiosResponse<PlaceSearchResponse>,Error, PlaceSearchRequest>({
    mutationFn: (data : PlaceSearchRequest) => {
      return authEP({
        func: searchPlaces,
        reqBody: data,
      })
    },
    onSuccess: (response) => {
      console.log("search places success");
    },
    onError: (error) => {
      console.log("search places success")
    }
  })
  
}