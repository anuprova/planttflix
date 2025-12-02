"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

export default function MapComponent() {
    const [markerIcon, setMarkerIcon] = useState<any>(null);

    useEffect(() => {
        // Only import and create icon on client side
        import("leaflet").then((L) => {
            const icon = new L.Icon({
                iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
                shadowSize: [41, 41],
            });
            setMarkerIcon(icon);
        });
    }, []);

    if (!markerIcon) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">Loading map...</p>
            </div>
        );
    }

    return (
        <MapContainer
            center={[22.65998378430739, 88.85785068480246]}
            zoom={15}
            scrollWheelZoom={false}
            className="w-full h-full"
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
            />
            <Marker position={[22.65998378430739, 88.85785068480246]} icon={markerIcon}>
                <Popup>Our Location</Popup>
            </Marker>
        </MapContainer>
    );
}
