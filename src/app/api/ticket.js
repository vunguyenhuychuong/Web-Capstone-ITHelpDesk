import axios from "axios";
import { getAuthHeader } from "./auth";
import { toast } from "react-toastify";
import { baseURL } from "./link";
import { useNavigate } from "react-router-dom";

// Get All List ticket
export async function getAllTicket(
  searchField,
  searchQuery,
  page = 1,
  pageSize = 5,
  sortBy = "createdAt",
  sortDirection = "desc",
  ticketStatus
) {
  const header = getAuthHeader();
  try {
    let filter = `${searchField}.contains("${searchQuery}")`;
    const params = {
      filter: filter,
      page: page,
      pageSize: pageSize,
      sort: `${sortBy} ${sortDirection}`,
      ticketStatus: ticketStatus,
    };
    const res = await axios.get(`${baseURL}/ticket`, {
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

//Get Ticket User By Id Pagination
export async function getTicketByUserIdPagination(
  searchField,
  searchQuery,
  page = 1,
  pageSize = 5,
  sortBy = "id",
  sortDirection = "asc",
  id,
  ticketStatus
) {
  const header = getAuthHeader();
  try {
    const filter = `${searchField}.contains("${searchQuery}")`;
    const params = {
      filter: filter,
      page: page,
      pageSize: pageSize,
      sort: `${sortBy} ${sortDirection}`,
      ticketStatus: ticketStatus,
    };
    const res = await axios.get(`${baseURL}/ticket/user/${id}`, {
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

//Get Ticket User By Id
export async function getTicketByUserId(
  searchField,
  searchQuery,
  id,
  page = 1,
  pageSize = 5
) {
  const header = getAuthHeader();
  try {
    const filter = `${searchField}.contains("${searchQuery}")`;
    const params = {
      page: page,
      pageSize: pageSize,
    };
    const res = await axios.get(`${baseURL}/ticket/user/${id}`, {
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

// Get Ticket Team By TeamId
export async function getTicketByTeamId(id) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/ticket/team/${id}`, {
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

// Get Ticket By Id
export async function getTicketByTicketId(id) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/ticket/${id}`, {
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
//Create Ticket By Customer
export async function createTicketByCustomer(data, navigate) {
  const header = getAuthHeader();

  try {
    const res = await axios.post(`${baseURL}/ticket/customer/new`, data, {
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
    toast.error(error.response.data.responseException.exceptionMessage, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
  }
}

//Edit Ticket By Customer
export async function editTicketByCustomer(ticketId, data) {
  const header = getAuthHeader();
  try {
    const res = await axios.put(
      `${baseURL}/ticket/customer/${ticketId}`,
      data,
      {
        headers: {
          Authorization: header,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

//Create Ticket By Manager
export async function createTicketByManager(data) {
  const header = getAuthHeader();
  try {
    const res = await axios.post(`${baseURL}/ticket/manager/new`, data, {
      headers: {
        Authorization: header,
      },
    });
    toast.success(res.data.result.message, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
    return res.data.result;
  } catch (error) {
    toast.error(error.response.data.responseException.exceptionMessage.title, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });

    console.log(error.response.data.responseException.exceptionMessage);
  }
}

//Delete Ticket By Manager
export async function deleteTicketByManager(ticketIds) {
  const header = getAuthHeader();
  try {
    const res = await axios.delete(`${baseURL}/ticket/manager/${ticketIds}`, {
      headers: {
        Authorization: header,
      },
      data: {
        ticketIds: ticketIds,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log("Error deleting tickets:", error);
    toast.error(error.response.data.responseException.exceptionMessage, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
  }
}

//Edit Ticket By Manager
export async function editTicketByManager(ticketId, data) {
  const header = getAuthHeader();
  try {
    const res = await axios.put(`${baseURL}/ticket/manager/${ticketId}`, data, {
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
    console.log("Error editing ticket:", error);
    toast.error(error.response.data.responseException.exceptionMessage, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
    throw error;
  }
}

//Get Ticket History
export async function getTicketUserHistory() {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/ticket/user/history`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

//Change status ticket
export async function ChangeStatusTicket(ticketId, newStatus) {
  const header = getAuthHeader();
  try {
    const res = await axios.patch(
      `${baseURL}/ticket/modify-status?ticketId=${ticketId}&newStatus=${newStatus}`,
      null,
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

export async function UpdateTicketForTechnician(ticketId, data) {
  const header = getAuthHeader();
  try {
    const res = await axios.patch(
      `${baseURL}/ticket/technician/${ticketId}`,
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

//View Ticket Customer
export async function GetTicketUserAvailable() {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/ticket/user/available`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function getAssignTicket(
  searchField,
  searchQuery,
  page = 1,
  pageSize = 5,
  sortBy = "createdAt",
  sortDirection = "desc",
  ticketStatus
) {
  const header = getAuthHeader();
  try {
    let filter = `${searchField}.contains("${searchQuery}")`;
    const params = {
      filter: filter,
      page: page,
      pageSize: pageSize,
      sort: `${sortBy} ${sortDirection}`,
      ticketStatus: ticketStatus,
    };
    const res = await axios.get(`${baseURL}/ticket/assign`, {
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

export async function CancelTicketUser(ticketId) {
  const header = getAuthHeader();
  try {
    const res = await axios.patch(
      `${baseURL}/ticket/cancel?ticketId=${ticketId}`,
      {},
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
    console.log(error.response.data.responseException.exceptionMessage);
    toast.error(error.response.data.responseException.exceptionMessage, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
  }
}

export async function CloseTicketUser(ticketId) {
  const header = getAuthHeader();
  try {
    const res = await axios.patch(
      `${baseURL}/ticket/close?ticketId=${ticketId}`,
      {},
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
    console.log(error.response.data.responseException.exceptionMessage);
    toast.error(error.response.data.responseException.exceptionMessage.title, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
  }
}

export async function getTicketAssignAvailable() {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/ticket/assign/available`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function getDataLocation() {
  try {
    const city = await axios.get(`https://provinces.open-api.vn/api/`);
  } catch (error) {}
}
