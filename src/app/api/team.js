import axios from "axios";
import { setUser } from "../../features/user/authSlice";
import { getAuthHeader } from "./auth";
export const baseURL = 'https://localhost:7043/v1/itsds';


//Get all Team in system
export async function getAllTeam() {
    const header = getAuthHeader();
    try{
        const res = await axios.get(`${baseURL}/team`, {
            headers: {
                Authorization: header,
            },
        });
        return res.data.result;
    }catch(error) {
        console.log(error);
        return [];
    }
}

//Add Team in system
export async function AddTeam(teamData) {
    const header = getAuthHeader();
    try{
        const res = await axios.post(`${baseURL}/team`,
        teamData,
        {
            headers: {
                Authorization: header,
            },
        });
        return res.data.result;
    }catch(error){
        console.log(error);
    }
};

//Delete Team in system
export async function DeleteDataTeam(id) {
    const header = getAuthHeader();
    try{
        const res = await axios.delete(`${baseURL}/team/${id}`, {
            headers: {
                Authorization: header,
            },
        });
        console.log(res.data);
        return res.data;
    }catch(error){
        console.log(error);
    }
};

// Get Detail Team in system
export async function getTeamById(id) {
    const header = getAuthHeader();
    try{
        const res = await axios.get(`${baseURL}/team/${id}`,{
            headers: {
                Authorization: header,
            },
        });
        return res.data;
    }catch(error){
        console.log(error);
        return [];
    }
}


//Update Team in system
export async function UpdateTeam(id, data) {
    const header = getAuthHeader();
    console.log('token',header);
    try{
      const res = await axios.put(`${baseURL}/team/${id}`, data,{
        headers: {
          Authorization: header,
          'Content-Type': 'application/json',
        },
      });
      console.log(res);
      return res.data;
    }catch(error) {
      console.log(error);
    }
  }