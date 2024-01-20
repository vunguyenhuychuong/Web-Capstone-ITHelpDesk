import React, { useEffect, useState } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import { FaAddressCard, FaFileContract } from "react-icons/fa";
import {
  ArrowBack,
  ChatOutlined,
  ContactMail,
  Group,
  Paid,
  ReceiptLong,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import { getCompanyById } from "../../../app/api/company";
import { toast } from "react-toastify";
import CircularLoading from "../../../components/iconify/CircularLoading";
import { truncateUrl } from "../../helpers/FormatText";
import CompanyAddress from "./CompanyAddress";
import LoadingSkeleton from "../../../components/iconify/LoadingSkeleton";
import CompanyMembers from "./CompanyMembers";

const CompanyDetail = () => {
  const { companyId } = useParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    id: null,
    companyName: "",
    taxCode: "",
    phoneNumber: "",
    email: "",
    website: "",
    companyAddress: "",
    logoUrl: "",
    fieldOfBusiness: "",
    isActive: true,
    customerAdminId: "",
  });

  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const userRole = user.user.role;
  const fetchCompanyData = async () => {
    setLoading(true);
    try {
      const res = await getCompanyById(companyId);
      setData((prevData) => ({
        ...prevData,
        id: res.id,
        companyName: res.companyName,
        taxCode: res.taxCode,
        phoneNumber: res.phoneNumber,
        email: res.email,
        website: res.website,
        companyAddress: res.companyAddress,
        logoUrl: res.logoUrl,
        fieldOfBusiness: res.fieldOfBusiness,
        isActive: res.isActive,
        // customerAdminId: res.customerAdminId,
      }));
    } catch (error) {
      toast.error("Can not get company");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCompanyData();
  }, [companyId]);
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpenEditCompany = (companyId) => {
    navigate(`/home/editCompany/${companyId}`);
  };

  const handleGoBack = () => {
    navigate(`/home/companyList`);
  };
  useEffect(() => {
    setValue(0);
  }, []);

  if (loading) {
    return <CircularLoading></CircularLoading>;
  }

  return (
    <>
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
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            sx={{
              backgroundColor: "#EEEEEE",
              padding: 0.75,
            }}
            spacing={2}
          >
            <Button
              sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: "5px",
              }}
              onClick={handleGoBack}
            >
              <ArrowBack />
            </Button>

            <Button
              sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: "5px",
              }}
              onClick={() => handleOpenEditCompany(companyId)}
            >
              Edit
            </Button>
          </Stack>

          <MDBRow className="mb-2">
            <Typography
              variant="h5"
              sx={{ borderBottom: "solid 1px #000", py: 1 }}
            >
              Company Detail
            </Typography>
            <MDBCol
              md="12"
              className="mt-2"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div
                className="circular-container"
                style={{ margin: 10, padding: 40 }}
              >
                <img
                  alt="company-logo"
                  src={
                    data.logoUrl ??
                    "https://cdn-icons-png.flaticon.com/512/1630/1630842.png"
                  }
                  style={{ width: 50, height: "auto" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span>
                  Company Name:
                  <span style={{ fontWeight: "bold" }}>{data.companyName}</span>
                </span>
                <span>
                  Email:
                  <span style={{ fontWeight: "bold" }}>{data.email}</span>
                </span>
                <span>
                  Website:
                  <a
                    href={data.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-toggle="tooltip"
                    data-placement="top"
                    title={data.website}
                  >
                    {truncateUrl(data.website, 30)}
                  </a>
                </span>
                <span>
                  Business Field:
                  <span style={{ fontWeight: "bold" }}>
                    {data.fieldOfBusiness}
                  </span>
                </span>
                <span>
                  Tax Code:
                  <span style={{ fontWeight: "bold" }}>{data.taxCode}</span>
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
                    <ContactMail sx={{ marginRight: 1 }} /> Address
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
                    <Group sx={{ marginRight: 1 }} /> Members
                  </div>
                }
                className="custom-tab-label"
              />
            </Tabs>
            <Box role="tabpanel" hidden={value !== 0}>
              {value === 0 ? (
                <CompanyAddress data={data} refetch={fetchCompanyData} />
              ) : (
                <LoadingSkeleton />
              )}
            </Box>
            <Box role="tabpanel" hidden={value !== 1}>
              {value === 1 ? (
                <CompanyMembers data={data} />
              ) : (
                <LoadingSkeleton />
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default CompanyDetail;
