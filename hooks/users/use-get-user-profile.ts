import { useUserDataStore } from "@/store/use-user-data-store";
import { api } from "@/service/data";
import { useQuery } from "@tanstack/react-query";

export function useGetUserProfile() {
  const token = useUserDataStore((s) => s.token);

  return useQuery({
    enabled: !!token,
    queryKey: ["me", token],
    queryFn: async () => {
      const response = await api.get("/me");
      return response.data;
    },
  });
}
