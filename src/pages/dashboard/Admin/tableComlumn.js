import { Email, Phone } from "@mui/icons-material";
import {
  FaImage,
  FaUserEdit,
  FaTrashAlt,
  FaEnvelope,
  FaPhone,
  FaImages,
  FaUser,
  FaPhoneAlt,
} from "react-icons/fa";

export const headCells = [
  {
    id: "avatar",
    numeric: false,
    disablePadding: true,
    label: "Avatar",
    icon: <FaImages />,
  },
  {
    id: "Name",
    numeric: false,
    disablePadding: true,
    label: "Name",
    icon: <FaUser />,
  },
  {
    id: "Email",
    numeric: false,
    disablePadding: false,
    label: "Email",
    icon: <Email />,
  },
  {
    id: "Phone",
    numeric: false,
    disablePadding: false,
    label: "Phone Number",
    icon: <FaPhoneAlt />,
  },
  {
    id: "Edit",
    numeric: false,
    disablePadding: false,
  },
  {
    id: "Delete",
    numeric: false,
    disablePadding: false,
  },
];

export const roleOptions = [
  { id: 0, name: "Admin" },
  { id: 1, name: "Customer" },
  { id: 2, name: "Manager" },
  { id: 3, name: "Technical Staff" },
  { id: 4, name: "Sale Staff" },
];

export const genderOptions = [
  { id: 0, name: "Male" },
  { id: 1, name: "Female" },
];
