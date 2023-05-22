import { Chat, VisibilityRounded, StarRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React from "react";

interface Props {
  views: number;
  rating?: number;
  commentsCount: number;
}

const DataRecord = ({ views, rating, commentsCount }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: 1,
        justifyContent: "end",
      }}
    >
      <Box
        sx={{
          mx: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Chat sx={{ color: "green" }} />
        <Typography>{commentsCount}</Typography>
      </Box>

      <Box
        sx={{
          mx: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <VisibilityRounded sx={{ color: "blue" }} />
        <Typography>{views}</Typography>
      </Box>

      <Box
        sx={{
          mx: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <StarRounded sx={{ color: "orange" }} />
        <Typography>{!rating ? 0 : rating.toFixed(1)}</Typography>
      </Box>
    </Box>
  );
};

export default DataRecord;
