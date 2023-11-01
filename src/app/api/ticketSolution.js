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

export async function createTicketSolution(data) {
    const header = getAuthHeader();
    try{
        const res = await axios.post(`${baseURL}/solution/new`, data,{
            headers: {
                Authorization: header
            }
        });
        return res.data.result;
    }catch(error){
        console.log(error);
    }
};

export async function deleteTicketSolution(solutionIds) {
    const header = getAuthHeader();
    try{
        const res = await axios.delete(`${baseURL}/solution/${solutionIds}`, {
            headers: {
                Authorization: header,
            },
            data: {
                solutionIds: solutionIds,
            },
        });
        return res.data.result;
    }catch(error){
        console.log("Error deleting solutionID", error);
        throw error;
    }
}
