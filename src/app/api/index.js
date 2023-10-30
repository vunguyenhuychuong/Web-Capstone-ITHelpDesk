import axios from "axios";
import { setUser } from "../../features/user/authSlice";
import { toast } from "react-toastify";
import { getAuthHeader } from "./auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";
export const baseURL = 'https://dichvuit-be.hisoft.vn/v1/itsds';

// Get all users in system
export async function getAllUser(searchField, searchQuery, page = 1, pageSize = 5, sortBy = "id", sortDirection = "asc") {
  const header = getAuthHeader();
  try {
    const encodedSearchQuery = encodeURIComponent(searchQuery);
    const filter = `${searchField}.contains("${searchQuery}")`;
    const params = {
      filter: filter,
      page: page,
      pageSize: pageSize,
      sort: `${sortBy} ${sortDirection}` 
    };
    const res = await axios.get(`${baseURL}/user`, {
      headers: {
        Authorization: header,
      },
      params: params,
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export async function getDataUser() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/user/all`, {
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

// Login User
export async function LoginUser(data) {
  try {
    const res = await axios.post(`${baseURL}/auth/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    setUser(res.data.result);
    sessionStorage.setItem("profile", JSON.stringify(res.data.result));
    return res.data;
  } catch (error) {
    if(error.response) {
        if(error.response.status === 400) {
          console.error("Input validation error: ", error.response.data);
          toast.error("Invalid input, please check your credentials");
          return {success: false, error: error.response.data};
        }else{
          console.error("Server error: ", error.response.status, error.response.data);
          toast.error("Server error occurred");
          return { success: false, error: "Server error occurred" };
        }
    }else if (error.request) {
      console.error("No response received: ", error.request);
      toast.error("No response received from the server");
      return { success: false, error: "No response received from the server"};
    }else {
      console.error("Request error: ", error.message);
      toast.error("Request error occurred");
      return { success: false, error: "Request error occurred"};
    }
  }
}


// Add Data Profile User
export async function AddDataProfile(userData) {
  const header = getAuthHeader();
  try{
    const res = await axios.post(`${baseURL}/user`,
    userData, 
    {
      header: {
        Authorization: header,
      },
    });
    console.log(res);
    return res.data;
  }catch(error) {
    console.log(error);
  }
}

export async function GetDataProfileUser() {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/user/profile`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  }catch(error) {
    console.log(error);
  };
};

//Delete Data User
export async function DeleteDataUser(id) {
  const header = getAuthHeader();
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
};

//Update profile User
export async function UpdateProfileUser() {
  const header = getAuthHeader();
  try{
    const res = await axios.patch(`${baseURL}/user/update-profile`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data;
  }catch(error){
    toast.error("BAD REQUEST ")
    console.log(error);
  }
}

//Update User 
export async function UpdateUser(id, data) {
  const header = getAuthHeader();
  try{
    const res = await axios.put(`${baseURL}/user/${id}`, data,{
      headers: {
        Authorization: header,
        'Content-Type': 'application/json',
      },
    });
    console.log(res);
    return res;
  }catch(error) {
    if(error.response && error.response.status === 400){
      const validationErrors = error.response.data.responseException.error;
      if(validationErrors && validationErrors['$.dateOfBirth']) {
        toast.error(validationErrors['$.dateOfBirth'][0]);
      }
      if(validationErrors && validationErrors.req) {
        toast.error(validationErrors.req[0]);
      }
    }else{
      toast.error("An error occurred while processing your request.");
      console.log(error);
    }
  }
}

//Get ID User
export async function getUserById(id) {
  const header = getAuthHeader();
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

//Upload image Profile
export async function UploadImage(file) {
  const header = getAuthHeader();
  try{
    const storageRef = ref(storage, 'images/'+ file.name);
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);
    const res = await axios.patch("https://localhost:7043/v1/itsds/user/uploadAvatarFirebase", {
      downloadURL: downloadURL,
    }, {
      headers: {
        Authorization: header,
      },
    });

    return res.data;
  }catch(error) {
    console.log(error);
  }
}
