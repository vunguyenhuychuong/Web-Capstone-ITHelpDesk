import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./ticket";

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
};

export async function getTicketSolutionById(solutionId) {
    const header = getAuthHeader();
    try{
        const res = await axios.get(`${baseURL}/solution/${solutionId}`,{
            headers: {
                Authorization: header,
            },
        });
        return res.data.result;
    }catch(error){
        console.log(error);
        return [];
    }
};

