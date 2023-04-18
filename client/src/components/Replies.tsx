import {
  Box,
  Paper,
  Avatar,
  Typography,
  Divider,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";
import { webApi } from "../helpers/animeApi";
import { toast } from "react-toastify";
import { getError } from "../helpers/handleErrors";
import { Delete, Done, Edit } from "@mui/icons-material";
import {
  deleteButtonStyle,
  doneButtonStyle,
  editButtonStyle,
} from "../helpers/customStyles";
import { USER_IMG_URL } from "../helpers/url";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import moment from "moment";

interface Props {
  comment: {
    id: string;
    username: string;
    userId: string;
    comment: string;
    userImg: string | null;
    repliesCount: number;
    createdAt: string;
  };

  replies: {
    id: string;
    username: string;
    reply: string;
    userId: string;
    createdAt: string;
    userImg: string | null;
    commentId: string;
    repliedToName: string;
    repliedToId: string;
  }[];
  userImg: string | undefined | null;
  userId: string | undefined;
  token: string | null;
  role: string | null;
  handleGetReplies: any;
}

const Replies = ({
  comment,
  replies,
  userImg,
  token,
  handleGetReplies,
  userId,
  role,
}: Props) => {
  const [reply, setReply] = useState<{
    index?: number | null;
    commentId?: string;
    text?: string;
  }>({
    index: null,
    commentId: "",
    text: "",
  });

  const [editedReply, setEditedReply] = useState<string>("");
  const [edit, setEdit] = useState<{ index?: number | null; edit: boolean }>({
    index: null,
    edit: false,
  });

  // UPDATE REPLY //
  const handleUpdatedReply = async (replyId: string) => {
    try {
      await webApi.put(
        `/reply/${replyId}`,
        {
          reply: editedReply,
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

  // EDIT REPLY //
  const handleEditReply = (index: number, value: string) => {
    const reply = [...replies];
    reply[index].reply = value;
    setEditedReply(reply[index].reply);
  };

  // TOGGLE EDIT //
  const editToggle = (index: number) => {
    if (edit.index !== index) {
      setEdit({
        index,
        edit: true,
      });
      setEditedReply(replies[index].reply);
    } else {
      setEdit({
        edit: false,
      });
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

      handleGetReplies(commentId);
      toast.success("Respondido");
      setReply({ ...reply, index: null });
    } catch (error) {
      toast.error(getError(error));
    }
  };

  // DELETE REPLY //
  const handleDeleteReply = async (id: string, commentId: string) => {
    try {
      Confirm.show(
        `¿Deseas borrar el comentario?`,
        ``,
        "Si",
        "No",
        async () => {
          await webApi.delete(`/reply/${id}`, {
            headers: { token },
          });
          toast.success("Has borrado el comentario");
          handleGetReplies(commentId);
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

  return replies.length > 0 ? (
    <>
      {replies.map((rep, index) => (
        <Box key={rep.id}>
          {rep.commentId === comment.id ? (
            <Paper elevation={0}>
              <Box sx={{ display: "flex", ml: 3, pt: 2 }}>
                <Box sx={{ display: "flex", pl: 2 }}>
                  {rep?.userImg ? (
                    <Paper
                      elevation={2}
                      component="img"
                      sx={{
                        objectFit: "cover",
                        height: 36,
                        width: 36,
                        borderRadius: "50%",
                        mr: 1,
                      }}
                      src={`${USER_IMG_URL}${rep.userId}/${rep?.userImg}`}
                    />
                  ) : (
                    <Avatar sx={{ width: 36, height: 36, mr: 1 }} />
                  )}
                </Box>
                <Box
                  sx={{
                    width: 1,
                    p: 1,
                    borderRadius: "5px",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <Box
                    sx={{
                      pr: 1,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography>{rep.username}</Typography>
                      <Typography sx={{ fontSize: 11 }}>
                        {moment(rep.createdAt).fromNow()}
                      </Typography>
                    </Box>
                    <Box>
                      {userId === rep.userId || role === "admin" ? (
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
                            onClick={() => handleUpdatedReply(rep.id)}
                          />
                          <Delete
                            sx={deleteButtonStyle}
                            onClick={() =>
                              handleDeleteReply(rep.id, rep.commentId)
                            }
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
                      value={rep.reply}
                      onChange={(e) => handleEditReply(index, e.target.value)}
                    />
                  ) : (
                    <Typography sx={{ pl: 1, mt: 1 }}>
                      <span style={{ color: "#4682B4" }}>
                        {rep.repliedToName}
                      </span>{" "}
                      {rep.reply}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  sx={{ textTransform: "capitalize", pr: 1 }}
                  size="small"
                  variant="text"
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
              {/* <Divider /> */}

              {/* REPLY */}

              {reply.index === index && reply.commentId === comment.id ? (
                <Paper elevation={0}>
                  {/* <Divider /> */}
                  <Box sx={{ display: "flex", pl: 5, pt: 1 }}>
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
                      <Avatar sx={{ width: 36, height: 36, mr: 1 }} />
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
                            {`${rep.username}`}&nbsp;
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
                          rep.username,
                          rep.userId
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
            </Paper>
          ) : (
            ""
          )}
        </Box>
      ))}
    </>
  ) : (
    <></>
  );
};

export default Replies;
