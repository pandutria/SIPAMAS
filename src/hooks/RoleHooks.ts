import { useEffect, useState } from "react";
import API from "../server/API";

export default function useRoleHooks() {
    const [role, setRole] = useState<RoleProps[]>([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchRole = async() => {
            try {
                const response = await API.get("/role", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRole(response.data.data);
            } catch (error) {
                if (error) {
                    console.error("Terjadi Kesalahan");
                }
            }
        }

        fetchRole();
    }, [token]);

    return {
        role
    }
}
