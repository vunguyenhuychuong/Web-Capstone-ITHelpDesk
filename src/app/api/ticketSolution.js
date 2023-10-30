import axios from "axios";
import { getAuthHeader } from "./auth";
export const baseURL = 'https://dichvuit-be.hisoft.vn/v1/itsds';

export async function getAllTicketSolutions() {
    const header = getAuthHeader();
    try{
        const res = await axios.get(`${baseURL}/solution`, {
            headers: {
                Authorization: header,
            },
        });
        return res.data.result;
    }catch(error){
        console.log(error);
        return [];
    };
}