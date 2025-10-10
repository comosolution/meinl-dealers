export const mapStyles = [
  {
    elementType: "geometry",
    stylers: [{ color: "#f2f1ef" }], // soft warm grey background
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#5b5b5b" }], // dark muted text
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#a4a6a8" }], // subtle neutral borders
  },
  {
    featureType: "administrative",
    elementType: "labels.text.fill",
    stylers: [{ color: "#7d7d7d" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#d7e4d0" }], // soft sage green for POIs
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#bcd7a6" }], // muted green for parks
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#7a9974" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#e1dcd5" }], // warm light beige roads
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#c7c2bc" }], // slightly darker strokes
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#d3c2b5" }], // slightly pinkish tan highways
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#b8a79c" }],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8b8b8b" }],
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#d4e0e8" }], // light blue-grey for transit
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#a7c7d9" }], // soft desaturated blue
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#7da2b4" }],
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "on" }], // keep POIs visible for style richness
  },
];
