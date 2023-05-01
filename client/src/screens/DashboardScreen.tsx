import React from "react";
import DashboardUser from "../components/DashboardUser";
import { Box, Paper, Tab, Tabs } from "@mui/material";
import UserIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import NewsIcon from "@mui/icons-material/Newspaper";
import CommentIcon from "@mui/icons-material/Comment";
import DashboardEvent from "../components/DashboardEvent";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </Box>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const DashboardScreen = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Paper
      sx={{
        flexGrow: 1,
        borderBottom: 1,
        borderColor: "divider",
        marginTop: 5,
      }}
    >
      <Tabs
        value={value}
        orientation="horizontal"
        variant="scrollable"
        onChange={handleChange}
        aria-label="basic tabs example"
        sx={{
          borderRight: 1,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tab icon={<UserIcon />} label={"Usuarios"} {...a11yProps(0)} />
        <Tab icon={<EventIcon />} label="Eventos" {...a11yProps(1)} />
        <Tab icon={<NewsIcon />} label="Noticias" {...a11yProps(2)} />
        <Tab icon={<CommentIcon />} label="Comentarios" {...a11yProps(3)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <DashboardUser />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <DashboardEvent />
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
    </Paper>
  );
};

export default DashboardScreen;
