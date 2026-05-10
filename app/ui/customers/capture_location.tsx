"use client";
import { useLocation } from "@/hooks/useLocation";
import { useState } from "react";
import { Values } from "zod";

interface Props {
    // onLocationCaptured: (lat: number, lng: number) => void; // ← accept two args
    onLocationCaptured: (link: string) => void; // ← accept two args
}

// export default function CaptureLocationButton({ customerId }: { customerId: string }) 
export default function CaptureLocationButton({ onLocationCaptured }: Props) {
    const { getLocation, loading } = useLocation();
    const [saved, setSaved] = useState(false);
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

    const handleCapture = async () => {
        try {
            const { lat, lng } = await getLocation();
            setCoords({ lat, lng });
            // Assuming lat and lan (longitude) are available from your form or database   
            // const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
            const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
            onLocationCaptured(googleMapsLink);

        } catch (err) {
            // alert("Could not get location. Please allow location access.");
            if (err instanceof GeolocationPositionError) {
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        alert("Location permission denied. Please enable it in your browser/phone settings.");
                        break;
                    case err.POSITION_UNAVAILABLE:
                        alert("Location unavailable. Are you in airplane mode or indoors?");
                        break;
                    case err.TIMEOUT:
                        alert("Location request timed out. Try again.");
                        break;
                }
            } else {
                alert(`Unexpected error: ${String(err)}`);
            }
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={handleCapture}
                disabled={loading}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? "Getting location..." : "📍 Capture Location"}
            </button>
            {saved && coords && (
                <p className="text-sm text-green-600">
                    ✅ Saved: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                </p>
            )}
        </div>
    );
}