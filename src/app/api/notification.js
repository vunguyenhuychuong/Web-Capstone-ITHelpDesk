import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./link";
import { toast } from "react-toastify";

export async function getAllNotification() {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/notification`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function ReadNotification(id) {
  const header = getAuthHeader();
  try {
    const res = await axios.patch(`${baseURL}/notification/${id}`,{}, {
      headers: {
        Authorization: header,
      },
    });
    toast.success("Mark as read")
    return res.data.result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function ReadNotificationAll() {
    const header = getAuthHeader();
    try{
        const res = await axios.patch(`${baseURL}/notification/read-all`,{}, {
            headers: {
                Authorization: header,
              },
        });
        return res.data.result;
    }catch(error){
        console.log(error);
    }
}
