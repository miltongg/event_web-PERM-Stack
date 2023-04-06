import {FormEvent, useEffect, useState} from "react";
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
  userId: string | undefined,
  // eventId: string,
  token: string | null,
  commentsCount: number
}

const Comments = ({ userId, token, commentsCount }: Props) => {
  const [comments, setComments] = useState([{
    id: '', username: '', comment: '', userImg: '', createdAt: ''
  }]);
  const [loading, setLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);

  const {id} = useParams<string>();
  
  console.log(id)
  
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
  },[reload]);
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const { data } = await webApi.post("/comment", {
        eventId: id, comment: formData.get('comment')
      }, {
        headers: {
          token,
        },
      });
      
      setLoading(false);
      
      toast.success("Comentario añadido");
      setReload(!reload);
      
      await webApi.put(`/event/${id}`, {
        commentsCount: commentsCount + 1
      }, {headers: {token}})
      
    } catch (error) {
      setLoading(false);
      toast.error(getError(error));
    }
  };

  return (
    <>
      {userId ? (
        <Paper component="form" elevation={1} sx={{ p: 2, width: 1, my: 2 }} onSubmit={handleSubmit}>
          <Box>
            <Rating sx={{ mb: 2 }} />

            <TextField
              multiline
              rows={4}
              sx={{ width: 1 }}
              name="comment"
              label="Deja tu comentario"
            />
            <Button
              type="submit"
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

      {
        comments.map(({ id, username, comment, userImg, createdAt }) => (
          <Paper key={id} sx={{ position: "relative", mb: 3 }}>
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
                    mr: 1
                  }}
                  src={`http://localhost:4000/api/uploads/img/avatar/${userImg}`}
                />
              ) : (
                <Avatar sx={{ mr: 1 }} />
              )}
              <Box>
                <Typography>{username}</Typography>
                <Typography sx={{ fontSize: "0.7rem" }}>{createdAt}</Typography>
              </Box>
              <Rating sx={{ position: "absolute", right: 5 }} />
            </Box>
            <Typography sx={{ px: 2, pb: 1 }}>{comment}</Typography>
            <Divider />
            <Box>ddd</Box>
          </Paper>
        ))
      }
    </>
  );
};

export default Comments;
