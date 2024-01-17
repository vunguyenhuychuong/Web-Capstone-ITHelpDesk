import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./link";
import { toast } from "react-toastify";

const header = getAuthHeader();
export async function getAllCompanyMember(companyId) {
  try {
    const res = await axios.get(`${baseURL}/company/member/${companyId}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllMemberCompany(
  searchField,
  searchQuery,
  page = 1,
  pageSize = 5,
  sortBy = "id",
  sortDirection = "asc"
) {
  try {
    let filter = `${searchField}.contains("${searchQuery}")`;
    const params = {
      filter: filter,
      page: page,
      pageSize: pageSize,
      sort: `${sortBy} ${sortDirection}`,
    };
    const res = await axios.get(`${baseURL}/company/member`, {
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

export async function getCompanyMemberSelect(companyId) {
  try {
    const res = await axios.get(
      `${baseURL}/company/member/select-list?companyId=${companyId}`,
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

export async function getCompanyMemberAdmin(companyId) {
  try {
    const res = await axios.get(
      `${baseURL}/company/member/company-admins?companyId=${companyId}`,
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

export async function createCompanyMember(data) {
  try {
    const res = await axios.post(`${baseURL}/company/member`, data, {
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
    toast.error(error.response.data.responseException.exceptionMessage.title, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
  }
}

export async function updateCompanyMember(data, memberId) {
  try {
    const res = await axios.put(`${baseURL}/company/member/${memberId}`, data, {
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
    toast.error(error.response.data.responseException.exceptionMessage.title, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
  }
}

export async function getCompanyMemberById(memberId) {
  try {
    const res = await axios.get(`${baseURL}/company/member/${memberId}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteCompanyMember(memberId) {
  try {
    const res = await axios.delete(`${baseURL}/company/member/${memberId}`, {
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
    toast.error(error.response.data.responseException.exceptionMessage.title, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
  }
}

export async function forgotPassword(email) {
  try {
    const res = await axios.post(
      `${baseURL}/auth/reset-password?email=${email}`,
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
    toast.error(error.response.data.responseException.exceptionMessage.title, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
  }
}
