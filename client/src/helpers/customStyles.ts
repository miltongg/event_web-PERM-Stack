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
  // ml: 1,
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

export const dashboardTableHeadStyle = {
  textAlign: "center",
  fontWeight: "bold",
  backgroundColor: "#333",
  color: "white",
};

export const dashboardTableBodyStyle = {
  textAlign: "center",
};

export const styles = {
  colorNavbar: { backgroundColor: "#fc0303" },
  colorText: { color: "white" },
};

export const buttonFormStyle = {
  backgroundColor: "#FF0000",
  marginTop: 2,
  "&:hover": { backgroundColor: "#333" },
};

export const addFormStyle = {
  p: 2,
  width: "70%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: "20px auto",
};
