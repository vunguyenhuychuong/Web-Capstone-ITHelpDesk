import {
  MDBContainer,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { getAllTicket } from "../../../app/api/ticket";
import { getAllCategories } from "../../../app/api/category";

const IndexTicket = () => {
  const [dataTickets, setDataTickets] = useState([]);
  const [dataCategories, setDataCategories] = useState([]);

  const fetchAllTicket = async () => {
    try {
      const res = await getAllTicket();
      setDataTickets(res);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const res = await getAllCategories();
      setDataCategories(res);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };

  const getCategoryNameById = (categoryId) => {
    const category = dataCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  useEffect(() => {
    fetchAllTicket();
    fetchAllCategories();
  }, []);

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5">
        <MDBTable className="align-middle mb-0" responsive style={{ border: "0.05px solid #50545c" }}>
          <MDBTableHead className="bg-light">
            <tr style={{fontSize: "1.2rem" }}>
              <th style={{ fontWeight: "bold"}}>Title</th>
              <th style={{ fontWeight: "bold"}}>Description</th>
              <th style={{ fontWeight: "bold"}}>Category</th>
              <th style={{ fontWeight: "bold"}}>Priority</th>
              <th style={{ fontWeight: "bold"}}>Processing</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody className="bg-light">
            {dataTickets.map((ticket, index) => (
              <tr key={index}>
                <td>{ticket.title}</td>
                <td>{ticket.description}</td>
                <td>{getCategoryNameById(ticket.categoryId)}</td>
                <td>
                  {ticket.priority === 0 ? (
                    <span className="badge bg-primary rounded-pill">Low</span>
                  ) : ticket.priority === 1 ? (
                    <span className="badge bg-warning rounded-pill">
                      Normal
                    </span>
                  ) : ticket.priority === 2 ? (
                    <span className="badge bg-info rounded-pill">High</span>
                  ) : (
                    <span className="badge bg-danger rounded-pill">
                      Critical
                    </span>
                  )}
                </td>
                <td>
                  <span
                    className={`badge ${
                      ticket.ticketStatus === 0 ? "bg-secondary" : "bg-success"
                    } rounded-pill`}
                  >
                    {ticket.ticketStatus === 0 ? "Not Processed" : "Processed"}
                  </span>
                </td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>
      </MDBContainer>
    </section>
  );
};

export default IndexTicket;
