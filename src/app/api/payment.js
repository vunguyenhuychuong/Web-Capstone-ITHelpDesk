import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./link";
import { toast } from "react-toastify";

export async function getAllPayment(
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
    const res = await axios.get(`${baseURL}/payment`, {
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

export async function getAllPayments() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/payment/all`, {
      headers: {
        Authorization: header,
      },
    });
    console.log(res);
    return res.data.result;
  }catch(error){
    console.log(error);
  }
}

export async function createPayment(data) {
  const header = getAuthHeader();
  try {
    const res = await axios.post(`${baseURL}/payment`, data, {
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
    toast.error(error.response.data.responseException.exceptionMessage.error, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
  }
}

export async function getPaymentContractById(contractId) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/payment/contract/${contractId}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function getPaymentById(paymentId) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/payment/${paymentId}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePaymentById(paymentId, data) {
  const header = getAuthHeader();
  try {
    const res = await axios.put(`${baseURL}/payment/${paymentId}`, data, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePaymentById(paymentId) {
  const header = getAuthHeader();
  try {
    const res = await axios.delete(`${baseURL}/payment/${paymentId}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function getPaymentTerm(paymentId) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(
      `${baseURL}/payment/term?paymentId=${paymentId}`,
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

export async function createPaymentTerm(paymentId, data) {
  const header = getAuthHeader();
  try {
    const res = await axios.post(`${baseURL}/payment/term/${paymentId}`, data, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePaymentTerm(paymentId) {
  const header = getAuthHeader();
  try {
    const res = await axios.delete(`${baseURL}/payment/term/${paymentId}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePaymentTerm(termId, data) {
  const header = getAuthHeader();
  try {
    const res = await axios.put(`${baseURL}/payment/term/${termId}`, data, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function sendNotificationTerm(termId, data) {
  const header = getAuthHeader();
  try {
    const res = await axios.post(
      `${baseURL}/payment/term/send-notification?id=${termId}`,
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
