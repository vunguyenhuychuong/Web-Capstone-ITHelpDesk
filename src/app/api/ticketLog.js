import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./link";

export async function getTicketLog(ticketId) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/ticket/log?ticketId=${ticketId}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}
