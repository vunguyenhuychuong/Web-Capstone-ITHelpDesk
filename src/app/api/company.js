import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./link";

export async function getAllCompany(
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
    const res = await axios.get(`${baseURL}/company`, {
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

export async function createCompany(data) {
  const header = getAuthHeader();
  try {
    const res = await axios.post(`${baseURL}/company/`, data, {
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

export async function updateCompany(companyId, data) {
  const header = getAuthHeader();
  try {
    const res = await axios.put(`${baseURL}/company/${companyId}`, data, {
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

export async function deleteCompany(companyId) {
  const header = getAuthHeader();
  try {
    const res = await axios.delete(`${baseURL}/company/${companyId}`, {
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

export async function getCompanyById(companyId) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/company/${companyId}`, {
      headers: {
        Authorization: header,
      },
    });
    console.log(res.data.result)
    return res.data.result;
  } catch (error) {
    console.log(error);
    return [];
  }
}
