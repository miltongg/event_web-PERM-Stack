export const doneButtonStyle = {
  color: "orange",
  "&:hover": {
    color: "red",
    cursor: "pointer",
  },
  "&:active": {
    color: "black",
  },
};

export const editButtonStyle = {
  color: "orange",
  marginX: 1,
  ml: 1,
  "&:hover": {
    color: "red",
    cursor: "pointer",
  },
  "&:active": {
    color: "block",
  },
};

export const deleteButtonStyle = {
  color: "red",
  ml: 1,
  "&:hover": {
    color: "darkred",
    cursor: "pointer",
  },
  "&:active": {
    color: "block",
  },
};

export const dashboardImgGrow = {
  cursor: "pointer",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
};

export const dashboardImgStandard = {
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  width: 50,
};
