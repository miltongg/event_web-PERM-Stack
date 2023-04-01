import {Box, Button, Card, CardActions, CardContent, CardMedia, Divider, Typography} from "@mui/material";

export const SideBar = () => {
  return (
    <Box sx={{marginY: 5 }}>

      <Typography component="div" color="white" marginBottom={1} sx={{
        backgroundColor: "orange",
        borderRadius: 1,
        padding: 1
      }}>
        Más popular
      </Typography>

      {/*<Divider/>*/}
      <Card sx={{ display: 'flex', marginY: 3}}>
        <CardMedia
          component="img"
          sx={{ width: 100 }}
          image="/public/cross-image.jpg"
          alt="Live from space album cover"
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h6">
              Title
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div">
              Mac Miller
            </Typography>
          </CardContent>
          {/*<Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>*/}
          {/*  aaa*/}
          {/*</Box>*/}
        </Box>
      </Card>
  
      <Card sx={{ display: 'flex', marginY: 3}}>
        <CardMedia
          component="img"
          sx={{ width: 100 }}
          image="/public/cross-image.jpg"
          alt="Live from space album cover"
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h6">
              Title
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div">
              Mac Miller
            </Typography>
          </CardContent>
          {/*<Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>*/}
          {/*  aaa*/}
          {/*</Box>*/}
        </Box>
      </Card>
  
      <Card sx={{ display: 'flex', marginY: 3}}>
        <CardMedia
          component="img"
          sx={{ width: 100 }}
          image="/public/cross-image.jpg"
          alt="Live from space album cover"
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h6">
              Title
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div">
              Mac Miller
            </Typography>
          </CardContent>
          {/*<Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>*/}
          {/*  aaa*/}
          {/*</Box>*/}
        </Box>
      </Card>
    </Box>
  );
};
