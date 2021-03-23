import React from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import NewLocationModal from "./NewLocationModal";


export interface Hoop {
  name?: string;
  lat?: number;
  lng?: number;
  rimType?: string;
  height?: string;
  courtSize?: string;
}

export interface hoopCoords {
  lat?: number;
  lng?: number;
}

const mapContainerStyle = {
  width: "50vw",
  height: "50vh",
  marginLeft: "auto",
  marginRight: "auto",
};



const myLocation = {
  lat: 33.368662,
  lng: -112.021923,
};



function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY !== undefined ? process.env.REACT_APP_GOOGLE_API_KEY : "",
  });
  const [showModal, setShowModal] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState<hoopCoords>({});
  const [addModeEnabled, toggleAddMode] = React.useState<boolean>(false);
  const [locations, setLocation] = React.useState<Hoop[]>([]);

  if (loadError) {
    return <p>Error loading maps</p>;
  }
  if (!isLoaded) {
    return <p>Loading map...</p>;
  }
  return (
    <div className="container">
      <h1>Hoop Finder</h1>
      <h2>Find basketball hoops near you</h2>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={myLocation}
        onClick={(event) => {
          if (addModeEnabled) {
            let location = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            };
            setShowModal((current) => !current);
            setSelectedLocation(location);
          }
        }}
      ></GoogleMap>
      <button
        onClick={(event) => toggleAddMode((current) => !current)}
        className={addModeEnabled ? "btn btn-success" : "btn btn-danger"}
      >
        Add Hoop Mode
      </button>
      <NewLocationModal
        showModal={showModal}
        toggleShow={() => setShowModal((current) => !current)}
        locationToAdd={selectedLocation}
      ></NewLocationModal>
    </div>
  );
}

export default App;
