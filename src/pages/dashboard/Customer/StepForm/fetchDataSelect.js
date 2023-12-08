import axios from 'axios';

const host = "https://provinces.open-api.vn/api/";

export const fetchCity = async () => {
  try {
    const response = await axios.get(host + "?depth=1");
    return response.data;
  } catch (error) {
    console.log("Error while fetching city data", error);
    return [];
  }
};

export const fetchDistricts = async (cityId) => {
  try {
    const response = await axios.get(host + `p/${cityId}?depth=2`);
    return response.data.districts;
  } catch (error) {
    console.log("Error while fetching districts", error.response);
    return [];
  }
};

export const fetchWards = async (districtId) => {
  try {
    const response = await axios.get(host + `d/${districtId}?depth=2`);
    return response.data.wards;
  } catch (error) {
    console.log("Error while fetching wards", error.response);
    return [];
  }
};


