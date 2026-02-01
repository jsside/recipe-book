import { Cloudinary } from "@cloudinary/url-gen";

export const CLOUD_NAME = "dbodwkphz";

const cld = new Cloudinary({
  cloud: {
    cloudName: CLOUD_NAME,
  },
});

export { cld };
