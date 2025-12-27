// src/hooks/useFolderQueries.ts

import useAuthEP, {FuncProps} from "../utils/useAuthEP";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createFolder, deleteFolder, getAllLoginUserFolders, updateFolder} from "../endpoints/folders-endpoints";

export const useMyFolders = () => {
  const authEP = useAuthEP();
  
  return useQuery<any>({
    queryKey: ["folders", "my"],
    queryFn: async () => {
      const response = await authEP({
        func: getAllLoginUserFolders
      })
      return response.data
    },
    staleTime: 1000 * 60 * 1
  })
}

export const useCreateFolder = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (folderData : FoldersDTO) => authEP({
        func : createFolder,
        params: folderData
      })
    ,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ["folders", "my"]})
    }
  })
}

export const useUpdateFolder = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (folderData : FoldersDTO) => authEP({
      func: updateFolder,
      params : folderData,
    }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ["folders", "my"]})
    }
  })
}

export const useDeleteFolder = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (folderId: string) => authEP({
      func: deleteFolder,
      params: { id: folderId }
    }),
    onSuccess: async () => {  // async 추가
      await queryClient.invalidateQueries({ queryKey: ["folders", "my"] });
    }
  });
};

