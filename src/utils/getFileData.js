import fs from "fs";

function getFileData(origin) {
  if (!origin) return null;

  let fileOrigin = origin; // Get the file origin
  let fileType = origin ? origin.split(".")[1] : null; // Get the file type

  // Check the file type
  switch (fileType) {
    case "jpg":
      fileType = "image/jpeg";
      break;
    case "jpeg":
      fileType = "image/jpeg";
      break;
    case "png":
      fileType = "image/png";
      break;
    case "webp":
      fileType = "image/gif";
      break;
    case "heic":
      fileType = "image/heic";
      break;
    case "heif":
      fileType = "image/heif";
      break;
    default:
      return null;
  }

  // Return the file data
  return {
    inlineData: {
      data: Buffer.from(
        fs.readFileSync(`./public/uploads/${fileOrigin}`)
      ).toString("base64"),
      mimeType: fileType,
    },
  };
}

export default getFileData;
