import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./link";
import { toast } from "react-toastify";

export async function getAllDepartmentSelect(companyId) {
  try {
    const header = getAuthHeader();
    const res = await axios.get(
      `${baseURL}/company/companyAddress/${companyId}/select-list`,
      {
        headers: {
          Authorization: header,
        },
      }
    );
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllDepartmentList(
  searchField,
  searchQuery,
  page = 1,
  pageSize = 5,
  sortBy = "id",
  sortDirection = "asc",
  companyId
) {
  try {
    const header = getAuthHeader();
    let filter = `${searchField}.contains("${searchQuery}")`;
    const params = {
      filter: filter,
      page: page,
      pageSize: pageSize,
      sort: `${sortBy} ${sortDirection}`,
    };
    const res = await axios.get(
      `${baseURL}/company/department/${companyId}/list`,
      {
        headers: {
          Authorization: header,
        },
        params: params,
      }
    );
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function getDepartmentById(companyId) {
  try {
    const header = getAuthHeader();
    const res = await axios.get(`${baseURL}/company/department/${companyId}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function createDepartment(data, companyId) {
  try {
    const header = getAuthHeader();
    const res = await axios.post(
      `${baseURL}/company/department?companyId=${companyId}`,
      data,
      {
        headers: {
          Authorization: header,
        },
      }
    );
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

export async function updateDepartment(data, companyId) {
  try {
    const header = getAuthHeader();
    const res = await axios.put(
      `${baseURL}/company/department?companyId=${companyId}`,
      data,
      {
        headers: {
          Authorization: header,
        },
      }
    );
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

export async function deleteDepartment(companyId) {
  try {
    const header = getAuthHeader();
    const res = await axios.delete(
      `${baseURL}/company/department/${companyId}`,
      {
        headers: {
          Authorization: header,
        },
      }
    );
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
