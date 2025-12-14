import { IUser } from "@/store/use-user-data-store";
import { api } from "@/service/data";
import { useQuery } from "@tanstack/react-query";

export function useGetUserById(id?: number) {
  return useQuery({
    enabled: !!id,
    queryKey: ["usuario", id],
    queryFn: async () => {
      const response = await api.get<IUser>(`/usuarios/${id}`, {
        withCredentials: true,
      });
      return response.data;
    },
  });
}
