import React, { useEffect, useState } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import "../../../../assets/css/ticket.css";
import "../../../../assets/css/EditTicket.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import { FaFileContract } from "react-icons/fa";
import {
  ArrowBack,
  ChatOutlined,
  Newspaper,
  Paid,
  Receipt,
  ReceiptLong,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import AssignTicketModal from "../AssignTicketModal";
import { Grid, MenuItem, Select, Tab, Tabs } from "@mui/material";
import { formatDate } from "../../../helpers/FormatDate";
import { Box } from "@mui/system";
import LoadingSkeleton from "../../../../components/iconify/LoadingSkeleton";
import { useSelector } from "react-redux";
import useContractData from "./useContractData";
import PaymentContract from "./PaymentContract";
import Details from "./Details";
import usePaymentData from "./usePaymentData";
import ContractChildList from "./ContractChildList";
import ContractRenew from "./ContractRenew";
import { getStatusContract } from "../../../helpers/tableComlumn";

const DetailContract = () => {
  const { contractId } = useParams();
  const { data, loading, setData } = useContractData(contractId);
  const { dataPayment, setDataPayment } = usePaymentData(contractId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const userRole = user.user.role;
  const [selectedValue, setSelectedValue] = useState("");

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpenEditTicket = (contractId) => {
    navigate(`/home/editContract/${contractId}`);
  };

  const handleCloseAssignTicket = () => {
    setDialogOpen(false);
  };

  const handleGoBack = () => {
    if (userRole === 2) {
      navigate(`/home/contractList`);
    } else if (userRole === 4) {
      navigate(`/home/contractList`);
    }
  };

  useEffect(() => {
    setValue(0);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <section style={{ backgroundColor: "#fff" }}>
      <Grid
        container
        style={{
          border: "1px solid #ccc",
          paddingRight: "10px",
          paddingLeft: "10px",
        }}
      >
        <Grid
          item
          style={{
            flex: 1,
            paddingLeft: "10px",
          }}
        >
          <MDBCol md="12">
            <MDBRow className="border-box-detail">
              <MDBCol md="1" className="mt-2">
                <div className="d-flex align-items-center">
                  <button type="button" className="btn btn-link icon-label">
                    <ArrowBack onClick={handleGoBack} />
                  </button>
                </div>
              </MDBCol>
              <MDBCol md="2">
                <div className="d-flex align-items-center">
                  <button
                    type="button"
                    className="btn btn-link narrow-input icon-label mt-2"
                    onClick={() => handleOpenEditTicket(contractId)}
                  >
                    Edit
                  </button>
                  <Select
                    displayEmpty
                    value={selectedValue}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "Without label" }}
                    style={{
                      backgroundColor: "#f2f2f2",
                      borderRadius: "5px",
                      paddingLeft: "10px",
                      height: "45px",
                      padding: "10px 0",
                      zIndex: 9999,
                    }}
                  >
                    {selectedValue !== "" ? null : (
                      <MenuItem value="" disabled>
                        <em className="action-menu-item">Action</em>
                      </MenuItem>
                    )}

                    <MenuItem value={10}>Renew Contract</MenuItem>

                    {userRole === 2 && [
                      <MenuItem key={20} value={20}>
                        Add Child Contract
                      </MenuItem>,
                      <MenuItem key={30} value={30}>
                        Add Payment Information
                      </MenuItem>,
                    ]}
                  </Select>
                </div>
              </MDBCol>
            </MDBRow>
          </MDBCol>
          <MDBRow className="mb-4">
            <MDBCol
              md="12"
              className="mt-2"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div
                className="circular-container"
                style={{ marginRight: "10px" }}
              >
                <FaFileContract size="2em" color="#007bff" />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ marginBottom: "5px", fontSize: "1.5em" }}>
                  #{data.id} {data.name || "null Name"}
                </span>
                <span style={{ fontSize: "1rem" }}>
                  Status: <span style={{ color: "red" }}>{getStatusContract(data.status)}</span>
                  <span className="bold-text"></span>{" "}
                  <ChatOutlined color="#007bff" />
                  <span className="bold-text"> Valid till:</span>{" "}
                  {formatDate(data.endDate)}
                </span>
              </div>
            </MDBCol>
          </MDBRow>
          <Box sx={{ width: "100%" }}>
            <Tabs
              onChange={handleTabChange}
              value={value}
              aria-label="Tabs where selection follows focus"
              selectionFollowsFocus
              sx={{
                "& .MuiTabs-root": {
                  color: "#007bff",
                },
              }}
            >
              <Tab
                label={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textTransform: "none",
                    }}
                  >
                    <ReceiptLong sx={{ marginRight: 1 }} /> Contract Details
                  </div>
                }
                className="custom-tab-label"
              />
              <Tab
                label={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textTransform: "none",
                    }}
                  >
                    <Paid sx={{ marginRight: 1 }} /> Payment
                  </div>
                }
                className="custom-tab-label"
              />
              <Tab
                label={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textTransform: "none",
                    }}
                  >
                    <Receipt sx={{ marginRight: 1 }} /> Child Contract
                  </div>
                }
                className="custom-tab-label"
              />
              <Tab
                label={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textTransform: "none",
                    }}
                  >
                    <Newspaper sx={{ marginRight: 1 }} /> Renewal Details
                  </div>
                }
                className="custom-tab-label"
              />
            </Tabs>
            <Box role="tabpanel" hidden={value !== 0}>
              {value === 0 ? (
                <Details data={data} loading={loading || false} />
              ) : (
                <LoadingSkeleton />
              )}
            </Box>
            <Box role="tabpanel" hidden={value !== 1}>
              {value === 1 ? (
                <PaymentContract
                  dataPayment={dataPayment}
                  loading={loading || false}
                />
              ) : (
                <LoadingSkeleton />
              )}
            </Box>
            <Box role="tabpanel" hidden={value !== 2}>
              {value === 2 ? <ContractChildList /> : <LoadingSkeleton />}
            </Box>
            <Box role="tabpanel" hidden={value !== 3}>
              {value === 3 ? <ContractRenew /> : <LoadingSkeleton />}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <AssignTicketModal
        open={dialogOpen}
        onClose={handleCloseAssignTicket}
        ticketId={contractId}
      />
    </section>
  );
};

export default DetailContract;
