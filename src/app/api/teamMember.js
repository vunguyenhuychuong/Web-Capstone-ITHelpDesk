import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./link";
import { toast } from "react-toastify";

export async function getAllTeamMember(
  searchField,
  searchQuery,
  page = 1,
  pageSize = 5,
  sortBy = "expertises",
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
    const res = await axios.get(`${baseURL}/team/member`, {
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

export async function getTeamMemberById(teamId) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/team/member/${teamId}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function getMemberSelect(teamId) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(
      `${baseURL}/team/member/select-list?teamId=${teamId}`,
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

export async function getTeamMemberId(id) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/team/member/get/${id}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function createTeamMemberAssign(data) {
  const header = getAuthHeader();
  try {
    const res = await axios.post(`${baseURL}/team/member/assign`, data, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function updateTeamMember(id, data) {
  const header = getAuthHeader();
  try {
    const res = await axios.put(
      `${baseURL}/team/member/update?id=${id}`,
      data,
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

export async function deleteTeamMember(id) {
  const header = getAuthHeader();
  try {
    const res = await axios.delete(`${baseURL}/team/member/remove?id=${id}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}
