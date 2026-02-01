import React from "react";
import { CLOUD_NAME } from "./cloudinaryInstance.js";

const UploadWidget = () => {
  const openWidget = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: "YOUR_UNSIGNED_UPLOAD_PRESET",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          // Handle the result (e.g., save the URL to your app's state or backend)
        }
      },
    );
  };

  return <button onClick={openWidget}>Upload Image</button>;
};

export default UploadWidget;
