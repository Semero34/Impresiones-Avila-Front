import React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

const BasicLayoutRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  minHeight: "100vh",
  backgroundSize: "cover",
  backgroundPosition: "center",
  overflow: "hidden",
}));

function BasicLayout({ image, children }) {
  return <BasicLayoutRoot sx={{ backgroundImage: `url(${image})` }}>{children}</BasicLayoutRoot>;
}

BasicLayout.propTypes = {
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default BasicLayout;
