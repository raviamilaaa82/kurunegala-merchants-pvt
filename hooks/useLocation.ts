// hooks/useLocation.ts
import { useState } from "react";

export function useLocation() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getLocation = (): Promise<{ lat: number; lng: number }> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject("Geolocation is not supported by this browser.");
                return;
            }
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLoading(false);
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (err) => {
                    setLoading(false);
                    setError(err.message);
                    reject(err.message);
                },
                {
                    enableHighAccuracy: true, // ✅ uses GPS on mobile, more accurate
                    timeout: 10000,
                    maximumAge: 0,            // ✅ always fresh, no cached location
                }
            );
        });
    };

    return { getLocation, loading, error };
}