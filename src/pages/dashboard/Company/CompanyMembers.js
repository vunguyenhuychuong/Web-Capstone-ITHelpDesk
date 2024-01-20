import React from "react";
import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { useState } from "react";

import { useParams } from "react-router-dom";
import { useEffect } from "react";

import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import { ControlPoint, RemoveCircleOutline } from "@mui/icons-material";
import { getCompanyMemberList } from "../../../app/api/companyMember";

const CompanyMembers = ({ data }) => {
  const [dataMembers, setDataMembers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const [dataSelectedService, setDataSelectedService] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const selectServiceAdd = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await getCompanyMemberList();
      if (!res || res.length === 0) {
        setErrorMessage("No data available.");
      } else {
        const companyMemberList = res?.data.filter(
          (company) => company.companyId === data.id
        );
        setDataMembers(companyMemberList);
      }
    } catch (error) {
      console.log("Error fetching contract data: ", error);
      setErrorMessage("Failed to fetch contract data. Please try again later.");
    }
  };

  const handleDelete = async (selectedRows) => {
    console.log("Deleting selected rows:", selectedRows);
    try {
      //   await deleteContractService(selectedRows);
      fetchData();
    } catch (error) {
      console.error("Error deleting contract services:", error);
    }
  };
  const formattedDataCompanyMembers = dataMembers?.map((companyMember) => ({
    id: companyMember.id,
    memberId: companyMember.memberId ?? "",
    firstName: companyMember.member?.firstName ?? "",
    lastName: companyMember.member?.lastName ?? "",
    username: companyMember.member?.username ?? "",
    email: companyMember.member?.email ?? "",
    isAdmin: companyMember.isCompanyAdmin ?? "",
  }));

  const columns = [
    // { field: "id", headerName: "ID", width: 200 },
    {
      field: "email",
      headerName: "Email",
      width: 350,
      editable: true,
    },
    {
      field: "firstName",
      headerName: "Name",
      width: 350,
      editable: true,
    },
    {
      field: "isAdmin",
      headerName: "Role",
      width: 500,
      editable: true,
      renderCell: (params) => (
        <Typography>{params.row.isAdmin ? "Admin" : "Member"}</Typography>
      ),
    },
    // {
    //   field: "delete",
    //   headerName: "Delete",
    //   width: 100,
    //   renderCell: (params) => (
    //     <IconButton onClick={() => handleDelete([params.id])} color="secondary">
    //       <Delete />
    //     </IconButton>
    //   ),
    // },
  ];
  useEffect(() => {
    if (data.id !== null) {
      fetchData();
    }
  }, [data]);

  return (
    <div>
      <Grid container spacing={2} alignItems="center" className="gridContainer">
        <Grid item xs={12}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            className="gridContainer"
          >
            <Grid item xs={12}>
              <Table
                style={{
                  marginTop: "20px",
                  border: "1px solid #000",
                }}
              >
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + 1}
                      style={{
                        background: "#EEEEEE",
                        textAlign: "left",
                        fontSize: "18px",
                        borderBottom: "2px solid #CCCCCC",
                        fontWeight: "bold",
                      }}
                    >
                      Company's Members
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {formattedDataCompanyMembers?.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "100px",
                  }}
                >
                  {/* <img
                    src={MyTask}
                    alt="No Pending"
                    style={{ maxWidth: "350px", maxHeight: "220px" }}
                  /> */}
                  <p
                    style={{
                      marginTop: "10px",
                      fontSize: "16px",
                      color: "#666",
                    }}
                  >
                    There is no member added yet
                  </p>
                </div>
              ) : (
                <DataGrid
                  rows={formattedDataCompanyMembers}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  //   checkboxSelection
                  disableRowSelectionOnClick
                  onSelectionModelChange={(newSelection) => {
                    const selectedRows = newSelection?.map((selectedId) => {
                      const selectedRow = formattedDataCompanyMembers.find(
                        (row) => row.id === selectedId
                      );
                      return selectedRow;
                    });
                    console.log("Selected Rows:", selectedRows);
                  }}
                />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default CompanyMembers;
