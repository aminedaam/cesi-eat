import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { getMe } from "@/utils/apiUser";

export const useMe = (token: string) => {
    const { user, setUser } = useUserStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!user && token) {
                setLoading(true);
                setError(null);
                try {
                    const userData = await getMe(token);
                    setUser(userData);
                } catch (err) {
                    console.error("Failed to fetch user data:", err);
                    setError(err);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUser();
    }, [user, token, setUser]);

    return { user, loading, error };
};
