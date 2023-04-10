import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Comment, Done, Edit } from "@mui/icons-material";
import { doneButtonStyle, editButtonStyle } from "../helpers/customStyles";
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
  // eventId: string,
  token: string | null;
  commentsCount: number;
  userImg: string | null | undefined;
}

const Comments = ({ userId, userImg, token, commentsCount }: Props) => {
  const [comments, setComments] = useState([
    {
      id: "",
      username: "",
      userId: "",
      comment: "",
      userImg: "",
      createdAt: "",
    },
  ]);
  const [editedComment, setEditedComment] = useState<string>("");
  const [edit, setEdit] = useState<{ index?: number | null; edit: boolean }>({
    index: null,
    edit: false,
  });

  const [reply, setReply] = useState<{
    index?: number | null;
    commentId?: string;
    text?: string;
  }>({
    index: null,
    commentId: "",
    text: "",
  });

  const [reload, setReload] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);

  const { id } = useParams<string>();

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
  }, [reload]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      await webApi.post(
        "/comment",
        {
          eventId: id,
          comment: formData.get("comment"),
        },
        {
          headers: {
            token,
          },
        }
      );

      // setLoading(false);

      toast.success("Comentario añadido");
      setReload(!reload);

      await webApi.put(
        `/event/${id}`,
        {
          commentsCount: commentsCount + 1,
        },
        { headers: { token } }
      );
    } catch (error: any) {
      // setLoading(false);
      toast.error(getError(error));
    }
  };

  const handleEditComment = (index: number, value: string) => {
    const comment = [...comments];
    comment[index].comment = value;
    setEditedComment(comment[index].comment);
    setComments(comment);
  };

  const handleUpdatedComment = async (commentId: string) => {
    try {
      await webApi.put(
        `/comment/${commentId}`,
        {
          comment: editedComment,
        },
        {
          headers: { token },
        }
      );

      toast.success("Has actualizado tu comentario");
      setEdit({ edit: false });
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));
    }
  };

  return (
    <>
      {userId ? (
        <Paper
          component="form"
          elevation={1}
          sx={{ p: 2, width: 1, my: 2 }}
          onSubmit={handleSubmit}
        >
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
        <>
          <Typography variant="h5" sx={{ p: 5, textAlign: "center" }}>
            Inicia sesión para comentar
          </Typography>
          <Divider />
        </>
      )}

      {comments.length === 0 ? (
        <Typography sx={{textAlign: 'center'}}>No hay comentarios de este evento</Typography>
      ) : (
        comments.map((comment, index) => (
          <Paper key={comment.id} sx={{ position: "relative", mb: 3 }}>
            <Box sx={{ display: "flex", p: 1 }}>
              {comment.userImg ? (
                <Paper
                  elevation={5}
                  component="img"
                  sx={{
                    objectFit: "cover",
                    height: 48,
                    width: 48,
                    borderRadius: "50%",
                    mr: 2,
                  }}
                  src={`http://localhost:4000/api/uploads/img/avatar/${comment.userImg}`}
                />
              ) : (
                <Avatar sx={{ mr: 1 }} />
              )}
              <Box>
                <Typography>{comment.username}</Typography>
                <Typography sx={{ fontSize: "0.7rem" }}>
                  {comment.createdAt}
                </Typography>
              </Box>
              <Box sx={{ position: "absolute", right: 5 }}>
                <Rating />
                {userId === comment.userId ? (
                  <Edit
                    sx={editButtonStyle}
                    onClick={() =>
                      setEdit({
                        index,
                        edit: !edit.edit,
                      })
                    }
                  />
                ) : (
                  ""
                )}
                {edit.index === index && edit.edit ? (
                  <Done
                    sx={doneButtonStyle}
                    onClick={() => handleUpdatedComment(comment.id)}
                  />
                ) : (
                  ""
                )}
              </Box>
            </Box>
            {edit.index === index && edit.edit ? (
              <TextField
                variant="standard"
                autoFocus
                fullWidth
                sx={{ pl: 2 }}
                value={comment.comment}
                onChange={(e) => handleEditComment(index, e.target.value)}
              />
            ) : (
              <Typography sx={{ px: 2, pb: 1 }}>{comment.comment}</Typography>
            )}

            <Divider />
            <Box sx={{ pl: 1 }}>
              <Button
                variant="text"
                sx={{ textTransform: "capitalize" }}
                onClick={() =>
                  setReply({
                    index,
                    commentId: comment.id,
                    text: ` `,
                  })
                }
              >
                replyer
              </Button>
            </Box>
            {reply.index === index && reply.commentId === comment.id ? (
              <Paper>
                <Divider />
                <Box sx={{ display: "flex", pl: 2, pt: 1 }}>
                  {userImg ? (
                    <Paper
                      elevation={5}
                      component="img"
                      sx={{
                        objectFit: "cover",
                        height: 36,
                        width: 36,
                        borderRadius: "50%",
                        mr: 1,
                      }}
                      src={`http://localhost:4000/api/uploads/img/avatar/${userImg}`}
                    />
                  ) : (
                    <Avatar sx={{ width: 36, height: 36 }} />
                  )}
                  <TextField
                    sx={{ p: 1 }}
                    autoFocus
                    fullWidth
                    variant="standard"
                    value={`${reply.text}`}
                    InputProps={{
                      startAdornment: (
                        <span
                          style={{ color: "#4682B4" }}
                        >{`${comment.username} `}</span>
                      ),
                    }}
                    onChange={(e) =>
                      setReply({ ...reply, text: e.target.value })
                    }
                  />
                </Box>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", pr: 1 }}
                >
                  <Button sx={{ textTransform: "capitalize" }}>
                    replyer
                  </Button>
                  <Button
                    onClick={() => setReply({ ...reply, index: null })}
                    sx={{ textTransform: "capitalize" }}
                  >
                    Cancelar
                  </Button>
                </Box>
              </Paper>
            ) : (
              ""
            )}
          </Paper>
        ))
      )}
    </>
  );
};

export default Comments;
