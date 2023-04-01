import {Box, Icon, List, ListItem, Paper, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";
import {Twitter, Instagram, Facebook, YouTube} from "@mui/icons-material";

const socialMedias = [
  {title: <YouTube/>, path: "/youtube"},
  {title: <Facebook/>, path: "/facebook"},
  {title: <Instagram/>, path: "/instagram"},
  {title: <Twitter/>, path: "/twitter"}
]


export const Footer = () => {
  return (
      <Paper square
        sx={{ padding: 4, backgroundColor: "#292929"}}
        elevation={0}
      >
        
        <List sx={{display: "flex", justifyContent: "center"}}>
          {/*<Box sx={{margin: "auto", display: "flex", alignItems: "middle"}}>*/}
          {
            socialMedias.map(({title, path}) => (
              <Box key={path} sx={{paddingX: 1}}>
                <ListItem
                  sx={{padding: 0, color: "white", "&:hover": {color: "orange"}}}
                  component={NavLink}
                  to={path}
                >
                  {title}
                </ListItem>
              </Box>
            ))
          }
          {/*</Box>*/}
        </List>
        
        <Typography sx={{fontSize: 12, margin: "auto", display: "flex", justifyContent: "center", color: "#999"}}>
          Todos los derechos reservados.
        </Typography>
        <Typography sx={{fontSize: 12, margin: "auto", display: "flex", justifyContent: "center", color: "#999"}}>
          2023
        </Typography>
      </Paper>
  );
};
