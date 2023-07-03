import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const VerifyPlaces = () => {
  const [placeIds, setPlaceIds] = useState("");
  const [newPlaceIds, setNewPlaceIds] = useState([]);
  const [placeDetails, setPlaceDetails] = useState({
    succesful_results: [],
    failed_results: [],
  });
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isSaveButtonClicked, setIsSaveButtonClicked] = useState(false);

  useEffect(() => {
    const fetchPlaceIds = async () => {
      try {
        const response = await axios.post(
          "https://100086.pythonanywhere.com/accounts/verify-place-ids/",
          {
            place_id_list: placeIds.split(",").map((id) => id.trim()),
          },
          { headers: { "Content-Type": "application/json" } }
        );
        if (response.data && Array.isArray(response.data.unique_ids)) {
          setNewPlaceIds(response.data.unique_ids);
        } else {
          setNewPlaceIds([]);
        }
      } catch (error) {
        console.error("Error fetching place IDs:", error);
      }
    };

    fetchPlaceIds();
  }, [placeIds, isButtonClicked]);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        const response = await axios.post(
          "https://100086.pythonanywhere.com/accounts/get-details-list-stage1/",
          {
            place_id_list: newPlaceIds,
          },
          { headers: { "Content-Type": "application/json" } }
        );
        if (response.data && Array.isArray(response.data.succesful_results)) {
          setPlaceDetails((prevState) => ({
            ...prevState,
            succesful_results: response.data.succesful_results,
          }));
        } else {
          setPlaceDetails((prevState) => ({
            ...prevState,
            succesful_results: [],
          }));
        }

        if (response.data && Array.isArray(response.data.failed_results)) {
          setPlaceDetails((prevState) => ({
            ...prevState,
            failed_results: response.data.failed_results,
          }));
        } else {
          setPlaceDetails((prevState) => ({
            ...prevState,
            failed_results: [],
          }));
        }
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    };

    if (isButtonClicked && newPlaceIds.length > 0) {
      fetchPlaceDetails();
    }
  }, [newPlaceIds, isButtonClicked]);

  useEffect(() => {
    const savePlaceDetails = async () => {
      try {
        const response = await axios.post(
          "https://100086.pythonanywhere.com/accounts/save-places-detail/",
          {
            result_dict: {
              succesful_results: placeDetails.succesful_results,
              failed_results: placeDetails.failed_results,
            },
          },
          { headers: { "Content-Type": "application/json" } }
        );
        toast.success("Place details saved successfully!", response.data);
      } catch (error) {
        toast.error("Error saving place details!", error);
      }
    };

    if (
      isSaveButtonClicked &&
      placeDetails.succesful_results.length > 0 &&
      placeDetails.failed_results.length > 0
    ) {
      savePlaceDetails();
    }
  }, [isButtonClicked, placeDetails, isSaveButtonClicked]);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setPlaceIds(value);
  };

  const handleButtonClick = () => {
    setIsButtonClicked(true);
  };

  const handleSaveDetails = () => {
    setIsSaveButtonClicked(true);
  };

  return (
    <div>
      <h2>Verify Place ID(s)</h2>
      <textarea
        placeholder="Enter place IDs separated by commas"
        onChange={handleInputChange}
      />
      {newPlaceIds && newPlaceIds.length > 0 && (
        <div>
          <h3>Unique ID(s):</h3>
          <ul className="a">
            {newPlaceIds.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </div>
      )}
      {newPlaceIds.length > 0 && (
        <div>
          <br />
          <button onClick={handleButtonClick}>Fetch Place Details</button>
          {placeDetails.succesful_results &&
            placeDetails.succesful_results.length > 0 && (
              <div>
                <h3>Place Details</h3>
                <ul>
                  <div>
                    <h4 className="successful-results">Successful Results:</h4>
                    <ul className="a">
                      {placeDetails.succesful_results.map((detail) => (
                        <li key={detail.placeId}>
                          <strong>ID:</strong> {detail.placeId} <br />
                          <strong>Address:</strong> {detail.place_name}
                          <br />
                          <strong>Category:</strong> {detail.category}
                          <br />
                          <strong>Location Coordinate:</strong>{" "}
                          {detail.location_coord}
                          <br />
                          <strong>Day Hours: </strong>
                          {detail.day_hours}
                          <br />
                          <strong>Phone: </strong>
                          {detail.phone}
                          <br />
                          <strong>Website: </strong>
                          {detail.website}
                          <br />
                          <strong>Data Type:</strong> {detail.type_of_data}
                          <br />
                          <strong>Event ID:</strong> {detail.eventId}
                          <br />
                        </li>
                      ))}
                    </ul>
                  </div>
                </ul>
              </div>
            )}

          {placeDetails.failed_results &&
            placeDetails.failed_results.length > 0 && (
              <div>
                <ul>
                  <div>
                    <h4 className="failed-results">Failed Results:</h4>
                    <ul className="a">
                      <strong>ID(s):</strong>
                      {placeDetails.failed_results.map((detail) => (
                        <li key={detail.placeId}>{detail.placeId} </li>
                      ))}
                    </ul>
                  </div>
                </ul>
              </div>
            )}
          {placeDetails.succesful_results.length > 0 &&
            placeDetails.failed_results.length > 0 && (
              <div>
                <button onClick={handleSaveDetails}>Save Details</button>
                <Toaster
                  position="bottom-center"
                  toastOptions={{
                    success: {
                      style: {
                        background: "green",
                        color: "white",
                      },
                    },
                    error: {
                      style: {
                        background: "red",
                      },
                    },
                  }}
                />
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default VerifyPlaces;
