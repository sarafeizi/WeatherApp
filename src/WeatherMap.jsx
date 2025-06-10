
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function ChangeMapView({ center }) {
    const map = useMap();
    map.setView(center);
    return null;
}

const WeatherMap = ({ lat, lon, cityName, countryName }) => {
    if (typeof lat === 'undefined' || typeof lon === 'undefined') {
        return null; 
    }

    return (
        <div style={{ height: "300px", marginTop: "20px" }} className="rounded overflow-hidden shadow-sm">
            <MapContainer
                center={[lat, lon]}
                zoom={10}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
            >
                <ChangeMapView center={[lat, lon]} />
                <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lon]}>
                    <Popup>
                        {cityName}, {countryName}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default WeatherMap;