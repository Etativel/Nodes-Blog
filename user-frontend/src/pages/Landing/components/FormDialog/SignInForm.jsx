import { ExclamationIcon } from "../../../../assets/svg";

function SignInForm({
  isValidating,
  errors,
  handleSignIn,
  setErrors,
  setDialogTitle,
  setActiveTab,
  handleCredentialChange,
  credential,
  password,
  handlePasswordChange,
}) {
  return (
    <>
      <p className="dialog-title">Sign in with email</p>
      <div className="sign-type-container">
        <form
          action=""
          className="sign-up-form"
          onSubmit={(e) => handleSignIn(e)}
        >
          <label required htmlFor="email-field" className="label">
            email or username
          </label>
          <div className="input-ctr">
            <input
              type="text"
              id="email-field"
              name="email"
              value={credential}
              onChange={(e) => handleCredentialChange(e.target.value)}
            />
            {errors.emailError && (
              <span className="error-exclamation">
                <ExclamationIcon
                  strokeWidth={1}
                  stroke="#c94a4a"
                  className="exclamation-icon"
                />
              </span>
            )}
            {errors.suspendedError && (
              <span className="error-exclamation">
                <ExclamationIcon
                  strokeWidth={1}
                  stroke="#c94a4a"
                  className="exclamation-icon"
                />
              </span>
            )}
          </div>
          {errors.emailError && (
            <p className="email-error">{errors.emailError}</p>
          )}

          {/* Suspension error text */}
          {errors.suspendedError && (
            <p className="email-error">{errors.suspendedError}</p>
          )}
          <label htmlFor="password-field" className="label">
            password
          </label>
          <div className="input-ctr">
            <input
              type="password"
              id="password-field"
              name="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
            {errors.passwordError && (
              <span className="error-exclamation">
                <ExclamationIcon
                  strokeWidth={1}
                  stroke="#c94a4a"
                  className="exclamation-icon"
                />
              </span>
            )}
          </div>
          {errors.passwordError && (
            <p className="password-error">{errors.passwordError}</p>
          )}
          <button
            className="submit-btn"
            type="submit"
            disabled={isValidating}
            style={{
              opacity: isValidating ? 0.5 : 1,
              cursor: isValidating ? "not-allowed" : "pointer",
            }}
          >
            Continue
          </button>
        </form>
        <p className="sign-in-info">
          <button
            className="sign-up-btn options"
            onClick={() => {
              setErrors({});
              setDialogTitle("Join Nodes.");
              setActiveTab("default");
            }}
          >
            &lt; &nbsp; All sign in option
          </button>
        </p>
      </div>
    </>
  );
}

export default SignInForm;
