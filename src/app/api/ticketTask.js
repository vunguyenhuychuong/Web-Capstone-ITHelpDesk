import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./link";
import { toast } from "react-toastify";
import { data } from "autoprefixer";

export async function getAllTicketTasks(
    searchField,
    searchQuery,
    page = 1,
    pageSize = 5,
    sortBy = "id",
    sortDirection = "asc"
    ){
     const header = getAuthHeader();
     try{
        let filter = `${searchField}.contains("${searchQuery}")`;
        const params = {
            filter: filter,
            page: page,
            pageSize: pageSize,
            sort: `${sortBy} ${sortDirection}`,
        }
        const res = await axios.get(`${baseURL}/ticket/task`, {
            headers: {
                Authorization: header,
            },
            params: params,
        });
        console.log(res);
        return res.data.result;
     }catch(error){
        console.log(error);
        return [];
     } 
};

//Get Ticket Task Active
export async function getTicketTaskActive(ticketId) {
    const header = getAuthHeader();
    try{
        const res = await axios.get(`${baseURL}/ticket/task/active?ticketId=${ticketId}`, {
            headers: {
                Authorization: header,
            },
        });
        return res.data.result;
    }catch(error){
        console.log(error);
    }
};

export async function getTicketTaskInActive(ticketId) {
    const header = getAuthHeader();
    try{
        const res = await axios.get(`${baseURL}/ticket/task/inactive?ticketId=${ticketId}`, {
            headers: {
                Authorization: header,
            },
        });
        return res.data.result;
    }catch(error){
        console.log(error);
    }
};

export async function createTicketTask(data) {
    const header = getAuthHeader();
    try{
        const response = await axios.post(`${baseURL}/ticket/task/new`, data, {
            headers: {
                Authorization: header,
            },
        });
        return response.data;
    }catch(error){
        console.log(error);
        throw error;
    }
};

export async function updateTicketTask(taskId) {
    const header = getAuthHeader();
    try{
        const res = await axios.put(`${baseURL}/ticket/task/${taskId}`, data, {
            headers: {
                Authorization: header,
            },
        });
        return res.data.result;
    }catch(error){
        console.log(error);
    }
};

export async function deleteTicketTask(taskId) {
    const header = getAuthHeader();
    try{
        const res = await axios.delete(`${baseURL}/ticket/task/${taskId}`,{
            headers: {
                Authorization: header,
            },
        });
        return res.data.result;
    }catch(error){
        console.log(error);
    }
};



