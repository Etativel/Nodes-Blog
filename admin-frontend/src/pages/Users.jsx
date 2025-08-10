import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
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
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import formatCloudinaryUrl from "../utils/cloudinaryUtils";
import { useContext } from "react";
import ProfileContext from "../contexts/context-create/ProfileContext";

export default function Users() {
  // states for modals
  const { author } = useContext(ProfileContext);
  const [openUserDetails, setOpenUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState(0);

  console.log("This is author", author);

  // States for editing user
  const [openEditUser, setOpenEditUser] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    fullName: "",
    role: "",
    biography: "",
  });

  // states for account actions
  const [openAccountActions, setOpenAccountActions] = useState(false);
  const [actionReason, setActionReason] = useState("");

  // states for filtering and search
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [reportFilter, setReportFilter] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");

  // pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [usersData, setUsersData] = useState([]);

  const [prevUserValues, setPrevUserValues] = useState({
    fullName: "",
    username: "",
    role: "",
    biography: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  // 1) Validation function
  const validate = () => {
    const errs = {};
    const { username } = editForm;

    if (!username) {
      errs.username = "Username is required.";
    } else if (username.length < 3) {
      errs.username = "Username must be at least 3 characters.";
    } else if (username.length > 15) {
      errs.username = "Username must be no more than 15 characters.";
    } else if (!/^[A-Za-z0-9]+$/.test(username)) {
      errs.username = "Username can only contain letters and numbers.";
    }

    // (you could add async uniqueness check here if you like)

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isDisabled =
    !selectedUser ||
    (prevUserValues.fullName === editForm.fullName &&
      prevUserValues.username === editForm.username &&
      prevUserValues.role === editForm.role &&
      prevUserValues.biography === editForm.biography &&
      prevUserValues.email === editForm.email) ||
    editForm.username.length > 15 ||
    editForm.fullName.length > 30 ||
    editForm.biography.length > 160 ||
    !editForm.email ||
    !isValidEmail(editForm.email);

  async function fetchSummaryData() {
    try {
      const response = await fetch(
        "https://nodes-blog-api-production.up.railway.app/admin-users-api/all-users",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.log("Failed to fetch dashboard data", response.status);
      }
      const data = await response.json();
      setUsersData(data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchSummaryData();
  }, []);

  // apply filters when criteria change
  useEffect(() => {
    let result = [...usersData];

    // filter by search query on username, email, fullName
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
      result = result.filter((user) => user.reports.length > 0);
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
  }, [
    searchQuery,
    roleFilter,
    reportFilter,
    startDate,
    endDate,
    activeFilter,
    usersData,
  ]);

  // Initialize filteredUsers with all data on mount
  useEffect(() => {
    setFilteredUsers(usersData);
  }, [usersData]);

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
    setPrevUserValues({
      fullName: user.fullName || "",
      username: user.username,
      role: user.role,
      biography: user.biography || "",
      email: user.email,
    });
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

  const handleSubmitEditUser = async () => {
    if (!validate()) {
      return; // bail out, errors have been set into state
    }
    try {
      const response = await fetch(
        `https://nodes-blog-api-production.up.railway.app/admin-users-api/update-user/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: editForm.username,
            email: editForm.email,
            fullName: editForm.fullName,
            role: editForm.role,
            biography: editForm.biography,
          }),
        }
      );
      if (response.status === 403) {
        alert("You need to be superAdmin to perform this action");
      }
      if (response.ok) {
        console.log("User updated successfully");
        setOpenEditUser(false);
        setSelectedUser(null);
        fetchSummaryData();
      } else {
        console.log("Error updating user", response.statusText);
      }
    } catch (error) {
      console.log("Error updating user", error);
      setOpenEditUser(false);
    }
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

  const handleSubmitAccountAction = async (action) => {
    try {
      if (action === "suspend") {
        const response = await fetch(
          `https://nodes-blog-api-production.up.railway.app/admin-users-api/suspend-user/${selectedUser.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              reason: actionReason,
              action: action,
              createdBy: author?.username,
            }),
          }
        );
        if (!response.ok) {
          if (response.status === 403) {
            alert("You need to be superAdmin to perform this action");
          }
          console.log("Failed to suspend user", response.statusText);
        }
        await response.json();
        setOpenAccountActions(false);
        fetchSummaryData();
      } else if (action === "activate") {
        const response = await fetch(
          `https://nodes-blog-api-production.up.railway.app/admin-users-api/lift-suspension-user/${selectedUser.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              liftReason: actionReason,
            }),
          }
        );
        if (!response.ok) {
          if (response.status === 403) {
            alert("You need to be superAdmin to perform this action");
          }
          console.log("Failed to active user", response.statusText);
        }
        await response.json();
        setOpenAccountActions(false);
        fetchSummaryData();
      } else {
        return;
      }
    } catch (error) {
      console.log("Error updating user", error);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("ALL");
    setReportFilter(false);
    setActiveFilter("ALL");
    setStartDate(null);
    setEndDate(null);
  };

  // pagination handlers
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

  if (usersData.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  function redirectPost(postId) {
    window.open(`https://nodes-blog.up.railway.app/post/${postId}`, "_blank");
  }

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
                <MenuItem value="SUPERADMIN">Super Admins</MenuItem>
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
                <MenuItem value="SUSPENDED">Suspended</MenuItem>
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
                        src={formatCloudinaryUrl(user.profilePicture, {
                          width: 41,
                          height: 41,
                          crop: "fill",
                          quality: "auto:best",
                          format: "auto",
                          dpr: 3,
                        })}
                        alt={user.username}
                        sx={{
                          mr: 2,
                          bgcolor: user?.userColor || "primary.main",
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
                        user.role === "ADMIN" || user.role === "SUPERADMIN" ? (
                          <AdminPanelSettingsIcon />
                        ) : (
                          <PersonIcon />
                        )
                      }
                      label={user.role}
                      color={
                        user.role === "ADMIN" || user.role === "SUPERADMIN"
                          ? "primary"
                          : "default"
                      }
                      size="small"
                      variant={
                        user.role === "ADMIN" || user.role === "SUPERADMIN"
                          ? "filled"
                          : "outlined"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Typography noWrap>{user.postCount} posts</Typography>
                    <Typography noWrap variant="body2">
                      {user.commentCount} comments
                    </Typography>
                    <Typography noWrap variant="body2">
                      {user.followerCount} followers
                    </Typography>
                    <Typography noWrap variant="body2">
                      {user.followingCount} following
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Chip
                        icon={
                          user.active ? <VerifiedUserIcon /> : <BlockIcon />
                        }
                        label={user.active ? "Active" : "Suspended"}
                        color={user.active ? "success" : "error"}
                        size="small"
                      />
                      {user.reports.length > 0 && (
                        <Chip
                          icon={<ReportIcon />}
                          label={`${user.reports.length} Reports`}
                          color="warning"
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box
                      display="flex"
                      flexWrap="wrap"
                      alignItems="center"
                      justifyContent="center"
                      gap={1}
                    >
                      <Tooltip title="View Details">
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          onClick={() => handleOpenUserDetails(user)}
                          // sx={{ mr: 1, mb: 1 }}
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
                          // sx={{ mr: 1, mb: 1 }}
                          startIcon={<EditIcon />}
                        >
                          Edit
                        </Button>
                      </Tooltip>
                      <Tooltip title="Account Actions">
                        <Button
                          disabled={author ? user.id === author.id : true}
                          variant="contained"
                          size="small"
                          color={user.active ? "error" : "success"}
                          onClick={() => handleOpenAccountActions(user)}
                          // sx={{ mb: 1 }}
                        >
                          {user.active ? "Suspend" : "Activate"}
                        </Button>
                      </Tooltip>
                    </Box>
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
        <DialogContent
          dividers
          sx={{
            paddingBottom: "64px",
            // marginBottom: "32px",
          }}
        >
          {selectedUser && (
            <Box sx={{ width: "100%" }}>
              {/* User Profile Header - Always Visible */}
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mb={2}
                p={1}
              >
                <Avatar
                  src={formatCloudinaryUrl(selectedUser.profilePicture, {
                    width: 80,
                    height: 80,
                    crop: "fill",
                    quality: "auto:best",
                    format: "auto",
                    dpr: 3,
                  })}
                  alt={selectedUser.username}
                  sx={{
                    width: { xs: 80, sm: 100 },
                    height: { xs: 80, sm: 100 },
                    mb: 1,
                    bgcolor: selectedUser.userColor || "primary.main",
                  }}
                >
                  {selectedUser.username.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" align="center">
                  {selectedUser.fullName || selectedUser.username}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                  gutterBottom
                >
                  @{selectedUser.username}
                </Typography>
                <Chip
                  icon={
                    selectedUser.role === "ADMIN" ||
                    selectedUser.role === "SUPERADMIN" ? (
                      <AdminPanelSettingsIcon />
                    ) : (
                      <PersonIcon />
                    )
                  }
                  label={selectedUser.role}
                  color={
                    selectedUser.role === "ADMIN" ||
                    selectedUser.role === "SUPERADMIN"
                      ? "primary"
                      : "default"
                  }
                  size="small"
                  sx={{ mb: 1 }}
                />

                <Chip
                  size="small"
                  label={selectedUser.active ? "Active" : "Inactive"}
                  color={selectedUser.active ? "success" : "error"}
                  sx={{ mt: 1 }}
                />

                {selectedUser.reports.length > 0 && (
                  <Chip
                    size="small"
                    label={`${selectedUser.reports.length} Reports`}
                    color="warning"
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>

              {/* Activity Stats - Horizontal Row on Mobile */}
              <Box sx={{ mb: 2 }}>
                <Grid
                  container
                  spacing={1}
                  display="flex"
                  justifyContent="center"
                >
                  <Grid item xs={3}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 1, textAlign: "center" }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                      >
                        {selectedUser.postCount}
                      </Typography>
                      <Typography variant="caption">Posts</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={3}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 1, textAlign: "center" }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                      >
                        {selectedUser.commentCount}
                      </Typography>
                      <Typography variant="caption">Comments</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={3}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 1, textAlign: "center" }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                      >
                        {selectedUser.followerCount}
                      </Typography>
                      <Typography variant="caption">Followers</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={3}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 1, textAlign: "center" }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                      >
                        {selectedUser.followingCount}
                      </Typography>
                      <Typography variant="caption">Following</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              {/* Accordion for User Details */}
              <Accordion defaultExpanded sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>About & Contact</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="subtitle2" gutterBottom>
                    About
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedUser.biography || "No biography provided."}
                  </Typography>

                  <Typography variant="subtitle2" gutterBottom>
                    Contact
                  </Typography>
                  <Typography variant="body2">{selectedUser.email}</Typography>

                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="h8" // or "h5", "body1", etc.
                    gutterBottom
                    sx={{ mt: 2 }}
                  >
                    Account Details
                  </Typography>

                  <Box sx={{ mt: 2 }}>
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
                      {selectedUser.reports.length > 0 ? (
                        <Chip
                          size="small"
                          label={`${selectedUser.reports.length} Reports`}
                          color="warning"
                        />
                      ) : (
                        "None"
                      )}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Tabs for Activity */}
              <Box sx={{ mt: 3 }}>
                <Tabs
                  value={activeDetailTab}
                  onChange={handleDetailTabChange}
                  aria-label="user activity tabs"
                  variant="fullWidth"
                >
                  <Tab label="Posts" />
                  <Tab label="Comments" />
                  {selectedUser.reports.length > 0 && <Tab label="Reports" />}
                </Tabs>
              </Box>

              {/* Recent Posts Tab */}
              {activeDetailTab === 0 && (
                <Box sx={{ mt: 2 }}>
                  {selectedUser.posts.length > 0 ? (
                    <List disablePadding>
                      {selectedUser.posts.map((post) => (
                        <ListItem
                          key={post.id}
                          divider
                          sx={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            py: 2,
                          }}
                        >
                          <Box sx={{ display: "flex", width: "100%", mb: 1 }}>
                            <PostAddIcon sx={{ mr: 1 }} />
                            <Typography
                              noWrap
                              sx={{
                                flexGrow: 1,
                                fontWeight: 500,
                              }}
                            >
                              {post.title.length > 100
                                ? post.title.slice(0, 100) + "..."
                                : post.title}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              width: "100%",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="caption" color="textSecondary">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </Typography>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => redirectPost(post.id)}
                            >
                              View
                            </Button>
                          </Box>
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
                <Box sx={{ mt: 2 }}>
                  {selectedUser.comments.length > 0 ? (
                    <List disablePadding>
                      {selectedUser.comments.map((comment) => (
                        <ListItem
                          key={comment.id}
                          divider
                          sx={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            py: 2,
                          }}
                        >
                          <Box sx={{ display: "flex", width: "100%", mb: 1 }}>
                            <CommentIcon sx={{ mr: 1 }} />
                            <Typography
                              sx={{
                                flexGrow: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {comment.content.length > 100
                                ? comment.content.slice(0, 100).trim() + "..."
                                : comment.content}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              width: "100%",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="caption" color="textSecondary">
                              Post ID: {comment.postId}
                            </Typography>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => redirectPost(comment.postId)}
                            >
                              View Post
                            </Button>
                          </Box>
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
              {activeDetailTab === 2 && selectedUser.reports.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {selectedUser.reports.length > 0 ? (
                    <List disablePadding>
                      {selectedUser.reports.map((report) => (
                        <ListItem
                          key={report.id}
                          divider
                          sx={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            py: 2,
                          }}
                        >
                          <Box sx={{ display: "flex", width: "100%", mb: 1 }}>
                            <ReportIcon color="error" sx={{ mr: 1 }} />
                            <Typography fontWeight="medium">
                              Report Type: {report.type}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              width: "100%",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="caption" color="textSecondary">
                              Post ID: {report.postId}
                            </Typography>
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={() => redirectPost(report.postId)}
                            >
                              Visit Content
                            </Button>
                          </Box>
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
            </Box>
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
                  src={formatCloudinaryUrl(selectedUser.profilePicture, {
                    width: 80,
                    height: 80,
                    crop: "fill",
                    quality: "auto:best",
                    format: "auto",
                    dpr: 3,
                  })}
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
                  placeholder="Username (max:15)"
                  error={Boolean(errors.username)}
                  helperText={errors.username || ""}
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
                  placeholder="Full Name (max: 30)"
                  fullWidth
                  value={editForm.fullName}
                  onChange={handleEditFormChange}
                  variant="outlined"
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {author ? (
                  selectedUser.id === author.id ? (
                    <Typography variant="body2" color="textSecondary">
                      You cannot change your own role
                    </Typography>
                  ) : (
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
                        <MenuItem value="SUPERADMIN">Super Admin</MenuItem>
                      </Select>
                    </FormControl>
                  )
                ) : (
                  ""
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="biography"
                  label="Biography"
                  fullWidth
                  placeholder="Biography (max: 160)"
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
            disabled={isDisabled}
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
                  src={formatCloudinaryUrl(selectedUser.profilePicture, {
                    width: 41,
                    height: 41,
                    crop: "fill",
                    quality: "auto:best",
                    format: "auto",
                    dpr: 3,
                  })}
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
