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
import "../../../assets/css/ticketCustomer.css";
import {
  ContentCopy,
  Lock,
  LockOpen,
  Square,
  ViewCompact,
} from "@mui/icons-material";
import { formatDate } from "../../helpers/FormatDate";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
import CustomizedProgressBars from "../../../components/iconify/LinearProccessing";
import CloseTicket from "../../../assets/images/NoTicketSolution.jpg";
import { getTicketAssignAvailable } from "../../../app/api/ticket";
import { getImpactById, getPriorityOption, getUrgencyById } from "../../helpers/tableComlumn";

const TicketAssignAvailableList = () => {
  const [dataListTicketsAssign, setDataListTicketsAssign] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDataListTicketSolution = async () => {
    try {
      setLoading(true);
      const response = await getTicketAssignAvailable();
      console.log(response);
      setDataListTicketsAssign(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateTicketSolution = () => {
    navigate("/home/createSolution");
  };

  const handleOpenDetailTicketSolution = (ticketId) => {
    navigate(`/home/detailTicket/${ticketId}`);
  };

  useEffect(() => {
    fetchDataListTicketSolution();
  }, [ refreshData]);

  return (
    <>
      <MDBContainer className="py-5 custom-container">
        <MDBNavbar expand="lg" style={{ backgroundColor: "#3399FF" }}>
          <MDBContainer fluid style={{ color: "#FFFFFF" }}>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px", color: "#FFFFFF" }} />{" "}
              <span style={{ color: "#FFFFFF" }}>All Ticket Assign</span>
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
            </MDBNavbarNav>
          </MDBContainer>
        </MDBNavbar>
        <div>
          <MDBTable className="align-middle mb-0" responsive>
            <MDBTableHead className="bg-light">
              <tr>
                <th
                  style={{ fontWeight: "bold", fontSize: "18px" }}
                >
                  ID
                </th>
                <th style={{ fontWeight: "bold", fontSize: "18px" }}>
                  <input
                    type="checkbox"
                  />
                </th>
                <th style={{ fontWeight: "bold", fontSize: "14px" }}></th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                >
                  Title{""}
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                >
                  Description
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                >
                  Priority
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                >
                  Impact
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                >
                  Urgency
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                >
                  Created
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                >
                  Last Update
                </th>
              </tr>
            </MDBTableHead>
            {loading ? (
              <CustomizedProgressBars />
            ) : (
              <MDBTableBody className="bg-light">
                {dataListTicketsAssign.map((TicketSolution, index) => {
                  return (
                    <tr key={index}>
                      <td>{TicketSolution.id}</td>
                      <td>
                        <input
                          type="checkbox"

                        />
                      </td>
                      <td>
                        <ViewCompact
                          onClick={() =>
                            handleOpenDetailTicketSolution(TicketSolution.id)
                          }
                        />{" "}
                      </td>
                      <td>{TicketSolution.title}</td>
                      <td>{TicketSolution.description}</td>
                      <td>{getPriorityOption(TicketSolution.priority)}</td>
                      <td>{getImpactById(TicketSolution.impact)}</td>
                      <td>{getUrgencyById(TicketSolution.urgency)}</td>
                      <td>{formatDate(TicketSolution.createdAt)}</td>
                      <td>{formatDate(TicketSolution.modifiedAt)}</td>
                    </tr>
                  );
                })}
              </MDBTableBody>
            )}
          </MDBTable>

          {dataListTicketsAssign.length === 0 && !loading && (
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
                    No Ticket Assign Available
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

export default TicketAssignAvailableList;
