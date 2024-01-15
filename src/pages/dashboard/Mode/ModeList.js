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
import React, { useCallback, useState } from "react";
import {
  ArrowDropDown,
  ArrowDropUp,
  ContentCopy,
  Delete,
  DeleteForeverSharp,
  Edit,
} from "@mui/icons-material";
import { useEffect } from "react";
import { deleteDataMode, deleteMode, getDataMode } from "../../../app/api/mode";
import { FaPlus, FaSearch } from "react-icons/fa";
import {
  CircularProgress,
  Dialog,
  FormControl,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import CreateMode from "./CreateMode";
import EditMode from "./EditMode";
import { toast } from "react-toastify";
import { formatDate } from "../../helpers/FormatDate";
import PageSizeSelector from "../Pagination/Pagination";
import { Box } from "@mui/system";

const ModeList = () => {
  const [dataModes, setDataModes] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectMode, setSelectMode] = useState(null);
  const [dialogEdit, setDialogEdit] = useState(false);
  const [selectedModes, setSelectedModes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchField, setSearchField] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("id");

  const fetchAllMode = useCallback(async () => {
    try {
      let filter = "";
      if (searchQuery) {
        filter = `title="${encodeURIComponent(searchQuery)}"`;
      }
      setLoading(true);
      const mode = await getDataMode(
        searchField,
        searchQuery,
        currentPage,
        pageSize,
        sortBy,
        sortDirection
      );
      setDataModes(mode);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchField, searchQuery, sortBy, sortDirection]);

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

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
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
            throw new Error(
              `Error deleting mode with ID ${modeId}: ${res.message}`
            );
          }
          return modeId;
        } catch (error) {
          throw new Error(
            `Error deleting mode with ID ${modeId}: ${error.message}`
          );
        }
      });

      const results = await Promise.allSettled(deletePromises);

      const successfulDeletes = [];
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          successfulDeletes.push(result.value);
        } else {
          toast.error(result.reason.message);
        }
      });
      const updateModes = dataModes.filter(
        (mode) => !successfulDeletes.includes(mode.id)
      );
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
        toast.success("Delete Mode successful", result.message);
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

  const handleChangePageSize = (event) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleEditClick = async (modeId) => {
    setSelectMode(modeId);
    setDialogEdit(true);
  };

  const handleCloseEdit = (e) => {
    if (e) {
      e.preventDefault();
    }
    setDialogEdit(false);
  };

  const handleOpenMode = (e) => {
    e.preventDefault();
    setDialogOpen(true);
  };

  const handleCloseMode = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    fetchAllMode();
    setTotalPages(4);
  }, [fetchAllMode]);

  return (
    <section style={{ backgroundColor: "#FFF" }}>
      <MDBContainer
        className="py-5"
        style={{ paddingLeft: 20, paddingRight: 20, maxWidth: "100%" }}
      >
        <MDBNavbar expand="lg" style={{ backgroundColor: "#3399FF" }}>
          <MDBContainer fluid>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px", color: "#FFFFFF" }} />{" "}
              <span style={{ color: "#FFFFFF" }}>All Mode</span>
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav justify-content-end align-items-center">
              <MDBBtn
                color="#eee"
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: "#FFFFFF",
                }}
                onClick={handleOpenMode}
              >
                <FaPlus /> New
              </MDBBtn>
              <MDBBtn
                color="eee"
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: "#FFFFFF",
                }}
              >
                <Delete onClick={handleDeleteSelectedModes} /> Delete
              </MDBBtn>
              <FormControl
                variant="outlined"
                style={{
                  minWidth: 120,
                  marginRight: 10,
                  marginTop: 10,
                  marginLeft: 10,
                }}
                size="small"
              >
                <Select
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  inputProps={{
                    name: "searchField",
                    id: "search-field",
                  }}
                  style={{ color: "white" }}
                >
                  <MenuItem value="name">name</MenuItem>
                  <MenuItem value="description">Title</MenuItem>
                  <MenuItem value="id">id</MenuItem>
                </Select>
              </FormControl>
              <div className="input-wrapper">
                <FaSearch id="search-icon" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      fetchAllMode();
                    }
                  }}
                  className="input-search"
                  placeholder="Type to search..."
                />
              </div>
              <PageSizeSelector
                pageSize={pageSize}
                handleChangePageSize={handleChangePageSize}
              />
            </MDBNavbarNav>
          </MDBContainer>
        </MDBNavbar>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="300px"
          >
            <CircularProgress color="primary" size={60} />
          </Box>
        ) : (
          <MDBTable className="align-middle mb-0" responsive>
            <MDBTableHead className="bg-light">
              <tr style={{ fontSize: "1.2rem" }}>
                <th style={{ fontWeight: "bold" }}>
                  <input
                    type="checkbox"
                    checked={selectedModes.length === dataModes.length}
                    onChange={handleSelectAllModes}
                  />
                </th>
                <th
                  style={{ fontWeight: "bold" }}
                  className="sortable-header"
                  onClick={() => handleSortChange("id")}
                >
                  ID
                  {sortBy === "id" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold" }}
                  className="sortable-header"
                  onClick={() => handleSortChange("name")}
                >
                  Mode Name
                  {sortBy === "name" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold" }}
                  className="sortable-header"
                  onClick={() => handleSortChange("description")}
                >
                  Description
                  {sortBy === "description" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold" }}
                  className="sortable-header"
                  onClick={() => handleSortChange("createdAt")}
                >
                  Create Time
                  {sortBy === "createdAt" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold" }}
                  className="sortable-header"
                  onClick={() => handleSortChange("modifiedAt")}
                >
                  Modify Time
                  {sortBy === "modifiedAt" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th style={{ fontWeight: "bold" }}></th>
                <th style={{ fontWeight: "bold" }}></th>
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
                    <td>{mode.id}</td>
                    <td>{mode.name}</td>
                    <td>{mode.description}</td>
                    <td>{formatDate(mode.createdAt || "-")}</td>
                    <td>{formatDate(mode.modifiedAt || "-")}</td>
                    <td onClick={() => handleEditClick(mode.id)}>
                      <Edit />
                    </td>
                    <td onClick={() => onDeleteMode(mode.id)}>
                      <DeleteForeverSharp />
                    </td>
                  </tr>
                );
              })}
            </MDBTableBody>
          </MDBTable>
        )}
      </MDBContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
        />
      </Box>
      <Dialog open={dialogOpen} onClose={handleCloseMode}>
        <CreateMode onClose={handleCloseMode} />
      </Dialog>

      <Dialog open={dialogEdit} onClose={handleCloseEdit}>
        <EditMode onClose={handleCloseEdit} modeId={selectMode} />
      </Dialog>
    </section>
  );
};

export default ModeList;
