import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./link";
import { toast } from "react-toastify";
import { data } from "autoprefixer";

export async function getAllTicketTasks(
  searchField,
  searchQuery,
  page = 1,
  pageSize = 5,
  sortBy = "id",
  sortDirection = "asc",
  ticketId
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
    const res = await axios.get(`${baseURL}/ticket/task?ticketId=${ticketId}`, {
      headers: {
        Authorization: header,
      },
      params: params,
    });
    console.log(res);
    return res.data.result;
  } catch (error) {
    console.log(error);
    return [];
  }
}

//Get Ticket Task Active
export async function getTicketTaskActive(ticketId) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(
      `${baseURL}/ticket/task/active?ticketId=${ticketId}`,
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

export async function getTicketTaskInActive(ticketId) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(
      `${baseURL}/ticket/task/inactive?ticketId=${ticketId}`,
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

export async function createTicketTask(data) {
  const header = getAuthHeader();
  try {
    const res = await axios.post(`${baseURL}/ticket/task/new`, data, {
      headers: {
        Authorization: header,
      },
    });

    if (res.data && res.data.isError === false) {
      toast.success(res.data.message || "Request successful.",
       {
        autoClose: 1000,
        hideProgressBar: false,
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } else {
      toast.error("An error occurred while processing the request.");
    }
    return res.data.result;
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.responseException
    ) {
      const errorMessage =
        error.response.data.responseException.exceptionMessage.errors
          .ScheduledEndTime;
      toast.error(`${errorMessage}`);
    }
  }
}

export async function updateTicketTask(taskId, data) {
  const header = getAuthHeader();
  try {
    const res = await axios.put(`${baseURL}/ticket/task/${taskId}`, data, {
      headers: {
        Authorization: header,
      },
    });

    if (res.data && res.data.isError === false) {
      toast.success(res.data.message || "Request successful.", {
        autoClose: 1000,
        hideProgressBar: false,
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } else {
      toast.error("An error occurred while processing the request."
      , {
        autoClose: 1000,
        hideProgressBar: false,
        position: toast.POSITION.TOP_CENTER,
      });
    }

    return res.data.result;
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.responseException
    ) {
      const errorMessage =
        error.response.data.responseException.exceptionMessage.errors
          .ScheduledEndTime;
      toast.error(`${errorMessage}`, {
        autoClose: 1000,
        hideProgressBar: false,
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }
}

export async function deleteTicketTask(taskId) {
  const header = getAuthHeader();
  try {
    const res = await axios.delete(`${baseURL}/ticket/task/${taskId}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function getTicketTaskById(ticketId) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/ticket/task/${ticketId}`, {
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
