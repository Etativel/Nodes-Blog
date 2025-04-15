import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  const statsDum = {
    totalUsers: 1280,
    totalPublishedPosts: 542,
    totalReportedPosts: 35,
    totalComments: 890,

    reportCounts: {
      sexual_content: 5,
      violent_content: 7,
      hateful_content: 6,
      harassment: 4,
      dangerous_acts: 2,
      misinformation: 3,
      child_abuse: 1,
      terrorism: 1,
      misleading: 6,
    },

    postStatusCounts: {
      DEFAULT: 300,
      DRAFT: 120,
      BLOCKED: 15,
      REPORTED: 35,
      ARCHIEVED: 72,
    },

    recentReports: [
      {
        id: "rep1",
        type: "hateful_content",
        createdAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString(), // 1 hour ago
        reporter: "johndoe",
        postTitle: "Controversial Thoughts on Society",
      },
      {
        id: "rep2",
        type: "misinformation",
        createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(), // 5 hours ago
        reporter: "janesmith",
        postTitle: "Covid-19 Cure Found",
      },
      {
        id: "rep3",
        type: "misleading",
        createdAt: new Date(Date.now() - 3600 * 1000 * 10).toISOString(),
        reporter: "techguy88",
        postTitle: "Earn $1000 in a Day!",
      },
      {
        id: "rep4",
        type: "harassment",
        createdAt: new Date(Date.now() - 3600 * 1000 * 20).toISOString(),
        reporter: "coolcat22",
        postTitle: "Targeting Specific Users",
      },
      {
        id: "rep5",
        type: "sexual_content",
        createdAt: new Date(Date.now() - 3600 * 1000 * 36).toISOString(),
        reporter: "adminbot",
        postTitle: "Explicit Post in General",
      },
    ],
  };

  useEffect(() => {
    // Simulate loading dummy stats
    setTimeout(() => setStats(statsDum), 0); // Optional delay to mimic fetch
  }, []);

  if (!stats) {
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

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      {/* Top Navigation Bar */}

      <main className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Dashboard Overview
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Monitoring platform activity and content reports
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards Row */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            }
            trend="+12% from last month"
            trendPositive={true}
          />
          <StatCard
            title="Published Posts"
            value={stats.totalPublishedPosts}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
            trend="+5% from last month"
            trendPositive={true}
          />
          <StatCard
            title="Reported Posts"
            value={stats.totalReportedPosts}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            }
            trend="-3% from last month"
            trendPositive={false}
          />
          <StatCard
            title="Total Comments"
            value={stats.totalComments}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            }
            trend="+8% from last month"
            trendPositive={true}
          />
        </div>

        {/* CHARTS SECTION */}
        <div className="grid gap-6 mb-8 md:grid-cols-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                Report Types Breakdown
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Distribution of content reports by category
              </p>
            </div>
            <div className="px-6 py-5">
              <div className="h-64">
                <PieChart data={stats.reportCounts} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                Post Status Distribution
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Current state of all posts on the platform
              </p>
            </div>
            <div className="px-6 py-5">
              <div className="h-64">
                <BarChart data={stats.postStatusCounts} />
              </div>
            </div>
          </div>
        </div>

        {/* RECENT REPORTS TABLE */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Reports
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Latest content flagged by users requiring review
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reporter
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Post
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Violation Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reported At
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-700">
                            {report.reporter.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {report.reporter}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600 hover:underline">
                        {report.postTitle}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ReportBadge type={report.type} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Review
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Dismiss
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">5</span> of{" "}
              <span className="font-medium">{stats.totalReportedPosts}</span>{" "}
              reports
            </div>
            <div>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                View All
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendPositive }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-center">
        <div className="flex-shrink-0 text-blue-500">{icon}</div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd>
              <div className="text-2xl font-semibold text-gray-900">
                {value.toLocaleString()}
              </div>
            </dd>
          </dl>
        </div>
      </div>
      {trend && (
        <div
          className={`mt-3 flex items-center text-sm ${
            trendPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          <span className="font-medium">
            {trendPositive ? (
              <svg
                className="w-4 h-4 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
            )}
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}

function ReportBadge({ type }) {
  const getBadgeColor = () => {
    switch (type) {
      case "sexual_content":
        return "bg-red-100 text-red-800";
      case "violent_content":
        return "bg-orange-100 text-orange-800";
      case "hateful_content":
        return "bg-yellow-100 text-yellow-800";
      case "harassment":
        return "bg-blue-100 text-blue-800";
      case "dangerous_acts":
        return "bg-purple-100 text-purple-800";
      case "misinformation":
        return "bg-indigo-100 text-indigo-800";
      case "child_abuse":
        return "bg-pink-100 text-pink-800";
      case "terrorism":
        return "bg-red-100 text-red-800";
      case "misleading":
        return "bg-green-100 text-green-800";
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

function PieChart({ data }) {
  const formattedLabels = Object.keys(data).map((key) =>
    key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );

  return (
    <Pie
      data={{
        labels: formattedLabels,
        datasets: [
          {
            data: Object.values(data),
            backgroundColor: [
              "#3B82F6", // blue-500
              "#EF4444", // red-500
              "#F59E0B", // amber-500
              "#10B981", // emerald-500
              "#6366F1", // indigo-500
              "#8B5CF6", // violet-500
              "#EC4899", // pink-500
              "#6B7280", // gray-500
              "#14B8A6", // teal-500
            ],
            borderWidth: 2,
            borderColor: "#ffffff",
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              font: {
                size: 12,
              },
              padding: 15,
            },
          },
          tooltip: {
            backgroundColor: "rgba(17, 24, 39, 0.8)",
            padding: 12,
            titleFont: {
              size: 14,
              weight: "bold",
            },
            bodyFont: {
              size: 13,
            },
            cornerRadius: 4,
            displayColors: true,
          },
        },
      }}
    />
  );
}

function BarChart({ data }) {
  const formattedLabels = Object.keys(data).map((key) =>
    key === "DEFAULT"
      ? "Published"
      : key === "ARCHIEVED"
      ? "Archived"
      : key.charAt(0) + key.slice(1).toLowerCase()
  );

  return (
    <Bar
      data={{
        labels: formattedLabels,
        datasets: [
          {
            label: "Posts",
            data: Object.values(data),
            backgroundColor: [
              "#3B82F6", // blue-500 for DEFAULT/Published
              "#9CA3AF", // gray-400 for DRAFT
              "#EF4444", // red-500 for BLOCKED
              "#F59E0B", // amber-500 for REPORTED
              "#6B7280", // gray-500 for ARCHIEVED/Archived
            ],
            borderRadius: 4,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(17, 24, 39, 0.8)",
            padding: 12,
            titleFont: {
              size: 14,
              weight: "bold",
            },
            bodyFont: {
              size: 13,
            },
            cornerRadius: 4,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
            grid: {
              drawBorder: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      }}
    />
  );
}
