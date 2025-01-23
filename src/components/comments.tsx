import { useState } from "react";
import { useTaskStore } from "../store/tasks";
import type { Comment } from "../types/task";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";

interface CommentsProps {
  taskId: string;
  comments: Comment[];
}

export function Comments({ taskId, comments }: CommentsProps) {
  const [newComment, setNewComment] = useState("");
  const { addComment, deleteComment } = useTaskStore();

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(taskId, newComment.trim());
      setNewComment("");
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>
      <List>
        {comments.map((comment) => (
          <ListItem
            key={comment.id}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => deleteComment(taskId, comment.id)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={comment.content}
              secondary={format(
                new Date(comment.createdAt),
                "MMM d, yyyy HH:mm"
              )}
            />
          </ListItem>
        ))}
      </List>
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddComment();
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
        <Button variant="contained" onClick={handleAddComment}>
          Add Comment
        </Button>
      </Box>
    </Box>
  );
}
