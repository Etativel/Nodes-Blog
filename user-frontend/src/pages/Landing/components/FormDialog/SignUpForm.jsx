import { ExclamationIcon } from "../../../../assets/svg";

function SignUpForm({
  handleSubmit,
  email,
  handleEmailChange,
  errors,
  username,
  handleUsernameChange,
  password,
  handlePasswordChange,
  isValidating,
  setErrors,
  setActiveTab,
}) {
  return (
    <>
      <p className="dialog-title">Sign up with email</p>
      <div className="sign-type-container">
        <form
          action=""
          className="sign-up-form"
          onSubmit={(e) => handleSubmit(e)}
        >
          <label required htmlFor="email-field" className="label">
            email
          </label>
          <div className="input-ctr">
            <input
              type="text"
              id="email-field"
              name="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
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
          </div>
          {errors.emailError && (
            <p className="email-error">{errors.emailError}</p>
          )}

          <label htmlFor="username-field" className="label">
            username
          </label>
          <div className="input-ctr">
            <input
              type="text"
              id="username-field"
              name="username"
              max={15}
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
            />
            {errors.usernameError && (
              <span className="error-exclamation">
                <ExclamationIcon
                  strokeWidth={1}
                  stroke="#c94a4a"
                  className="exclamation-icon"
                />
              </span>
            )}
          </div>
          {errors.usernameError && (
            <p className="username-error">{errors.usernameError}</p>
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

export default SignUpForm;
