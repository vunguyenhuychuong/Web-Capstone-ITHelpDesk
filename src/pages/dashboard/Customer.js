import * as React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,DialogTitle,Paper,Button,DialogContent,TableRow,TableSortLabel,Box,Table,TableBody,TableCell,TableContainer,TableHead,TextField,TablePagination,IconButton,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import {
  MDBBtn,
  MDBCol,
  MDBInput,
  MDBRow,
} from "mdb-react-ui-kit";
import { visuallyHidden } from "@mui/utils";
import { AddDataProfile, DeleteDataUser, UpdateUser, getAllUser, getUserById } from "../../app/api";
import { toast } from "react-toastify";
import { headCells, roleOptions } from "./Admin/tableComlumn";
import { Close } from "@mui/icons-material";

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
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowPerPage] = useState(5);
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);
  const [data, setData] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    address: "",
    phoneNumber: "",
    isActive: true,
    role: 0,
    birth: "",
    gender: 0,
    createdAt:"",
    modifiedAt: ""
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
        console.log(result);
        toast.success("User created successfully");
        setOpenAdd(false);
        fetchDataUser();
      } else {
        toast.error("Fail to create user");
        console.log("error", result.message);
      }
    } catch (error) {
      toast.error("Error");
      console.log("Please check data input", error);
    }
  };

  const handleDetailUser = async (id) => {
    setLoading(true);
    try {
      const user = await getUserById(id);
      setData({
        id: user.result.id,
        firstName: user.result.firstName || "", 
        lastName: user.result.lastName || "",
        username: user.result.username || "",
        password: user.result.password || "",
        email: user.result.email || "",
        address: user.result.address || "",
        phoneNumber: user.result.phoneNumber || "",
        isActive: user.result.isActive || true, 
        role: user.result.role || 0, 
        birth: user.result.birth || "",
        gender: user.result.gender || 0, 
        dateOfBirth: user.result.dateOfBirth || "",
      });
    } catch (error) {
      toast.error("Can not get user id");
      console.log(error);
    }
    setLoading(false);
    setOpen(true);
  }

  const onDeleteUser = async (id) => {
    const shouldDelete = window.confirm("Are you sure you want to delete?");
    if (shouldDelete) {
      try {
        const result = await DeleteDataUser(id);
        fetchDataUser();
        if (result.isError === false) {
          toast.success("Delete successful");
        } else {
          toast.error("Delete fail");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleClose = () => {
    setOpen(false);
    setOpenAdd(false);
  };

  const handleOpenAdd = (e) => {
    e.preventDefault();
    setOpenAdd(true);
  };

  const handleOpenEditUser = (id) => {
    getUserById(id);
  };

  const onHandleEditUser = async () => {
    try{
      const response = UpdateUser(data.id, data);
      console.log(data);
      console.log(response);
      toast.success("User updated successfully");
    }catch(error){
      toast.error("Failed to update user");
      console.log(error);
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Button variant="contained" color="primary" onClick={handleOpenAdd}>
        Add
      </Button>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <EnhancedTableHead />
            <TableBody>
              {users.map((user, index) => 
                 (
                  <TableRow
                    key={`user-${index}`} 
                    hover
                    role="checkbox"
                    tabIndex={-1}
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
                        onClick={() => handleDetailUser(user.id)}
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
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={openAdd} fullWidth maxWidth="lg">
        <DialogTitle className="text-center">
          <IconButton
            edge="end"
            onClick={handleClose}
            aria-label="close"
            color="#3b71ca"
            style={{
              position: 'absolute',
              right: '32px',
              top: '8px',
              width: '36px',
              height: '36px',
              backgroundColor: '#2196f3',
              borderRadius: '4px',
            }}
          >
            <Close style={{ color: 'white' }} />
          </IconButton>
          Create Team
        </DialogTitle>
        <form style={{ margin: "0px 40px" }} className="custom-dialog ">         
          <MDBRow>
            <MDBCol>
              <InputLabel>First Name</InputLabel>
              <MDBInput id="firstName" name="firstName" value={data.firstName} onChange={handleChange}/>
            </MDBCol>
            <MDBCol>
              <InputLabel >Last Name</InputLabel>
              <MDBInput id="lastName" name="lastName" value={data.lastName} onChange={handleChange}/>
            </MDBCol>
          </MDBRow>  
          <MDBRow>
            <MDBCol>
              <InputLabel >User Name</InputLabel>
              <MDBInput id="username" name="username" value={data.username} onChange={handleChange}/>
            </MDBCol>
            <MDBCol>
              <InputLabel>Password</InputLabel>
              <MDBInput id="password" name="password" value={data.password} onChange={handleChange}/>
            </MDBCol>
          </MDBRow>  
          <MDBRow>
            <MDBCol>
              <InputLabel>Email</InputLabel>
              <MDBInput id="email" name="email" value={data.email} onChange={handleChange}/>
            </MDBCol>
            <MDBCol>
              <InputLabel>Role</InputLabel>
              <Select
                  id="role"
                  onChange={handleChange}
                  fullWidth
                  margin="dense" // or margin="none"
                  variant="outlined"
                  style={{ height: '36px' }}
                  displayEmpty
                  renderValue={(value) => (value === '' ? <span>&nbsp;</span> : value)}>
                {roleOptions.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
                ))}
              </Select>
            </MDBCol>
          </MDBRow>
          <div className="text-center customer-center-btn">
            <MDBBtn className="mb-4 mt-4" type="submit" onClick={onCreateUser}>
              Add
            </MDBBtn>
          </div>
        </form>
      </Dialog>

      <Dialog open={open} fullWidth maxWidth="lg">
        <DialogTitle className="text-center">
        <IconButton
            edge="end"
            onClick={handleClose}
            aria-label="close"
            color="#3b71ca"
            style={{
              position: 'absolute',
              right: '32px',
              top: '8px',
              width: '36px', // Set the width and height to create a square button
              height: '36px',
              backgroundColor: '#2196f3', // Set the background color to blue
              borderRadius: '4px', // Optional: Add border-radius for rounded corners
            }}
          >
            <Close style={{ color: 'white' }} />
          </IconButton>
          Create Team
        </DialogTitle>
          {loading ? (
            <div>loading...</div>
          ) : (
        <form style={{ margin: "0px 40px" }} className="custom-dialog ">         
          <MDBRow>
            <MDBCol>
              <InputLabel>First Name</InputLabel>
              <MDBInput id="firstName" name="firstName" value={data.firstName} onChange={handleChange}/>
            </MDBCol>
            <MDBCol>
              <InputLabel >Last Name</InputLabel>
              <MDBInput id="lastName" name="lastName" value={data.lastName} onChange={handleChange}/>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <InputLabel>Email</InputLabel>
              <MDBInput id="email" name="email" value={data.email} onChange={handleChange}/>
            </MDBCol>
            <MDBCol>
              <InputLabel>Phone Number</InputLabel>
              <MDBInput id="phoneNumber" name="phoneNumber" value={data.phoneNumber} onChange={handleChange}/>
            </MDBCol>
          </MDBRow> 
          <MDBRow>
          <MDBCol>
              <InputLabel>Gender</InputLabel>
              <MDBInput id="gender" name="gender" value={data.gender} onChange={handleChange}/>
            </MDBCol>
            <MDBCol>
              <InputLabel >IsActive</InputLabel>
              <MDBInput id="isActive" name="isActive" value={data.isActive} onChange={handleChange}/>
            </MDBCol>  
          </MDBRow>  
          <MDBRow>
          <MDBCol>
              <InputLabel>Date Of Birth</InputLabel>
              <MDBInput id="dateOfBirth" name="dateOfBirth" value={data.dateOfBirth} onChange={handleChange}/>
            </MDBCol>
            <MDBCol>
              <InputLabel>Address</InputLabel>
              <MDBInput id="address" name="address" value={data.address} onChange={handleChange}/>
            </MDBCol>  
          </MDBRow>  
          <div className="text-center customer-center-btn">
            <MDBBtn className="mb-4 mt-4" type="button" onClick={onHandleEditUser}>
              Edit
            </MDBBtn>
          </div>
        </form>
          )}  
      </Dialog>
    </Box>
  );
}
