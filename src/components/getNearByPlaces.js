import React, { useState, useEffect } from "react";
import axios from "axios";

const GetNearbyPlaces = () => {
  const [place, setPlace] = useState("");
  const [radius2, setRadius2] = useState("");
  const [coordinate, setCoordinate] = useState("");
  const [queryString, setQueryString] = useState("");
  const [nearbyPlaces, setNearbyPlaces] = useState([]);

  useEffect(() => {
    const handleGetCoords = async () => {
      try {
        const response = await axios.post(
          "https://100074.pythonanywhere.com/get-coords/",
          {
            region: place,
          }
        );
        console.log("Response data:", response.data);

        // Extract latitude and longitude if Coords is defined
        if (response.data && response.data.Coords) {
          const latString = response.data.Coords.lat; // Extract latitude string
          const lngString = response.data.Coords.lng; // Extract longitude string

          // Extract numerical values from latitude string
          const latMatch = latString.match(/[+-]?\d+(\.\d+)?/);
          const latValue = parseFloat(latMatch[0]);
          const latitude = latString.includes("S") ? -latValue : latValue;

          // Extract numerical values from longitude string
          const lngMatch = lngString.match(/[+-]?\d+(\.\d+)?/);
          const lngValue = parseFloat(lngMatch[0]);
          const longitude = lngString.includes("W") ? -lngValue : lngValue;

          const coordinate = `${latitude}, ${longitude}`; // Decimal degrees coordinate

          // const { lat, lng } = response.data.Coords;
          // const coordinate = `${lat}, ${lng}`;

          setCoordinate(coordinate);
        } else {
          console.error("Invalid response data: Coords is undefined");
        }
      } catch (error) {
        console.error("Error getting coordinates:", error);
      }
    };

    handleGetCoords();
  }, [place]);

  const handleGetNearbyPlaces = async () => {
    try {
      const [latitude, longitude] = coordinate
        .split(",")
        .map((coord) => parseFloat(coord.trim()));

      const requestData = {
        radius1: 0,
        radius2: parseInt(radius2),
        center_lat: latitude,
        center_lon: longitude,
        query_string: queryString,
        data_type: "scraped",
      };

      const response = await axios.post(
        "https://100086.pythonanywhere.com/accounts/get-local-nearby/",
        requestData,
        { headers: { "Content-Type": "application/json" } }
      );

      const { data } = response;
      setNearbyPlaces(data.data); // Access the 'data' array in the response
    } catch (error) {
      console.error("Error getting nearby places:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Get Nearby Locations</h2>
      <h3>Place: </h3>
      <input
        type="text"
        placeholder=" Place"
        value={place}
        onChange={(e) => setPlace(e.target.value)}
      />

      {/* <button onClick={handleGetCoords}>Get Coordinate</button> */}
      {coordinate && <p>Coordinate: {coordinate}</p>}

      <h3>Radius (in meters): </h3>
      <input
        type="number"
        placeholder=" Radius"
        value={radius2}
        onChange={(e) => setRadius2(e.target.value)}
      />

      <h3>Query: </h3>
      <input
        type="text"
        placeholder=" Exp: School"
        value={queryString}
        onChange={(e) => setQueryString(e.target.value)}
      />
      <br />

      <button onClick={handleGetNearbyPlaces}>Get Nearby Places</button>

      <h2>All Nearby Places</h2>
      {nearbyPlaces.length > 0 ? (
        <ul>
          {nearbyPlaces
            .sort((a, b) => a.hav_distances - b.hav_distances)
            .map((place, index) => (
              <li key={index}>
                {place.place_name} ({Math.ceil(place.hav_distances)}m.)
                <h5>
                  <small>{place.location_coord}</small>
                </h5>
              </li>
            ))}
        </ul>
      ) : (
        <p>No nearby places found.</p>
      )}
    </div>
  );
};

export default GetNearbyPlaces;
