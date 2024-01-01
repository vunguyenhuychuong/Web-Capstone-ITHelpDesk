import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./link";
import { toast } from "react-toastify";

export async function getAllContract(
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
    const res = await axios.get(`${baseURL}/contract`, {
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

export async function getAllContracts() {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/contract/all`, {
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

//
export async function getContractById(contractId) {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/contract/${contractId}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
}

//Get contract child
export async function getContractChild(contractId) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(
      `${baseURL}/contract/child?contractId=${contractId}`,
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

//Get ReNew Contract
export async function getContractRenew(contractId) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(
      `${baseURL}/contract/renew?contractId=${contractId}`,
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

export async function getContractAccountant() {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/contract/accountant`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function getContractCompanyByCompanyId(companyId) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/contract/company/${companyId}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

// Get ContractId

// Create Contract
export async function createContract(data) {
  const header = getAuthHeader();
  try {
    const res = await axios.post(`${baseURL}/contract`, data, {
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
    console.log(error.response.data.responseException.exceptionMessage);
    toast.error(error.response.data.responseException.exceptionMessage, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
  }
}

// Update Contract
export async function updateContract(data, contractId) {
  const header = getAuthHeader();
  try {
    const res = await axios.put(`${baseURL}/contract/${contractId}`, data, {
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
    console.log(error.response.data.responseException.exceptionMessage);
    toast.error(error.response.data.responseException.exceptionMessage, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
  }
}

//Delete Contract
export async function deleteContract(contractId) {
  const header = getAuthHeader();
  try {
    const res = await axios.delete(`${baseURL}/contract/${contractId}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error.response.data.responseException.exceptionMessage);
    toast.error(error.response.data.responseException.exceptionMessage, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
  }
}

//Update Contract ReNew
export async function updateContractReNew(data, contractId) {
  const header = getAuthHeader();
  try {
    const res = await axios.put(
      `${baseURL}/contract/${contractId}/renew`,
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

export async function getParentContract() {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/contract/parent-contracts`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllAccountList() {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/user/list/accountants`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
};

export async function getAllCompanyList() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/company/all`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
};

export async function getAllContractSelect() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/contract/all`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
};

export async function getContractService(contractId) {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/contract/services?contractId=${contractId}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
};

export async function getPaymentContract(contractId) {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/payment/contract/${contractId}`, {
      headers: {
        Authorization: header,
      },
    });

    return res.data.result;
  } catch (error) {
    if (error.response && error.response.data) {
      const { isError, responseException } = error.response.data;
      if (isError && responseException) {
        console.log(responseException.exceptionMessage);
        throw new Error(responseException.exceptionMessage);
      }
    }

    console.error(error);
    throw new Error("An unexpected error occurred.");
  }
}

export async function getAllAccountant () {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/user/list/accountants`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
};

export async function createContractService(contractId, selectedService) {
  const header = getAuthHeader();
  try {
    const res = await axios.post(
      `${baseURL}/contract/services?contractId=${contractId}`,
      selectedService,
      {
        headers: {
          Authorization: header,
        },
      }
    );
    return res.data.result;
  } catch (error) {
    toast.error(error.response.data.responseException.exceptionMessage, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });    
    throw error; 
  }
}

export async function getServiceSelect(contractId) {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/contract/services/select?contractId=${contractId}`, {
      headers: {
        Authorization: header,
      },
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
};

export async function deleteContractService(serviceId) {
  const header = getAuthHeader();
  try{
    const res = await axios.delete(`${baseURL}/contract/services/${serviceId}`, {
      headers: {
        Authorization: header,
      },
    });
    toast.success("Contract services deleted successfully", {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
    return res.data.result;
  }catch(error){
    console.log(error.response.data.responseException.exceptionMessage);
    toast.error(error.response.data.responseException.exceptionMessage, {
      autoClose: 2000,
      hideProgressBar: false,
      position: toast.POSITION.TOP_CENTER,
    });
  }
}
