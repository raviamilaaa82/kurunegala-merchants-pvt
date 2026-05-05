
'use client';
import { useState, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';

type Coordinates = {
    lat: number;
    lng: number;
};

type Props = {
    onLocationSelect: (coords: Coordinates, googleLink: string) => void;
    defaultLat?: number;
    defaultLng?: number;
};

// defaultLat = 7.8731, defaultLng = 80.7718
export default function MapPicker({ onLocationSelect, defaultLat = 7.481770, defaultLng = 80.360888 }: Props) {
    const [markerPosition, setMarkerPosition] = useState<Coordinates | null>(
        defaultLat && defaultLng ? { lat: defaultLat, lng: defaultLng } : null
    );
    const [searchQuery, setSearchQuery] = useState('');

    const handleMapClick = useCallback((e: any) => {
        const lat = e.detail.latLng.lat;
        const lng = e.detail.latLng.lng;

        setMarkerPosition({ lat, lng });

        // generate google maps link
        const googleLink = `https://www.google.com/maps?q=${lat},${lng}`;
        onLocationSelect({ lat, lng }, googleLink);
    }, [onLocationSelect]);

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
            <div className="flex flex-col gap-2">
                {/* Search box */}
                <SearchBox onPlaceSelect={(coords, link) => {
                    setMarkerPosition(coords);
                    onLocationSelect(coords, link);
                }} />

                {/* Map */}
                <div className="w-full h-[400px] rounded-md overflow-hidden border">
                    <Map
                        defaultCenter={{ lat: defaultLat, lng: defaultLng }}
                        defaultZoom={8}
                        mapId="location-picker"
                        onClick={handleMapClick}
                        gestureHandling="greedy"
                    >
                        {markerPosition && (
                            <AdvancedMarker position={markerPosition} />
                        )}
                    </Map>
                </div>

                {/* Show selected coordinates */}
                {markerPosition && (
                    <p className="text-sm text-gray-500">
                        📍 {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
                    </p>
                )}
            </div>
        </APIProvider>
    );
}

// Search box component
function SearchBox({ onPlaceSelect }: {
    onPlaceSelect: (coords: Coordinates, link: string) => void
}) {
    const map = useMap();
    const places = useMapsLibrary('places');
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = async () => {
        if (!places || !map || !searchValue) return;

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: searchValue }, (results, status) => {
            if (status === 'OK' && results?.[0]) {
                const location = results[0].geometry.location;
                const lat = location.lat();
                const lng = location.lng();

                map.panTo({ lat, lng });
                map.setZoom(15);

                const googleLink = `https://www.google.com/maps?q=${lat},${lng}`;
                onPlaceSelect({ lat, lng }, googleLink);
            }
        });
    };

    return (
        <div className="flex gap-2">
            <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search location..."
                className="flex-1 border rounded-md px-3 py-2 text-sm"
            />
            <button
                type="button"
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
            >
                Search
            </button>
        </div>
    );
}