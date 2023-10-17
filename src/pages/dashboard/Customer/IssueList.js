import {
  MDBContainer,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { getTicketByUserId } from "../../../app/api/ticket";
import { useSelector } from "react-redux";

const IssueList = ({ onClose }) => {
  const [dataListTickets, setDataListTickets] = useState([]);
  const user = useSelector((state) => state.auth);
  const getUserId = user.user.id;

  const fetchDataListTicket = async (id) => {
    try {
      const response = await getTicketByUserId(id);
      console.log(response);
      setDataListTickets(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataListTicket(getUserId);
  }, [getUserId]);

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5">
        <MDBTable className="align-middle mb-0" responsive>
          <MDBTableHead className="bg-light">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Create Time</th>
              <th>Processing</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {dataListTickets.map((ticket, index) => (
              <tr key={index}>
                <td>{ticket.title}</td>
                <td>{ticket.description}</td>
                <td>{ticket.category}</td>{" "}
                <td>{ticket.priority}</td>{" "}
                <td>{ticket.createdAt}</td>{" "}
                <td>
                  {ticket.ticketStatus === 0 ? "Not Processed" : "Processed"}
                </td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>
      </MDBContainer>
    </section>
  );
};

export default IssueList;
