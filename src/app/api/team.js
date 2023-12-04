import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./link";
import { toast } from "react-toastify";

//Get all Team in system

export async function getAllTeam(
  searchField,
  searchQuery,
  page = 1,
  pageSize = 5,
  sortBy = "name",
  sortDirection = "asc"
) {
  const header = getAuthHeader();
  try {
    const filter = `${searchField}.contains("${searchQuery}")`;
    const params = {
      filter: filter,
      page: page,
      pageSize: pageSize,
      sort: `${sortBy} ${sortDirection}`,
    };
    const res = await axios.get(`${baseURL}/team`, {
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
}

export async function getAllTeams() {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/team/all`, {
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

//Add Team in system
export async function AddTeam(teamData) {
  const header = getAuthHeader();
  try {
    const res = await axios.post(`${baseURL}/team`, teamData, {
      headers: {
        Authorization: header,
      },
    });
    toast.success("Create Mode successful", {
        autoClose: 1000,
        hideProgressBar: false,
      });
    return res.data.result;
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.responseException
    ) {
      const errorMessage =
        error.response.data.responseException.exceptionMessage;
      toast.error(`Failed to add team: ${errorMessage}`);
    } else {
      toast.error("An unexpected error occurred while adding the team.");
    }
  }
}

//Delete Team in system
export async function DeleteDataTeam(id) {
  const header = getAuthHeader();
  try {
    const res = await axios.delete(`${baseURL}/team/${id}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

// Get Detail Team in system
export async function getTeamById(id) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/team/${id}`, {
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

//Update Team in system
export async function UpdateTeam(id, data) {
  const header = getAuthHeader();
  try {
    const res = await axios.put(`${baseURL}/team/${id}`, data, {
      headers: {
        Authorization: header,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.responseException
    ) {
      const errorMessage =
        error.response.data.responseException.exceptionMessage;
      toast.error(`Failed to edit team: ${errorMessage}`);
    } else {
      toast.error("An unexpected error occurred while adding the team.");
    }
  }
}

export async function getManagerList() {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/user/list/managers`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
};

export async function getCityList() {
  try{
    const res = await axios.get(`https://provinces.open-api.vn/api/?fbclid=IwAR3163YbjjVD3neOn1YZkYGdQYxz2Q0Y9_WiB__rSw8gmGsScxtvj-Z7TQE`);
    return res.data;
  }catch(error){
    console.log(error);
  }
};

export async function getTechnicianList() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/user/list/technicians`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
}
