import * as React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  Paper,
  Button,
  DialogContent,
  TableRow,
  TableSortLabel,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TextField,
  TablePagination
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { AddDataProfile, DeleteDataUser, getAllUser } from "../../app/api";
import { toast } from "react-toastify";
import { headCells } from "./Admin/tableComlumn";


function EnhancedTableHead(props) {
  const { order, orderBy } = props;
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">STT</TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function Customer() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowPerPage] = useState(5);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);


  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    role: 0,
    birth: "",
    gender: 0,
  });

  const fetchDataUser = async () => {
    try {
      const UserList = await getAllUser({ page, rowsPerPage });
      setUsers(UserList);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };

  useEffect(() => {
    fetchDataUser();
  }, []);

  const onCreateUser = async (e) => {
    e.preventDefault();
    try {
      const result = await AddDataProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        password: data.password,
        email: data.email,
        role: data.role,
        birth: data.birth,
        gender: data.gender,
      });
      if (result.isError === false) {
        setData({
          firstName: "",
          lastName: "",
          username: "",
          password: "",
          email: "",
          role: 0,
          birth: "",
          gender: 0,
        });
        toast.success("User created successfully");
        setOpenAdd(false);
        fetchDataUser();
      }else{
        toast.error("Fail to create user");
        console.log('error', result.message);
      }
    } catch (error) {
      toast.error("Error");
      console.log("Please check data input", error);
    }
  };

  const onDeleteUser = async (id) => {
    const shouldDelete = window.confirm("Are you sure you want to delete?");
    if(shouldDelete) {
      try{
        const result = await DeleteDataUser(id);
        fetchDataUser();
        if(result.isError === false) {
          toast.message("Delete successful");
        }else{
          toast.message("Delete fail");
        }
      }catch(error) {
        console.log(error);
      }
    }
  }

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (e) => {
    setRowPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setOpen(false);
    setOpenAdd(false);
  };

  const handleOpenAdd = (e) => {
    e.preventDefault();
    setOpenAdd(true);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Button variant="contained" color="primary" onClick={handleOpenAdd}>
        Add
      </Button>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} >
            <EnhancedTableHead />
            <TableBody>
              {users.map((user) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={user.id}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell align="left">{user.id}</TableCell>
                    <TableCell align="left">{user.avatar || "N/A"}</TableCell>
                    <TableCell align="left">{user.firstName}</TableCell>
                    <TableCell align="left">{user.lastName}</TableCell>
                    <TableCell align="left">{user.username}</TableCell>
                    <TableCell align="left">{user.email}</TableCell>
                    <TableCell align="left">{user.phone || "N/A"}</TableCell>
                    <TableCell align="left">{user.birth || "N/A"}</TableCell>
                    <TableCell align="left">{user.gender || "N/A"}</TableCell>
                    <TableCell align="left">
                      <Button
                        variant="contained"
                        color="primary"
                        //onClick={() => handleEdit(user.id)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell align="left">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => onDeleteUser(user.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination  
          rowsPerPageOptions={[5, 10, 25]} // You can customize the number of rows per page options here.
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={openAdd} onClose={handleClose}>
        <DialogTitle>Create Account Users</DialogTitle>
        <DialogContent>
        <TextField
      label="First Name"
      variant="outlined"
      fullWidth
      name="firstName"
      value={data.firstName}
      onChange={handleChange}
    />
    <TextField
      label="Last Name"
      variant="outlined"
      fullWidth
      name="lastName"
      value={data.lastName}
      onChange={handleChange}
    />
    <TextField
      label="Username"
      variant="outlined"
      fullWidth
      name="username"
      value={data.username}
      onChange={handleChange}
    />
    <TextField
      label="Password"
      variant="outlined"
      fullWidth
      name="password"
      type="password"
      value={data.password}
      onChange={handleChange}
    />
    <TextField
      label="Email"
      variant="outlined"
      fullWidth
      name="email"
      value={data.email}
      onChange={handleChange}
    />
    <TextField
      label="Role"
      variant="outlined"
      fullWidth
      name="role"
      type="number"
      value={data.role}
      onChange={handleChange}
    />
          <Button variant="contained" onClick={onCreateUser}>
            Add
          </Button>
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
