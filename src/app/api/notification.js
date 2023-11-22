import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./link";

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

export async function ReadNotification(id ,data) {
  const header = getAuthHeader();
  try {
    const res = await axios.patch(`${baseURL}/notification/${id}`, data, {
      headers: {
        Authorization: header,
      },
    });
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
