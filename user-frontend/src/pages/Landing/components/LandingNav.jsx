function LandingNav({ openDialog, setDialogTitle, setActiveTab }) {
  return (
    <div className="l-nav-container">
      <div className="nav-flex-container">
        <div className="left-nav">
          <p className="web-title">Nodes</p>
        </div>
        <div className="right-nav">
          <button
            className="write-btn-landing"
            onClick={() => {
              setDialogTitle("Create an account to start writing.");
              openDialog("signIn");
            }}
          >
            Write
          </button>
          <button
            className="sign-in-btn"
            onClick={() => {
              setActiveTab("signIn");
              setDialogTitle("Welcome back.");
              openDialog("signIn");
            }}
          >
            Sign in
          </button>
          <button
            className="get-started-btn"
            onClick={() => {
              setDialogTitle("Join nodes.");
              openDialog("signIn");
            }}
          >
            Get started
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingNav;
