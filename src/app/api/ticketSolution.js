import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./link";
import { toast } from "react-toastify";

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
        if (res.data.isError && res.data.message) {
            toast.error(res.data.message);
        } else {
            toast.success("Create Ticket Solution successful");
            return res.data.result;
        }        
    }catch(error){
        console.log(error.response.data.responseException.exceptionMessage.title);
        toast.error(error.response.data.responseException.exceptionMessage.title);
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
};

export async function editTicketSolution(solutionId, data) {
    const header = getAuthHeader();
    try{
        const res = await axios.put(`${baseURL}/solution/${solutionId}`, data, {
            headers: {
                Authorization: header,
            },            
        });
        toast.success("Edit Ticket Solution successful");
        return res.data.result;
    }catch(error){
        console.log("Error edit solution", error);
        toast.error(error.response.data.responseException.exceptionMessage.title);
    }
}

export async function changePublicSolution(solutionId) {
    const header = getAuthHeader();
    try{
        const res = await axios.patch(`${baseURL}/solution/change-public?solutionId=${solutionId}`, null ,{
            headers: {
                Authorization: header,
            },
        })
        return res.data.result;
    }catch(error){
        console.log("Error change public solutionID", error);
    }
};

export async function approveTicketSolution(solutionId) {
    const header = getAuthHeader();
    try{
        const res = await axios.patch(`${baseURL}/solution/approve?solutionId=${solutionId}`, null, {
            headers: {
                Authorization: header,
            },
        })
        return res.data.result;
    }catch(error){
        console.log("Error approve public solutionID", error);
    }
}

export async function rejectTicketSolution(solutionId) {
    const header = getAuthHeader();
    try{
        const res = await axios.patch(`${baseURL}/solution/reject?solutionId=${solutionId}`, null, {
            headers: {
                Authorization: header,
            },
        })
        return res.data.result;
    }catch(error){
        console.log("Error reject public solutionID", error);
    }
}

