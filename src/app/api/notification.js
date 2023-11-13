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
        console.log(res);
        return res.data.result;
    } catch (error) {
        console.log(error);
        return [];
    }
}