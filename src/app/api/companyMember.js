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

export async function createCompanyMember(data) {
  try {
    const res = await axios.post(`${baseURL}/`, data, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function updateCompanyMember(memberId, data) {
  try {
    const res = await axios.put(`${baseURL}/company/member/${memberId}`, data, {
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
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}
