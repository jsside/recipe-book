import { AdvancedImage } from "@cloudinary/react";
import { cld } from "./cloudinaryInstance.js";
import { fill } from "@cloudinary/url-gen/actions/resize";

const DisplayImage = () => {
  // Use a public ID of an image uploaded to your Cloudinary account
  const myImage = cld.image("chorizo-breakfast-burrito");

  // Apply a transformation (e.g., resize and crop)
  myImage.resize(fill().width(250).height(250));

  return <AdvancedImage cldImg={myImage} />;
};

export default DisplayImage;
