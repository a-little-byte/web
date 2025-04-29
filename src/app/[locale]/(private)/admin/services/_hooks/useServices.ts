import { useQuery } from "@/hooks/useQuery";
import { apiClient } from "@/lib/apiClient";

export const useServices = () => {
  const { data: items, ...query } = useQuery(apiClient.services);

  const data = items?.map((item) => ({
    ...item,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
  }));

  return { data, ...query };
};
