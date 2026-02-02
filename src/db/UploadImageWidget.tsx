import React from "react";
import { CLOUD_NAME } from "./cloudinaryInstance.js";

declare global {
  interface Window {
    cloudinary: {
      openUploadWidget: (
        options: { cloudName: string; uploadPreset: string },
        callback: (error: unknown, result: { event: string; info: unknown }) => void
      ) => void;
    };
  }
}

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
        }
      },
    );
  };

  return <button onClick={openWidget}>Upload Image</button>;
};

export default UploadWidget;
