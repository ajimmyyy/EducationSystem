import apiFetcher from "@/utils/api-fetcher";
import { useState, useEffect } from "react";

export const useSearchUser = (userType: string, pageNum: number) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async (type: string, page: number) => {
      const { data } = await apiFetcher(`/api/ManageUser?type=${type}&page=${page}`, {});
      setUsers(data);
    }
    fetchUsers(userType, pageNum);
  }, [userType]);

  return { users };
}