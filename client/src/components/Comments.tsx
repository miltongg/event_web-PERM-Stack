import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AccessTime,
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
  id: string;
  userId: string | undefined;
  token: string | null;
  role: string | null;
  userImg: string | null | undefined;
  updateCommentsCount: (number: number) => void;
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

// interface IReplies {
//   id: string;
//   username: string;
//   reply: string;
//   createdAt: string;
//   userId: string;
//   userImg: string | null;
//   commentId: string;
//   repliedToName: string;
//   repliedToId: string;
// }

const Comments = ({
  id,
  userId,
  userImg,
  token,
  role,
  updateCommentsCount,
}: Props) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<IComment[]>([]);
  const [commentData, setCommentData] = useState<{
    id: string | null;
    repCount: number;
    index: number | null;
  }>({
    id: null,
    repCount: 0,
    index: null,
  });
  const [editedComment, setEditedComment] = useState<string>("");
  const [edit, setEdit] = useState<{ index?: number | null; edit: boolean }>({
    index: null,
    edit: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [showReplies, setShowReplies] = useState<number | null>(null);

  const showHideReplies = (commentId: string, index: number) => {
    if (showReplies === index) {
      setCommentData({ ...commentData, id: null, index: null });
      setShowReplies(null);
    } else {
      setCommentData({ ...commentData, id: commentId, index });
      setShowReplies(index);
    }
  };

  const [reply, setReply] = useState<{
    index?: number | null;
    commentId?: string;
    text?: string;
  }>({
    index: null,
    commentId: "",
    text: "",
  });

  const [arrIndex, setArrIndex] = useState<string>("");
  const [rating, setRating] = useState<number | null>(0);

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
  }, []);

  // UPDATE EVENTS COMMENTS COUNT //
  useEffect(() => {
    updateCommentsCount(comments?.length);
  }, [comments]);

  // POST COMMENT //
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data } = await webApi.post(
        "/comment",
        {
          comment,
          elementId: id,
          rating,
        },
        {
          headers: {
            token,
          },
        }
      );

      setComments([...comments, data]);
      setComment("");
      setLoading(false);

      toast.success("Comentario añadido");
    } catch (error: any) {
      setLoading(false);
      toast.error(getError(error));
    }
  };

  // EDIT COMMENT //
  const handleEditComment = (index: number, value: string) => {
    const comment = [...comments];
    comment[index].comment = value;
    setEditedComment(comment[index].comment);
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

      // UPDATE COMMENT RATING STATUS //
      comments.map((com: any) => {
        if (com.id === commentId) {
          com.comment = editedComment;
          com.rating = rating;
        }
      });

      setComments(comments);
      setEdit({ edit: false });
      toast.success("Has actualizado tu comentario");
    } catch (error: any) {
      console.error(error);
      toast.error(getError(error));
    }
  };

  // REPLY A COMMENT //
  const handleReply = async (
    commentId: string,
    replyText: string,
    index: number,
    repliedToName: string,
    repliedToId: string
  ) => {
    try {
      setLoading(true);
      await webApi.post(
        "/reply",
        {
          commentId,
          reply: replyText,
          repliedToName,
          repliedToId,
          elementId: id,
        },
        {
          headers: { token },
        }
      );

      toast.success("Respondido");
      setReply({ ...reply, index: null });
      setComments(
        comments.map((com) => {
          return com.id === commentId
            ? { ...com, repliesCount: Number(com.repliesCount) + 1 }
            : com;
        })
      );
      setCommentData({ ...commentData, id: commentId });
      setLoading(false);
      // setShowReplies(true)
    } catch (error) {
      setLoading(false);
      toast.error(getError(error));
    }
  };

  const actualizeCommentReplyStatus = (incRep: boolean) => {
    setComments(
      comments.map((com) => {
        return com.id === commentData.id
          ? {
              ...com,
              repliesCount: incRep
                ? Number(com.repliesCount) + 1
                : com.repliesCount - 1,
            }
          : com;
      })
    );
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

          setComments(comments.filter((com) => com.id !== id));

          toast.success("Has borrado el comentario");
          setEdit({ index: null, edit: false });
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
      ) : (
        // ) : comments.find((i) => i.userId === userId) ? (
        //   ""
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
              value={comment}
              label="Deja tu comentario"
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ my: 2 }}
              startIcon={<Comment />}
              disabled={loading}
            >
              Comentar
            </Button>
          </Box>
        </Paper>
      )}

      {/* RENDER COMMENTS */}
      {comments.length === 0 ? (
        <Typography sx={{ textAlign: "center" }}>
          No hay comentarios, se el primero en comentar
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
                    src={`${USER_IMG_URL}${comment.userId}/${comment.userImg}`}
                  />
                ) : (
                  <Avatar sx={{ mr: 1 }} />
                )}
                <Box>
                  <Typography>{comment.username}</Typography>
                  <Box sx={{ fontSize: 11, color: "#6677FF" }}>
                    <AccessTime sx={{ fontSize: 11 }} />{" "}
                    {moment(comment.createdAt).fromNow()}
                  </Box>
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
                <Typography sx={{ pl: 9, pr: 2, pb: 1 }}>
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
                      ? () => showHideReplies(comment.id, index)
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

              {/*// REPLY FORM //*/}
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
                        src={`${USER_IMG_URL}${userId}/${userImg}`}
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
                            style={{
                              color: "#4682B4",
                            }}
                          >
                            {`${comment.username}`}
                            &nbsp;
                          </span>
                        ),
                      }}
                      onChange={(e) =>
                        setReply({
                          ...reply,
                          text: e.target.value,
                        })
                      }
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      pr: 1,
                    }}
                  >
                    <Button
                      disabled={loading}
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
                      sx={{
                        textTransform: "capitalize",
                        color: "#50C878",
                      }}
                    >
                      Responder
                    </Button>
                    <Button
                      onClick={() =>
                        setReply({
                          ...reply,
                          index: null,
                        })
                      }
                      sx={{
                        textTransform: "capitalize",
                        color: "#50C878",
                      }}
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
            {comment.id === commentData.id ? (
              <Replies
                id={id}
                userImg={userImg}
                userId={userId}
                token={token}
                role={role}
                commentData={commentData}
                actualizeCommentReplyStatus={actualizeCommentReplyStatus}
              />
            ) : (
              <></>
            )}
          </Box>
        ))
      )}
    </>
  );
};

export default Comments;
