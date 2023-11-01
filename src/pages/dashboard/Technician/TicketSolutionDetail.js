import React from "react";
import "../../../assets/css/ticket.css";
import "../../../assets/css/ServiceTicket.css";
import { Box, Grid, Tab, Tabs } from "@mui/material";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import { ArrowBack, Lock, Square, TipsAndUpdates } from "@mui/icons-material";
import CommentSolution from "./CommentSolution.js/CommentSolution";
import LoadingSkeleton from "../../../components/iconify/LoadingSkeleton";
import CountBox from "../../helpers/CountBox";
import useSolutionTicketData from "./SolutionTicketData";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../../helpers/FormatDate";
import HistorySolution from "./CommentSolution.js/HistorySolution";

const TicketSolutionDetail = () => {
  const [value, setValue] = React.useState(0);
  const {solutionId} = useParams();
  const navigate = useNavigate();
  const { loading ,data, error } = useSolutionTicketData(solutionId);
  const associationsRequesterCount = 42;
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleBackTicketSolution = () => {
    navigate('/home/ticketSolution'); 
  };

  if(loading) {
    return <LoadingSkeleton />;
  }

  const comments = [
    {
      id: 1,
      user: { name: 'John Doe', avatarUrl: 'url_to_avatar' },
      text: 'This is the first comment.',
      dateTime: 'Oct 30, 2023, 10:00 AM',
    },
  ];

  return (
    <Grid
      container
      style={{
        border: "1px solid #ccc",
        paddingRight: "10px",
        paddingLeft: "10px",
      }}
    >
      <Grid item xs={9} style={{ paddingRight: "12px"}}>
        <MDBCol md="12">
          <MDBRow className="border-box">
            <MDBCol md="1" className="mt-2">
              <div className="d-flex align-items-center">
                <button type="button" className="btn btn-link icon-label">
                  <ArrowBack onClick={handleBackTicketSolution}/>
                </button>
              </div>
            </MDBCol>
            <MDBCol md="2" className="mt-2">
              <div className="d-flex align-items-center">
                <button
                  type="button"
                  className="btn btn-link narrow-input icon-label"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-link narrow-input icon-label"
                >
                  Actions
                </button>
                {/* <Select
                  value={age}
                  onChange={handleChange}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  style={{
                    backgroundColor: "#f2f2f2",
                    borderRadius: "5px",
                    paddingLeft: "10px",
                    height: "40px", // Set the height of the select box
                    padding: "10px 0", // Set the top and bottom padding
                  }}
                >
                  <MenuItem value="">
                    <em>Actions</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select> */}
              </div>
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <MDBRow className="mb-4">
          <MDBCol
            md="6"
            className="mt-2"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div className="circular-container" style={{ marginRight: "10px" }}>
              <TipsAndUpdates size="2em" style={{ color: "#FFCC33" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ marginBottom: "5px", fontSize: "1.5em" }}>
                {data.title}
              </span>
              <span style={{ fontSize: "0.8em" }}>
                <span>Topic: </span> <span className="bold-text">Printers</span>{" "}
              </span>
            </div>
          </MDBCol>
        </MDBRow>
        <Grid item xs={12}>
          <textarea
            type="text"
            id="description"
            name="description"
            className="form-control input-field-2"
            rows="6"
            value={data.content}
          />
        </Grid>
        <Grid item xs={12}>
          <input
            type="file"
            name="file"
            className="form-control input-field"
            id="attachmentUrl"
            value={data.attachmentUrl}
          />
        </Grid>

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
            <Tab label="Feedback" className="custom-tab-label" />
            <Tab label="Keywords" className="custom-tab-label" />
            <Tab label="Associations" className="custom-tab-label" />
            <Tab label="History" className="custom-tab-label" />
          </Tabs>
          <Box role="tabpanel" hidden={value !== 0}>
          {value === 0 ? <CommentSolution comments={comments} /> : <LoadingSkeleton />}
          </Box>
          <Box role="tabpanel" hidden={value !== 1}>
          </Box>
          <Box role="tabpanel" hidden={value !== 2}>
          </Box>
          <Box role="tabpanel" hidden={value !== 3}>
          {value === 3 ? <HistorySolution /> : <LoadingSkeleton />}
          </Box>
        </Box>
      </Grid>
      <Grid item xs={3} style={{ paddingBottom: "10px", borderLeft: "1px solid #ccc", paddingLeft: "11px" }}>
        <MDBRow className="border-box">
          <MDBCol md="12">
            <div className="d-flex">
              <h2 className="heading-padding">Solution</h2>
            </div>
          </MDBCol>
        </MDBRow>
        <MDBRow className="mb-4 mt-4">
          <MDBRow className="mb-4">
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-3 ">Solution ID</div>
              <div className="data-col col-md-9">{data.id}</div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-3 ">Status</div>
              <div className="data-col col-md-9" ><Square className="square-icon" /> {data.isApproved ? "Approved" : "Not Approved"} </div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-3 ">Type</div>
              <div className="data-col col-md-9">Solution</div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-3 "> Visibility</div>
              <div className="data-col col-md-9"> <Lock className="square-icon" /> {data.isPublic ? "Public" : "Not Public"}</div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-3 ">Review Date</div>
              <div className="data-col col-md-9">{formatDate(data.reviewDate)}</div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-3 ">Expiry Date</div>
              <div className="data-col col-md-9">{formatDate(data.expiredDate)}</div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-3 ">Views</div>
              <div className="data-col col-md-9">1</div>
            </MDBCol>
          </MDBRow>
        </MDBRow>

        <MDBRow className="mb-4 mt-4" style={{ border: "1px solid #ccc", padding: "5px" }}>
          <MDBRow className="mb-4">
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-5 "style={{ fontWeight: "bold" }}>Created By</div>
            </MDBCol> 
            <MDBCol md="12" className="mt-2 text-box">
            <div className="label-col col-md-12"><span style={{ color: "#3399FF" }}>administrator</span> {formatDate(data.createdAt)}</div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-5 "style={{ fontWeight: "bold" }}>Last Updated By</div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
            <div className="label-col col-md-12"><span style={{ color: "#3399FF" }}>administrator</span> {formatDate(data.modifiedAt)}</div>
            </MDBCol>
          </MDBRow>
        </MDBRow>

        <MDBRow className="mb-4 mt-4" >
          <MDBRow className="mb-4">
            <MDBCol md="12" className="mt-2 text-box">
              <div className="col-md-5 " style={{ fontWeight: "bold" }}>Associations</div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
            <div className=" col-md-11">Associations Requester</div> 
            <CountBox  count={associationsRequesterCount} />
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="col-md-11">Associations Problems</div>
              <CountBox  count={associationsRequesterCount} />
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
            <div className="col-md-11">Linked Solutions</div>
            <CountBox  count={associationsRequesterCount} />
            </MDBCol>
          </MDBRow>
        </MDBRow>
      </Grid>
    </Grid>
  );
};

export default TicketSolutionDetail;
