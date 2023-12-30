import apiFetcher from "@/utils/api-fetcher";
import { useState, useEffect } from "react";

export const useSearchUser = (userType: string) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async (type: string) => {
            const { data } = await apiFetcher(`/api/ManageUser?type=${type}`, {});
            setUsers(data);
        }
        fetchUsers(userType);
    }, [userType]);

    return {users};
}