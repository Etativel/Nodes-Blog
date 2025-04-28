import { MailIcon } from "../../../../assets/svg";

function DefaultDialog({ title, setActiveTab, setErrors, setDialogTitle }) {
  return (
    <>
      <p className="dialog-title">{title}</p>
      <div className="sign-type-container">
        <button className="email-btn" onClick={() => setActiveTab("email")}>
          <MailIcon
            strokeWidth={1}
            stroke="currentColor"
            className="sign-icon"
          />
          Sign up with email
          <div className="spacer"></div>
        </button>
        <p className="sign-in-info">
          Already have account?
          <button
            className="sign-up-btn"
            onClick={() => {
              setErrors({});
              setDialogTitle("Welcome back.");
              setActiveTab("signIn");
            }}
          >
            Sign in
          </button>
        </p>
      </div>
    </>
  );
}

export default DefaultDialog;
