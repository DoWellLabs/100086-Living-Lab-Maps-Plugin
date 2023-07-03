import "./frontend.scss";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import VerifyPlaces from "./components/verifyId";
import GetNearbyPlaces from "./components/getNearByPlaces";

const divsToUpdate = document.querySelectorAll(".boilerplate-update-me");

divsToUpdate.forEach((div) => {
  const data = JSON.parse(div.querySelector("pre").innerText);
  ReactDOM.render(<OurComponent {...data} />, div);
  div.classList.remove("boilerplate-update-me");
});

function OurComponent(props) {
  const [showSkyColor, setShowSkyColor] = useState(false);
  const [showGrassColor, setShowGrassColor] = useState(false);

  return (
    <div className="boilerplate-frontend">
      <VerifyPlaces />
      <GetNearbyPlaces />
    </div>
  );
}
