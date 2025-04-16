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

// Expanded dummy comments data to demonstrate all features
const commentsData = [
  {
    id: "c1a23456-7890-4def-b123-456789abcdef",
    content:
      "This is a reported comment with inappropriate language that violates community guidelines.",
    postId: "d5386468-4667-402a-9963-ad985efd90c7",
    postTitle: "Post Title Example",
    authorId: "u1234567-89ab-cdef-0123-456789abcdef",
    author: {
      username: "problematicUser",
      role: "USER",
      profilePicture: null,
    },
    createdAt: "2025-04-15T14:25:17.827Z",
    updatedAt: "2025-04-15T14:25:17.827Z",
    parentId: null,
    replies: [
      {
        id: "c2b34567-8901-5efg-c234-567890bcdefg",
        content:
          "Please keep the discussion respectful and follow our community guidelines.",
        postId: "d5386468-4667-402a-9963-ad985efd90c7",
        authorId: "u2345678-9abc-defg-1234-56789abcdefg",
        author: {
          username: "moderator1",
          role: "USER",
          profilePicture: "/api/placeholder/32/32",
        },
        createdAt: "2025-04-15T14:35:42.391Z",
        updatedAt: "2025-04-15T14:35:42.391Z",
        parentId: "c1a23456-7890-4def-b123-456789abcdef",
      },
    ],
    reactions: [
      {
        id: "r1c34567-8901-5efg-c234-567890bcdefg",
        userId: "u3456789-abcd-efgh-2345-6789abcdefgh",
        reaction: "DISLIKE",
        createdAt: "2025-04-15T14:30:22.827Z",
      },
      {
        id: "r2d45678-9012-6fgh-d345-678901cdefgh",
        userId: "u4567890-bcde-fghi-3456-789abcdefghi",
        reaction: "DISLIKE",
        createdAt: "2025-04-15T14:32:17.827Z",
      },
      {
        id: "r3e56789-0123-7ghi-e456-789012defghi",
        userId: "u5678901-cdef-ghij-4567-89abcdefghij",
        reaction: "DISLIKE",
        createdAt: "2025-04-15T14:33:05.827Z",
      },
    ],
    reports: [
      {
        id: "rp1f6789-0123-7ghi-e456-789012defghi",
        type: "hateful_content",
        message: "This comment contains hate speech",
        createdAt: "2025-04-15T14:40:12.827Z",
        reporter: {
          username: "concernedUser1",
        },
      },
      {
        id: "rp2g7890-1234-8hij-f567-890123efghij",
        type: "harassment",
        message: "This comment is targeting other users",
        createdAt: "2025-04-15T14:45:33.827Z",
        reporter: {
          username: "concernedUser2",
        },
      },
    ],
    status: "REPORTED",
  },
  {
    id: "c3h8901-2345-9ijk-g678-901234fghijk",
    content:
      "I found this article very informative and well-researched. Thanks for sharing this valuable content with the community!",
    postId: "e6397579-5778-513b-b064-bf085efd90d8",
    postTitle: "Community Guidelines",
    authorId: "u6789012-defg-hijk-5678-9abcdefghijk",
    author: {
      username: "positiveUser",
      role: "USER",
      profilePicture: "/api/placeholder/32/32",
    },
    createdAt: "2025-04-14T09:12:45.827Z",
    updatedAt: "2025-04-14T09:12:45.827Z",
    parentId: null,
    replies: [],
    reactions: [
      {
        id: "r4i9012-3456-0jkl-h789-012345ghijkl",
        userId: "u7890123-efgh-ijkl-6789-abcdefghijkl",
        reaction: "LIKE",
        createdAt: "2025-04-14T09:15:22.827Z",
      },
      {
        id: "r5j0123-4567-1klm-i890-123456hijklm",
        userId: "u8901234-fghi-jklm-7890-bcdefghijklm",
        reaction: "LIKE",
        createdAt: "2025-04-14T09:17:55.827Z",
      },
    ],
    reports: [],
    status: "DEFAULT",
  },
  {
    id: "c4k1234-5678-2lmn-j901-234567ijklmn",
    content:
      "Click here to win free prizes! Visit my website at scam.example.com and enter your credit card details!",
    postId: "f7408680-6889-624c-c175-cf196fge01e9",
    postTitle: "Questionable Content",
    authorId: "u9012345-ghij-klmn-8901-cdefghijklmn",
    author: {
      username: "spammer123",
      role: "USER",
      profilePicture: null,
    },
    createdAt: "2025-04-13T16:45:33.827Z",
    updatedAt: "2025-04-13T16:45:33.827Z",
    parentId: null,
    replies: [],
    reactions: [],
    reports: [
      {
        id: "rp3l2345-6789-3mno-k012-345678jklmno",
        type: "spam_misleading",
        message: "This is an obvious spam comment with suspicious links",
        createdAt: "2025-04-13T16:55:42.827Z",
        reporter: {
          username: "vigilantUser",
        },
      },
    ],
    status: "REPORTED",
  },
  {
    id: "c5m3456-7890-4nop-l123-456789klmnop",
    content:
      "This content promotes conspiracy theories and contains factual errors that could mislead others.",
    postId: "j0731913-9112-957f-f408-fi529jif34h2",
    postTitle: "Controversial Discussion",
    authorId: "u0123456-hijk-lmno-9012-defghijklmno",
    author: {
      username: "truthSeeker77",
      role: "USER",
      profilePicture: null,
    },
    createdAt: "2025-04-12T11:23:17.827Z",
    updatedAt: "2025-04-12T11:23:17.827Z",
    parentId: null,
    replies: [],
    reactions: [
      {
        id: "r6n4567-8901-5opq-m234-567890lmnopq",
        userId: "u1234567-ijkl-mnop-0123-efghijklmnop",
        reaction: "DISLIKE",
        createdAt: "2025-04-12T11:28:45.827Z",
      },
    ],
    reports: [
      {
        id: "rp4o5678-9012-6pqr-n345-678901mnopqr",
        type: "misinformation",
        message: "This comment spreads dangerous misinformation",
        createdAt: "2025-04-12T11:35:22.827Z",
        reporter: {
          username: "factChecker",
        },
      },
    ],
    status: "REPORTED",
  },
  {
    id: "c6p6789-0123-7qrs-o456-789012nopqrs",
    content:
      "I experienced the same issue with the mobile app. The search function crashes when I try to filter by date.",
    postId: "l2953135-1334-179h-h620-hk741lkh56j4",
    postTitle: "Bug Report Thread",
    authorId: "u2345678-jklm-nopq-1234-fghijklmnopq",
    author: {
      username: "appUser42",
      role: "USER",
      profilePicture: "/api/placeholder/32/32",
    },
    createdAt: "2025-04-11T15:42:39.827Z",
    updatedAt: "2025-04-11T15:42:39.827Z",
    parentId: null,
    replies: [
      {
        id: "c7q7890-1234-8rst-p567-890123opqrst",
        content:
          "Thanks for reporting this issue. We've noted it and our developers are working on a fix for the next update.",
        postId: "l2953135-1334-179h-h620-hk741lkh56j4",
        authorId: "u3456789-klmn-opqr-2345-ghijklmnopqr",
        author: {
          username: "supportTeam",
          role: "ADMIN",
          profilePicture: "/api/placeholder/32/32",
        },
        createdAt: "2025-04-11T16:15:22.827Z",
        updatedAt: "2025-04-11T16:15:22.827Z",
        parentId: "c6p6789-0123-7qrs-o456-789012nopqrs",
      },
    ],
    reactions: [
      {
        id: "r7r8901-2345-9stu-q678-901234pqrstu",
        userId: "u4567890-lmno-pqrs-3456-hijklmnopqrs",
        reaction: "LIKE",
        createdAt: "2025-04-11T15:55:17.827Z",
      },
    ],
    reports: [],
    status: "DEFAULT",
  },
  {
    id: "c8s0123-4567-0tuv-r789-012345qrstuv",
    content:
      "I strongly disagree with your assessment. The new design is far worse than the previous one for accessibility reasons.",
    postId: "m3064246-2445-280i-i731-il852mli67k5",
    postTitle: "User Feedback Collection",
    authorId: "u5678901-mnop-qrst-4567-ijklmnopqrst",
    author: {
      username: "designCritic",
      role: "USER",
      profilePicture: null,
    },
    createdAt: "2025-04-10T09:37:14.827Z",
    updatedAt: "2025-04-10T09:37:14.827Z",
    parentId: null,
    replies: [],
    reactions: [],
    reports: [],
    status: "DEFAULT",
  },
  {
    id: "c9t1234-5678-1uvw-s890-123456rstuv",
    content:
      "Could someone help me figure out how to change my account settings? I can't find the option anywhere.",
    postId: "o5286468-4667-402k-k953-ko074bok89m7",
    postTitle: "Help Request",
    authorId: "u6789012-nopq-rstu-5678-jklmnopqrstu",
    author: {
      username: "newUser123",
      role: "USER",
      profilePicture: "/api/placeholder/32/32",
    },
    createdAt: "2025-04-09T14:22:58.827Z",
    updatedAt: "2025-04-09T14:22:58.827Z",
    parentId: null,
    replies: [
      {
        id: "c10u2345-6789-2vwx-t901-234567stuvwx",
        content:
          "You can find account settings by clicking on your profile icon in the top right corner, then selecting 'Settings' from the dropdown menu.",
        postId: "o5286468-4667-402k-k953-ko074bok89m7",
        authorId: "u7890123-opqr-stuv-6789-klmnopqrstuv",
        author: {
          username: "helpfulUser",
          role: "USER",
          profilePicture: "/api/placeholder/32/32",
        },
        createdAt: "2025-04-09T14:27:33.827Z",
        updatedAt: "2025-04-09T14:27:33.827Z",
        parentId: "c9t1234-5678-1uvw-s890-123456rstuv",
      },
    ],
    reactions: [
      {
        id: "r8u3456-7890-3wxy-t012-345678tuvwxy",
        userId: "u8901234-pqrs-tuvw-7890-lmnopqrstuvw",
        reaction: "LIKE",
        createdAt: "2025-04-09T14:30:22.827Z",
      },
    ],
    reports: [],
    status: "DEFAULT",
  },
  {
    id: "c11v4567-8901-4yz1-u123-456789uvwxyz",
    content:
      "This platform's policies are restrictive and limit free speech! You're censoring important discussions!",
    postId: "n4175357-3556-391j-j842-jm963nmj78l6",
    postTitle: "Policy Violation",
    authorId: "u9012345-qrst-uvwx-8901-mnopqrstuvwx",
    author: {
      username: "freedomFighter42",
      role: "USER",
      profilePicture: null,
    },
    createdAt: "2025-04-08T17:12:44.827Z",
    updatedAt: "2025-04-08T17:12:44.827Z",
    parentId: null,
    replies: [],
    reactions: [],
    reports: [
      {
        id: "rp5v5678-9012-6123-o345-678901opqrst",
        type: "harassment",
        message: "This comment is hostile and accuses the platform unfairly",
        createdAt: "2025-04-08T17:25:33.827Z",
        reporter: {
          username: "communityDefender",
        },
      },
    ],
    status: "REPORTED",
  },
  {
    id: "c12w5678-9012-5ab2-v234-567890vwxyza",
    content:
      "The new update completely broke the notification system. Nothing works anymore. Fix it!",
    postId: "k1842024-0223-068g-g519-gj630kjg45i3",
    postTitle: "Product Announcement",
    authorId: "u0123456-rstu-vwxy-9012-nopqrstuvwxy",
    author: {
      username: "angryUser99",
      role: "USER",
      profilePicture: null,
    },
    createdAt: "2025-04-07T11:37:22.827Z",
    updatedAt: "2025-04-07T11:37:22.827Z",
    parentId: null,
    replies: [
      {
        id: "c13x6789-0123-6bc3-w345-678901wxyza",
        content:
          "I'm sorry you're experiencing issues. Could you provide more details about what specifically isn't working? Our team is actively addressing bugs in the new release.",
        postId: "k1842024-0223-068g-g519-gj630kjg45i3",
        authorId: "u1234567-stuv-wxyz-0123-opqrstuvwxyz",
        author: {
          username: "productSupport",
          role: "ADMIN",
          profilePicture: "/api/placeholder/32/32",
        },
        createdAt: "2025-04-07T11:42:55.827Z",
        updatedAt: "2025-04-07T11:42:55.827Z",
        parentId: "c12w5678-9012-5ab2-v234-567890vwxyza",
      },
      {
        id: "c13x6789-0123-6bc3-w345-678901wxyza",
        content:
          "I'm sorry you're experiencing issues. Could you provide more details about what specifically isn't working? Our team is actively addressing bugs in the new release.",
        postId: "k1842024-0223-068g-g519-gj630kjg45i3",
        authorId: "u1234567-stuv-wxyz-0123-opqrstuvwxyz",
        author: {
          username: "productSupport",
          role: "ADMIN",
          profilePicture: "/api/placeholder/32/32",
        },
        createdAt: "2025-04-07T11:42:55.827Z",
        updatedAt: "2025-04-07T11:42:55.827Z",
        parentId: "c12w5678-9012-5ab2-v234-567890vwxyza",
      },
      {
        id: "c13x6789-0123-6bc3-w345-678901wxyza",
        content:
          "I'm sorry you're experiencing issues. Could you provide more details about what specifically isn't working? Our team is actively addressing bugs in the new release.",
        postId: "k1842024-0223-068g-g519-gj630kjg45i3",
        authorId: "u1234567-stuv-wxyz-0123-opqrstuvwxyz",
        author: {
          username: "productSupport",
          role: "ADMIN",
          profilePicture: "/api/placeholder/32/32",
        },
        createdAt: "2025-04-07T11:42:55.827Z",
        updatedAt: "2025-04-07T11:42:55.827Z",
        parentId: "c12w5678-9012-5ab2-v234-567890vwxyza",
      },
      {
        id: "c13x6789-0123-6bc3-w345-678901wxyza",
        content:
          "I'm sorry you're experiencing issues. Could you provide more details about what specifically isn't working? Our team is actively addressing bugs in the new release.",
        postId: "k1842024-0223-068g-g519-gj630kjg45i3",
        authorId: "u1234567-stuv-wxyz-0123-opqrstuvwxyz",
        author: {
          username: "productSupport",
          role: "ADMIN",
          profilePicture: "/api/placeholder/32/32",
        },
        createdAt: "2025-04-07T11:42:55.827Z",
        updatedAt: "2025-04-07T11:42:55.827Z",
        parentId: "c12w5678-9012-5ab2-v234-567890vwxyza",
      },
      {
        id: "c13x6789-0123-6bc3-w345-678901wxyza",
        content:
          "I'm sorry you're experiencing issues. Could you provide more details about what specifically isn't working? Our team is actively addressing bugs in the new release.",
        postId: "k1842024-0223-068g-g519-gj630kjg45i3",
        authorId: "u1234567-stuv-wxyz-0123-opqrstuvwxyz",
        author: {
          username: "productSupport",
          role: "ADMIN",
          profilePicture: "/api/placeholder/32/32",
        },
        createdAt: "2025-04-07T11:42:55.827Z",
        updatedAt: "2025-04-07T11:42:55.827Z",
        parentId: "c12w5678-9012-5ab2-v234-567890vwxyza",
      },
      {
        id: "c13x6789-0123-6bc3-w345-678901wxyza",
        content:
          "I'm sorry you're experiencing issues. Could you provide more details about what specifically isn't working? Our team is actively addressing bugs in the new release.",
        postId: "k1842024-0223-068g-g519-gj630kjg45i3",
        authorId: "u1234567-stuv-wxyz-0123-opqrstuvwxyz",
        author: {
          username: "productSupport",
          role: "ADMIN",
          profilePicture: "/api/placeholder/32/32",
        },
        createdAt: "2025-04-07T11:42:55.827Z",
        updatedAt: "2025-04-07T11:42:55.827Z",
        parentId: "c12w5678-9012-5ab2-v234-567890vwxyza",
      },
      {
        id: "c13x6789-0123-6bc3-w345-678901wxyza",
        content:
          "I'm sorry you're experiencing issues. Could you provide more details about what specifically isn't working? Our team is actively addressing bugs in the new release.",
        postId: "k1842024-0223-068g-g519-gj630kjg45i3",
        authorId: "u1234567-stuv-wxyz-0123-opqrstuvwxyz",
        author: {
          username: "productSupport",
          role: "ADMIN",
          profilePicture: "/api/placeholder/32/32",
        },
        createdAt: "2025-04-07T11:42:55.827Z",
        updatedAt: "2025-04-07T11:42:55.827Z",
        parentId: "c12w5678-9012-5ab2-v234-567890vwxyza",
      },
      {
        id: "c13x6789-0123-6bc3-w345-678901wxyza",
        content:
          "I'm sorry you're experiencing issues. Could you provide more details about what specifically isn't working? Our team is actively addressing bugs in the new release.",
        postId: "k1842024-0223-068g-g519-gj630kjg45i3",
        authorId: "u1234567-stuv-wxyz-0123-opqrstuvwxyz",
        author: {
          username: "productSupport",
          role: "ADMIN",
          profilePicture: "/api/placeholder/32/32",
        },
        createdAt: "2025-04-07T11:42:55.827Z",
        updatedAt: "2025-04-07T11:42:55.827Z",
        parentId: "c12w5678-9012-5ab2-v234-567890vwxyza",
      },
    ],
    reactions: [
      {
        id: "r9w7890-1234-9cd4-x456-789012wxyzab",
        userId: "u2345678-tuvw-xyza-1234-pqrstuvwxyza",
        reaction: "LIKE",
        createdAt: "2025-04-07T11:39:42.827Z",
      },
    ],
    reports: [],
    status: "DEFAULT",
  },
  {
    id: "c14y8901-2345-7de5-y567-890123xyzabcd",
    content:
      "Does anyone know when the mobile app will be available for Android users?",
    postId: "k1842024-0223-068g-g519-gj630kjg45i3",
    postTitle: "Product Announcement",
    authorId: "u3456789-uvwx-yzab-2345-qrstuvwxyzab",
    author: {
      username: "androidFan",
      role: "USER",
      profilePicture: "/api/placeholder/32/32",
    },
    createdAt: "2025-04-06T15:17:33.827Z",
    updatedAt: "2025-04-06T15:17:33.827Z",
    parentId: null,
    replies: [],
    reactions: [],
    reports: [],
    status: "DEFAULT",
  },
];

