import {
  MDBBtn,
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import React, { useState } from "react";
import { ContentCopy, Delete, DeleteForeverSharp, Edit } from "@mui/icons-material";
import { useEffect } from "react";
import ModeApi, { deleteDataMode, deleteMode } from "../../../app/api/mode";
import { FaPlus } from "react-icons/fa";
import { Dialog } from "@mui/material";
import CreateMode from "./CreateMode";
import EditMode from "./EditMode";
import { toast } from "react-toastify";
import { formatDate } from "../../helpers/FormatDate";
const ModeList = () => {
  const [dataModes, setDataModes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectMode, setSelectMode] = useState(null);
  const [dialogEdit, setDialogEdit] = useState(false);
  const [selectedModes, setSelectedModes] = useState([]);

   const fetchAllMode = async () => {
    try {
      const mode = await ModeApi.getMode();
      console.log(mode);
      setDataModes(mode);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitModeSuccess = () => {
    fetchAllMode(); // Refresh data after successful form submission
  };

  const handleSelectMode = (modeId) => {
    if (selectedModes.includes(modeId)) {
      setSelectedModes(selectedModes.filter((id) => id !== modeId));
      console.log("many select", selectMode);
    } else {
      setSelectedModes([...selectedModes, modeId]);
    }
  };

  const handleSelectAllModes = () => {
    if (selectedModes.length === dataModes.length) {
      setSelectedModes([]);
    } else {
      setSelectedModes(dataModes.map((mode) => mode.id));
    }
  };

  const handleDeleteSelectedModes = async (id) => {
    try {
      if (selectedModes.length === 0) {
        return;
      }  
      const deletePromises = selectedModes.map(async (modeId) => {
        try {
          const res = await Promise.resolve(deleteMode(modeId));
          if (res.isError) {
            throw new Error(`Error deleting mode with ID ${modeId}: ${res.message}`);
          }
          return modeId;
        } catch (error) {
          throw new Error(`Error deleting mode with ID ${modeId}: ${error.message}`);
        }
      });
  
      const results = await Promise.allSettled(deletePromises);
  
      const successfulDeletes = [];
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          successfulDeletes.push(result.value);
        } else {
          toast.error(result.reason.message); // Handle error messages here
        }
      });
  
      const updateModes = dataModes.filter((mode) => !successfulDeletes.includes(mode.id));
      setDataModes(updateModes);
      setSelectMode([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete selected modes, Please try again later");
    }
  };

  const onDeleteMode = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure want to delete this mode"
    );
    if (shouldDelete) {
      try {
        const result = await deleteDataMode(id);
        fetchAllMode();
        toast.success( 'Delete Mode successful',result.message);
        if (result.isError === false) {
          toast.success(result.message);
        } else {
          toast.error(result.message); 
        }
      } catch (error) {
        toast.error("Failed to delete mode. Please try again later");
      }
    }
  };

  const handleEditClick = async (modeId) => {
    setSelectMode(modeId);
    setDialogEdit(true);
  };

  const handleCloseEdit = (e) => {
    if(e){
      e.preventDefault();
    }
    setDialogEdit(false);
  };

  const handleOpenMode = (e) => {
    e.preventDefault();
    setDialogOpen(true);
  };

  const handleCloseMode = (e) => {
    e.preventDefault();
    setDialogOpen(false);
  };

  useEffect(() => {
    fetchAllMode();
  }, []);

  return (
    <section style={{ backgroundColor: "#FFF" }}>
      <MDBContainer
        className="py-5"
        style={{ paddingLeft: 20, paddingRight: 20, maxWidth: "100%" }}
      >
        <MDBNavbar expand="lg" light bgColor="inherit">
          <MDBContainer fluid>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px" }} /> All Mode
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav">
              <MDBBtn
                color="#eee"
                style={{ fontWeight: "bold", fontSize: "20px" }}
                onClick={handleOpenMode}
              >
                <FaPlus /> New
              </MDBBtn>
              <MDBBtn
                color="eee"
                style={{ fontWeight: "bold", fontSize: "20px" }}
              >
                <Delete onClick={handleDeleteSelectedModes} /> Delete
              </MDBBtn>
            </MDBNavbarNav>
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
                <input
                  type="checkbox"
                  checked={selectedModes.length === dataModes.length}
                  onChange={handleSelectAllModes}
                />
              </th>
              <th style={{ fontWeight: "bold" }}>Edit</th>
              <th style={{ fontWeight: "bold" }}>Delete</th>
              <th style={{ fontWeight: "bold" }}>Mode Name</th>
              <th style={{ fontWeight: "bold" }}>Description</th>
              <th style={{ fontWeight: "bold" }}>Create Time</th>
              <th style={{ fontWeight: "bold" }}>Modify Time</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody className="bg-light">
            {dataModes.map((mode, index) => {
              const isSelected = selectedModes.includes(mode.id);
              return (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectMode(mode.id)}
                    />
                  </td>
                  <td onClick={() => handleEditClick(mode.id)}>
                    <Edit />
                  </td>
                  <td onClick={() => onDeleteMode(mode.id)}>
                    <DeleteForeverSharp />
                  </td>
                  <td>{mode.name}</td>
                  <td>{mode.description}</td>
                  <td>{formatDate(mode.createdAt || "-")}</td>
                  <td>{formatDate(mode.modifiedAt || "-")}</td>
                </tr>
              );
            })}
          </MDBTableBody>
          <MDBTableBody className="bg-light"></MDBTableBody>
        </MDBTable>
      </MDBContainer>
      <Dialog
        open={dialogOpen}
        onClose={handleCloseMode}
      >
        <CreateMode onClose={handleCloseMode} onSubmitSuccess={handleSubmitModeSuccess} />
      </Dialog>

      <Dialog open={dialogEdit} onClose={handleCloseEdit}>
        <EditMode onClose={handleCloseEdit} modeId={selectMode} />
      </Dialog>
    </section>
  );
};

export default ModeList;
