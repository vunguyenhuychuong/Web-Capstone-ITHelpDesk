import axios from "axios";
import { getAuthHeader } from "./auth";
import axiosClient from "./axiosClient";
import { baseURL } from "./link";
import { toast } from "react-toastify";

export async function getAllCategories() {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/category`, {
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

export async function getCategoriesAll(
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
    const res = await axios.get(`${baseURL}/category`, {
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

export async function createCategory(data) {
  try {
    const header = getAuthHeader();
    const res = await axios.post(`${baseURL}/category`, data, {
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

export async function updateCategory(data, categoryId) {
  try {
    const header = getAuthHeader();
    const res = await axios.put(`${baseURL}/category/${categoryId}`, data, {
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

export async function deleteCategory(categoryId) {
  try {
    const header = getAuthHeader();
    const res = await axios.delete(`${baseURL}/category/${categoryId}`, {
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

export async function getCategoryDetail(categoryId) {
  const header = getAuthHeader();
  try {
    const result = await axios.get(`${baseURL}/category/${categoryId}`, {
      headers: {
        Authorization: header,
      },
    });
    return result.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function getDataCategories() {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/category/all`, {
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

const CategoryApi = {
  getAllCategories: async () => {
    const header = getAuthHeader();
    try {
      const response = await axiosClient.get("/category", {
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

export default CategoryApi;
