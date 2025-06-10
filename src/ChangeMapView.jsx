import { useMap } from 'react-leaflet';

function ChangeMapView({ center }) {
  const map = useMap();
  map.setView(center);
  return null;
}
