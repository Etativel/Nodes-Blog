import "../styles/LandingPage.css";
import { useRef, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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

function LandingFooter() {
  return (
    <div className="l-foot-container">
      <div className="foot-flex-container">
        <a
          href="https://github.com/Etativel/Nodes-Blog"
          className="about-github"
        >
          Github
        </a>
      </div>
    </div>
  );
}

function SignDialog({
  activeTab,
  setActiveTab,
  isOpen,
  closeDialog,
  title = "Join nodes",
  setDialogTitle,
}) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [credential, setCredential] = useState("");
  const navigate = useNavigate();
  const [, setLoginError] = useState(null);
  const dialogRef = useRef(null);
  const signContainer = useRef(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (dialogRef.current) {
          dialogRef.current.classList.add("active");
          signContainer.current.classList.add("active");
        }
      }, 10);
    } else {
      if (dialogRef.current) {
        dialogRef.current.classList.remove("active");
        signContainer.current.classList.remove("active");
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleClose() {
    setActiveTab("default");
    closeDialog();
  }

  function handleEmailChange(email) {
    setEmail(email);
  }
  function handleUsernameChange(username) {
    setUsername(username);
  }
  function handlePasswordChange(password) {
    setPassword(password);
  }

  function handleCredentialChange(credential) {
    setCredential(credential);
  }

  async function validateForm(email, username, password) {
    const errors = {};

    // Validate email
    if (!email) {
      errors.emailError = "Email is required.";
      setIsValidating(false);
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.emailError = "Invalid email address.";
      setIsValidating(false);
    } else {
      try {
        const response = await fetch(
          "https://nodes-blog-api-production.up.railway.app/user/check-email",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        );
        const data = await response.json();
        if (!data.available) {
          errors.emailError = "Email already taken.";
          setIsValidating(false);
        }
      } catch (error) {
        console.error("Error checking email:", error);
        errors.emailError = "Error checking email availability.";
        setIsValidating(false);
      }
    }

    // Validate username
    if (!username) {
      errors.usernameError = "Username is required.";
      setIsValidating(false);
    } else if (username.length < 3) {
      errors.usernameError = "Username must be at least 3 characters.";
      setIsValidating(false);
    } else if (username.length > 15) {
      errors.usernameError = "Username must be no more than 15 characters.";
      setIsValidating(false);
    } else if (!/^[A-Za-z0-9]+$/.test(username)) {
      errors.usernameError = "Username can only contain letters and numbers.";
      setIsValidating(false);
    } else {
      try {
        const response = await fetch(
          "https://nodes-blog-api-production.up.railway.app/user/check-username",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
          }
        );
        const data = await response.json();
        if (!data.available) {
          errors.usernameError = "Username already taken.";
          setIsValidating(false);
        }
      } catch (error) {
        console.error("Error checking username:", error);
        errors.usernameError = "Error checking username availability.";
        setIsValidating(false);
      }
    }

    // Validate password
    if (!password) {
      errors.passwordError = "Password is required.";
      setIsValidating(false);
    } else if (password.length < 6) {
      errors.passwordError = "Password must be at least 6 characters.";
      setIsValidating(false);
    }

    return errors;
  }

  async function validateUserLogin(credential, password) {
    const errors = {};

    if (!credential) {
      errors.credentialError = "Email or username is required.";
    } else {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (credential.includes("@") && !emailRegex.test(credential)) {
        errors.credentialError = "Invalid email address.";
      }
    }

    if (!password) {
      errors.passwordError = "Password is required.";
    } else if (password.length < 6) {
      errors.passwordError = "Password must be at least 6 characters.";
    }

    return errors;
  }

  async function handleSignIn(e) {
    e.preventDefault();
    setIsValidating(true);
    const loginErrors = validateUserLogin(credential, password);
    if (Object.keys(loginErrors).length > 0) {
      setErrors(loginErrors);
      setIsValidating(false);
      return;
    }
    try {
      const response = await fetch(
        "https://nodes-blog-api-production.up.railway.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ credential, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.message || "Login error";
        console.log(message);
        if (message.toLowerCase().includes("not registered")) {
          setErrors({ emailError: message });
        } else if (message.toLowerCase().includes("incorrect password")) {
          setErrors({ passwordError: message });
        } else if (
          message.toLowerCase().includes("your account has been suspended")
        ) {
          setErrors({ suspendedError: message });
        } else {
          setErrors({ loginError: message });
        }
        setIsValidating(false);
        return;
      }
      navigate("/posts");
    } catch (error) {
      console.error("An error occurred. Please try again", error);
      setIsValidating(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsValidating(true);
    const validationErrors = await validateForm(email, username, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    } else {
      setErrors({});
      async function createUser() {
        try {
          const response = await fetch(
            "https://nodes-blog-api-production.up.railway.app/user/create",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email,
                username,
                password,
              }),
            }
          );

          if (!response.ok) {
            console.error("Error: ", response.statusText);
            setIsValidating(false);
          } else {
            await response.json();
            try {
              const response = await fetch(
                "https://nodes-blog-api-production.up.railway.app/auth/login",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({ credential: username, password }),
                }
              );

              if (!response.ok) {
                const responseText = await response.text();
                setLoginError(responseText);
                setIsValidating(false);
                return;
              }
              // const data = await response.json();
              navigate("/posts");
            } catch (error) {
              setLoginError("An error occurred. Please try again", error);
              setIsValidating(false);
            }
          }
        } catch (error) {
          console.error("Fetch error: ", error);
          setIsValidating(false);
        }
      }
      await createUser();
    }
  }

  const CloseButton = () => (
    <button className="close-dialog-btn" onClick={handleClose}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 x-logo"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "signIn":
        return (
          <>
            <p className="dialog-title">{title}</p>
            <div className="sign-type-container">
              <button
                className="email-btn"
                onClick={() => {
                  setActiveTab("emailSignIn");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="size-6 sign-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
                Sign in with email
                <div className="spacer"></div>
              </button>
              <p className="sign-in-info">
                No account?{" "}
                <button
                  className="create-acc-btn"
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
      case "default":
        return (
          <>
            <p className="dialog-title">{title}</p>
            <div className="sign-type-container">
              <button
                className="email-btn"
                onClick={() => setActiveTab("email")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="size-6 sign-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
                Sign up with email
                <div className="spacer"></div>
              </button>
              <p className="sign-in-info">
                Already have account?{" "}
                <button
                  className="sign-up-btn"
                  onClick={() => {
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
      case "email":
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1}
                        stroke="#c94a4a"
                        className="size-6 exclamation-icon"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                        />
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1}
                        stroke="#c94a4a"
                        className="size-6 exclamation-icon"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                        />
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1}
                        stroke="#c94a4a"
                        className="size-6 exclamation-icon"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                        />
                      </svg>
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
                    setActiveTab("default");
                  }}
                >
                  &lt; &nbsp; All sign in option
                </button>
              </p>
            </div>
          </>
        );
      case "emailSignIn":
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1}
                        stroke="#c94a4a"
                        className="size-6 exclamation-icon"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                        />
                      </svg>
                    </span>
                  )}
                  {errors.suspendedError && (
                    <span className="error-exclamation">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1}
                        stroke="#c94a4a"
                        className="size-6 exclamation-icon"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                        />
                      </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1}
                        stroke="#c94a4a"
                        className="size-6 exclamation-icon"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                        />
                      </svg>
                    </span>
                  )}
                </div>
                {errors.passwordError && (
                  <p className="password-error">{errors.passwordError}</p>
                )}
                {/* <div>
                  {errors.suspendedError && (
                    <>
                      <div
                        className="input-ctr"
                        style={{ borderColor: "#c94a4a" }}
                      >
                        <span className="error-exclamation">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1}
                            stroke="#c94a4a"
                            className="size-6 exclamation-icon"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                            />
                          </svg>
                        </span>
                      </div>
                      <p
                        className="suspended-error"
                        style={{ color: "#c94a4a" }}
                      >
                        {errors.suspendedError}
                      </p>
                    </>
                  )}
                </div> */}
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
      default:
        return null;
    }
  };

  return (
    <>
      <div className="dialog-container" ref={dialogRef}>
        <div className="sign-in" ref={signContainer}>
          <CloseButton />
          {renderContent()}
        </div>
      </div>
    </>
  );
}

