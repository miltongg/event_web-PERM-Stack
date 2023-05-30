import {
  Box,
  Paper,
  Avatar,
  Typography,
  Divider,
  TextField,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { webApi } from "../helpers/animeApi";
import { toast } from "react-toastify";
import { getError } from "../helpers/handleErrors";
import { AccessTime, Delete, Done, Edit } from "@mui/icons-material";
import {
  deleteButtonStyle,
  doneButtonStyle,
  editButtonStyle,
} from "../helpers/customStyles";
import { USER_IMG_URL } from "../helpers/url";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import moment from "moment";

interface Props {
  id: string;
  userImg?: string | undefined | null;
  userId?: string | undefined;
  token?: string | null;
  role?: string | null;
  commentData: { id: string | null; repCount: number; index: number | null };
  actualizeCommentReplyStatus: (incRep: boolean) => void;
  updateCommentsCount: (operation: string) => void;
}

interface IReplies {
  id: string;
  username: string;
  reply: string;
  userId: string;
  createdAt: string;
  userImg: string | null;
  commentId: string;
  repliedToName: string;
  repliedToId: string;
}

const Replies = ({
  id,
  userImg,
  token,
  userId,
  commentData,
  actualizeCommentReplyStatus,
  updateCommentsCount,
  role,
}: Props) => {
  const [replies, setReplies] = useState<IReplies[]>([]);
  const [editedReply, setEditedReply] = useState<string>("");
  const [edit, setEdit] = useState<{ index?: number | null; edit: boolean }>({
    index: null,
    edit: false,
  });

  const [loading, setLoading] = useState(false);

  const [rep, setRep] = useState<{
    index?: number | null;
    commentId?: string;
    text?: string;
  }>({
    index: null,
    commentId: "",
    text: "",
  });

  // GET REPLIES //
  useEffect(() => {
    if (commentData?.id) {
      const handleGetReplies = async (commentId: string) => {
        setLoading(true);
        try {
          const { data } = await webApi.get(`/reply/${commentId}`);
          setReplies(data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          toast.error(getError(error));
        }
      };
      handleGetReplies(commentData.id);
    }
  }, [commentData]);

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

  // REPLY TO A REPLY //
  const handleReply = async (
    commentId: string,
    replyText: string,
    index: number,
    repliedToName: string,
    repliedToId: string
  ) => {
    try {
      const { data } = await webApi.post(
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

      actualizeCommentReplyStatus(true);
      setReplies([...replies, data]);
      updateCommentsCount("sum");

      toast.success("Respondido");
      setRep({ ...rep, index: null });
    } catch (error) {
      toast.error(getError(error));
    }
  };

  // DELETE REPLY //
  const handleDeleteReply = async (id: string) => {
    try {
      Confirm.show(
        `¿Deseas borrar el comentario?`,
        ``,
        "Si",
        "No",
        async () => {
          setLoading(true);
          await webApi.delete(`/reply/${id}`, {
            headers: { token },
          });

          setReplies(replies.filter((reply) => reply.id !== id));
          setEdit({ ...edit, edit: false });
          actualizeCommentReplyStatus(false);
          updateCommentsCount("minus");
          toast.success("Has borrado el comentario");
          setLoading(false);
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
      setLoading(false);
      toast.error(getError(error));
    }
  };

  return replies.length > 0 ? (
    <>
      {/*// RENDER REPLIES //*/}
      {replies.map((reply, index) => (
        <Box key={reply.id}>
          {reply.commentId === commentData.id ? (
            <Paper elevation={0}>
              <Box sx={{ display: "flex", ml: 3, pt: 2 }}>
                <Box sx={{ display: "flex", pl: 2 }}>
                  {reply?.userImg ? (
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
                      src={`${USER_IMG_URL}${reply.userId}/${reply?.userImg}`}
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
                      <Typography>{reply.username}</Typography>
                      <Box sx={{ fontSize: 11, color: "#6677FF" }}>
                        <AccessTime sx={{ fontSize: 11 }} />{" "}
                        {moment(reply.createdAt).fromNow()}
                      </Box>
                    </Box>
                    <Box>
                      {userId === reply.userId || role === "admin" ? (
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
                            onClick={() => handleUpdatedReply(reply.id)}
                          />
                          <Delete
                            sx={deleteButtonStyle}
                            onClick={() => handleDeleteReply(reply.id)}
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
                      value={reply.reply}
                      onChange={(e) => handleEditReply(index, e.target.value)}
                    />
                  ) : (
                    <Typography sx={{ mt: 1 }}>
                      <span style={{ color: "#4682B4" }}>
                        {reply.repliedToName}
                      </span>{" "}
                      {reply.reply}
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
                    setRep({
                      index,
                      commentId: commentData.id!,
                      text: "",
                    })
                  }
                >
                  Responder
                </Button>
              </Box>
              <Divider />

              {/*// REPLY FORM TO REPLY // */}

              {rep.index === index && reply.commentId === commentData.id ? (
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
                      value={`${rep.text}`}
                      InputProps={{
                        startAdornment: (
                          <span style={{ color: "#4682B4" }}>
                            {`${reply.username}`}&nbsp;
                          </span>
                        ),
                      }}
                      onChange={(e) => setRep({ ...rep, text: e.target.value })}
                    />
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", pr: 1 }}
                  >
                    <Button
                      onClick={() =>
                        handleReply(
                          commentData.id!,
                          rep.text!,
                          index,
                          reply.username,
                          reply.userId
                        )
                      }
                      size="small"
                      sx={{ textTransform: "capitalize", color: "#50C878" }}
                    >
                      Responder
                    </Button>
                    <Button
                      onClick={() => setRep({ ...rep, index: null })}
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
