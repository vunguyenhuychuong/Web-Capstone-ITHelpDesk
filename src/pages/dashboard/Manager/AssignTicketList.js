import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import React, { useState } from "react";
import { Badge, ContentCopy, Edit } from "@mui/icons-material";
import { getAllAssigns } from "../../../app/api/assign";
import { useEffect } from "react";
import { getTicketByTicketId } from "../../../app/api/ticket";
import { TicketStatusOptions, mapTicketStatusToColor } from "../Admin/tableComlumn";
const AssignTicketList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dataAssign, setDataAssign] = useState([]);
  const [dataTicket, setDataTicket] = useState([]);
  const fetchAllTicketAssign = async () => {
    try {
      const assigns = await getAllAssigns();
      const assignsWithTickets = await Promise.all(
        assigns.map(async (assign) => {
          const ticket = await getTicketByTicketId(assign.ticketId);
          return {
            ...assign,
            title: ticket.title,
            ticketStatus: ticket.ticketStatus,
          };
        })
      );
      setDataAssign(assignsWithTickets);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTicketAssign();
  }, []);

  return (
    <section style={{ backgroundColor: "#FFF" }}>
      <MDBContainer
        className="py-5"
        style={{ paddingLeft: 20, paddingRight: 20, maxWidth: "100%" }}
      >
        <MDBNavbar expand="lg" light bgColor="inherit">
          <MDBContainer fluid>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px" }} /> All Assign
            </MDBNavbarBrand>
          </MDBContainer>
        </MDBNavbar>
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
              <th style={{ fontWeight: "bold" }}>Change</th>
              <th style={{ fontWeight: "bold" }}>Ticket Name</th>
              <th style={{ fontWeight: "bold" }}>Technician Name</th>
              <th style={{ fontWeight: "bold" }}>Team Name</th>
              <th style={{ fontWeight: "bold" }}>Status</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody className="bg-light">
            {dataAssign.map((assign, index) => {
              return (
                <tr key={index}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>
                    <Edit />
                  </td>
                  <td>{assign.title}</td>
                  <td>{assign.technicianFullName}</td>
                  <td>{assign.teamName}</td>
                  <td>
                  {TicketStatusOptions.find(option => option.id === assign.ticketStatus)?.name || 'Unknown Status'}
                </td>
                </tr>
              );
            })}
          </MDBTableBody>
          <MDBTableBody className="bg-light"></MDBTableBody>
        </MDBTable>
      </MDBContainer>
    </section>
  );
};

export default AssignTicketList;