function LandingPage() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [openDialog, setOpenDialog] = useState(null);
  const [dialogTitle, setDialogTitle] = useState("");
  const [activeTab, setActiveTab] = useState("default");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("https://nodes-blog-api-production.up.railway.app/auth/profile", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Not logged in");
      })
      .then(() => {
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.log(err);
        setIsLoggedIn(false);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!canvasRef.current || !containerRef.current) return;
    // Define getDistance before any usage
    function getDistance(p1, p2) {
      return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const points = [];
    const target = { x: width / 2, y: height / 2 };
    let animateHeader = true;
    let animationFrameId;

    // Set landing container height and canvas size
    if (containerRef.current) {
      containerRef.current.style.height = height + "px";
    }
    canvas.width = width;
    canvas.height = height;

    // Create points
    for (let x = 0; x < width; x += width / 10) {
      for (let y = 0; y < height; y += height / 20) {
        const px = x + (Math.random() * width) / 10;
        const py = y + (Math.random() * height) / 10;
        const p = { x: px, originX: px, y: py, originY: py };
        points.push(p);
      }
    }

    // For each point, find the 3 closest points
    for (let i = 0; i < points.length; i++) {
      let closest = [];
      const p1 = points[i];
      for (let j = 0; j < points.length; j++) {
        const p2 = points[j];
        if (p1 === p2) continue;
        let placed = false;
        for (let k = 0; k < 3; k++) {
          if (!placed && closest[k] === undefined) {
            closest[k] = p2;
            placed = true;
          }
        }
        for (let k = 0; k < 3; k++) {
          if (!placed && getDistance(p1, p2) < getDistance(p1, closest[k])) {
            closest[k] = p2;
            placed = true;
          }
        }
      }
      p1.closest = closest;
    }

    // Circle constructor function
    function Circle(pos, rad, color) {
      this.pos = pos || null;
      this.radius = rad || null;
      this.color = color || null;
      this.active = 0;
      this.draw = function () {
        if (!this.active) return;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 4 * Math.PI, false);
        ctx.fillStyle = "rgba(153, 188, 133," + this.active + ")";
        ctx.fill();
      };
    }

    // Create a circle for each point
    points.forEach((p) => {
      p.circle = new Circle(
        p,
        4 + Math.random() * 2,
        "rgba(153, 188, 133,0.3)"
      );
    });

    // Event handlers
    const mouseMove = (e) => {
      const posx =
        e.pageX ||
        e.clientX +
          document.body.scrollLeft +
          document.documentElement.scrollLeft;
      const posy =
        e.pageY ||
        e.clientY +
          document.body.scrollTop +
          document.documentElement.scrollTop;
      target.x = posx;
      target.y = posy;
    };

    const scrollCheck = () => {
      animateHeader = document.body.scrollTop <= height;
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      if (containerRef.current) {
        containerRef.current.style.height = height + "px";
      }
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("scroll", scrollCheck);
    window.addEventListener("resize", resize);

    // Animation functions
    const animate = () => {
      if (animateHeader) {
        ctx.clearRect(0, 0, width, height);
        points.forEach((p) => {
          const distance = Math.abs(getDistance(target, p));
          if (distance < 4000) {
            p.active = 0.3;
            p.circle.active = 0.6;
          } else if (distance < 20000) {
            p.active = 0.1;
            p.circle.active = 0.3;
          } else if (distance < 40000) {
            p.active = 0.02;
            p.circle.active = 0.1;
          } else {
            p.active = 0;
            p.circle.active = 0;
          }
          drawLines(p);
          p.circle.draw();
        });
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    // Use TweenLite and EasePack from CDN (available as globals)
    const shiftPoint = (p) => {
      // eslint-disable-next-line no-undef
      TweenLite.to(p, 1 + Math.random(), {
        x: p.originX - 50 + Math.random() * 100,
        y: p.originY - 50 + Math.random() * 100,
        // eslint-disable-next-line no-undef
        ease: Circ.easeInOut,
        onComplete: () => shiftPoint(p),
      });
    };

    const drawLines = (p) => {
      if (!p.active) return;
      p.closest.forEach((cp) => {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(cp.x, cp.y);
        ctx.strokeStyle = "rgba(153, 188, 133," + p.active + ")";
        ctx.stroke();
      });
    };

    // Start animation
    animate();
    points.forEach((p) => shiftPoint(p));

    // Cleanup on unmount
    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("scroll", scrollCheck);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [loading]);

  if (isLoggedIn) {
    return <Navigate to="/posts" />;
  }

  return (
    <div className="wrapper" style={{ position: "relative" }}>
      {loading ? (
        <div></div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}
          />
          <div className="landing-container" ref={containerRef}>
            <LandingNav
              openDialog={setOpenDialog}
              setDialogTitle={setDialogTitle}
              setActiveTab={setActiveTab}
            />
            <LandingMain
              openDialog={setOpenDialog}
              setDialogTitle={setDialogTitle}
            />
            <LandingFooter />
            <SignDialog
              title={dialogTitle}
              setDialogTitle={setDialogTitle}
              isOpen={openDialog === "signIn"}
              closeDialog={() => setOpenDialog(null)}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default LandingPage;
