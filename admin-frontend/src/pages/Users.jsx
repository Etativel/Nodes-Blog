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
  Avatar,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BlockIcon from "@mui/icons-material/Block";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CommentIcon from "@mui/icons-material/Comment";
import ReportIcon from "@mui/icons-material/Report";
import EditIcon from "@mui/icons-material/Edit";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

// Dummy data for users
const usersData = [
  {
    id: "a1234567-7890-4abc-a123-456789abcdef",
    username: "johndoe",
    email: "john.doe@example.com",
    role: "USER",
    createdAt: "2025-01-15T08:30:04.171Z",
    updatedAt: "2025-04-10T14:22:04.171Z",
    userColor: "#4287f5",
    biography: "Software developer passionate about UI/UX design",
    fullName: "John Doe",
    profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
    postCount: 12,
    commentCount: 45,
    followerCount: 78,
    followingCount: 34,
    reportCount: 0,
    active: true,
  },
  {
    id: "b2345678-8901-5bcd-b234-56789abcdefg",
    username: "janesmith",
    email: "jane.smith@example.com",
    role: "ADMIN",
    createdAt: "2024-11-22T12:45:30.171Z",
    updatedAt: "2025-04-12T09:15:04.171Z",
    userColor: "#e83e8c",
    biography: "Platform administrator and content moderator",
    fullName: "Jane Smith",
    profilePicture: "https://randomuser.me/api/portraits/women/2.jpg",
    postCount: 8,
    commentCount: 156,
    followerCount: 245,
    followingCount: 112,
    reportCount: 0,
    active: true,
  },
  {
    id: "c3456789-9012-6cde-c345-6789abcdefgh",
    username: "mikewilson",
    email: "mike.wilson@example.com",
    role: "USER",
    createdAt: "2025-02-08T10:15:22.171Z",
    updatedAt: "2025-04-05T18:33:04.171Z",
    userColor: "#28a745",
    biography: "Fitness enthusiast and travel blogger",
    fullName: "Michael Wilson",
    profilePicture: "https://randomuser.me/api/portraits/men/3.jpg",
    postCount: 35,
    commentCount: 92,
    followerCount: 310,
    followingCount: 174,
    reportCount: 2,
    active: true,
  },
  {
    id: "d4567890-0123-7def-d456-789abcdefghi",
    username: "sarahparker",
    email: "sarah.parker@example.com",
    role: "USER",
    createdAt: "2025-03-17T15:20:18.171Z",
    updatedAt: "2025-04-14T11:45:04.171Z",
    userColor: "#fd7e14",
    biography: "Digital artist and photography enthusiast",
    fullName: "Sarah Parker",
    profilePicture: "https://randomuser.me/api/portraits/women/4.jpg",
    postCount: 28,
    commentCount: 67,
    followerCount: 425,
    followingCount: 201,
    reportCount: 0,
    active: true,
  },
  {
    id: "e5678901-1234-8efg-e567-89abcdefghij",
    username: "alexjohnson",
    email: "alex.johnson@example.com",
    role: "USER",
    createdAt: "2024-12-05T09:10:45.171Z",
    updatedAt: "2025-04-02T22:05:04.171Z",
    userColor: "#20c997",
    biography: "Tech reviewer and gaming enthusiast",
    fullName: "Alex Johnson",
    profilePicture: "https://randomuser.me/api/portraits/men/5.jpg",
    postCount: 42,
    commentCount: 137,
    followerCount: 512,
    followingCount: 98,
    reportCount: 1,
    active: true,
  },
  {
    id: "f6789012-2345-9fgh-f678-9abcdefghijk",
    username: "emilybrown",
    email: "emily.brown@example.com",
    role: "USER",
    createdAt: "2025-01-30T11:25:36.171Z",
    updatedAt: "2025-03-29T16:40:04.171Z",
    userColor: "#6f42c1",
    biography: "Book lover and aspiring author",
    fullName: "Emily Brown",
    profilePicture: "https://randomuser.me/api/portraits/women/6.jpg",
    postCount: 17,
    commentCount: 83,
    followerCount: 156,
    followingCount: 142,
    reportCount: 0,
    active: true,
  },
  {
    id: "g7890123-3456-0ghi-g789-0abcdefghijkl",
    username: "davidmiller",
    email: "david.miller@example.com",
    role: "USER",
    createdAt: "2025-02-22T14:50:12.171Z",
    updatedAt: "2025-04-08T08:15:04.171Z",
    userColor: "#dc3545",
    biography: "Music producer and audio engineer",
    fullName: "David Miller",
    profilePicture: "https://randomuser.me/api/portraits/men/7.jpg",
    postCount: 9,
    commentCount: 41,
    followerCount: 78,
    followingCount: 63,
    reportCount: 0,
    active: true,
  },
  {
    id: "h8901234-4567-1hij-h890-1abcdefghijklm",
    username: "olivialee",
    email: "olivia.lee@example.com",
    role: "USER",
    createdAt: "2024-11-10T07:35:28.171Z",
    updatedAt: "2025-03-25T13:20:04.171Z",
    userColor: "#17a2b8",
    biography: "Food blogger and recipe developer",
    fullName: "Olivia Lee",
    profilePicture: "https://randomuser.me/api/portraits/women/8.jpg",
    postCount: 31,
    commentCount: 114,
    followerCount: 892,
    followingCount: 235,
    reportCount: 0,
    active: true,
  },
  {
    id: "i9012345-5678-2ijk-i901-2abcdefghijklmn",
    username: "roberttaylor",
    email: "robert.taylor@example.com",
    role: "USER",
    createdAt: "2025-03-05T16:40:54.171Z",
    updatedAt: "2025-04-11T10:55:04.171Z",
    userColor: "#ffc107",
    biography: "Sports analyst and former athlete",
    fullName: "Robert Taylor",
    profilePicture: "https://randomuser.me/api/portraits/men/9.jpg",
    postCount: 14,
    commentCount: 68,
    followerCount: 203,
    followingCount: 87,
    reportCount: 3,
    active: false,
  },
  {
    id: "j0123456-6789-3jkl-j012-3abcdefghijklmno",
    username: "sophiawilliams",
    email: "sophia.williams@example.com",
    role: "ADMIN",
    createdAt: "2024-12-18T13:15:39.171Z",
    updatedAt: "2025-04-09T19:30:04.171Z",
    userColor: "#007bff",
    biography: "Content strategist and platform moderator",
    fullName: "Sophia Williams",
    profilePicture: "https://randomuser.me/api/portraits/women/10.jpg",
    postCount: 22,
    commentCount: 167,
    followerCount: 321,
    followingCount: 145,
    reportCount: 0,
    active: true,
  },
  {
    id: "k1234567-7890-4klm-k123-4abcdefghijklmnop",
    username: "danielclark",
    email: "daniel.clark@example.com",
    role: "USER",
    createdAt: "2025-01-05T09:25:17.171Z",
    updatedAt: "2025-04-07T12:10:04.171Z",
    userColor: "#6c757d",
    biography: "Software engineer and open source contributor",
    fullName: "Daniel Clark",
    profilePicture: "https://randomuser.me/api/portraits/men/11.jpg",
    postCount: 19,
    commentCount: 55,
    followerCount: 134,
    followingCount: 98,
    reportCount: 0,
    active: true,
  },
  {
    id: "l2345678-8901-5lmn-l234-5abcdefghijklmnopq",
    username: "emmawilson",
    email: "emma.wilson@example.com",
    role: "USER",
    createdAt: "2025-02-28T11:05:43.171Z",
    updatedAt: "2025-04-13T17:25:04.171Z",
    userColor: "#e83e8c",
    biography: "Fashion designer and style consultant",
    fullName: "Emma Wilson",
    profilePicture: "https://randomuser.me/api/portraits/women/12.jpg",
    postCount: 37,
    commentCount: 91,
    followerCount: 567,
    followingCount: 302,
    reportCount: 0,
    active: true,
  },
];

