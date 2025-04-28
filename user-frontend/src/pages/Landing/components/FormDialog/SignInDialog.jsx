import { MailIcon } from "../../../../assets/svg";

function SignInDialog({ title, setErrors, setActiveTab, setDialogTitle }) {
  return (
    <>
      <p className="dialog-title">{title}</p>
      <div className="sign-type-container">
        <button
          className="email-btn"
          onClick={() => {
            setErrors({});
            setActiveTab("emailSignIn");
          }}
        >
          <MailIcon
            strokeWidth={1}
            stroke="currentColor"
            className="sign-icon"
          />
          Sign in with email
          <div className="spacer"></div>
        </button>
        <p className="sign-in-info">
          No account?
          <button
            className="create-acc-btn padding"
            onClick={() => {
              setDialogTitle("Join nodes.");
              setActiveTab("default");
            }}
          >
            Create one
          </button>
        </p>
      </div>
    </>
  );
}
export default SignInDialog;
