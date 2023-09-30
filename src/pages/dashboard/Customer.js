import * as React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,Paper,Button,
  DialogContent,
  TableRow,TableSortLabel,
  Box,Table,TableBody,TableCell,TableContainer,TableHead,TablePagination
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { AddDataProfile, getAllUser } from "../../app/api";
import { toast } from "react-toastify";
import axios from "axios";



const headCells = [
  {
    id: "avatar",
    numeric: false,
    disablePadding: true,
    label: "Avatar",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "FirstName",
  },
  {
    id: "calories",
    numeric: true,
    disablePadding: false,
    label: "LastName",
  },
  {
    id: "fat",
    numeric: true,
    disablePadding: false,
    label: "UserName",
  },
  {
    id: "carbs",
    numeric: true,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "protein",
    numeric: true,
    disablePadding: false,
    label: "PhoneNumber",
  },
];

function EnhancedTableHead(props) {
  const {
    order,
    orderBy,
  } = props;
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          STT
        </TableCell>
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
  
  const [selected, setSelected] = React.useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openUpdate, setUpdate] = React.useState(false);

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
    role: 0,
  });

  const fetchDataUser = async () => {
    try {
      const UserList = await getAllUser(data);
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
    const user = JSON.stringify(localStorage.getItem("profileAdmin"));
    const accessToken = user.result;
    console.log(accessToken);
    const header = `Bearer ${accessToken}`;
    try{
      //const result = await AddDataProfile();
      const result = await axios.post("https://localhost:7043/v1/itsds/user", {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        password: data.password,
        email: data.email,
        role: data.role
      }, {
        headers: {
          Authorization: header
        }
      })
      console.log('result', result);
      if(result.status === 200) {
        setData({
          firstName: '',
          lastName: '',
          username: '',
          password: '',
          email: '',
          role: 0
        });
        toast.success("User created successfully");
        setOpenAdd(false);
        fetchDataUser();
      }      
    }catch(error){
      toast.error("Error");
      console.log("Please check data input", error);
    }
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
    setUpdate(false);
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
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              numSelected={selected.length}
            />
            <TableBody>
              {users.map((user, index) => {
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
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={users.length}
        />
      </Paper>
      <Dialog open={openAdd} onClose={handleClose}>
        <DialogTitle>Create Account Users</DialogTitle>
        <DialogContent>
          <label>
            FirstName: <input type="text" name="firstName" value={data.firstName} onChange={handleChange}/>
          </label>
          <label>
            LastName: <input type="text" name="lastName" value={data.lastName} onChange={handleChange}/>
          </label>
          <label>
            UserName: <input type="text" name="username" value={data.username} onChange={handleChange}/>
          </label>
          <label>
            Password: <input type="password" name="password" value={data.password} onChange={handleChange}/>
          </label>
          <label>
            Email: <input type="email" name="email" value={data.email} onChange={handleChange}/>
          </label>
          <label>
            Role: <input type="number" name="role" value={data.role} onChange={handleChange}/>
          </label>
          <Button variant="contained" onClick={onCreateUser}>Add</Button>
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
