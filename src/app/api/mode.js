import axios from "axios";
import { getAuthHeader } from "./auth";
import axiosClient from "./axiosClient";

const ModeApi = {
    getMode: async() => {
       const header = getAuthHeader();
       try{
            const response = await axiosClient.get('/mode', {
                headers: {
                    Authorization: header,
                },
            });
            return response.result;
       }catch(error) {
            console.error(error);
            return [];
       };
    },
};


export default ModeApi;