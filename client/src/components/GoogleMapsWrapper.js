import React from "react";
import { LoadScript } from "@react-google-maps/api";

const GoogleMapsWrapper = ({ children }) => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyCm6ZwWVGotswtlCaLJkpXkBUZnVaL24Z4">
      {children}
    </LoadScript>
  );
};

export default GoogleMapsWrapper;
