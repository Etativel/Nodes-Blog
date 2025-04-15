import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";

// dummy post
const postsData = [
  {
    id: "d5386468-4667-402a-9963-ad985efd90c7",
    title: "Post Title Example",
    excerpt: "This is a sample excerpt for the post.",
    status: "REPORTED",
    author: { username: "asdfadsfa" },
    createdAt: "2025-03-22T08:02:04.171Z",
    reports: [
      {
        id: "5f35fb3f-4798-4b87-a3ee-eebf05acab3c",
        type: "harassment",
        message:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio id blanditiis asperiores ipsum. Laborum autem placeat nemo, aperiam reprehenderit reiciendis, iste est ducimus nostrum labore repellendus, voluptatem enim aliquam voluptatum.",
        createdAt: "2025-04-14T05:36:27.827Z",
      },
      {
        id: "748fc927-1532-42ec-a7c0-90de2e1f5da9",
        type: "terrorism",
        message: "Content inciting fear.",
        createdAt: "2025-04-14T05:39:27.417Z",
      },
      {
        id: "5f35fb3f-4798-4b87-a3ee-eebf05acab3c",
        type: "harassment",
        message:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio id blanditiis asperiores ipsum. Laborum autem placeat nemo, aperiam reprehenderit reiciendis, iste est ducimus nostrum labore repellendus, voluptatem enim aliquam voluptatum.",
        createdAt: "2025-04-14T05:36:27.827Z",
      },
      {
        id: "748fc927-1532-42ec-a7c0-90de2e1f5da9",
        type: "terrorism",
        message: "Content inciting fear.",
        createdAt: "2025-04-14T05:39:27.417Z",
      },
      {
        id: "5f35fb3f-4798-4b87-a3ee-eebf05acab3c",
        type: "harassment",
        message:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio id blanditiis asperiores ipsum. Laborum autem placeat nemo, aperiam reprehenderit reiciendis, iste est ducimus nostrum labore repellendus, voluptatem enim aliquam voluptatum.",
        createdAt: "2025-04-14T05:36:27.827Z",
      },
      {
        id: "748fc927-1532-42ec-a7c0-90de2e1f5da9",
        type: "terrorism",
        message: "Content inciting fear.",
        createdAt: "2025-04-14T05:39:27.417Z",
      },
      {
        id: "5f35fb3f-4798-4b87-a3ee-eebf05acab3c",
        type: "harassment",
        message:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio id blanditiis asperiores ipsum. Laborum autem placeat nemo, aperiam reprehenderit reiciendis, iste est ducimus nostrum labore repellendus, voluptatem enim aliquam voluptatum.",
        createdAt: "2025-04-14T05:36:27.827Z",
      },
      {
        id: "748fc927-1532-42ec-a7c0-90de2e1f5da9",
        type: "terrorism",
        message: "Content inciting fear.",
        createdAt: "2025-04-14T05:39:27.417Z",
      },
      {
        id: "5f35fb3f-4798-4b87-a3ee-eebf05acab3c",
        type: "harassment",
        message:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio id blanditiis asperiores ipsum. Laborum autem placeat nemo, aperiam reprehenderit reiciendis, iste est ducimus nostrum labore repellendus, voluptatem enim aliquam voluptatum.",
        createdAt: "2025-04-14T05:36:27.827Z",
      },
      {
        id: "748fc927-1532-42ec-a7c0-90de2e1f5da9",
        type: "terrorism",
        message: "Content inciting fear.",
        createdAt: "2025-04-14T05:39:27.417Z",
      },
      {
        id: "5f35fb3f-4798-4b87-a3ee-eebf05acab3c",
        type: "harassment",
        message:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio id blanditiis asperiores ipsum. Laborum autem placeat nemo, aperiam reprehenderit reiciendis, iste est ducimus nostrum labore repellendus, voluptatem enim aliquam voluptatum.",
        createdAt: "2025-04-14T05:36:27.827Z",
      },
      {
        id: "748fc927-1532-42ec-a7c0-90de2e1f5da9",
        type: "terrorism",
        message: "Content inciting fear.",
        createdAt: "2025-04-14T05:39:27.417Z",
      },
      {
        id: "5f35fb3f-4798-4b87-a3ee-eebf05acab3c",
        type: "harassment",
        message:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio id blanditiis asperiores ipsum. Laborum autem placeat nemo, aperiam reprehenderit reiciendis, iste est ducimus nostrum labore repellendus, voluptatem enim aliquam voluptatum.",
        createdAt: "2025-04-14T05:36:27.827Z",
      },
      {
        id: "748fc927-1532-42ec-a7c0-90de2e1f5da9",
        type: "terrorism",
        message: "Content inciting fear.",
        createdAt: "2025-04-14T05:39:27.417Z",
      },
      {
        id: "5f35fb3f-4798-4b87-a3ee-eebf05acab3c",
        type: "harassment",
        message:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio id blanditiis asperiores ipsum. Laborum autem placeat nemo, aperiam reprehenderit reiciendis, iste est ducimus nostrum labore repellendus, voluptatem enim aliquam voluptatum.",
        createdAt: "2025-04-14T05:36:27.827Z",
      },
      {
        id: "748fc927-1532-42ec-a7c0-90de2e1f5da9",
        type: "terrorism",
        message: "Content inciting fear.",
        createdAt: "2025-04-14T05:39:27.417Z",
      },
      {
        id: "5f35fb3f-4798-4b87-a3ee-eebf05acab3c",
        type: "harassment",
        message:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio id blanditiis asperiores ipsum. Laborum autem placeat nemo, aperiam reprehenderit reiciendis, iste est ducimus nostrum labore repellendus, voluptatem enim aliquam voluptatum.",
        createdAt: "2025-04-14T05:36:27.827Z",
      },
      {
        id: "748fc927-1532-42ec-a7c0-90de2e1f5da9",
        type: "terrorism",
        message: "Content inciting fear.",
        createdAt: "2025-04-14T05:39:27.417Z",
      },
      {
        id: "5f35fb3f-4798-4b87-a3ee-eebf05acab3c",
        type: "harassment",
        message:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio id blanditiis asperiores ipsum. Laborum autem placeat nemo, aperiam reprehenderit reiciendis, iste est ducimus nostrum labore repellendus, voluptatem enim aliquam voluptatum.",
        createdAt: "2025-04-14T05:36:27.827Z",
      },
      {
        id: "748fc927-1532-42ec-a7c0-90de2e1f5da9",
        type: "terrorism",
        message: "Content inciting fear.",
        createdAt: "2025-04-14T05:39:27.417Z",
      },
      {
        id: "5f35fb3f-4798-4b87-a3ee-eebf05acab3c",
        type: "harassment",
        message:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio id blanditiis asperiores ipsum. Laborum autem placeat nemo, aperiam reprehenderit reiciendis, iste est ducimus nostrum labore repellendus, voluptatem enim aliquam voluptatum.",
        createdAt: "2025-04-14T05:36:27.827Z",
      },
      {
        id: "748fc927-1532-42ec-a7c0-90de2e1f5da9",
        type: "terrorism",
        message: "Content inciting fear.",
        createdAt: "2025-04-14T05:39:27.417Z",
      },
      {
        id: "5f35fb3f-4798-4b87-a3ee-eebf05acab3c",
        type: "harassment",
        message:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio id blanditiis asperiores ipsum. Laborum autem placeat nemo, aperiam reprehenderit reiciendis, iste est ducimus nostrum labore repellendus, voluptatem enim aliquam voluptatum.",
        createdAt: "2025-04-14T05:36:27.827Z",
      },
      {
        id: "748fc927-1532-42ec-a7c0-90de2e1f5da9",
        type: "terrorism",
        message: "Content inciting fear.",
        createdAt: "2025-04-14T05:39:27.417Z",
      },
      {
        id: "5f35fb3f-4798-4b87-a3ee-eebf05acab3c",
        type: "harassment",
        message:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio id blanditiis asperiores ipsum. Laborum autem placeat nemo, aperiam reprehenderit reiciendis, iste est ducimus nostrum labore repellendus, voluptatem enim aliquam voluptatum.",
        createdAt: "2025-04-14T05:36:27.827Z",
      },
      {
        id: "748fc927-1532-42ec-a7c0-90de2e1f5da9",
        type: "terrorism",
        message: "Content inciting fear.",
        createdAt: "2025-04-14T05:39:27.417Z",
      },
      {
        id: "5f35fb3f-4798-4b87-a3ee-eebf05acab3c",
        type: "harassment",
        message:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio id blanditiis asperiores ipsum. Laborum autem placeat nemo, aperiam reprehenderit reiciendis, iste est ducimus nostrum labore repellendus, voluptatem enim aliquam voluptatum.",
        createdAt: "2025-04-14T05:36:27.827Z",
      },
      {
        id: "748fc927-1532-42ec-a7c0-90de2e1f5da9",
        type: "terrorism",
        message: "Content inciting fear.",
        createdAt: "2025-04-14T05:39:27.417Z",
      },
      {
        id: "5f35fb3f-4798-4b87-a3ee-eebf05acab3c",
        type: "harassment",
        message:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio id blanditiis asperiores ipsum. Laborum autem placeat nemo, aperiam reprehenderit reiciendis, iste est ducimus nostrum labore repellendus, voluptatem enim aliquam voluptatum.",
        createdAt: "2025-04-14T05:36:27.827Z",
      },
      {
        id: "748fc927-1532-42ec-a7c0-90de2e1f5da9",
        type: "terrorism",
        message: "Content inciting fear.",
        createdAt: "2025-04-14T05:39:27.417Z",
      },
      {
        id: "5f35fb3f-4798-4b87-a3ee-eebf05acab3c",
        type: "harassment",
        message:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio id blanditiis asperiores ipsum. Laborum autem placeat nemo, aperiam reprehenderit reiciendis, iste est ducimus nostrum labore repellendus, voluptatem enim aliquam voluptatum.",
        createdAt: "2025-04-14T05:36:27.827Z",
      },
      {
        id: "748fc927-1532-42ec-a7c0-90de2e1f5da9",
        type: "terrorism",
        message: "Content inciting fear.",
        createdAt: "2025-04-14T05:39:27.417Z",
      },
      {
        id: "5f35fb3f-4798-4b87-a3ee-eebf05acab3c",
        type: "harassment",
        message:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio id blanditiis asperiores ipsum. Laborum autem placeat nemo, aperiam reprehenderit reiciendis, iste est ducimus nostrum labore repellendus, voluptatem enim aliquam voluptatum.",
        createdAt: "2025-04-14T05:36:27.827Z",
      },
      {
        id: "748fc927-1532-42ec-a7c0-90de2e1f5da9",
        type: "terrorism",
        message: "Content inciting fear.",
        createdAt: "2025-04-14T05:39:27.417Z",
      },
      {
        id: "5f35fb3f-4798-4b87-a3ee-eebf05acab3c",
        type: "harassment",
        message:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio id blanditiis asperiores ipsum. Laborum autem placeat nemo, aperiam reprehenderit reiciendis, iste est ducimus nostrum labore repellendus, voluptatem enim aliquam voluptatum.",
        createdAt: "2025-04-14T05:36:27.827Z",
      },
      {
        id: "748fc927-1532-42ec-a7c0-90de2e1f5da9",
        type: "terrorism",
        message: "Content inciting fear.",
        createdAt: "2025-04-14T05:39:27.417Z",
      },
      {
        id: "5f35fb3f-4798-4b87-a3ee-eebf05acab3c",
        type: "harassment",
        message:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio id blanditiis asperiores ipsum. Laborum autem placeat nemo, aperiam reprehenderit reiciendis, iste est ducimus nostrum labore repellendus, voluptatem enim aliquam voluptatum.",
        createdAt: "2025-04-14T05:36:27.827Z",
      },
      {
        id: "748fc927-1532-42ec-a7c0-90de2e1f5da9",
        type: "terrorism",
        message: "Content inciting fear.",
        createdAt: "2025-04-14T05:39:27.417Z",
      },
      {
        id: "5f35fb3f-4798-4b87-a3ee-eebf05acab3c",
        type: "harassment",
        message:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio id blanditiis asperiores ipsum. Laborum autem placeat nemo, aperiam reprehenderit reiciendis, iste est ducimus nostrum labore repellendus, voluptatem enim aliquam voluptatum.",
        createdAt: "2025-04-14T05:36:27.827Z",
      },
      {
        id: "748fc927-1532-42ec-a7c0-90de2e1f5da9",
        type: "terrorism",
        message: "Content inciting fear.",
        createdAt: "2025-04-14T05:39:27.417Z",
      },
      {
        id: "5f35fb3f-4798-4b87-a3ee-eebf05acab3c",
        type: "harassment",
        message:
          "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio id blanditiis asperiores ipsum. Laborum autem placeat nemo, aperiam reprehenderit reiciendis, iste est ducimus nostrum labore repellendus, voluptatem enim aliquam voluptatum.",
        createdAt: "2025-04-14T05:36:27.827Z",
      },
      {
        id: "748fc927-1532-42ec-a7c0-90de2e1f5da9",
        type: "terrorism",
        message: "Content inciting fear.",
        createdAt: "2025-04-14T05:39:27.417Z",
      },
    ],
  },
];

