import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./axiosClient";
import { toast } from "react-toastify";

export async function getCompanyAddressList(companyId, params) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(
      `${baseURL}/company/companyAddress/${companyId}/list`,
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
    return [];
  }
}

export async function getCompanyAddress(companyId) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(
      `${baseURL}/company/companyAddress/${companyId}`,
      {
        headers: {
          Authorization: header,
        },
      }
    );
    return res.data.result;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function createCompanyMember(data) {
  const header = getAuthHeader();
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

export async function createCompanyAddress(data, companyId) {
  const header = getAuthHeader();
  try {
    const res = await axios.post(
      `${baseURL}/company/companyAddress?companyId=${companyId}`,
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
    toast.error(error.response.data.responseException.exceptionMessage.title, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
  }
}

export async function updateCompanyAddress(data, addressId) {
  const header = getAuthHeader();
  try {
    const res = await axios.put(
      `${baseURL}/company/companyAddress/${addressId}`,
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
    toast.error(error.response.data.responseException.exceptionMessage.title, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
  }
}

export async function getCompanyAddressById(addressId) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(
      `${baseURL}/company/companyAddress/${addressId}`,
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

export async function deleteCompanyAddress(addressId) {
  const header = getAuthHeader();
  try {
    const res = await axios.delete(
      `${baseURL}/company/companyAddress/${addressId}`,
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
