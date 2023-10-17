import axios from "axios";
import { getAuthHeader } from "./auth";
import axiosClient from "./axiosClient";
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
};

const CategoryApi = {
    getAllCategories: async () => {
        const header = getAuthHeader();
        try{
            const response = await axiosClient.get('/category', {
                headers: {
                    Authorization: header,
                },
            });
            return response.result;
        }catch (error) {
            console.error(error);
            return [];
        }
    },
};

export default CategoryApi;