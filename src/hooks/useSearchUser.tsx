import apiFetcher from "@/utils/api-fetcher";
import { useState, useEffect } from "react";

export const useSearchUser = (userType: string) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const { data } = await apiFetcher("/api/ManageUser?type=" + userType, {});
            setUsers(data);
        }
        fetchUsers();
    }, [userType]);

    return {users};
}