// Mock data for user activity details
const userActivityData = {
  posts: [
    {
      id: "post1",
      title: "Getting Started with React",
      createdAt: "2025-03-15T10:30:00Z",
    },
    {
      id: "post2",
      title: "Understanding State Management",
      createdAt: "2025-03-20T14:45:00Z",
    },
    {
      id: "post3",
      title: "Advanced Component Patterns",
      createdAt: "2025-04-01T09:15:00Z",
    },
  ],
  comments: [
    {
      id: "comment1",
      content: "Great article, thanks for sharing!",
      postId: "post5",
      createdAt: "2025-04-05T11:20:00Z",
    },
    {
      id: "comment2",
      content: "I have a question about this approach...",
      postId: "post7",
      createdAt: "2025-04-07T16:30:00Z",
    },
    {
      id: "comment3",
      content: "This solved my problem, thank you!",
      postId: "post2",
      createdAt: "2025-04-10T13:45:00Z",
    },
  ],
  reports: [
    {
      id: "report1",
      type: "misinformation",
      postId: "post12",
      createdAt: "2025-04-02T08:10:00Z",
    },
    {
      id: "report2",
      type: "harassment",
      postId: "post18",
      createdAt: "2025-04-09T17:25:00Z",
    },
  ],
};

export default function Users() {
  // States for modals
  const [openUserDetails, setOpenUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState(0);

  // States for editing user
  const [openEditUser, setOpenEditUser] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    fullName: "",
    role: "",
    biography: "",
  });

  // States for account actions
  const [openAccountActions, setOpenAccountActions] = useState(false);
  const [actionReason, setActionReason] = useState("");

  // States for filtering and search
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [reportFilter, setReportFilter] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Apply filters when criteria change
  useEffect(() => {
    let result = [...usersData];

    // Filter by search query on username, email, fullName
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.username.toLowerCase().includes(lowerCaseQuery) ||
          user.email.toLowerCase().includes(lowerCaseQuery) ||
          (user.fullName &&
            user.fullName.toLowerCase().includes(lowerCaseQuery))
      );
    }

    // Role filter
    if (roleFilter !== "ALL") {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Report filter
    if (reportFilter) {
      result = result.filter((user) => user.reportCount > 0);
    }

    // Active status filter
    if (activeFilter !== "ALL") {
      const isActive = activeFilter === "ACTIVE";
      result = result.filter((user) => user.active === isActive);
    }

    // Date range filter (createdAt)
    if (startDate) {
      const startTime = startDate.setHours(0, 0, 0, 0);
      result = result.filter((user) => new Date(user.createdAt) >= startTime);
    }
    if (endDate) {
      const endTime = new Date(endDate);
      endTime.setHours(23, 59, 59, 999);
      result = result.filter((user) => new Date(user.createdAt) <= endTime);
    }

    // Sort by most recent first
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredUsers(result);
    setPage(0); // Reset page when filters change
  }, [searchQuery, roleFilter, reportFilter, startDate, endDate, activeFilter]);

  // Initialize filteredUsers with all data on mount
  useEffect(() => {
    setFilteredUsers(usersData);
  }, []);

  // Dialog handlers
  const handleOpenUserDetails = (user) => {
    setSelectedUser(user);
    setActiveDetailTab(0);
    setOpenUserDetails(true);
  };

  const handleCloseUserDetails = () => {
    setOpenUserDetails(false);
    setSelectedUser(null);
  };

  const handleOpenEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      fullName: user.fullName || "",
      role: user.role,
      biography: user.biography || "",
    });
    setOpenEditUser(true);
  };

  const handleCloseEditUser = () => {
    setOpenEditUser(false);
    setSelectedUser(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitEditUser = () => {
    console.log("Updating user", selectedUser.id, editForm);
    setOpenEditUser(false);
  };

  const handleOpenAccountActions = (user) => {
    setSelectedUser(user);
    setActionReason("");
    setOpenAccountActions(true);
  };

  const handleCloseAccountActions = () => {
    setOpenAccountActions(false);
    setSelectedUser(null);
  };

  const handleSubmitAccountAction = (action) => {
    console.log(
      `${action} user account`,
      selectedUser.id,
      "Reason:",
      actionReason
    );
    setOpenAccountActions(false);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("ALL");
    setReportFilter(false);
    setActiveFilter("ALL");
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

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleDetailTabChange = (event, newValue) => {
    setActiveDetailTab(newValue);
  };

  return (
    <Box p={3} pt={2}>
      <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
      <p className="mt-1 text-sm text-gray-600 mb-4">
        Monitor user accounts, activity, and manage platform permissions
      </p>
      {/* Search and Filter Section */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by username, email, or name..."
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

          {/* Role Filter */}
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                displayEmpty
                variant="outlined"
              >
                <MenuItem value="ALL">All Roles</MenuItem>
                <MenuItem value="USER">Users</MenuItem>
                <MenuItem value="ADMIN">Admins</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Active Status Filter */}
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <Select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                displayEmpty
                variant="outlined"
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Report Filter */}
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <Select
                value={reportFilter ? "REPORTED" : "ALL"}
                onChange={(e) => setReportFilter(e.target.value === "REPORTED")}
                displayEmpty
                variant="outlined"
              >
                <MenuItem value="ALL">All Users</MenuItem>
                <MenuItem value="REPORTED">Reported Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Clear Filters */}
          <Grid item xs={6} md={2}>
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
              Registration Date Range
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="From"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
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
                    onChange={(newValue) => setEndDate(newValue)}
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
          Showing {Math.min(rowsPerPage, filteredUsers.length)} of{" "}
          {filteredUsers.length} users
          {(searchQuery ||
            roleFilter !== "ALL" ||
            reportFilter ||
            activeFilter !== "ALL" ||
            startDate ||
            endDate) &&
            " (filtered)"}
        </Typography>
      </Box>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Activity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Registration Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={user.profilePicture}
                        alt={user.username}
                        sx={{
                          mr: 2,
                          bgcolor: user.userColor || "primary.main",
                        }}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          {user.fullName || user.username}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          @{user.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={
                        user.role === "ADMIN" ? (
                          <AdminPanelSettingsIcon />
                        ) : (
                          <PersonIcon />
                        )
                      }
                      label={user.role}
                      color={user.role === "ADMIN" ? "primary" : "default"}
                      size="small"
                      variant={user.role === "ADMIN" ? "filled" : "outlined"}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {user.postCount} posts • {user.commentCount} comments
                    </Typography>
                    <Typography variant="body2">
                      {user.followerCount} followers • {user.followingCount}{" "}
                      following
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={user.active ? <VerifiedUserIcon /> : <BlockIcon />}
                      label={user.active ? "Active" : "Inactive"}
                      color={user.active ? "success" : "error"}
                      size="small"
                    />
                    {user.reportCount > 0 && (
                      <Chip
                        icon={<ReportIcon />}
                        label={`${user.reportCount} Reports`}
                        color="warning"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        onClick={() => handleOpenUserDetails(user)}
                        sx={{ mr: 1, mb: 1 }}
                      >
                        Details
                      </Button>
                    </Tooltip>
                    <Tooltip title="Edit User">
                      <Button
                        variant="outlined"
                        size="small"
                        color="secondary"
                        onClick={() => handleOpenEditUser(user)}
                        sx={{ mr: 1, mb: 1 }}
                        startIcon={<EditIcon />}
                      >
                        Edit
                      </Button>
                    </Tooltip>
                    <Tooltip title="Account Actions">
                      <Button
                        variant="contained"
                        size="small"
                        color={user.active ? "error" : "success"}
                        onClick={() => handleOpenAccountActions(user)}
                        sx={{ mb: 1 }}
                      >
                        {user.active ? "Suspend" : "Activate"}
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{ py: 2 }}
                  >
                    No users match your search criteria. Try adjusting your
                    filters.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Dialog for Viewing User Details */}
      <Dialog
        open={openUserDetails}
        onClose={handleCloseUserDetails}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          User Details
          <IconButton
            sx={{ position: "absolute", right: 8, top: 8 }}
            onClick={handleCloseUserDetails}
          >
            <ClearIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Grid container spacing={3}>
              {/* User Profile Card with Detailed Info */}
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      mb={2}
                    >
                      <Avatar
                        src={selectedUser.profilePicture}
                        alt={selectedUser.username}
                        sx={{
                          width: 100,
                          height: 100,
                          mb: 2,
                          bgcolor: selectedUser.userColor || "primary.main",
                        }}
                      >
                        {selectedUser.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="h6">
                        {selectedUser.fullName || selectedUser.username}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                      >
                        @{selectedUser.username}
                      </Typography>
                      <Chip
                        icon={
                          selectedUser.role === "ADMIN" ? (
                            <AdminPanelSettingsIcon />
                          ) : (
                            <PersonIcon />
                          )
                        }
                        label={selectedUser.role}
                        color={
                          selectedUser.role === "ADMIN" ? "primary" : "default"
                        }
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    <Typography variant="subtitle2" gutterBottom>
                      About
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {selectedUser.biography || "No biography provided."}
                    </Typography>

                    <Typography variant="subtitle2" gutterBottom>
                      Contact
                    </Typography>
                    <Typography variant="body2">
                      {selectedUser.email}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Activity Overview
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Paper
                            variant="outlined"
                            sx={{ p: 1, textAlign: "center" }}
                          >
                            <Typography variant="h6">
                              {selectedUser.postCount}
                            </Typography>
                            <Typography variant="caption">Posts</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper
                            variant="outlined"
                            sx={{ p: 1, textAlign: "center" }}
                          >
                            <Typography variant="h6">
                              {selectedUser.commentCount}
                            </Typography>
                            <Typography variant="caption">Comments</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper
                            variant="outlined"
                            sx={{ p: 1, textAlign: "center" }}
                          >
                            <Typography variant="h6">
                              {selectedUser.followerCount}
                            </Typography>
                            <Typography variant="caption">Followers</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper
                            variant="outlined"
                            sx={{ p: 1, textAlign: "center" }}
                          >
                            <Typography variant="h6">
                              {selectedUser.followingCount}
                            </Typography>
                            <Typography variant="caption">Following</Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" gutterBottom>
                      Account Information
                    </Typography>
                    <Box>
                      <Typography variant="body2">
                        <strong>Status:</strong>{" "}
                        <Chip
                          size="small"
                          label={selectedUser.active ? "Active" : "Inactive"}
                          color={selectedUser.active ? "success" : "error"}
                        />
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Created:</strong>{" "}
                        {new Date(selectedUser.createdAt).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Last Updated:</strong>{" "}
                        {new Date(selectedUser.updatedAt).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Reports:</strong>{" "}
                        {selectedUser.reportCount > 0 ? (
                          <Chip
                            size="small"
                            label={`${selectedUser.reportCount} Reports`}
                            color="warning"
                          />
                        ) : (
                          "None"
                        )}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* User Activity Tabs */}
              <Grid item xs={12} md={8}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={activeDetailTab}
                    onChange={handleDetailTabChange}
                    aria-label="user activity tabs"
                  >
                    <Tab label="Recent Posts" />
                    <Tab label="Recent Comments" />
                    {selectedUser.reportCount > 0 && <Tab label="Reports" />}
                  </Tabs>
                </Box>

                {/* Recent Posts Tab */}
                {activeDetailTab === 0 && (
                  <Box sx={{ p: 2 }}>
                    {userActivityData.posts.length > 0 ? (
                      <List>
                        {userActivityData.posts.map((post) => (
                          <ListItem
                            key={post.id}
                            divider
                            secondaryAction={
                              <Button size="small" variant="outlined">
                                View
                              </Button>
                            }
                          >
                            <ListItemIcon>
                              <PostAddIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={post.title}
                              secondary={`Posted on ${new Date(
                                post.createdAt
                              ).toLocaleDateString()}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography
                        color="textSecondary"
                        align="center"
                        sx={{ py: 3 }}
                      >
                        No posts found for this user.
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Recent Comments Tab */}
                {activeDetailTab === 1 && (
                  <Box sx={{ p: 2 }}>
                    {userActivityData.comments.length > 0 ? (
                      <List>
                        {userActivityData.comments.map((comment) => (
                          <ListItem
                            key={comment.id}
                            divider
                            secondaryAction={
                              <Button size="small" variant="outlined">
                                View Post
                              </Button>
                            }
                          >
                            <ListItemIcon>
                              <CommentIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={comment.content}
                              secondary={`Commented on ${new Date(
                                comment.createdAt
                              ).toLocaleDateString()} • Post ID: ${
                                comment.postId
                              }`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography
                        color="textSecondary"
                        align="center"
                        sx={{ py: 3 }}
                      >
                        No comments found for this user.
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Reports Tab */}
                {activeDetailTab === 2 && selectedUser.reportCount > 0 && (
                  <Box sx={{ p: 2 }}>
                    {userActivityData.reports.length > 0 ? (
                      <List>
                        {userActivityData.reports.map((report) => (
                          <ListItem
                            key={report.id}
                            divider
                            secondaryAction={
                              <Button
                                size="small"
                                variant="outlined"
                                color="primary"
                              >
                                Review
                              </Button>
                            }
                          >
                            <ListItemIcon>
                              <ReportIcon color="error" />
                            </ListItemIcon>
                            <ListItemText
                              primary={`Report Type: ${report.type}`}
                              secondary={`Reported on ${new Date(
                                report.createdAt
                              ).toLocaleDateString()} • Post ID: ${
                                report.postId
                              }`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography
                        color="textSecondary"
                        align="center"
                        sx={{ py: 3 }}
                      >
                        No report details available.
                      </Typography>
                    )}
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDetails} color="primary">
            Close
          </Button>
          <Button
            onClick={() => {
              handleCloseUserDetails();
              handleOpenEditUser(selectedUser);
            }}
            color="primary"
            variant="contained"
          >
            Edit User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Editing User */}
      <Dialog
        open={openEditUser}
        onClose={handleCloseEditUser}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Edit User
          <IconButton
            sx={{ position: "absolute", right: 8, top: 8 }}
            onClick={handleCloseEditUser}
          >
            <ClearIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Grid container spacing={2}>
              <Grid item xs={12} display="flex" justifyContent="center" mb={2}>
                <Avatar
                  src={selectedUser.profilePicture}
                  alt={selectedUser.username}
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: selectedUser.userColor || "primary.main",
                  }}
                >
                  {selectedUser.username.charAt(0).toUpperCase()}
                </Avatar>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="username"
                  label="Username"
                  fullWidth
                  value={editForm.username}
                  onChange={handleEditFormChange}
                  variant="outlined"
                  margin="dense"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">@</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email"
                  fullWidth
                  value={editForm.email}
                  onChange={handleEditFormChange}
                  variant="outlined"
                  margin="dense"
                  type="email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="fullName"
                  label="Full Name"
                  fullWidth
                  value={editForm.fullName}
                  onChange={handleEditFormChange}
                  variant="outlined"
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <Select
                    name="role"
                    value={editForm.role}
                    onChange={handleEditFormChange}
                    displayEmpty
                    variant="outlined"
                  >
                    <MenuItem value="USER">User</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="biography"
                  label="Biography"
                  fullWidth
                  value={editForm.biography}
                  onChange={handleEditFormChange}
                  variant="outlined"
                  margin="dense"
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditUser} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitEditUser}
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Account Actions */}
      <Dialog
        open={openAccountActions}
        onClose={handleCloseAccountActions}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {selectedUser &&
            (selectedUser.active ? "Suspend Account" : "Activate Account")}
          <IconButton
            sx={{ position: "absolute", right: 8, top: 8 }}
            onClick={handleCloseAccountActions}
          >
            <ClearIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <>
              <Typography variant="body1" gutterBottom>
                {selectedUser.active
                  ? `Are you sure you want to suspend @${selectedUser.username}'s account?`
                  : `Are you sure you want to reactivate @${selectedUser.username}'s account?`}
              </Typography>
              <Box display="flex" alignItems="center" my={2}>
                <Avatar
                  src={selectedUser.profilePicture}
                  alt={selectedUser.username}
                  sx={{
                    width: 40,
                    height: 40,
                    mr: 2,
                    bgcolor: selectedUser.userColor || "primary.main",
                  }}
                >
                  {selectedUser.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2">
                    {selectedUser.fullName || selectedUser.username}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    @{selectedUser.username}
                  </Typography>
                </Box>
              </Box>
              <TextField
                label="Reason for action"
                multiline
                fullWidth
                rows={3}
                variant="outlined"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                margin="normal"
                placeholder="Please provide a reason for this action..."
              />
              {selectedUser.active && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                  Note: Suspending an account will prevent the user from logging
                  in or interacting with the platform.
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAccountActions} color="primary">
            Cancel
          </Button>
          {selectedUser && selectedUser.active ? (
            <Button
              onClick={() => handleSubmitAccountAction("suspend")}
              variant="contained"
              color="error"
              disabled={!actionReason.trim()}
            >
              Suspend Account
            </Button>
          ) : (
            <Button
              onClick={() => handleSubmitAccountAction("activate")}
              variant="contained"
              color="success"
            >
              Activate Account
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
