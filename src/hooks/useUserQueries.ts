import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthEP from "../utils/useAuthEP";
import { updateUserAccount } from "../endpoints/users-endpoints";
import { UpdateUserAccountDTO } from "../types/users/UsersDTO";

export const useUpdateUserAccount = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();

  return useMutation<UpdateUserAccountDTO, Error, UpdateUserAccountDTO>({
    mutationFn: async (body) => {
      const res = await authEP({
        func: updateUserAccount,
        reqBody: body,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
