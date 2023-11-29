import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./link";
import { toast } from "react-toastify";

export async function getAllFeedBack(solutionId) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(
      `${baseURL}/solution/feedback?solutionId=${solutionId}`,
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

export async function createFeedBack(data) {
  const header = getAuthHeader();
  try {
    const res = await axios.post(`${baseURL}/solution/feedback`, data, {
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
    toast.error(error.response.data.responseException.exceptionMessage, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
  }
}

export async function createReply(data) {
  const header = getAuthHeader();
  try {
    const res = await axios.post(`${baseURL}/solution/feedback/reply`, data, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFeedBack(feedbackId) {
  const header = getAuthHeader();
  try {
    const res = await axios.delete(
      `${baseURL}/solution/feedback/${feedbackId}`,
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

export async function editFeedBack(feedbackId, data) {
  const header = getAuthHeader();
  try {
    const res = await axios.put(
      `${baseURL}/solution/feedback/${feedbackId}`,
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

export async function getDetailFeedBack(feedbackId) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/solution/feedback/${feedbackId}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}
