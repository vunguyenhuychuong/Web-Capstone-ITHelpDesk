import axios from "axios";

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
    console.log('data get users', res.data.result);
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
    return res.data;
  } catch (error) {
    console.log(error);
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
export async function AddDataProfile() {
  const user = JSON.parse(localStorage.getItem("profileAdmin"));
  const accessToken = user.response.accessToken;
  const header = `Bearer ${accessToken}`;
  try{
    const res = await axios.post(`${baseURL}/user`, {
      header: {
        Authorization: header,
      },
    });
    console.log('data Add Profile', res);
  }catch(error) {
    console.log(error);
    return [];
  }
}

//Update Data Profile User
export async function UpdateDataProfile(id) {
  const user = JSON.parse(localStorage.getItem("profielAdmin"));
  const accessToken = user.response.accessToken;
  const header = `Bearer ${accessToken}`;
  try{
    const res = await axios.put(`${baseURL}/user/${id}`, {
      header: {
        Authorization: header,
      },
    });
    console.log('data Update Profile', res);
  }catch(error){
    console.log(error);
    return [];
  }
}
