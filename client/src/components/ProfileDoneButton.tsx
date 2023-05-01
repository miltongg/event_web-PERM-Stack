import React from "react";
import { Done } from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface Props {
  activate: () => void;
}

const DoneButton = ({ activate }: Props) => {
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
      <Done fontWeight={500} />
    </IconButton>
  );
};

export default DoneButton;
