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
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

// Expanded dummy posts data to demonstrate pagination
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
        message: "Inappropriate language used.",
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
  {
    id: "e6397579-5778-513b-b064-bf085efd90d8",
    title: "Community Guidelines",
    excerpt: "Everything you need to know about our platform rules.",
    status: "ACTIVE",
    author: { username: "moderator1" },
    createdAt: "2025-04-10T12:25:14.171Z",
    reports: [],
  },
  {
    id: "f7408680-6889-624c-c175-cf196fge01e9",
    title: "Questionable Content",
    excerpt: "This post has been flagged multiple times by users.",
    status: "REPORTED",
    author: { username: "newuser123" },
    createdAt: "2025-04-12T15:42:37.171Z",
    reports: [
      {
        id: "859gec38-2643-53fd-b4ff-ffcg16bdbd4d",
        type: "misinformation",
        message: "Contains factually incorrect information.",
        createdAt: "2025-04-13T09:22:15.827Z",
      },
    ],
  },
  {
    id: "h8519791-7990-735d-d286-dg307ghe12f0",
    title: "Old Post Example",
    excerpt: "This is an older post to test date filtering.",
    status: "ACTIVE",
    author: { username: "olduser" },
    createdAt: "2025-02-15T10:12:45.171Z",
    reports: [],
  },
  {
    id: "i9620802-8001-846e-e397-eh418ihe23g1",
    title: "Technical Tutorial",
    excerpt: "Learning how to use our platform features.",
    status: "ACTIVE",
    author: { username: "techguru" },
    createdAt: "2025-04-05T14:22:18.171Z",
    reports: [],
  },
  {
    id: "j0731913-9112-957f-f408-fi529jif34h2",
    title: "Controversial Discussion",
    excerpt: "This post contains politically sensitive content.",
    status: "REPORTED",
    author: { username: "debater" },
    createdAt: "2025-04-08T09:37:29.171Z",
    reports: [
      {
        id: "960hed49-3754-64ge-c5gg-ggdh27cece5e",
        type: "politics",
        message: "Contains potentially divisive political content.",
        createdAt: "2025-04-09T11:45:33.827Z",
      },
    ],
  },
  {
    id: "k1842024-0223-068g-g519-gj630kjg45i3",
    title: "Product Announcement",
    excerpt: "Introducing our newest platform feature.",
    status: "ACTIVE",
    author: { username: "productmanager" },
    createdAt: "2025-04-01T16:51:03.171Z",
    reports: [],
  },
  {
    id: "l2953135-1334-179h-h620-hk741lkh56j4",
    title: "Bug Report Thread",
    excerpt: "Users documenting issues with the mobile app.",
    status: "ACTIVE",
    author: { username: "bugreporter" },
    createdAt: "2025-03-28T13:05:47.171Z",
    reports: [],
  },
  {
    id: "m3064246-2445-280i-i731-il852mli67k5",
    title: "User Feedback Collection",
    excerpt: "We want to hear your thoughts on our new design.",
    status: "ACTIVE",
    author: { username: "designteam" },
    createdAt: "2025-03-25T10:19:31.171Z",
    reports: [],
  },
  {
    id: "n4175357-3556-391j-j842-jm963nmj78l6",
    title: "Policy Violation",
    excerpt: "This content appears to violate our terms of service.",
    status: "REPORTED",
    author: { username: "problemuser" },
    createdAt: "2025-04-11T17:33:15.171Z",
    reports: [
      {
        id: "061iei50-4865-75hf-d6hh-hhei38dfdf6f",
        type: "terms_violation",
        message: "Potential violation of platform terms.",
        createdAt: "2025-04-12T08:59:42.827Z",
      },
    ],
  },
  {
    id: "o5286468-4667-402k-k953-ko074bok89m7",
    title: "Help Request",
    excerpt: "User needs assistance with account settings.",
    status: "ACTIVE",
    author: { username: "newmember" },
    createdAt: "2025-04-09T20:47:59.171Z",
    reports: [],
  },
];

export default function Posts() {
  // State for the "View Details" modal
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);

  // State for the "Review" modal
  const [openReview, setOpenReview] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [selectedPostForReview, setSelectedPostForReview] = useState(null);

  // State for filtering and search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [reportTypeFilter, setReportTypeFilter] = useState("ALL");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(lowerCaseQuery) ||
          post.excerpt.toLowerCase().includes(lowerCaseQuery)
      );
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
  }, [searchQuery, statusFilter, reportTypeFilter, startDate, endDate]);

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
    setReviewComment(""); // reset the comment
    setOpenReview(true);
  };

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
  const paginatedPosts = filteredPosts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
                    <Typography variant="subtitle1" fontWeight="bold">
                      {post.title}
                    </Typography>
                    <Typography variant="caption">{post.excerpt}</Typography>
                  </TableCell>
                  <TableCell>{post.author.username}</TableCell>
                  <TableCell>
                    <Typography
                      color={
                        post.status === "REPORTED" ? "error" : "textPrimary"
                      }
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
