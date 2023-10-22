import axios from "axios";
import { getAuthHeader } from "./auth";
export const baseURL = "https://localhost:7043/v1/itsds";

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
