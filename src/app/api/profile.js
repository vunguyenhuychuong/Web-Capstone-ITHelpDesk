import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./link";

// Change password
export async function ChangePasswordUser(data) {
  const header = getAuthHeader();
  try {
    const res = await axios.patch(`${baseURL}/auth/change-password`, data, {
      headers: {
        Authorization: header,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
