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
//   createAssignTicket: async (ticketId, data) => {
//     const header = getAuthHeader();
//     console.log('Request Payload:', data);
//     try {
//       const res = await axiosClient.post(
//         `${baseURL}/assign/${ticketId}/assign`,
//         JSON.stringify(data),
//         {
//           headers: {
//             Authorization: header,
//             'Content-Type': 'application/json'
//           },
//         }
//       );
//       console.log("API Response:", res.data);
//       return res.data;
//     } catch (error) {
//       console.log(error);
//     }
//   },
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
    console.log('Request Payload:', data);
    try {
      const res = await axios.post(
        `${baseURL}/assign/${ticketId}/assign`,
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

export async function getAllAssigns ()  {
  const header = getAuthHeader();
  try {
    const res = await axiosClient.get(`${baseURL}/assign`, {
      headers: {
        Authorization: header,
      },
    });
    return res.result;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export default AssignApi;
