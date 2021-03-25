import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import NewLocationModal from "./NewLocationModal";
import { FirebaseAccess, User } from "./FirebaseAccess";
import HoopInfoModal from "./HoopInfoModal";
import Geocode from "react-geocode";
import firebase from "firebase";

export interface Hoop {
  name?: string;
  lat?: number;
  lng?: number;
  rimType?: string;
  height?: string;
  courtSize?: string;
  createdBy: User | null;
}

export interface HoopContainer {
  ref: string,
  hoop: Hoop
}

export interface hoopCoords {
  lat?: number;
  lng?: number;
}

const mapContainerStyle = {
  height: "50vh",
  marginLeft: "auto",
  marginRight: "auto",
};

function askForLocation(callback: PositionCallback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(callback);
  }
}


function setLocationToSearch(
  searchQuery: string,
  setCurrentLocation: Function
) {
  Geocode.fromAddress(searchQuery).then(
    (response) => {
      const { lat, lng } = response.results[0].geometry.location;
      setCurrentLocation({ coords: { latitude: lat, longitude: lng } });
    },
    (error) => {
      console.error(error);
    }
  );
}

function App() {
  let apiKey = process.env.REACT_APP_GOOGLE_API_KEY !== undefined ? process.env.REACT_APP_GOOGLE_API_KEY : "";
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey

  });
  Geocode.setApiKey(apiKey);
  const [showModal, setShowModal] = React.useState(false);
  const [showInfoModal, setShowInfoModal] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState<hoopCoords>(
    {}
  );
  const [addModeEnabled, toggleAddMode] = React.useState<boolean>(false);
  const [locations, setLocations] = React.useState<HoopContainer[]>([]);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [selectedHoop, setSelectedHoop] = React.useState<HoopContainer>({
    ref: "",
    hoop: {
      name: "",
      rimType: "",
      height: "",
      courtSize: "",
      createdBy: currentUser
    }
  });
  const [currentLocation, setCurrentLocation] = React.useState<{
    coords: { latitude: number; longitude: number };
  }>({ coords: { latitude: 40.8292, longitude: -73.9361 } });
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const mapRef = React.useRef<GoogleMap>(null);
  React.useEffect(() => {
    FirebaseAccess.getInstance().setEventHandlers(setLocations);

  }, []);
  const myLocation = {
    lat: currentLocation?.coords.latitude,
    lng: currentLocation?.coords.longitude,
  };

  if (loadError) {
    return <p>Error loading maps</p>;
  }
  if (!isLoaded) {
    return <p>Loading map...</p>;
  }

  let handleDrag = () => {
    const center = mapRef.current?.state.map.getCenter();
    setCurrentLocation({ coords: { latitude: center.lat, longitude: center.lng } })
  }
  if (currentUser !== null) {
    return (
      <div className="container">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={15}
          ref={mapRef}
          center={myLocation}
          onDragEnd={handleDrag}
          onClick={(event) => {
            if (addModeEnabled && currentUser !== null) {
              let location = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
              };
              setShowModal((current) => !current);
              setSelectedLocation(location);
            }
          }}
        >
          {locations.map((item: HoopContainer) => {
            return (
              <Marker
                key={item.ref}
                position={{ lat: item.hoop.lat, lng: item.hoop.lng }}
                onClick={() => {
                  setSelectedHoop(item);
                  setShowInfoModal((current) => !current);
                }}

              />
            );
          })}
        </GoogleMap>
        <div className="btn-toolbar mb-3 mt-4" role="toolbar">
          <div className="btn-group mr-2" role="group">
            <button
              onClick={(event) => toggleAddMode((current) => !current)}
              className={addModeEnabled ? "btn btn-success" : "btn btn-danger"}
            >
              Add Hoop Mode
            </button>
            <button
              className={"btn btn-success"}
              onClick={() => askForLocation(setCurrentLocation)}
            >
              Center on your location
            </button>
            <button
              className={"btn btn-danger"}
              onClick={() => setCurrentUser(null)}
            >
              Logout
            </button>
          </div>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Go Somewhere"
              aria-label="Go Somewhere"
              aria-describedby="basic-addon2"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setLocationToSearch(searchQuery, setCurrentLocation)
                }
              }}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-success"
                onClick={() =>
                  setLocationToSearch(searchQuery, setCurrentLocation)
                }
                type="button"
              >
                Go
              </button>
            </div>
          </div>
        </div>

        <HoopInfoModal
          showModal={showInfoModal}
          toggleShow={() => setShowInfoModal((current) => !current)}
          hoop={selectedHoop}
          user={currentUser}
          
        ></HoopInfoModal>
        <NewLocationModal
          showModal={showModal}
          toggleShow={() => setShowModal((current) => !current)}
          locationToAdd={selectedLocation}
          user={currentUser}
          hoops={locations}
        ></NewLocationModal>
      </div>
    );
  }
  else {
    return (
    <div className={"container"}>
      <button 
        className={"btn btn-success"} 
        onClick={() => FirebaseAccess.getInstance().loginWithPopup(setCurrentUser)}>Login
      </button>
    </div>)
  }

}

export default App;
