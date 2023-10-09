import axios from "axios";
import { setUser } from "../../features/user/authSlice";
import { getAuthHeader } from "./auth";
import { data } from "autoprefixer";
export const baseURL = "https://localhost:7043/v1/itsds";

// Change password
export async function ChangePassword(data) {
  const header = getAuthHeader();
  try {
    const res = await axios.patch(`${baseURL}/auth/${id}/change-password`, data, {
      headers: {
        Authorization: header,
      },
    });
    return res.data;
  } catch (error) {
    toast.error("Some thing error");
    console.log(error);
  }
}
