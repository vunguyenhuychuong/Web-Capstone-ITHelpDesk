import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import React, { useState } from "react";

import { ContentCopy } from "@mui/icons-material";

import LoadingSkeleton from "../../../components/iconify/LoadingSkeleton";

const AssignTicketList = () => {
  const [isLoading, setIsLoading] = useState(true);

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
                <th style={{ fontWeight: "bold" }}>Edit</th>
                <th style={{ fontWeight: "bold" }}>ID </th>
                <th style={{ fontWeight: "bold" }}>Title </th>
                <th style={{ fontWeight: "bold" }}>Description </th>
                <th style={{ fontWeight: "bold" }}>Category </th>
                <th style={{ fontWeight: "bold" }}>Priority </th>
                <th style={{ fontWeight: "bold" }}>Status </th>
                <th style={{ fontWeight: "bold" }}>Date </th>
              </tr>
            </MDBTableHead>
            <MDBTableBody className="bg-light"></MDBTableBody>
          </MDBTable>
        </MDBContainer>
    </section>
  );
};

export default AssignTicketList;
