import axios from "axios";
import { getAuthHeader } from "./auth";
export const baseURL = "https://localhost:7043/v1/itsds";

// Get All List ticket
export async function getAllTicket(
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
};

//Get Ticket User By Id Pagination
export async function getTicketByUserIdPagination(searchField, searchQuery, page = 1, pageSize = 5, sortBy = "id", sortDirection = "asc", id) {
  const header = getAuthHeader();
  try {
    const filter = `${searchField}.contains("${searchQuery}")`;
    const params = {
      filter: filter,
      page: page,
      pageSize: pageSize,
      sort: `${sortBy} ${sortDirection}`,
    }
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
};

//Get Ticket User By Id
export async function getTicketByUserId(id) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/ticket/user/${id}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

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
    console.log(res);
    return res.data.result;
  } catch (error) {
    console.log(error);
    return [];
  }
}

//Create Ticket By Customer
export async function createTicketByCustomer(data) {
  const header = getAuthHeader();
  try {
    const res = await axios.post(`${baseURL}/ticket/customer/new`, data, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

//Edit Ticket By Customer
export async function editTicketByCustomer(ticketId, data) {
  const header = getAuthHeader();
  try{
    const res = await axios.put(`${baseURL}/ticket/customer/${ticketId}`, JSON.stringify(data),{
      headers: {
        Authorization: header,
      },
    })
    return res.data;
  }catch(error){
    console.log(error);
  }
};

//Create Ticket By Manager
export async function createTicketByManager(data) {
  const header = getAuthHeader();
  try {
    const res = await axios.post(`${baseURL}/ticket/manager/new`, data, {
      headers: {
        Authorization: header,
      },
    });
    console.log(res);
    return res.data.result;
  } catch (error) {
    console.log(error);
    return [];
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
    throw error;
  }
}

//Edit Ticket By Manager
export async function editTicketByManager(ticketId, data) {
  const header = getAuthHeader();
  try {
    const res = await axios.put(
      `${baseURL}/ticket/manager/${ticketId}`,
      data,
      {
        headers: {
          Authorization: header,
        }
      }
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log("Error editing ticket:", error);
    throw error;
  }
};


