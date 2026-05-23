/** Brand-styled Google Maps JSON — shared across map components. */
export const dalaiEejMapStyles = [
  {
    elementType: "geometry",
    stylers: [{ color: "#1D3C45" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#F5F5F0" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1D3C45" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#2C3E30" }],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [{ color: "#F5F5F0" }, { lightness: -20 }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#2C3E30" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#2C3E30" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#F5F5F0" }, { lightness: -30 }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [{ color: "#2C3E30" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#3A5048" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1D3C45" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#F5F5F0" }, { lightness: -20 }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#4A6058" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#2C3E30" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2C3E30" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#1D3C45" }, { lightness: -10 }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#F5F5F0" }],
  },
];
