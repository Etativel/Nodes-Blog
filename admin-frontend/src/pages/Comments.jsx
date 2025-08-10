import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Tooltip,
  Chip,
  Collapse,
  Divider,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReplyIcon from "@mui/icons-material/Reply";
import FilterListIcon from "@mui/icons-material/FilterList";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

export default function Comments() {
  // State for the details dialog
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  // State for the review dialog
  const [openReview, setOpenReview] = useState(false);
  const [reviewAction, setReviewAction] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  // State for expanded rows
  const [expandedRows, setExpandedRows] = useState({});

  // State for filters
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [reactionFilter, setReactionFilter] = useState("ALL");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hasRepliesFilter, setHasRepliesFilter] = useState("ALL");

  // State for filtered data
  const [filteredComments, setFilteredComments] = useState([]);

  // State for notification
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    severity: "success",
  });

  const [commentsData, setCommentsData] = useState([]);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  async function fetchCommentsData() {
    try {
      const response = await fetch(
        "https://nodes-blog-api-production.up.railway.app/admin-comments-api/all-comments",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.log("Failed to fetch dashboard data", response.status);
      }
      const data = await response.json();
      setCommentsData(data.comments || []);
      setFilteredComments(data.comments || []);
    } catch (error) {
      console.log(error);
      setCommentsData([]);
      setFilteredComments([]);
    }
  }
  useEffect(() => {
    fetchCommentsData();
  }, []);

  // Load initial data
  useEffect(() => {
    setFilteredComments(commentsData);
  }, [commentsData]);

  // Apply filters whenever criteria change
  useEffect(() => {
    let result = [...commentsData];

    // Filter by search query (content, username, post title)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (comment) =>
          comment.content.toLowerCase().includes(query) ||
          comment.author.username.toLowerCase().includes(query) ||
          comment.post.title.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== "ALL") {
      result = result.filter((comment) => comment.status === statusFilter);
    }

    // Filter by reaction type
    if (reactionFilter !== "ALL") {
      result = result.filter((comment) =>
        comment.reactions.some(
          (reaction) => reaction.reaction === reactionFilter
        )
      );
    }

    // Filter by date range
    if (startDate) {
      const startTime = startDate.setHours(0, 0, 0, 0);
      result = result.filter(
        (comment) => new Date(comment.createdAt) >= startTime
      );
    }

    if (endDate) {
      const endTime = new Date(endDate);
      endTime.setHours(23, 59, 59, 999);
      result = result.filter(
        (comment) => new Date(comment.createdAt) <= endTime
      );
    }

    // Filter by has replies
    if (hasRepliesFilter === "HAS_REPLIES") {
      result = result.filter(
        (comment) => comment.replies && comment.replies.length > 0
      );
    } else if (hasRepliesFilter === "NO_REPLIES") {
      result = result.filter(
        (comment) => !comment.replies || comment.replies.length === 0
      );
    }

    // Sort by most recent first
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredComments(result);
    setPage(0); // Reset to first page when filters change
  }, [
    searchQuery,
    statusFilter,
    reactionFilter,
    startDate,
    endDate,
    hasRepliesFilter,
    commentsData,
  ]);

  // Handle row expansion
  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Open comment details dialog
  const handleOpenDetails = (comment) => {
    setSelectedComment(comment);
    setOpenDetails(true);
  };

  // Close comment details dialog
  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedComment(null);
  };

  // Open review dialog
  const handleOpenReview = (comment, action) => {
    setSelectedComment(comment);
    setReviewAction(action);
    setReviewComment("");
    setOpenReview(true);
  };

  // Close review dialog
  const handleCloseReview = () => {
    setOpenReview(false);
    setSelectedComment(null);
    setReviewAction("");
  };

  // Submit the review/moderation action
  const handleSubmitReview = async () => {
    console.log(selectedComment.id);
    try {
      const response = await fetch(
        `https://nodes-blog-api-production.up.railway.app/admin-comments-api/delete-comment/${selectedComment.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        if (response.status === 403) {
          return alert("You need to be superAdmin to perform this action");
        }
        console.log("Failed to delete comment", response.statusText);
      }

      await response.json();
      console.log("Comment deleted successfully");
      fetchCommentsData();
      setNotification({
        show: true,
        message: `Comment successfully ${reviewAction.toLowerCase()}ed!`,
        severity: "success",
      });

      setOpenReview(false);
    } catch (error) {
      console.log(error);
      setNotification({
        show: true,
        message: `Error: Failed to ${reviewAction.toLowerCase()} comment.`,
        severity: "error",
      });

      setTimeout(() => {
        setNotification({ show: false, message: "", severity: "success" });
      }, 3000);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setReactionFilter("ALL");
    setStartDate(null);
    setEndDate(null);
    setHasRepliesFilter("ALL");
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get reaction counts
  const getReactionCounts = (reactions) => {
    const likes = reactions.filter((r) => r.reaction === "LIKE").length;
    const dislikes = reactions.filter((r) => r.reaction === "DISLIKE").length;
    return { likes, dislikes };
  };

  // Slice the array for pagination
  const paginatedComments = filteredComments
    ? filteredComments.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      )
    : [];

  if (commentsData.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">
            Loading posts data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Box p={3} pt={2}>
      <h2 className="text-2xl font-bold text-gray-800">Comments moderation</h2>
      <p className="mt-1 text-sm text-gray-600 mb-4">
        Monitor and moderate user comments across the platform
      </p>

      {/* Notification Alert */}
      {notification.show && (
        <Alert
          severity={notification.severity}
          sx={{ mb: 2 }}
          onClose={() => setNotification({ ...notification, show: false })}
        >
          {notification.message}
        </Alert>
      )}

      {/* Search and Basic Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Content Search */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search comments, users or posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery("")}
                      edge="end"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>

          {/* Status Filter */}
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                displayEmpty
                variant="outlined"
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="REPORTED">Reported</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Toggle Advanced Filters Button */}
          <Grid item xs={6} md={2}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              size="small"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide Filters" : "More Filters"}
            </Button>
          </Grid>

          {/* Clear Filters Button */}
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              fullWidth
              onClick={clearFilters}
            >
              Clear All Filters
            </Button>
          </Grid>

          {/* Advanced Filters Collapsible Section */}
          <Grid item xs={12}>
            <Collapse in={showFilters}>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {/* Reaction Filter */}
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <Typography variant="caption" gutterBottom>
                      Reaction Type
                    </Typography>
                    <Select
                      value={reactionFilter}
                      onChange={(e) => setReactionFilter(e.target.value)}
                      displayEmpty
                      variant="outlined"
                    >
                      <MenuItem value="ALL">All Reactions</MenuItem>
                      <MenuItem value="LIKE">Likes</MenuItem>
                      <MenuItem value="DISLIKE">Dislikes</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Has Replies Filter */}
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <Typography variant="caption" gutterBottom>
                      Reply Status
                    </Typography>
                    <Select
                      value={hasRepliesFilter}
                      onChange={(e) => setHasRepliesFilter(e.target.value)}
                      displayEmpty
                      variant="outlined"
                    >
                      <MenuItem value="ALL">All Comments</MenuItem>
                      <MenuItem value="HAS_REPLIES">Has Replies</MenuItem>
                      <MenuItem value="NO_REPLIES">No Replies</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Date Range Filters */}
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" gutterBottom>
                    Date Range
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="To"
                          value={endDate}
                          onChange={(newValue) => {
                            setEndDate(newValue);
                          }}
                          minDate={startDate}
                          slotProps={{
                            textField: {
                              size: "small",
                              fullWidth: true,
                              InputProps: {
                                endAdornment: endDate && (
                                  <InputAdornment position="end">
                                    <IconButton
                                      size="small"
                                      onClick={() => setEndDate(null)}
                                      edge="end"
                                    >
                                      <ClearIcon fontSize="small" />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              },
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Collapse>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Count */}
      <Box
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="body2" color="textSecondary">
          Showing {Math.min(rowsPerPage, filteredComments.length)} of{" "}
          {filteredComments.length} comments
          {(searchQuery ||
            statusFilter !== "ALL" ||
            reactionFilter !== "ALL" ||
            hasRepliesFilter !== "ALL" ||
            startDate ||
            endDate) &&
            " (filtered)"}
        </Typography>
      </Box>

      {/* Comments Table */}
      <TableContainer component={Paper}>
        <Table aria-label="comments table">
          <TableHead>
            <TableRow>
              <TableCell width="5%"></TableCell>
              <TableCell width="40%">Comment Content</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Post</TableCell>
              <TableCell>Reactions</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedComments.length > 0 ? (
              paginatedComments.map((comment) => {
                const { likes, dislikes } = getReactionCounts(
                  comment.reactions
                );
                return (
                  <React.Fragment key={comment.id}>
                    <TableRow
                      sx={{
                        backgroundColor:
                          comment.status === "REPORTED" ? "#FFF4F4" : "inherit",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                    >
                      <TableCell>
                        {comment.replies && comment.replies.length > 0 && (
                          <IconButton
                            size="small"
                            onClick={() => toggleRowExpansion(comment.id)}
                          >
                            {expandedRows[comment.id] ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </IconButton>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ maxWidth: "100%", wordBreak: "break-word" }}>
                          <Typography
                            variant="body2"
                            component="div"
                            sx={{
                              mb: 1,
                              minWidth: 200, // 👈 adjust the value as needed
                              fontWeight:
                                comment.status === "REPORTED"
                                  ? "bold"
                                  : "normal",
                            }}
                          >
                            {comment.content.length > 150
                              ? `${comment.content.substring(0, 150)}...`
                              : comment.content}
                          </Typography>
                          {comment.reports && comment.reports.length > 0 && (
                            <Box mt={1}>
                              <Chip
                                label={`${comment.reports.length} Report${
                                  comment.reports.length > 1 ? "s" : ""
                                }`}
                                size="small"
                                color="error"
                                variant="outlined"
                                onClick={() => handleOpenDetails(comment)}
                              />
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Typography variant="body2">
                            {comment.author.username}
                          </Typography>
                          {/* {comment.author.role === "ADMIN" ? (
                            <Chip
                              size="small"
                              label="ADMIN"
                              color="primary"
                              sx={{ ml: 1 }}
                            />
                          ) : null} */}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={comment.post.title}>
                          <Typography
                            variant="body2"
                            display="flex"
                            sx={{ maxWidth: "150px" }}
                          >
                            {comment.post.title}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <ThumbUpIcon
                            fontSize="small"
                            color="action"
                            sx={{ mr: 0.5 }}
                          />
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {likes}
                          </Typography>
                          <ThumbDownIcon
                            fontSize="small"
                            color="action"
                            sx={{ mr: 0.5 }}
                          />
                          <Typography variant="body2">{dislikes}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={formatDate(comment.createdAt)}>
                          <Typography variant="body2">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          gap={1}
                          flexWrap="wrap"
                        >
                          {/* <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={() => handleOpenReview(comment, "APPROVE")}
                            // sx={{ mr: 1, mb: { xs: 1, md: 0 } }}
                          >
                            Approve
                          </Button> */}
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            onClick={() => handleOpenReview(comment, "REMOVE")}
                          >
                            Remove
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>

                    {/* Replies Expansion Panel */}
                    {comment.replies &&
                      comment.replies.length > 0 &&
                      expandedRows[comment.id] && (
                        <TableRow>
                          <TableCell colSpan={7} sx={{ p: 0 }}>
                            <Box sx={{ p: 2, backgroundColor: "#F9F9F9" }}>
                              <Typography variant="subtitle2" gutterBottom>
                                {comment.replies.length}{" "}
                                {comment.replies.length === 1
                                  ? "Reply"
                                  : "Replies"}
                              </Typography>
                              <Divider sx={{ mb: 2 }} />
                              {comment.replies.map((reply) => (
                                <Box
                                  key={reply.id}
                                  sx={{
                                    mb: 2,
                                    pl: 2,
                                    borderLeft: "2px solid #e0e0e0",
                                  }}
                                >
                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    mb={1}
                                  >
                                    <Box display="flex" alignItems="center">
                                      <ReplyIcon
                                        fontSize="small"
                                        sx={{ mr: 1, color: "text.secondary" }}
                                      />
                                      <Typography
                                        variant="body2"
                                        fontWeight="bold"
                                      >
                                        {reply.author.username}
                                        {reply.author.role === "ADMIN" && (
                                          <Chip
                                            size="small"
                                            label="ADMIN"
                                            color="primary"
                                            sx={{ ml: 1 }}
                                          />
                                        )}
                                      </Typography>
                                    </Box>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {formatDate(reply.createdAt)}
                                    </Typography>
                                  </Box>
                                  <Typography variant="body2" sx={{ ml: 3 }}>
                                    {reply.content}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                  </React.Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{ py: 2 }}
                  >
                    No comments match your search criteria. Try adjusting your
                    filters.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Component */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredComments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Dialog for Viewing Comment Details */}
      <Dialog
        open={openDetails}
        onClose={handleCloseDetails}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Comment Details
          {selectedComment && selectedComment.status === "REPORTED" && (
            <Chip label="REPORTED" color="error" size="small" sx={{ ml: 1 }} />
          )}
        </DialogTitle>
        <DialogContent dividers>
          {selectedComment && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Comment Information
              </Typography>
              <Box sx={{ mb: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Content:</strong>
                </Typography>
                <Typography
                  variant="body2"
                  paragraph
                  sx={{ whiteSpace: "pre-wrap" }}
                >
                  {selectedComment.content}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Author:</strong> {selectedComment.author.username}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Role:</strong> {selectedComment.author.role}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Created:</strong>{" "}
                      {formatDate(selectedComment.createdAt)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Post:</strong> {selectedComment.post.title}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {selectedComment.reports &&
                selectedComment.reports.length > 0 && (
                  <>
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                      Reports ({selectedComment.reports.length})
                    </Typography>
                    {selectedComment.reports.map((report) => (
                      <Box
                        key={report.id}
                        sx={{
                          mb: 2,
                          p: 2,
                          bgcolor: "#fff4f4",
                          borderRadius: 1,
                          border: "1px solid #ffcdd2",
                        }}
                      >
                        <Typography variant="body2">
                          <strong>Type:</strong>{" "}
                          {report.type.replace(/_/g, " ")}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Reporter:</strong> {report.reporter.username}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Date:</strong> {formatDate(report.createdAt)}
                        </Typography>
                        {report.message && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>Message:</strong> {report.message}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </>
                )}

              {selectedComment.replies &&
                selectedComment.replies.length > 0 && (
                  <>
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                      Replies ({selectedComment.replies.length})
                    </Typography>
                    {selectedComment.replies.map((reply) => (
                      <Box
                        key={reply.id}
                        sx={{
                          mb: 2,
                          p: 2,
                          bgcolor: "#f0f7ff",
                          borderRadius: 1,
                          border: "1px solid #bbdefb",
                        }}
                      >
                        <Typography variant="body2">
                          <strong>{reply.author.username}</strong> (
                          {reply.author.role})
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {formatDate(reply.createdAt)}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {reply.content}
                        </Typography>
                      </Box>
                    ))}
                  </>
                )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          {selectedComment && (
            <>
              {/* <Button */}
              {/* onClick={() => { */}
              {/* handleCloseDetails(); */}
              {/* handleOpenReview(selectedComment, "APPROVE"); */}
              {/* }} */}
              {/* color="primary" */}
              {/* > */}
              {/* Approve */}
              {/* </Button> */}
              <Button
                onClick={() => {
                  handleCloseDetails();
                  handleOpenReview(selectedComment, "REMOVE");
                }}
                color="error"
              >
                Remove
              </Button>
            </>
          )}
          <Button onClick={handleCloseDetails} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Review/Moderation Action */}
      <Dialog
        open={openReview}
        onClose={handleCloseReview}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {reviewAction === "APPROVE" ? "Approve Comment" : "Remove Comment"}
        </DialogTitle>
        <DialogContent dividers>
          {selectedComment && (
            <>
              <Alert
                severity={reviewAction === "APPROVE" ? "info" : "warning"}
                sx={{ mb: 2 }}
              >
                {reviewAction === "APPROVE"
                  ? "This will mark the comment as approved and clear any reports."
                  : "This will remove the comment from the platform and notify the author."}
              </Alert>

              <Typography variant="subtitle2" gutterBottom>
                Comment Content:
              </Typography>
              <Paper
                variant="outlined"
                sx={{ p: 2, mb: 3, bgcolor: "#fafafa" }}
              >
                <Typography variant="body2">
                  {selectedComment.content}
                </Typography>
              </Paper>

              <TextField
                label={
                  reviewAction === "APPROVE"
                    ? "Approval Notes (Optional)"
                    : "Removal Reason (Required)"
                }
                multiline
                fullWidth
                rows={4}
                variant="outlined"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                required={reviewAction === "REMOVE"}
                error={reviewAction === "REMOVE" && !reviewComment}
                helperText={
                  reviewAction === "REMOVE" && !reviewComment
                    ? "Please provide a reason for removal"
                    : ""
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReview} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            color={reviewAction === "APPROVE" ? "primary" : "error"}
            disabled={reviewAction === "REMOVE" && !reviewComment}
          >
            {reviewAction === "APPROVE" ? "Approve Comment" : "Remove Comment"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
