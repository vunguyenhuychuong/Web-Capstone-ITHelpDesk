import axios from "axios";
import { getAuthHeader } from "./auth";
import { baseURL } from "./link";
import { RssFeed } from "@mui/icons-material";

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
};

export async function getChartWeek() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/manager/ticket/this-week`, {
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
};

export async function getChartLastWeek() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/manager/ticket/last-week`, {
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
};

export async function getChartThisMonth() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/manager/ticket/this-month`,{
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
};

export async function getChartLastMonth() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/manager/ticket/last-month`, {
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error) {
    console.log(error);
  }
};

export async function getChartUserCreated() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/user/recent-created?amount=5`,{
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
};

export async function getChartUserUpdated() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/user/recent-updated?amount=5`, {
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
};

export async function getChartActiveCount() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/user/active-count`,{
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
};

export async function getChartRoleCount() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/user/role-count`, {
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
};

export async function getChartRecentCreated() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/user/role-count`, {
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
};

export async function getChartTeamRecentCreated() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/team/recent-created?amount=5`, {
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
};

export async function getChartTeamRecentUpdated() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/team/recent-updated?amount=5`, {
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
};

export async function getChartTeamActiveCount() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/team/active-count`, {
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
};

export async function getChartTeamMemberCount() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/team/member-count`, {
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
};

export async function getChartAccountantContract() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/accountant/contract`, {
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
};

export async function getChartAccountantContractStatus() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/accountant/contract/status`, {
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error) {
    console.log(error);
  }
};

export async function getChartManagerContract() {
  const header = getAuthHeader();
  try{
    const res = await axios.get(`${baseURL}/dashboard/manager/contract`, {
      headers: {
        Authorization: header,
      }
    });
    return res.data.result;
  }catch(error){
    console.log(error);
  }
};




