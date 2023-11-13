import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./link";

export async function getSummaryTechnician() {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/dashboard/ticket/technician`, {
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
};

export async function getSummaryCustomer() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/ticket/customer`, {
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
}
