import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./link";

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
    return res.data.result;
  } catch (error) {
    console.log(error);
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
    return res.data.result;
  } catch (error) {
    console.log(error);
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
    console.log(error);
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
    return res.data.result;
  } catch (error) {
    console.log(error);
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
