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

interface Props {
  comment: {
    id: string;
    username: string;
    userId: string;
    comment: string;
    userImg: string;
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
    repliedToId: string
  }[];
  userImg: string | undefined | null;
  token: string | null;
  handleGetReplies: any
}

const Replies = ({ comment, replies, userImg, token, handleGetReplies }: Props) => {
  const [reply, setReply] = useState<{
    index?: number | null;
    commentId?: string;
    text?: string;
  }>({
    index: null,
    commentId: "",
    text: "",
  });

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
          repliedToId
        },
        {
          headers: { token },
        }
      );

      await webApi.put(
        `/comment/${commentId}`,
        {
          repliesCount: comment.repliesCount + 1,
        },
        {
          headers: { token },
        }
      );
      handleGetReplies(commentId)
      toast.success("Respondido");
      setReply({ ...reply, index: null });
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return replies.length > 0 ? (
    <>
      {replies.map((rep, index) => (
        <Box key={rep.id}>
          {rep.commentId === comment.id ? (
            <Paper elevation={0}>
              <Box sx={{ display: "flex", ml: 3, my: 2 }}>
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
                      src={`http://localhost:4000/api/uploads/img/avatar/${rep?.userImg}`}
                    />
                  ) : (
                    <Avatar sx={{ width: 36, height: 36 }} />
                  )}
                </Box>
                <Box sx={{ width: 1 }}>
                  <Typography sx={{ pl: 1 }}>{rep.username}</Typography>
                  <Typography sx={{ pl: 1, fontSize: 11 }}>
                    {rep.createdAt}
                  </Typography>
                  <Typography sx={{ pl: 1, mt: 1 }}>
                    <span style={{ color: "#4682B4" }}>{rep.repliedToName}</span>{" "}
                    {rep.reply}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  sx={{ textTransform: "capitalize", pr: 1 }}
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
              <Divider />

              {/* REPLY */}

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
                      sx={{ textTransform: "capitalize" }}
                    >
                      Responder
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
