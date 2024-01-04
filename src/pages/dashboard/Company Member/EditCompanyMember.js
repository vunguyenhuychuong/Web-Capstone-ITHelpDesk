import React, { useEffect, useState } from "react";
import "../../../assets/css/ticketSolution.css";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import {
  getCompanyMemberById,
  updateCompanyMember,
} from "../../../app/api/companyMember";
import "react-image-gallery/styles/css/image-gallery.css";

const EditCompanyMember = ({ memberId, onClose,  onReloadData }) => {
  const [data, setData] = useState({
    isCompanyAdmin: false,
    memberPosition: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    memberPosition: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const memberData = await getCompanyMemberById(memberId);
        setData((prevData) => ({
          ...prevData,
          isCompanyAdmin: memberData.isCompanyAdmin,
          memberPosition: memberData.memberPosition,
        }));
      } catch (error) {
        console.error("Error fetching company member data:", error);
      }
    };

    fetchData();
  }, [memberId]);

  const handleIsCompanyAdminChange = (newValue) => {
    setData((prevData) => ({
      ...prevData,
      isCompanyAdmin: newValue,
    }));
  };

  const handleMemberPositionChange = (newValue) => {
    setData((prevData) => ({
      ...prevData,
      memberPosition: newValue,
    }));
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    const errors = {};

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedData = {
        isCompanyAdmin: data.isCompanyAdmin,
        memberPosition: data.memberPosition,
      };
      setData(updatedData);
      await updateCompanyMember(
        {
          isCompanyAdmin: data.isCompanyAdmin,
          memberPosition: data.memberPosition,
        },
        memberId
      );
      onReloadData();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog
        open={isEditDialogOpen}
        onClose={() => onClose()}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Update Information Customer
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => onClose()}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <Tooltip title="Select Company Admin status" placement="top">
              <Select
                labelId="isCompanyAdmin-label"
                id="isCompanyAdmin"
                value={data.isCompanyAdmin}
                onChange={(e) => handleIsCompanyAdminChange(e.target.value)}
              >
                <MenuItem value={true}>True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </Select>
            </Tooltip>
          </FormControl>

          <TextField
            label="Member Position"
            variant="outlined"
            fullWidth
            margin="dense"
            style={{ marginTop: "20px" }}
            value={data.memberPosition}
            onChange={(e) => handleMemberPositionChange(e.target.value)}
            error={!!fieldErrors.memberPosition}
            helperText={fieldErrors.memberPosition}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmitUser}
            disabled={isSubmitting}
            style={{ marginTop: "10px" }}
          >
            Save Changes
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditCompanyMember;
