import React from "react";
import { Box, Paper, Tab, Tabs } from "@mui/material";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import UserIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import NewsIcon from "@mui/icons-material/Newspaper";
import CommentIcon from "@mui/icons-material/Comment";
import { Outlet, useNavigate, useParams } from "react-router-dom";

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
  const urlName = location.pathname;

  let tabNumber: number = 0;

  if (urlName?.includes("users")) tabNumber = 1;
  else if (urlName?.includes("events")) tabNumber = 2;
  else if (urlName?.includes("news")) tabNumber = 3;

  const [value, setValue] = React.useState(tabNumber);
  const navigate = useNavigate();

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
        <Tab
          onClick={() => navigate("/dashboard")}
          icon={<InsertChartIcon />}
          label={"General"}
          {...a11yProps(0)}
        />
        <Tab
          onClick={() => navigate("/dashboard/users")}
          icon={<UserIcon />}
          label={"Usuarios"}
          {...a11yProps(1)}
        />
        <Tab
          onClick={() => navigate("/dashboard/events")}
          icon={<EventIcon />}
          label="Eventos"
          {...a11yProps(2)}
        />
        <Tab
          onClick={() => navigate("/dashboard/news")}
          icon={<NewsIcon />}
          label="Noticias"
          {...a11yProps(3)}
        />
        <Tab icon={<CommentIcon />} label="Comentarios" {...a11yProps(4)} />
      </Tabs>
      <TabPanel value={value} index={0}></TabPanel>
      <TabPanel value={value} index={1}>
        <Outlet />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Outlet />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Outlet />
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Four
      </TabPanel>
    </Paper>
  );
};

export default DashboardScreen;
