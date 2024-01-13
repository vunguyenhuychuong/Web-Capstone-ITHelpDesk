import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./link";

export async function uploadFiles(fileList) {
  const header = getAuthHeader();

  // Create a new FormData instance
  let formData = new FormData();

  // Append each file to the FormData instance
  fileList.forEach((file) => {
    formData.append('files', file.originFileObj);
  });

  try {
    const res = await axios.post(`${baseURL}/storage/upload/multiple-files`, formData, {
      headers: {
        Authorization: header,
        'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}
