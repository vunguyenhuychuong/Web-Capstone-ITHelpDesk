import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import React, { useState } from "react";
import { ContentCopy, Edit } from "@mui/icons-material";
import { useEffect } from "react";
import { getAllTicketSolutions } from "../../../app/api/ticketSolution";
import { formatDate } from "../../helpers/FormatDate";
import CustomizedProgressBars from "../../../components/iconify/LinearProccessing";
import CloseTicket from "../../../assets/images/NoTicketSolution.jpg";
import { Card, CardContent } from "@mui/material";
const TicketSolution = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dataTicketSolution, setDataTicketSolution] = useState([]);
  const fetchAllTicketSolutions = async () => {
    setIsLoading(true);
    try {
      const res = await getAllTicketSolutions();
      setDataTicketSolution(res.result);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTicketSolutions();
  }, []);

  useEffect(() => {
    if (dataTicketSolution.length > 0) {
      setIsLoading(false);
    }
  }, [dataTicketSolution]);

  return (
    <>
      <MDBContainer
        className="py-5"
        style={{ paddingLeft: 20, paddingRight: 20, maxWidth: "100%" }}
      >
        <MDBNavbar expand="lg" style={{ backgroundColor: "#3399FF" }}>
          <MDBContainer fluid>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "16px" }}>
              <ContentCopy style={{ marginRight: "20px", color: "#FFFFFF" }} />{" "}
              <span style={{ color: "#FFFFFF" }}>All Ticket Solution</span>
            </MDBNavbarBrand>
          </MDBContainer>
        </MDBNavbar>
        {isLoading ? (
          <CustomizedProgressBars />
        ) : (
          <>
            {dataTicketSolution && dataTicketSolution.length === 0 ? (
              <Card
                className="dashboard-card"
                style={{ height: "150px", marginLeft: "20px" }}
              >
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
                      alt="No Pending"
                      style={{ maxWidth: "50px", maxHeight: "50px" }}
                    />
                    <p
                      style={{
                        marginTop: "2px",
                        fontSize: "16px",
                        color: "#666",
                      }}
                    >
                      No Ticket Solutions Available
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <MDBTable
                className="align-middle mb-0"
                responsive
                style={{ border: "0.05px solid #50545c" }}
              >
                <MDBTableHead className="bg-light">
                  <tr style={{ fontSize: "1.2rem" }}>
                    <th style={{ fontWeight: "bold" }}>
                      <input type="checkbox" />
                    </th>
                    <th style={{ fontWeight: "bold" }}>Detail</th>

                    <th style={{ fontWeight: "bold" }}>Title</th>
                    <th style={{ fontWeight: "bold" }}>Content</th>
                    <th style={{ fontWeight: "bold" }}>Category</th>
                    <th style={{ fontWeight: "bold" }}>Owner</th>
                    <th style={{ fontWeight: "bold" }}>ReviewDate</th>
                    <th style={{ fontWeight: "bold" }}>ExpireDate</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody className="bg-light">
                  {dataTicketSolution.map((solution, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td>
                          <Edit />
                        </td>
                        <td>{solution.title}</td>
                        <td>{solution.content}</td>
                        <td>{solution.categoryId}</td>
                        <td>{solution.ownerId}</td>
                        <td>{formatDate(solution.reviewDate)}</td>
                        <td>{formatDate(solution.expiredDate)}</td>
                      </tr>
                    );
                  })}
                </MDBTableBody>
                <MDBTableBody className="bg-light"></MDBTableBody>
              </MDBTable>
            )}
          </>
        )}
      </MDBContainer>
    </>
  );
};

export default TicketSolution;
