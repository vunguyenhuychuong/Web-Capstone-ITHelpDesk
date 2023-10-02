import axios from "axios";
import { setUser } from "../../features/user/authSlice";
import { toast } from "react-toastify";
export const baseURL = "https://localhost:7043/v1/itsds";

// Get all users in system
export async function getAllUser() {
  const user = JSON.parse(localStorage.getItem("profileAdmin"));
  const accessToken = user.result.accessToken;
  const header = `Bearer ${accessToken}`;
  try {
    const res = await axios.get(`${baseURL}/user`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Login User
export async function LoginUser(data) {
  try {
    const res = await axios.post(`${baseURL}/auth/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    setUser(res.data.result);
    return res.data;
  } catch (error) {
    if(error.response && error.response.status === 400) {
        console.log("Input validation error: " , error.response.data);
    }else {
        console.log("An error occurred: ", error.message);
    }
  }
}

// Get Data Profile User
export async function getDataProfile(id) {
  const user = JSON.parse(localStorage.getItem("profileAdmin"));
  const accessToken = user.result.accessToken;
  const header = `Bearer ${accessToken}`;
  try{
    const res = await axios.get(`${baseURL}/user/${id}`, {
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

// Add Data Profile User
export async function AddDataProfile(userData) {
  const user = JSON.parse(localStorage.getItem("profileAdmin"));
  const accessToken = user.result;
  const header = `Bearer ${accessToken}`;
  try{
    const res = await axios.post(`${baseURL}/user`,
    userData, 
    {
      header: {
        Authorization: header,
      },
    });
    return res.data;
  }catch(error) {
    console.log(error);
  }
}

export async function GetDataProfileUser() {
  const user = JSON.parse(localStorage.getItem("profileAdmin"));
  const accessToken = user.result.accessToken;
  const header = `Bearer ${accessToken}`;
  try {
    const res = await axios.get(`https://localhost:7043/v1/itsds/user/profile`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  }catch(error) {
    console.log(error);
  }
}


//Update Data Profile User
export async function UpdateDataProfile(id) {
  const user = JSON.parse(localStorage.getItem("profielAdmin"));
  const accessToken = user.result.accessToken;
  const header = `Bearer ${accessToken}`;
  try{
    const res = await axios.put(`${baseURL}/user/${id}`, {
      header: {
        Authorization: header,
      },
    });
  }catch(error){
    console.log(error);
    return [];
  }
}

//Delete Data User
export async function DeleteDataUser(id) {
  const user = JSON.parse(localStorage.getItem("profileAdmin"));
  const accessToken = user.result.accessToken;
  const header = `Bearer ${accessToken}`;
  try{
    const res = await axios.delete(`${baseURL}/user/${id}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data;
  }catch(error) {
    console.log(error);
  }
}

//Update profile User
export async function UpdateProfileUser() {
  const user = JSON.parse(localStorage.getItem("profileAdmin"));
  const accessToken = user.result.accessToken;
  const header = `Bearer ${accessToken}`;
  console.log('token update profile ===',header);
  try{
    const res = await axios.patch(`${baseURL}/user/update-profile`, {
      headers: {
        Authorization: header,
      },
    });

    console.log(res.data);
    return res.data;
  }catch(error){
    toast.error("BAD REQUEST ")
    console.log(error);
  }
}
