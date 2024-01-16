import axios from "axios";
import { getAuthHeader } from "./auth";
import axiosClient from "./axiosClient";
import { baseURL } from "./link";
const AssignApi = {
  getAllAssignByTechnician: async (id) => {
    const header = getAuthHeader();
    try {
      const res = await axiosClient.get(`${baseURL}/assign/technician/${id}`, {
        headers: {
          Authorization: header,
        },
      });
      return res.result;
    } catch (error) {
      console.log(error);
    }
  },
  getTechnician: async (teamId) => {
    const header = getAuthHeader();
    try {
      const res = await axiosClient.get(
        `${baseURL}/assign/get-technicians?teamId=${teamId}`,
        {
          headers: {
            Authorization: header,
          },
        }
      );
      return res.result;
    } catch (error) {
      console.log(error);
    }
  },
};

export async function createAssignTicket(ticketId, data) {
  const header = getAuthHeader();
  console.log("Request Payload:", data);
  try {
    const res = await axios.post(`${baseURL}/assign/${ticketId}/assign`, data, {
      headers: {
        Authorization: header,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllAssigns() {
  const header = getAuthHeader();
  try {
    const res = await axiosClient.get(`${baseURL}/assign`, {
      headers: {
        Authorization: header,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getAssignAvailable() {
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

export async function getTicketAssignedTechnician(ticketId) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/assign/ticket/${ticketId}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}
export default AssignApi;
