import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./link";
import { toast } from "react-toastify";

export async function getAllTicketSolutions(
  searchField,
  searchQuery,
  page = 1,
  pageSize = 5,
  sortBy = "createdAt",
  sortDirection = "desc"
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
    const res = await axios.get(`${baseURL}/solution`, {
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

export async function getTicketSolutionById(solutionId) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/solution/${solutionId}`, {
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

export async function createTicketSolution(data) {
  const header = getAuthHeader();
  try {
    const res = await axios.post(`${baseURL}/solution/new`, data, {
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
    console.log(error.response.data.responseException.exceptionMessage.title);
    toast.error(error.response.data.responseException.exceptionMessage, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
  }
}

export async function deleteTicketSolution(solutionId) {
  const header = getAuthHeader();
  try {
    const res = await axios.delete(`${baseURL}/solution/${solutionId}`, {
      headers: {
        Authorization: header,
      },
      // data: {
      //   solutionId: solutionId,
      // },
    });
    return res.data.result;
  } catch (error) {
    console.log("Error deleting solutionID", error);
    throw error;
  }
}

export async function editTicketSolution(solutionId, data) {
  const header = getAuthHeader();
  try {
    const res = await axios.put(`${baseURL}/solution/${solutionId}`, data, {
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
    console.log("Error edit solution", error);
    toast.error(error.response.data.responseException.exceptionMessage, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
  }
}

export async function changePublicSolution(solutionId) {
  const header = getAuthHeader();
  try {
    const res = await axios.patch(
      `${baseURL}/solution/change-public?solutionId=${solutionId}`,
      null,
      {
        headers: {
          Authorization: header,
        },
      }
    );
    return res.data.result;
  } catch (error) {
    console.log("Error change public solutionID", error);
  }
}

export async function approveTicketSolution(solutionId, duration) {
  const header = getAuthHeader();
  try {
    const res = await axios.patch(
      `${baseURL}/solution/approve?solutionId=${solutionId}`,
      {
        duration: duration,
      },
      {
        headers: {
          Authorization: header,
        },
      }
    );
    return res.data.result;
  } catch (error) {
    console.log("Error approve public solutionID", error);
  }
}

export async function submitApprovalTicketSolution(solutionId, managerId) {
  const header = getAuthHeader();
  try {
    const res = await axios.patch(
      `${baseURL}/solution/submit-approval?solutionId=${solutionId}`,
      { managerId: managerId },
      {
        headers: {
          Authorization: header,
        },
      }
    );
    return res.data.result;
  } catch (error) {
    console.log("Error approve public solutionID", error);
  }
}

export async function rejectTicketSolution(solutionId) {
  const header = getAuthHeader();
  try {
    const res = await axios.patch(
      `${baseURL}/solution/reject?solutionId=${solutionId}`,
      null,
      {
        headers: {
          Authorization: header,
        },
      }
    );
    return res.data.result;
  } catch (error) {
    console.log("Error reject public solutionID", error);
  }
}
