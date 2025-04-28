function LandingMain({ openDialog, setDialogTitle }) {
  return (
    <div className="l-main-container">
      <div className="main-title">
        Connecting
        <br />
        people & ideas
      </div>
      <div className="main-subtitle">
        A space to explore and share your ideas.
      </div>
      <button
        className="start-reading-btn"
        onClick={() => {
          setDialogTitle("Join nodes.");
          openDialog("signIn");
        }}
      >
        Start reading
      </button>
    </div>
  );
}

export default LandingMain;
