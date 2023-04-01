import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Comment } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Paper,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { getError } from "../helpers/handleErrors";
import { webApi } from "../helpers/animeApi";

interface Props {
  userId: string | undefined;
  username: string | undefined;
}

const Comments = ({ userId, username }: Props) => {
  const [comments, setComments] = useState([]);

  const id = useParams<string>();

  useEffect(() => {
    try {
      const callComments = async () => {
        const { data } = await webApi.get(`/comment/${id}`);

        setComments(data);
      };

      callComments();
    } catch (error) {
      console.log(error);
      toast.error(getError(error));
    }
  },[]);

  const handleComment = () => {
    try {
    } catch (error) {
      console.log(error);
      toast.error(getError(error));
    }
  };

  return (
    <>
      {userId ? (
        <Paper elevation={1} sx={{ p: 2, width: 1, my: 2 }}>
          <Box>
            <Rating sx={{ mb: 2 }} />

            <TextField
              multiline
              rows={4}
              sx={{ width: 1 }}
              label="Deja tu comentario"
            />
            <Button
              onClick={handleComment}
              variant="contained"
              sx={{ my: 2 }}
              startIcon={<Comment />}
            >
              Comentar
            </Button>
          </Box>
          <Divider />
        </Paper>
      ) : (
        <Typography variant="h5" sx={{ p: 5, textAlign: "center" }}>
          Inicia sesión para comentar
        </Typography>
      )}

      {comments.map(({ username, userImg, comment, date }) => (
        <Paper sx={{ position: "relative" }}>
          <Box sx={{ display: "flex", p: 1 }}>
            {userImg ? (
              <Paper
                elevation={5}
                component="img"
                sx={{
                  objectFit: "cover",
                  height: 48,
                  width: 48,
                  borderRadius: "50%",
                }}
                src={`http://localhost:4000/api/uploads/img/avatar/${userImg}`}
              />
            ) : (
              <Avatar sx={{ mr: 1 }} />
            )}
            <Box>
              <Typography>{username}</Typography>
              <Typography sx={{ fontSize: "0.7rem" }}>{date}</Typography>
            </Box>
            <Rating sx={{ position: "absolute", right: 5 }} />
          </Box>
          <Typography sx={{ px: 2, pb: 1 }}>{comment}</Typography>
          <Divider />
          <Box>ddd</Box>
        </Paper>
      ))}
    </>
  );
};

export default Comments;
