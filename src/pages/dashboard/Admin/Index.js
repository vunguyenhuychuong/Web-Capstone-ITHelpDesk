import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
//import { getAllUser } from "../../../app/api";
import Wrapper from "../../../assets/wrappers/DashboardFormPage";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { getAllUser } from "../../../app/api";

const Index = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    async function fetchDataUser() {
    const UserList = await getAllUser();
    setUsers(UserList);
    }
    fetchDataUser();
  }, []); 
  

  return (
    <Wrapper>
      <form className="form">
        <div className="container" style={{ width: "1500px" }}>
          <Table>
            <TableHead>
              <TableRow className="table-header image-header">
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                  First Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                  Last Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                  User Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                  Email
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                  Phone
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                  Date Of Birth
                </TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.dateOfBirth}</TableCell>
                    {/* Add other columns as needed */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>No users found.</TableCell>
                  {/* Set colSpan to the number of columns in your table */}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </form>
    </Wrapper>
  );
};

export default Index;
