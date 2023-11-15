import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./link";

export async function getSummaryTechnician() {
  const header = getAuthHeader();
  try {
    const res = await axios.get(`${baseURL}/dashboard/technician/ticket`, {
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
  }
};

export async function getSummaryCustomer() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/customer/ticket`, {
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
};

export async function getSummaryManager() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/manager/ticket`,{
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
}

export async function  getChartCategory() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/manager/ticket/category`, {
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
};

export async function getChartPriority() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/manager/ticket/priority`, {
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
}

export async function getChartMode() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/manager/ticket/mode`, {
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
}

export async function getChartService() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/manager/ticket/service`, {
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
}
