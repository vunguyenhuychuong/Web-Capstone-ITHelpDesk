import axios from "axios";
import { getAuthHeader } from "./auth";
export const baseURL = 'https://dichvuit-be.hisoft.vn/v1/itsds';


export async function getAllServices(
    page = 1,
    pageSize = 5,
) {
    const header = getAuthHeader();
    try{
        const params = {
            page: page,
            pageSize: pageSize,
        }
        const res = await axios.get(`${baseURL}/service`,{
            headers: {
                Authorization: header,
            },
            params: params,
        })
        return res.data.result;
    }catch(error){
        console.log(error);
        return [];
    }
};

export async function getDataServices() {
    const header = getAuthHeader();
    try{
        const res = await axios.get(`${baseURL}/service/all`,{
            headers: {
                Authorization: header,
            },
        })
        return res.data.result;
    }catch(error){
        console.log(error);
        return [];
    }
};

export async function getServiceDetail(serviceId) {
    const header = getAuthHeader();
    try{
        const result = await axios.get(`${baseURL}/service/${serviceId}`,{
            headers: {
                Authorization: header,
            },
        });
        console.log(result);
        return result.data.result;
    }catch(error){
        console.log(error);
    }
};

export async function createService(data) {
    const header = getAuthHeader();
    try{
        const result = await axios.post(`${baseURL}/service`,data, {
            headers: {
                Authorization: header,
            },
        })
        return result.data;
    }catch(error){
        console.log(error);
    }
};

export async function updateService(serviceId) {
    const header = getAuthHeader();
    try{
        const result = await axios.put(`${baseURL}/service/${serviceId}`,{
            headers: {
                Authorization: header,
            },
        });
        return result.data;
    }catch(error){
        console.log(error);
    }
};

export async function deleteService(serviceId) {
    const header = getAuthHeader();
    try{
        const result = await axios.delete(`${baseURL}/service/${serviceId}`,{
            headers: {
                Authorization: header,
            },
        });
        return result.data;
    }catch(error) {
        console.log(error);
    }
}