export default function Posts() {
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);

  const [openReview, setOpenReview] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [selectedPostForReview, setSelectedPostForReview] = useState(null);

  const handleOpenDetails = (reports) => {
    setSelectedReports(reports);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedReports([]);
  };

  const handleOpenReview = (post) => {
    setSelectedPostForReview(post);
    setReviewComment("");
    setOpenReview(true);
  };

  const handleCloseReview = () => {
    setOpenReview(false);
    setSelectedPostForReview(null);
  };

  const handleSubmitReview = () => {
    console.log("Review for post", selectedPostForReview.id, reviewComment);
    setOpenReview(false);
  };

  return (
    <Box p={3} pt={2}>
      <Typography variant="h4" gutterBottom>
        Posts Moderation
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="posts table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reports</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {postsData.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {post.title}
                  </Typography>
                  <Typography variant="caption">{post.excerpt}</Typography>
                </TableCell>
                <TableCell>{post.author.username}</TableCell>
                <TableCell>
                  <Typography
                    color={post.status === "REPORTED" ? "error" : "textPrimary"}
                  >
                    {post.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  {post.reports.length}{" "}
                  {post.reports.length > 0 && (
                    <Button
                      size="small"
                      onClick={() => handleOpenDetails(post.reports)}
                    >
                      View Details
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(post.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => handleOpenReview(post)}
                    sx={{ mr: 1 }}
                  >
                    Review
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="secondary"
                    sx={{ mr: 1 }}
                    href={`http://localhost:5173/post/${post.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Preview
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="success"
                    sx={{ mr: 1 }}
                  >
                    Approve
                  </Button>
                  <Button variant="contained" size="small" color="error">
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Viewing Report Details */}
      <Dialog
        open={openDetails}
        onClose={handleCloseDetails}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Report Details</DialogTitle>
        <DialogContent dividers>
          {selectedReports.length ? (
            <List>
              {selectedReports.map((report) => (
                <ListItem key={report.id} divider>
                  <ListItemText
                    primary={`Type: ${report.type}`}
                    secondary={`Message: ${
                      report.message || "No additional details."
                    }
                    Reported on: ${new Date(
                      report.createdAt
                    ).toLocaleString()}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No reports found for this post.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Reviewing a Post */}
      <Dialog
        open={openReview}
        onClose={handleCloseReview}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Review Post</DialogTitle>
        <DialogContent dividers>
          {selectedPostForReview && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                {selectedPostForReview.title}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {selectedPostForReview.excerpt}
              </Typography>
              <TextField
                label="Add your review or feedback"
                multiline
                fullWidth
                rows={4}
                variant="outlined"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                margin="normal"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReview} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            color="primary"
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
