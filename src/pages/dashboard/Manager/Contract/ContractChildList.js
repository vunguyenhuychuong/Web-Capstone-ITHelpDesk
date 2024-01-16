import {
  MDBBtn,
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import "../../../../assets/css/ticketCustomer.css";
import { ContentCopy, DeleteForever } from "@mui/icons-material";
import { formatDate } from "../../../helpers/FormatDate";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import CloseTicket from "../../../../assets/images/NoContractChild.jpg";
import { getContractChild } from "../../../../app/api/contract";
import CustomizedProgressBars from "../../../../components/iconify/LinearProccessing";
import { formatCurrency } from "../../../helpers/FormatCurrency";
import CircularLoading from "../../../../components/iconify/CircularLoading";

const ContractChildList = () => {
  const [dataListContractChild, setDataListContractChild] = useState([]);
  const [loading, setLoading] = useState(true);
  const { contractId } = useParams();
  const navigate = useNavigate();

  const fetchDataListContractChild = async () => {
    try {
      setLoading(true);
      const response = await getContractChild(contractId);
      setDataListContractChild(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateTicketSolution = () => {
    navigate("/home/createSolution");
  };

  useEffect(() => {
    fetchDataListContractChild();
  }, []);

  return (
    <>
      <MDBContainer className="py-5 custom-container">
        <MDBNavbar expand="lg" style={{ backgroundColor: "#3399FF" }}>
          <MDBContainer fluid style={{ color: "#FFFFFF" }}>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px", color: "#FFFFFF" }} />{" "}
              <span style={{ color: "#FFFFFF" }}>Contract Child</span>
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav">
              <MDBBtn
                color="#eee"
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: "#FFFFFF",
                }}
                onClick={() => handleOpenCreateTicketSolution()}
              >
                <FaPlus style={{ color: "#FFFFFF" }} />{" "}
                <span style={{ color: "#FFFFFF" }}>New</span>
              </MDBBtn>
              <MDBBtn
                color="#eee"
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: "#FFFFFF",
                }}
              >
                <DeleteForever style={{ color: "#FFFFFF" }} />{" "}
                <span style={{ color: "#FFFFFF" }}>Delete</span>
              </MDBBtn>
            </MDBNavbarNav>
          </MDBContainer>
        </MDBNavbar>
        <div>
          <MDBTable className="align-middle mb-0" responsive>
            <MDBTableHead className="bg-light">
              <tr>
                <th style={{ fontWeight: "bold", fontSize: "18px" }}>ID</th>
                <th style={{ fontWeight: "bold", fontSize: "14px" }}>Name</th>
                <th style={{ fontWeight: "bold", fontSize: "14px" }}>
                  Description
                </th>
                <th style={{ fontWeight: "bold", fontSize: "14px" }}>
                  From Date
                </th>
                <th style={{ fontWeight: "bold", fontSize: "14px" }}>
                  To Date
                </th>
                <th style={{ fontWeight: "bold", fontSize: "14px" }}>
                  Cost ($)
                </th>
                <th style={{ fontWeight: "bold", fontSize: "14px" }}>
                  Renewed Date
                </th>
                <th style={{ fontWeight: "bold", fontSize: "14px" }}>
                  Renewed By
                </th>
              </tr>
            </MDBTableHead>
            {loading ? (
              <MDBTableBody className="bg-light">
                <tr>
                  <td>
                    <CircularLoading />
                  </td>
                </tr>
              </MDBTableBody>
            ) : (
              <MDBTableBody className="bg-light">
                {dataListContractChild.map((ContractChild, index) => {
                  return (
                    <tr key={index}>
                      <td>{ContractChild.id}</td>
                      <td>{ContractChild.name}</td>
                      <td>{ContractChild.description}</td>
                      <td>{formatDate(ContractChild.startDate)}</td>
                      <td>{formatDate(ContractChild.endDate)}</td>
                      <td>{formatCurrency(ContractChild.value)}VND</td>
                      <td>{formatDate(ContractChild.createdAt)}</td>
                      <td>{formatDate(ContractChild.modifiedAt)}</td>
                    </tr>
                  );
                })}
              </MDBTableBody>
            )}
          </MDBTable>

          {dataListContractChild.length === 0 && !loading && (
            <Card style={{ height: "450px", width: "100%" }}>
              <CardContent style={{ marginRight: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <img
                    src={CloseTicket}
                    alt="No Solutions"
                    style={{ maxWidth: "350px", maxHeight: "300px" }}
                  />
                  <p
                    style={{
                      marginTop: "2px",
                      fontSize: "16px",
                      color: "#666",
                    }}
                  >
                    No Contracts Child Available
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </MDBContainer>
    </>
  );
};

export default ContractChildList;
