"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

export default function MapComponent() {
    return (
        <MapContainer
            center={[34.0522, -118.2437]}
            zoom={13}
            scrollWheelZoom={false}
            className="w-full h-full"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
            />
            <Marker position={[34.0522, -118.2437]} icon={markerIcon}>
                <Popup>Los Angeles, California, USA</Popup>
            </Marker>
        </MapContainer>
    );
}
