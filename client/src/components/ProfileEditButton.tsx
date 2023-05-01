import React from "react";
import { Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface Props {
  activate: (value: string | undefined | {}) => void;
}

const EditButton = ({ activate }: Props) => {
  return (
    <IconButton
      sx={{
        color: "orange",
        "&:hover": {
          cursor: "pointer",
          color: "black",
        },
      }}
      onClick={activate}
    >
      <Edit />
    </IconButton>
  );
};

export default EditButton;
