import { useState, useEffect } from "react";
import { getContractById } from "../../../../app/api/contract";

const useContractData = (contractId) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    value: 10000,
    startDate: "",
    endDate: "",
    isRenewed: "",
    parentContractId: 1,
    accountantId: 1,
    attachmentUrls: [],
    companyId: 1,
    status: 1,
    id: 1,
    createdAt: "",
    modifiedAt: "",
    deletedAt: "",
    accountant: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      role: 1,
      phoneNumber: "",
      isActive: true,
      dateOfBirth: "",
      gender: 0,

    },
    company: {
      companyName: "",
      taxCode: "",
      website: "",
      phoneNumber: "",
      email: "",
      companyAddress: "",
      logoUrl: "",
      fieldOfBusiness: "",
      isActive: true,
      customerAdminId: "",
      customerAdmin: "",
      createdAt: "",
      modifiedAt: "",
      deletedAt: ""
    },
  });

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const contractData = await getContractById(contractId);
        if (isMounted) {
          setData({
            ...contractData,
          });
        }
      } catch (error) {
        console.error("Error fetching contract data: ", error);
        if(isMounted){
            setError(error);
        }
      }
    };

    fetchData();
    return () => {
        isMounted = false;
      };
    }, [contractId]);
  
    if (error) {
      return { error }; // Return error separately
    }
    return { data }; // Return data separately
};

export default useContractData;
