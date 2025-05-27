import { MailIcon } from "../../../../assets/svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function SignInDialog({ title, setErrors, setActiveTab, setDialogTitle }) {
  const [isValidatingGuest, setIsValidatingGuest] = useState(false);
  const navigate = useNavigate();

  async function guestLogin(e) {
    e.preventDefault();
    setIsValidatingGuest(true);

    try {
      const response = await fetch(
        "https://nodes-blog-api-production.up.railway.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            credential: "guest-user@gmail.com",
            password: "guestguest",
          }),
        }
      );

      if (!response.ok) {
        setIsValidatingGuest(false);
        return;
      }
      navigate("/posts");
    } catch (error) {
      console.error("An error occurred. Please try again", error);
      setIsValidatingGuest(false);
    } finally {
      setIsValidatingGuest(false);
    }
  }
  return (
    <>
      <p className="dialog-title">{title}</p>
      <div className="sign-type-container">
        <div className="sign-btn-container">
          <button
            disabled={isValidatingGuest}
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
          <button
            disabled={isValidatingGuest}
            className="email-btn"
            onClick={(e) => {
              guestLogin(e);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="size-6 guest-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            Sign in as Guest
            <div className="spacer"></div>
          </button>
        </div>

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