// Mock function to simulate API calls
const mockApiCall = (action, data) => {
  console.log(`API call: ${action}`, data);
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 500);
  });
};

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

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Load initial data
  useEffect(() => {
    setFilteredComments(commentsData);
  }, []);

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
          comment.postTitle.toLowerCase().includes(query)
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
    try {
      await mockApiCall(reviewAction, {
        commentId: selectedComment.id,
        feedback: reviewComment,
      });

      // Show success notification
      setNotification({
        show: true,
        message: `Comment successfully ${reviewAction.toLowerCase()}ed!`,
        severity: "success",
      });

      // Close the dialog
      setOpenReview(false);

      // In a real app, you would update the comment status in the state or refetch data
      setTimeout(() => {
        setNotification({ show: false, message: "", severity: "success" });
      }, 3000);
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
  const paginatedComments = filteredComments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box p={3} pt={2}>
      <h2 className="text-2xl font-bold text-gray-800">Comments moderation</h2>
      <p className="mt-1 text-sm text-gray-600 mb-4">
        Monitor and moderate user comments across your platform
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
                <MenuItem value="DEFAULT">Default</MenuItem>
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
                          {comment.author.role === "ADMIN" ? (
                            <Chip
                              size="small"
                              label="ADMIN"
                              color="primary"
                              sx={{ mr: 1 }}
                            />
                          ) : null}
                          <Typography variant="body2">
                            {comment.author.username}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={comment.postTitle}>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: "150px" }}
                          >
                            {comment.postTitle}
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
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          onClick={() => handleOpenReview(comment, "APPROVE")}
                          sx={{ mr: 1, mb: { xs: 1, md: 0 } }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => handleOpenReview(comment, "REMOVE")}
                        >
                          Remove
                        </Button>
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
                      <strong>Post:</strong> {selectedComment.postTitle}
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
              <Button
                onClick={() => {
                  handleCloseDetails();
                  handleOpenReview(selectedComment, "APPROVE");
                }}
                color="primary"
              >
                Approve
              </Button>
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
