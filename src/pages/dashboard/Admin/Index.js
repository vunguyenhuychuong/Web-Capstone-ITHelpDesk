import React, { useEffect } from "react";
import { useState } from "react";
import Wrapper from "../../../assets/wrappers/DashboardFormPage";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
} from "@mui/material";
import { getAllUser } from "../../../app/api";

const Index = () => {
  const [users, setUsers] = useState([]);

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
        <button className="btn btn-primary mb-4 buttonUser">New</button>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.firstName || 'N/A'}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || 'N/A'}</TableCell>
                    <TableCell>{user.dateOfBirth || 'N/A'}</TableCell>
                      <button
                          className="btn btn-warning"
                          type="button"
                        >Edit</button>
                      <button
                          className="btn btn-danger"
                          type="button"
                        >Delete</button>   
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
