import axios from "axios";
import { getAuthHeader } from "./auth";
export const baseURL = "https://localhost:7043/v1/itsds";


export async function getAllCategories() {
    const header = getAuthHeader();
    try{
        const res = await axios.get(`${baseURL}/category`,{
            headers: {
                Authorization: header,
            },
        })
        return res.data.result;
    }catch(error){
        console.log(error);
        return [];
    }
}