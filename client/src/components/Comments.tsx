import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Comment,
  Delete,
  Done,
  Edit,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import {
  doneButtonStyle,
  editButtonStyle,
  deleteButtonStyle,
} from "../helpers/customStyles";
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
import Replies from "./Replies";
import { USER_IMG_URL } from "../helpers/url";
import moment from "moment";
import "moment/locale/es";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";

moment.locale("es");

interface Props {
  userId: string | undefined;
  // eventId: string,
  token: string | null;
  role: string | null;
  commentsCount: number;
  userImg: string | null | undefined;
}

interface IComment {
  id: string;
  username: string;
  userId: string;
  comment: string;
  userImg: string | null;
  repliesCount: number;
  rating: number | null;
  createdAt: string;
}

interface IReplies {
  id: string;
  username: string;
  reply: string;
  createdAt: string;
  userId: string;
  userImg: string | null;
  commentId: string;
  repliedToName: string;
  repliedToId: string;
}

const Comments = ({ userId, userImg, token, role, commentsCount }: Props) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [editedComment, setEditedComment] = useState<string>("");
  const [edit, setEdit] = useState<{ index?: number | null; edit: boolean }>({
    index: null,
    edit: false,
  });

  const [showReplies, setShowReplies] = useState<number | null>(null);

  const [reply, setReply] = useState<{
    index?: number | null;
    commentId?: string;
    text?: string;
  }>({
    index: null,
    commentId: "",
    text: "",
  });

  const [replies, setReplies] = useState<IReplies[]>([]);
  const [arrIndex, setArrIndex] = useState<string>("");

  const [reload, setReload] = useState<boolean>(false);
  const [rating, setRating] = useState<number | null>(0);

  const { id } = useParams<string>();

  // GET COMMENTS //
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

  // POST COMMENT //
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
          rating,
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

  // EDIT COMMENT //
  const handleEditComment = (index: number, value: string) => {
    const comment = [...comments];
    comment[index].comment = value;
    setEditedComment(comment[index].comment);
    // setComments(comment);
  };

  // UPDATE COMMENT //
  const handleUpdatedComment = async (commentId: string) => {
    try {
      await webApi.put(
        `/comment/${commentId}`,
        {
          comment: editedComment,
          rating,
        },
        {
          headers: { token },
        }
      );

      toast.success("Has actualizado tu comentario");
      setEdit({ edit: false });
      // setRating(0)
      setReload(!reload);
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));
    }
  };

  // POST REPLY //
  const handleReply = async (
    commentId: string,
    replyText: string,
    index: number,
    repliedToName: string,
    repliedToId: string
  ) => {
    try {
      await webApi.post(
        "/reply",
        {
          commentId,
          reply: replyText,
          repliedToName,
          repliedToId,
        },
        {
          headers: { token },
        }
      );

      // UPDATE REPLIES COUNT OF COMMENTS //
      await webApi.put(
        `/comment/${commentId}`,
        {
          repliesCount: comments[index].repliesCount + 1,
        },
        {
          headers: { token },
        }
      );
      setReload(!reload);
      toast.success("Respondido");
      setReply({ ...reply, index: null });

      handleGetReplies(commentId, index);
    } catch (error) {
      toast.error(getError(error));
    }
  };

  // TOGGLE EDIT BUTTON //
  const editToggle = (index: number) => {
    if (edit.index !== index) {
      setEdit({
        index,
        edit: true,
      });
      setRating(comments[index].rating);
      setEditedComment(comments[index].comment);
    } else {
      setEdit({
        edit: false,
      });
      setRating(0);
    }
  };

  // GET REPLIES //
  const handleGetReplies = async (commentId: string, index: number) => {
    if (showReplies === index) {
      setReplies([])
      setShowReplies(null);
    } else {
      try {
        const { data } = await webApi.get(`/reply/${commentId}`);
        setReplies(data);
        setArrIndex(commentId);
        setReload(!reload);
      } catch (error) {
        toast.error(getError(error));
      }

      setShowReplies(index);
    }
  };

  // DELETE COMMENT //
  const handleDeleteComment = async (id: string) => {
    try {
      Confirm.show(
        `¿Deseas borrar el comentario?`,
        ``,
        "Si",
        "No",
        async () => {
          await webApi.delete(`/comment/${id}`, {
            headers: { token },
          });
          toast.success("Has borrado el comentario");
          // setRating(0)
          setEdit({ index: null, edit: false });
          setReload(!reload);
        },
        () => {},
        {
          titleColor: "black",
          okButtonBackground: "orange",
          titleFontSize: "20px",
          messageFontSize: "16px",
        }
      );
    } catch (error: any) {
      toast.error(getError(error));
    }
  };

  return (
    <>
      {!userId ? (
        <>
          <Typography variant="h5" sx={{ p: 5, textAlign: "center" }}>
            Inicia sesión para comentar
          </Typography>
          <Divider />
        </>
      ) : comments.find((i) => i.userId === userId) ? (
        ""
      ) : (
        <Paper
          component="form"
          elevation={1}
          sx={{ p: 2, width: 1, my: 2 }}
          onSubmit={handleSubmit}
        >
          <Box>
            <Rating
              sx={{ mb: 2 }}
              value={rating}
              onChange={(e, newValue) => {
                setRating(newValue);
              }}
            />

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
      )}

      {/* RENDER COMMENTS */}

      {comments.length === 0 ? (
        <Typography sx={{ textAlign: "center" }}>
          No hay comentarios de este evento
        </Typography>
      ) : (
        comments.map((comment, index) => (
          <Box key={comment.id}>
            <Paper sx={{ position: "relative", mb: 3 }}>
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
                    src={USER_IMG_URL + comment.userImg}
                  />
                ) : (
                  <Avatar sx={{ mr: 1 }} />
                )}
                <Box>
                  <Typography>{comment.username}</Typography>
                  <Typography sx={{ fontSize: "0.7rem" }}>
                    {moment(comment.createdAt).fromNow()}
                  </Typography>
                </Box>
                <Box sx={{ position: "absolute", right: 5 }}>
                  <Rating
                    disabled={edit.index !== index}
                    value={
                      edit.edit && edit.index === index
                        ? rating
                        : comment.rating
                    }
                    onChange={(e, newValue) => {
                      setRating(newValue);
                    }}
                  />
                  {userId === comment.userId || role === "admin" ? (
                    <Edit
                      sx={editButtonStyle}
                      onClick={() => editToggle(index)}
                    />
                  ) : (
                    ""
                  )}
                  {edit.index === index && edit.edit ? (
                    <>
                      <Done
                        sx={doneButtonStyle}
                        onClick={() => handleUpdatedComment(comment.id)}
                      />
                      <Delete
                        sx={deleteButtonStyle}
                        onClick={() => handleDeleteComment(comment.id)}
                      />
                    </>
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
                  value={edit.index === index ? editedComment : comment.comment}
                  onChange={(e) => handleEditComment(index, e.target.value)}
                />
              ) : (
                <Typography sx={{ pl: 7, pr: 2, pb: 1 }}>
                  {comment.comment}
                </Typography>
              )}

              <Divider />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  w: 1,
                  justifyContent: "space-between",
                }}
              >
                <Button
                  onClick={
                    comment.repliesCount !== 0
                      ? () => handleGetReplies(comment.id, index)
                      : () => null
                  }
                  variant="text"
                  sx={{ px: 1, textTransform: "lowercase" }}
                  startIcon={
                    comment.id === arrIndex ? <ExpandLess /> : <ExpandMore />
                  }
                  size="small"
                >
                  {comment.repliesCount <= 1
                    ? `${comment.repliesCount} respuesta`
                    : `${comment.repliesCount} respuestas`}
                </Button>
                <Box sx={{ pl: 1 }}>
                  <Button
                    size="small"
                    variant="text"
                    sx={{ textTransform: "capitalize" }}
                    onClick={() =>
                      setReply({
                        index,
                        commentId: comment.id,
                        text: "",
                      })
                    }
                  >
                    Responder
                  </Button>
                </Box>
              </Box>
              <Divider />

              {/* REPLY FORM */}

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
                        src={USER_IMG_URL + userImg}
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
                          <span style={{ color: "#4682B4" }}>
                            {`${comment.username}`}&nbsp;
                          </span>
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
                    <Button
                      onClick={() =>
                        handleReply(
                          comment.id,
                          reply.text!,
                          index,
                          comment.username,
                          comment.userId
                        )
                      }
                      size="small"
                      sx={{ textTransform: "capitalize", color: "#50C878" }}
                    >
                      Responder
                    </Button>
                    <Button
                      onClick={() => setReply({ ...reply, index: null })}
                      sx={{ textTransform: "capitalize", color: "#50C878" }}
                      size="small"
                    >
                      Cancelar
                    </Button>
                  </Box>
                </Paper>
              ) : (
                ""
              )}

              {/* RENDER REPLIES */}
            </Paper>
            <Replies
              comment={comment}
              replies={replies}
              userImg={userImg}
              userId={userId}
              token={token}
              role={role}
              handleGetReplies={handleGetReplies}
            />
          </Box>
        ))
      )}
    </>
  );
};

export default Comments;
