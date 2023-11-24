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
import {
  ContentCopy,
  DeleteForever,
  ViewCompact,
} from "@mui/icons-material";
import { formatDate } from "../../../helpers/FormatDate";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
import CloseTicket from "../../../../assets/images/NoTicketSolution.jpg";
import { getContractChild, getContractRenew } from "../../../../app/api/contract";
import CustomizedProgressBars from "../../../../components/iconify/LinearProccessing";
import { formatCurrency } from "../../../helpers/FormatCurrency";


const ContractRenew = () => {
  const [dataListContractRenew, setDataListContractRenew] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [loading, setLoading] = useState(true);
  const { contractId } = useParams();
  const navigate = useNavigate();

  const fetchDataListContractRenew = async () => {
    try {
      setLoading(true);
      const response = await getContractRenew(contractId);
      setDataListContractRenew(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // const handleDeleteSelectedContractChilds = (id) => {
  //   try {
  //     console.log("Deleting selected solutions...");

  //     if (selectedContractChildIds.length === 0) {
  //       console.log("No selected solutions to delete.");
  //       return;
  //     }

  //     let currentIndex = 0;

  //     const deleteNextSolution = () => {
  //       if (currentIndex < selectedContractChildIds.length) {
  //         const contractId = selectedContractChildIds[currentIndex];

  //         deleteTicketSolution(contractId)
  //           .then(() => {
  //             console.log(
  //               `Solution with ID ${contractId} deleted successfully`
  //             );
  //             currentIndex++;
  //             deleteNextSolution();
  //           })
  //           .catch((error) => {
  //             console.error(
  //               `Error deleting solution with ID ${contractId}: `,
  //               error
  //             );
  //             toast.error(
  //               `Error deleting solution with ID ${contractId}: `,
  //               error
  //             );
  //           });
  //       } else {
  //         setSelectedContractChildIds([]);
  //         toast.success("Selected solutions deleted successfully");
  //         setRefreshData((prev) => !prev);
  //       }
  //     };

  //     deleteNextSolution();
  //   } catch (error) {
  //     console.error("Failed to delete selected solutions: ", error);
  //     toast.error(
  //       "Failed to delete selected solutions, Please try again later"
  //     );
  //   }
  // };

  const handleOpenCreateTicketSolution = () => {
    navigate("/home/createSolution");
  };

  useEffect(() => {
    fetchDataListContractRenew();
  }, [refreshData]);

  return (
    <>
      <MDBContainer className="py-5 custom-container">
        <MDBNavbar expand="lg" style={{ backgroundColor: "#3399FF" }}>
          <MDBContainer fluid style={{ color: "#FFFFFF" }}>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px", color: "#FFFFFF" }} />{" "}
              <span style={{ color: "#FFFFFF" }}>Contract Renew</span>
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
              <CustomizedProgressBars />
            ) : (
              <MDBTableBody className="bg-light">
                {dataListContractRenew.map((ContractChild, index) => {
                  return (
                    <tr key={index}>
                      <td>{ContractChild.id}</td>
                      <td>{ContractChild.description}</td>
                      <td>{formatDate(ContractChild.fromDate)}</td>
                      <td>{formatDate(ContractChild.toDate)}</td>
                      <td>{formatCurrency(ContractChild.value)}VND</td>
                      <td>{formatDate(ContractChild.renewedDate)}</td>
                      <td>{formatDate(ContractChild.renewedById)}</td>
                    </tr>
                  );
                })}
              </MDBTableBody>
            )}
          </MDBTable>

          {dataListContractRenew.length === 0 && !loading && (
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

export default ContractRenew;
