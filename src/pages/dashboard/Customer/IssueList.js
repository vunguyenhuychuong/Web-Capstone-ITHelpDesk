import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { getTicketByUserId } from "../../../app/api/ticket";
import { TicketStatusOptions } from "../Admin/tableComlumn";
import CategoryApi from "../../../app/api/category";
import { Edit } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { Dialog } from "@mui/material";
import { FaArrowLeft } from "react-icons/fa";
import ChangeIssues from "./ChangeIssues";

const IssueList = () => {
  const [dataListTickets, setDataListTickets] = useState([]);
  const [dataCategories, setDataCategories] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const user = useSelector((state) => state.auth);
  const userId = user.user.id;

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCloseChangeTicket = () => {
    setDialogOpen(false);
  };

  const fetchDataListTicket = async (userId) => {
    try {
      const response = await getTicketByUserId(userId);
      console.log(response);
      setDataListTickets(response);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategoriesList = async () => {
    try {
      const fetchCategories = await CategoryApi.getAllCategories();
      setDataCategories(fetchCategories);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };

  const handleOpenDialog = (ticketId) => {
    setSelectedTicketId(ticketId);
    setDialogOpen(true);
  };

  const getCategoryName = (categoryId) => {
    const category = dataCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const getStatusName = (statusId) => {
    const statusOption = TicketStatusOptions.find(
      (option) => option.id === statusId
    );
    return statusOption ? statusOption.name : "Unknown Status";
  };

  const getPriorityBadge = (priorityId) => {
    if (priorityId === 0) {
      return <span className="badge bg-primary rounded-pill">Low</span>;
    } else if (priorityId === 1) {
      return <span className="badge bg-info rounded-pill">Normal</span>;
    } else if (priorityId === 2) {
      return <span className="badge bg-secondary rounded-pill">Medium</span>;
    } else if (priorityId === 3) {
      return <span className="badge bg-warning rounded-pill">High</span>;
    } else {
      return <span className="badge bg-danger rounded-pill">Critical</span>;
    }
  };

  useEffect(() => {
    fetchDataListTicket(userId);
    fetchCategoriesList();
  }, [userId]);

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5">
        <MDBTable className="align-middle mb-0" responsive>
          <MDBTableHead className="bg-light">
            <tr>
              <th
                style={{ fontWeight: "bold", fontSize: "18px" }}>Edit</th>
               <th style={{ fontWeight: "bold", fontSize: "18px" }}>Title</th>
              <th style={{ fontWeight: "bold", fontSize: "18px" }}>
                Description
              </th>
              <th style={{ fontWeight: "bold", fontSize: "18px" }}>Category</th>
              <th style={{ fontWeight: "bold", fontSize: "18px" }}>Priority</th>
              <th style={{ fontWeight: "bold", fontSize: "18px" }}>
                Create Time
              </th>
              <th style={{ fontWeight: "bold", fontSize: "18px" }}>
                Processing
              </th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {dataListTickets.map((ticket, index) => (
              <tr key={index}>
                <td style={{ cursor: 'pointer' }} onClick={() => handleOpenDialog(ticket.id)}>
                  
                  <Edit />
                </td>
                <td>{ticket.title}</td>
                <td>{ticket.description}</td>
                <td>{getCategoryName(ticket.categoryId)}</td>
                <td>{getPriorityBadge(ticket.priority)}</td>
                <td>{ticket.createdAt}</td>
                <td>{getStatusName(ticket.ticketStatus)}</td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>
      </MDBContainer>
      <Dialog
        maxWidth="lg"
        fullWidth
        open={dialogOpen}
        onClose={handleCloseChangeTicket}
      >
        <section style={{ backgroundColor: "#C0C0C0" }}>
          <MDBContainer className="py-5">
            <MDBRow className="mb-4 custom-padding">
              <MDBCol className="text-left-corner d-flex align-items-center">
                <button className="btn btn-light">
                  <FaArrowLeft style={{ fontSize: 20 }} />
                </button>
                <h2
                  className="ms-3"
                  style={{ fontFamily: "Arial, sans-serif" }}
                >
                  Change Request
                </h2>
              </MDBCol>
            </MDBRow>
            <ChangeIssues onClose={() => setDialogOpen(false)}  ticketId={selectedTicketId}/>
          </MDBContainer>
        </section>
      </Dialog>
    </section>
  );
};

export default IssueList;
