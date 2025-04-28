function ReportForm({
  setDialogOpen,
  reportType,
  setReportType,
  reportAdditionalInfo,
  setReportAdditionalInfo,
  handleReportSubmit,
  reportLoading,
  contentId,
  uniqueClassname,
}) {
  const disableButton =
    !reportType || reportLoading || reportAdditionalInfo.length > 160;

  return (
    <div className="report-from-ctr">
      <form onSubmit={(e) => handleReportSubmit(e, contentId)}>
        <div className="r-i-ctr">
          <input
            type="radio"
            id={`sexual-content-comment-${uniqueClassname}`}
            name="reportCategory"
            className="report-radio"
            value="sexual_content"
            checked={reportType === "sexual_content"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor={`sexual-content-comment-${uniqueClassname}`}>
            Sexual content
          </label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id={`violent-content-comment-${uniqueClassname}`}
            name="reportCategory"
            className="report-radio"
            value="violent_content"
            checked={reportType === "violent_content"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor={`violent-content-comment-${uniqueClassname}`}>
            Violent or repulsive content
          </label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id={`hateful-content-comment-${uniqueClassname}`}
            name="reportCategory"
            className="report-radio"
            value="hateful_content"
            checked={reportType === "hateful_content"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor={`hateful-content-comment-${uniqueClassname}`}>
            Hateful or abusive content
          </label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id={`harassment-comment-${uniqueClassname}`}
            name="reportCategory"
            className="report-radio"
            value="harassment"
            checked={reportType === "harassment"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor={`harassment-comment-${uniqueClassname}`}>
            Harassment or bullying
          </label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id={`dangerous-acts-comment-${uniqueClassname}`}
            name="reportCategory"
            className="report-radio"
            value="dangerous_acts"
            checked={reportType === "dangerous_acts"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor={`dangerous-acts-comment-${uniqueClassname}`}>
            Harmful or dangerous acts
          </label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id={`misinformation-comment-${uniqueClassname}`}
            name="reportCategory"
            className="report-radio"
            value="misinformation"
            checked={reportType === "misinformation"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor={`misinformation-comment-${uniqueClassname}`}>
            Misinformation
          </label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id={`child-abuse-comment-${uniqueClassname}`}
            name="reportCategory"
            className="report-radio"
            value="child_abuse"
            checked={reportType === "child_abuse"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor={`child-abuse-comment-${uniqueClassname}`}>
            Child abuse
          </label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id={`terrorism-comment-${uniqueClassname}`}
            name="reportCategory"
            className="report-radio"
            value="terrorism"
            checked={reportType === "terrorism"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor={`terrorism-comment-${uniqueClassname}`}>
            Promotes terrorism
          </label>
        </div>
        <div className="r-i-ctr">
          <input
            type="radio"
            id={`spam-misleading-comment-${uniqueClassname}`}
            name="reportCategory"
            className="report-radio"
            value="spam_misleading"
            checked={reportType === "spam_misleading"}
            onChange={(e) => {
              setReportType(e.target.value);
              console.log(e.target.value);
            }}
          />
          <label htmlFor={`spam-misleading-comment-${uniqueClassname}`}>
            Spam or misleading
          </label>
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

export default ReportForm;
