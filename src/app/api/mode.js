import axios from "axios";
import { getAuthHeader } from "./auth";
import axiosClient from "./axiosClient";
import { baseURL } from "./link";
import { toast } from "react-toastify";

const ModeApi = {
  getMode: async () => {
    const header = getAuthHeader();
    try {
      const response = await axiosClient.get("/mode", {
        headers: {
          Authorization: header,
        },
      });
      return response.result;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
};

export async function getDataMode(
  searchField,
  searchQuery,
  page = 1,
  pageSize = 5,
  sortBy = "id",
  sortDirection = "asc"
) {
  const header = getAuthHeader();
  try {
    let filter = `${searchField}.contains("${searchQuery}")`;
    const params = {
      filter: filter,
      page: page,
      pageSize: pageSize,
      sort: `${sortBy} ${sortDirection}`,
    };
    const res = await axios.get(`${baseURL}/mode`, {
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

export async function createMode(data) {
  const header = getAuthHeader();
  try {
    const res = await axios.post(`${baseURL}/mode`, data, {
      headers: {
        Authorization: header,
      },
    });
    toast.success(res.data.result, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.responseException.exceptionMessage, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
  }
}

export async function updateMode(modeId, data) {
  const header = getAuthHeader();
  try {
    const res = await axios.put(`${baseURL}/mode/${modeId}`, data, {
      headers: {
        Authorization: header,
      },
    });
    toast.success(res.data.result, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.responseException.exceptionMessage, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
  }
}

export async function deleteMode(modeIds) {
  const header = getAuthHeader();
  try {
    const result = await axios.delete(`${baseURL}/mode/${modeIds}`, {
      headers: {
        Authorization: header,
      },
      data: {
        modeIds: modeIds,
      },
    });
    return result.data.result;
  } catch (error) {
    console.log("Error deleting modes:", error);
    throw error;
  }
}

export async function deleteDataMode(modeIds) {
  const header = getAuthHeader();
  try {
    const result = await axios.delete(`${baseURL}/mode/${modeIds}`, {
      headers: {
        Authorization: header,
      },
    });
    return result.data.result;
  } catch (error) {
    console.log("Error deleting modes:", error);
    throw error;
  }
}

export async function getModeDetail(modeId) {
  const header = getAuthHeader();
  try {
    const result = await axios.get(`${baseURL}/mode/${modeId}`, {
      headers: {
        Authorization: header,
      },
    });
    console.log(result);
    return result.data.result;
  } catch (error) {
    console.log(error);
  }
}

export default ModeApi;
