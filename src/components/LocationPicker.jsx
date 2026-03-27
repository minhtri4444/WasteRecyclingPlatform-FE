import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix default icon issue with leaflet in React
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

export default function LocationPicker({ latitude, longitude, onChange }) {
  // Set default position if not set
  const position = [
    latitude ? parseFloat(latitude) : 21.0285, // Default: Hanoi
    longitude ? parseFloat(longitude) : 105.8542,
  ];

  function LocationMarker() {
    useMapEvents({
      click(e) {
        onChange({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        });
      },
    });
    return <Marker position={position} icon={markerIcon} />;
  }

  useEffect(() => {
    // If latitude/longitude changes externally, could pan map here if needed
  }, [latitude, longitude]);

  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ height: 300, width: '100%', borderRadius: 8, marginBottom: 16 }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
}
