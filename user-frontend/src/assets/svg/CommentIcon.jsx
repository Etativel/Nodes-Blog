import React from "react";

const CommentSolid = ({ className, fill = "black" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={fill}
    className={`size-6 ${className}`}
  >
    <path
      fillRule="evenodd"
      d="M5.337 21.718a6.707 6.707 0 0 1-.533-.074.75.75 0 0 1-.44-1.223 3.73 3.73 0 0 0 .814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 0 1-4.246.997Z"
      clipRule="evenodd"
    />
  </svg>
);

const CommentOutline = ({ className, color = "red", strokeWidth = 1.5 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke={color}
    className={`size-6  ${className}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
    />
  </svg>
);

const CommentIcon = ({
  isOutline = true,
  className = "",
  color = "black",
  stroke = "black",
  strokeWidth = 1.5,
  fill = "black",
}) => {
  return isOutline ? (
    <CommentOutline
      className={className}
      color={color}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  ) : (
    <CommentSolid className={className} color={color} fill={fill} />
  );
};

export default CommentIcon;
