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
  List,
  ListItem,
  ListItemText,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Grid,
  IconButton,
  InputLabel,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

export default function Posts() {
  // State for the "View Details" modal
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);

  // State for the "Review" modal
  const [openReview, setOpenReview] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [selectedPostForReview, setSelectedPostForReview] = useState(null);

  // State for the edit modal
  const [openEdit, setOpenEdit] = useState(false);
  const [postStatus, setPostStatus] = useState("ACTIVE");

  // State for filtering and search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [reportTypeFilter, setReportTypeFilter] = useState("ALL");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [postsData, setPostsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editPost, setEditPost] = useState(null);

  async function fetchSummaryData() {
    try {
      const response = await fetch(
        "https://nodes-blog-api-production.up.railway.app/admin-posts-api/all-posts",
        {
          credentials: "include",
          method: "GET",
        }
      );

      if (!response.ok) {
        console.log("Failed to fetch dashboard data", response.status);
      }
      const data = await response.json();
      setPostsData(data.allPosts);
      setFilteredPosts(data.allPosts);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchSummaryData();
  }, []);

  // Get unique report types for filter dropdown
  const allReportTypes = Array.from(
    new Set(
      postsData
        .flatMap((post) => post.reports)
        .map((report) => report?.type)
        .filter(Boolean)
    )
  );

  // Apply filters whenever search or filter criteria change
  useEffect(() => {
    let result = [...postsData];

    // Apply search query filter (on title and excerpt - the content columns)
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter((post) => {
        const title = (post.title ?? "").toLowerCase();
        const excerpt = (post.excerpt ?? "").toLowerCase();
        return (
          title.includes(lowerCaseQuery) || excerpt.includes(lowerCaseQuery)
        );
      });
    }

    // Apply status filter
    if (statusFilter !== "ALL") {
      result = result.filter((post) => post.status === statusFilter);
    }

    // Apply report type filter
    if (reportTypeFilter !== "ALL") {
      result = result.filter((post) =>
        post.reports.some((report) => report.type === reportTypeFilter)
      );
    }

    // Apply date range filter
    if (startDate) {
      const startTime = startDate.setHours(0, 0, 0, 0);
      result = result.filter((post) => new Date(post.createdAt) >= startTime);
    }

    if (endDate) {
      const endTime = new Date(endDate);
      endTime.setHours(23, 59, 59, 999);
      result = result.filter((post) => new Date(post.createdAt) <= endTime);
    }

    // Sort by most recent first
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredPosts(result);
    setPage(0); // Reset to first page when filters change
  }, [
    searchQuery,
    statusFilter,
    reportTypeFilter,
    startDate,
    endDate,
    postsData,
  ]);

  const handleOpenDetails = (reports) => {
    setSelectedReports(reports);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedReports([]);
  };

  // const handleOpenReview = (post) => {
  //   setSelectedPostForReview(post);
  //   setReviewComment(""); // reset the comment
  //   setOpenReview(true);
  // };

  const handleCloseReview = () => {
    setOpenReview(false);
    setSelectedPostForReview(null);
  };

  const handleSubmitReview = () => {
    // Here, integrate your API call to submit the review/feedback
    console.log("Review for post", selectedPostForReview.id, reviewComment);
    // After successful submission, close the modal
    setOpenReview(false);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setReportTypeFilter("ALL");
    setStartDate(null);
    setEndDate(null);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Slice the array for pagination
  const paginatedPosts = (filteredPosts ?? []).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (postsData.length === 0) {
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

  function handleOpenEditPost(post) {
    setPostStatus(post.status);
    setOpenEdit(true);
    setEditPost(post);
  }

  function handleClosePostStatus() {
    setOpenEdit(false);
    setEditPost(null);
  }

  function handleStatusChange(status) {
    setPostStatus(status);
  }

  async function handleUpdateStatus(postId) {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nodes-blog-api-production.up.railway.app/admin-posts-api/update-status/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status: postStatus,
          }),
        }
      );
      if (!response.ok) {
        setLoading(false);
        console.log("Error updating post status:", response.status);
      }
      if (response.status == 403) {
        alert("You need to be superAdmin to perform this action");
      }
      await response.json();
      setLoading(false);
      handleClosePostStatus();
      fetchSummaryData();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Box p={3} pt={2}>
      <h2 className="text-2xl font-bold text-gray-800">Posts moderation</h2>
      <p className="mt-1 text-sm text-gray-600 mb-4">
        Monitoring platform activity and content reports
      </p>

      {/* Search and Filter Section */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Content Search */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search post content..."
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
                <MenuItem value="REPORTED">Reported</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Report Type Filter */}
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <Select
                value={reportTypeFilter}
                onChange={(e) => setReportTypeFilter(e.target.value)}
                displayEmpty
                variant="outlined"
              >
                <MenuItem value="ALL">All Report Types</MenuItem>
                {allReportTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Clear Filters Button */}
          <Grid item xs={12} md={4}>
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

          {/* Date Range Filters */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Date Range Filter
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="From"
                    value={startDate}
                    onChange={(newValue) => {
                      setStartDate(newValue);
                    }}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        InputProps: {
                          endAdornment: startDate && (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                onClick={() => setStartDate(null)}
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
      </Paper>

      {/* Results Count */}
      <Box
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="body2" color="textSecondary">
          Showing {Math.min(rowsPerPage, filteredPosts.length)} of{" "}
          {filteredPosts.length} posts
          {(searchQuery ||
            statusFilter !== "ALL" ||
            reportTypeFilter !== "ALL" ||
            startDate ||
            endDate) &&
            " (filtered)"}
        </Typography>
      </Box>

      {/* Posts Table */}
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
            {paginatedPosts.length > 0 ? (
              paginatedPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Typography
                      display="flex"
                      variant="subtitle1"
                      fontWeight="bold"
                      width="100%"
                      minWidth="200px"
                      maxWidth="500px"
                    >
                      {!post.title
                        ? ""
                        : post.title.length > 50
                        ? post.title.slice(0, 100).trim() + "..."
                        : post.title}
                    </Typography>
                    <Typography variant="caption">
                      {!post.excerpt
                        ? ""
                        : post.excerpt.length > 50
                        ? post.excerpt.slice(0, 100).trim() + "..."
                        : post.excerpt}
                    </Typography>
                  </TableCell>
                  <TableCell>{post.author.username}</TableCell>
                  <TableCell>
                    <Typography
                      display={"flex"}
                      justifyContent={"center"}
                      color={
                        post.status === "REPORTED" ? "error" : "textPrimary"
                      }
                    >
                      <ReportBadge type={post.status} />
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-center">
                      <span className="font-medium text-gray-700 mb-1">
                        {post.reports.length}
                      </span>
                      {post.reports.length > 0 && (
                        <button
                          onClick={() => handleOpenDetails(post.reports)}
                          className="cursor-pointer px-1 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box
                      display="flex"
                      // flexDirection="column"
                      // alignItems="center"
                      justifyContent="center"
                      alignItems="center"
                      // flexWrap="wrap"
                      gap={1}
                    >
                      {/* <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        onClick={() => handleOpenReview(post)}
                        // sx={{ mr: 1 }}
                      >
                        Review
                      </Button> */}
                      <Tooltip title="Visit Post">
                        <Button
                          variant="outlined"
                          size="small"
                          color="secondary"
                          // sx={{ mr: 1 }}
                          href={`https://nodes-blog.up.railway.app/post/${post.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit
                        </Button>
                      </Tooltip>

                      {/* <Button
                        variant="contained"
                        size="small"
                        color="success"
                        // sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                      <Button variant="contained" size="small" color="error">
                        Reject
                      </Button> */}
                      <Tooltip title="Edit User">
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          onClick={() => handleOpenEditPost(post)}
                          // sx={{ mr: 1, mb: 1 }}
                          startIcon={<EditIcon />}
                        >
                          Edit
                        </Button>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{ py: 2 }}
                  >
                    No posts match your search criteria. Try adjusting your
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
          count={filteredPosts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Dialog for edit post */}
      <Dialog
        open={openEdit}
        onClose={handleClosePostStatus}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Change Post Status</DialogTitle>
        <DialogContent dividers>
          <>
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status-select"
                  value={postStatus}
                  label="Status"
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="REPORTED">Reported</MenuItem>
                  <MenuItem value="BLOCKED">Blocked</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePostStatus} color="primary">
            Close
          </Button>
          <Button
            disabled={loading}
            onClick={() => {
              handleUpdateStatus(editPost.id);
            }}
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

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
                    primary={
                      <>
                        Type: <ReportBadge type={report.type || "unknown"} />
                      </>
                    }
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

function ReportBadge({ type }) {
  const getBadgeColor = () => {
    switch (type) {
      case "REPORTED":
        return "bg-red-100 text-red-800";
      case "ACTIVE":
        return "bg-blue-100 text-blue-800";
      case "BLOCKED":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor()}`}
    >
      {type.replace("_", " ")}
    </span>
  );
}
