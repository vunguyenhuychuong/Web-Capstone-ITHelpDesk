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
import React, { useCallback, useEffect, useState } from "react";
import { getAllTicket } from "../../../app/api/ticket";
import { getAllCategories } from "../../../app/api/category";
import "../../../assets/css/manager.css";
import { FaPlus, FaSearch } from "react-icons/fa";
import { ContentCopy } from "@mui/icons-material";
import CreateTicket from "./CreateTicket";
import { Box, Dialog, Pagination } from "@mui/material";

const IndexTicket = () => {
  const [dataTickets, setDataTickets] = useState([]);
  const [dataCategories, setDataCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAllTicket = useCallback(async () => {
    try {
      let filter = "";
      if (searchQuery) {
        filter = `title="${encodeURIComponent(searchQuery)}"`;
      }
      const res = await getAllTicket(searchQuery, currentPage, pageSize);
      setDataTickets(res);
      setIsLoading(false);
    } catch (error) {
      console.log("Error while fetching data", error);
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery]);

  const fetchAllCategories = async () => {
    try {
      const res = await getAllCategories();
      setDataCategories(res);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleChangePageSize = (event) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleOpenRequestTicket = (e) => {
    e.preventDefault();
    setDialogOpen(true);
  };

  const handleCloseRequestTicket = (e) => {
    e.preventDefault();
    setDialogOpen(false);
  };

  const getCategoryNameById = (categoryId) => {
    const category = dataCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  useEffect(() => {
    fetchAllTicket();
    fetchAllCategories();
    setTotalPages(4);
  }, [fetchAllTicket]);

  return (
    <section style={{ backgroundColor: "#FFF" }}>
      <MDBContainer
        className="py-5"
        style={{ paddingLeft: 20, paddingRight: 20, maxWidth: "100%" }}
      >
        <MDBNavbar expand="lg" light bgColor="inherit">
          <MDBContainer fluid>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px" }} /> All Request
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav">
              <MDBBtn
                color="#eee"
                style={{ fontWeight: "bold", fontSize: "20px" }}
                onClick={handleOpenRequestTicket}
              >
                <FaPlus /> New
              </MDBBtn>
              <div className="input-wrapper">
                <FaSearch id="search-icon" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-search"
                  placeholder="Type to search..."
                />
              </div>
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <label>Items per page: </label>
                <select value={pageSize} onChange={handleChangePageSize}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </MDBNavbarNav>
          </MDBContainer>
        </MDBNavbar>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <MDBTable
            className="align-middle mb-0"
            responsive
            style={{ border: "0.05px solid #50545c" }}
          >
            <MDBTableHead className="bg-light">
              <tr style={{ fontSize: "1.2rem" }}>
                <th style={{ fontWeight: "bold" }}>ID</th>
                <th style={{ fontWeight: "bold" }}>Subject</th>
                <th style={{ fontWeight: "bold" }}>Description</th>
                <th style={{ fontWeight: "bold" }}>Category</th>
                <th style={{ fontWeight: "bold" }}>Priority</th>
                <th style={{ fontWeight: "bold" }}>Status</th>
                <th style={{ fontWeight: "bold" }}>CreatedDate</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody className="bg-light">
              {dataTickets.map((ticket, index) => {
                const createdAtDate = new Date(ticket.createdAt);
                const formattedDate = `${String(
                  createdAtDate.getDate()
                ).padStart(2, "0")}/${String(
                  createdAtDate.getMonth() + 1
                ).padStart(2, "0")}/${createdAtDate.getFullYear()} ${String(
                  createdAtDate.getHours()
                ).padStart(2, "0")}:${String(
                  createdAtDate.getMinutes()
                ).padStart(2, "0")}`;

                return (
                  <tr key={index}>
                    <td>{ticket.requesterId}</td>
                    <td>{ticket.title}</td>
                    <td>{ticket.description}</td>
                    <td>{getCategoryNameById(ticket.categoryId)}</td>
                    <td>
                      {ticket.priority === 0 ? (
                        <span className="badge bg-primary rounded-pill">
                          Low
                        </span>
                      ) : ticket.priority === 1 ? (
                        <span className="badge bg-info rounded-pill">
                          Normal
                        </span>
                      ) : ticket.priority === 2 ? (
                        <span className="badge bg-secondary rounded-pill">
                          Medium
                        </span>
                      ) : ticket.priority === 3 ? (
                        <span className="badge bg-warning rounded-pill">
                          High
                        </span>
                      ) : (
                        <span className="badge bg-danger rounded-pill">
                          Critical
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          ticket.ticketStatus === 0
                            ? "bg-secondary"
                            : "bg-success"
                        } rounded-pill`}
                      >
                        {ticket.ticketStatus === 0
                          ? "Not Processed"
                          : "Processed"}
                      </span>
                    </td>
                    <td>{formattedDate}</td>
                  </tr>
                );
              })}
            </MDBTableBody>
          </MDBTable>
        )}
      </MDBContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
        />
      </Box>
      <Dialog
        maxWidth="lg"
        fullWidth
        open={dialogOpen}
        onClose={handleCloseRequestTicket}
      >
        <CreateTicket onClose={handleCloseRequestTicket} />
      </Dialog>
    </section>
  );
};

export default IndexTicket;
