import React, { useState } from "react"
import { useTaskStore } from "../store/tasks"
import type { Comment } from "../types/task"
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Avatar,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import { format } from "date-fns"

interface CommentsProps {
  taskId: string
  comments: Comment[]
}

export function Comments({ taskId, comments }: CommentsProps) {
  const [newComment, setNewComment] = useState("")
  const { addComment, deleteComment } = useTaskStore()

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(taskId, newComment.trim())
      setNewComment("")
    }
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Comments
      </Typography>
      <List>
        {comments.map((comment, index) => (
          <React.Fragment key={comment.id}>
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => deleteComment(taskId, comment.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>{comment.content[0].toUpperCase()}</Avatar>
              <ListItemText
                primary={comment.content}
                secondary={
                  <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.secondary">
                    {format(new Date(comment.createdAt), "MMM d, yyyy HH:mm")}
                  </Typography>
                }
              />
            </ListItem>
            {index < comments.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault()
          handleAddComment()
        }}
        sx={{ mt: 2 }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Button variant="contained" onClick={handleAddComment} sx={{ borderRadius: "20px" }}>
          Add Comment
        </Button>
      </Box>
    </Box>
  )
}

