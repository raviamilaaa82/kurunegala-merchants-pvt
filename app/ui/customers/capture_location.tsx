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
            const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
            onLocationCaptured(googleMapsLink);
            // console.log("lat" + lat);
            // console.log("lng" + lng);
            // Save to DB
            // await fetch("/api/save-location", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ customerId, lat, lng }),
            // });

            // setSaved(true);
        } catch (err) {
            alert("Could not get location. Please allow location access.");
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