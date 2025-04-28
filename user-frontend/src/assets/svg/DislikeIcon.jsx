const DislikeSolid = ({ className, fill = "black" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={fill}
    className={`size-6 ${className}`}
  >
    <path d="M15.73 5.5h1.035A7.465 7.465 0 0 1 18 9.625a7.465 7.465 0 0 1-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 0 1-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.499 4.499 0 0 0-.322 1.672v.633A.75.75 0 0 1 9 22a2.25 2.25 0 0 1-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.622c-1.026 0-1.945-.694-2.054-1.715A12.137 12.137 0 0 1 1.5 12.25c0-2.848.992-5.464 2.649-7.521C4.537 4.247 5.136 4 5.754 4H9.77a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23ZM21.669 14.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.958 8.958 0 0 1-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227Z" />
  </svg>
);

const DislikeOutline = ({ className, stroke = "black", strokeWidth = 1.5 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke={stroke}
    className={`size-6 ${className}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54"
    />
  </svg>
);

const DislikeIcon = ({
  isOutline = true,
  className = "",
  fill = "red",
  stroke = "red",
  strokeWidth = 1.5,
}) => {
  return isOutline ? (
    <DislikeOutline
      className={className}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  ) : (
    <DislikeSolid className={className} fill={fill} />
  );
};

export default DislikeIcon;

function ReportForm({
  setDialogOpen,
  reportType,
  setReportType,
  reportAdditionalInfo,
  setReportAdditionalInfo,
  handleReportSubmit,
  reportLoading,
}) {
  const disableButton =
    reportLoading || !reportType || reportAdditionalInfo.length > 160;
  return (
    <div className="report-from-ctr">
      <form onSubmit={(e) => handleReportSubmit(e)}>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="sexual-content"
            name="reportCategory"
            className="report-radio"
            value="sexual_content"
            checked={reportType === "sexual_content"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="sexual-content">Sexual content</label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="violent-content"
            name="reportCategory"
            className="report-radio"
            value="violent_content"
            checked={reportType === "violent_content"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="violent-content">Violent or repulsive content</label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="hateful-content"
            name="reportCategory"
            className="report-radio"
            value="hateful_content"
            checked={reportType === "hateful_content"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="hateful-content">Hateful or abusive content</label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="harassment"
            name="reportCategory"
            className="report-radio"
            value="harassment"
            checked={reportType === "harassment"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="harassment">Harassment or bullying</label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="dangerous-acts"
            name="reportCategory"
            className="report-radio"
            value="dangerous_acts"
            checked={reportType === "dangerous_acts"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="dangerous-acts">Harmful or dangerous acts</label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="misinformation"
            name="reportCategory"
            className="report-radio"
            value="misinformation"
            checked={reportType === "misinformation"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="misinformation">Misinformation</label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="child-abuse"
            name="reportCategory"
            className="report-radio"
            value="child_abuse"
            checked={reportType === "child_abuse"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="child-abuse">Child abuse</label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="terrorism"
            name="reportCategory"
            className="report-radio"
            value="terrorism"
            checked={reportType === "terrorism"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="terrorism">Promotes terrorism</label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id="spam-misleading"
            name="reportCategory"
            className="report-radio"
            value="spam_misleading"
            checked={reportType === "spam_misleading"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor="spam-misleading">Spam or misleading</label>
        </div>
        <div className="additional-info-ctr">
          <label htmlFor="add-info" className="add-info-text">
            Additional information
          </label>
          <textarea
            name="report-message"
            id="add-info"
            className="additional-info-txt"
            placeholder="Write here..."
            value={reportAdditionalInfo}
            onChange={(e) => {
              setReportAdditionalInfo(e.target.value);
            }}
          ></textarea>
          <div className="biography-length length-indicator">
            <span>{reportAdditionalInfo.length}</span>
            <span className="max-length">/160</span>
          </div>
        </div>
        <div className="submit-report-btn-ctr">
          <button
            aria-label="cancel-report"
            type="button"
            className="cancel-report-btn"
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </button>
          <button
            aria-label="submit-report"
            type="submit"
            className={`submit-report-btn ${disableButton ? "disabled" : ""}`}
            disabled={disableButton}
          >
            Report
          </button>
        </div>
      </form>
    </div>
  );
}
