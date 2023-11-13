import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./link";

export async function getAllFeedBack(solutionId) {
    const header = getAuthHeader();
    try{
        const res = await axios.get(`${baseURL}/solution/feedback?solutionId=${solutionId}`, {
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

export async function createFeedBack(data) {
    const header = getAuthHeader();
    try{
        const res = await axios.post(`${baseURL}/solution/feedback`, data ,{
            headers: {
                Authorization: header,
            },
        });
        return res.data.result;
    }catch(error){
        console.log(error);
    }
};

export async function createReply(data) {
    const header = getAuthHeader();
    try{
        const res = await axios.post(`${baseURL}/solution/feedback/reply`, data, {
            headers: {
                Authorization: header,
            },
        });
        return res.data.result;
    }catch(error){
        console.log(error);
    }
}

export async function deleteFeedBack(feedbackId) {
    const header = getAuthHeader();
    try{
        const res = await axios.delete(`${baseURL}/solution/feedback/${feedbackId}`, {
            headers: {
                Authorization: header,
            },
        });
        return res.data.result;
    }catch(error){
        console.log(error);
    };
};

export async function editFeedBack(feedbackId, data) {
    const header = getAuthHeader();
    try{
        const res = await axios.put(`${baseURL}/solution/feedback/${feedbackId}`, data, {
            headers: {
                Authorization: header,
            },
        });
        return res.data.result;
    }catch(error){
        console.log(error);
    }
};

export async function getDetailFeedBack(feedbackId) {
    const header = getAuthHeader();
    try{
        const res = await axios.get(`${baseURL}/solution/feedback/${feedbackId}`, {
            headers: {
                Authorization: header,
            },
        });
        return res.data.result;
    }catch(error){
        console.log(error);
    }
}