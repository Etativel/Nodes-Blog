import { useRef, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { CloseButton } from "../../shared";
import { Loader } from "../../components/Loader";
import {
  LandingMain,
  LandingFooter,
  LandingNav,
  SignInDialog,
  SignInForm,
  SignUpForm,
  DefaultDialog,
} from "./components";
import "./Landing.css";

function Sign({
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
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.emailError = "Invalid email address.";
    }

    // Validate username
    if (!username) {
      errors.usernameError = "Username is required.";
    } else if (username.length < 3) {
      errors.usernameError = "Username must be at least 3 characters.";
    } else if (username.length > 15) {
      errors.usernameError = "Username must be no more than 15 characters.";
    } else if (!/^[A-Za-z0-9]+$/.test(username)) {
      errors.usernameError = "Username can only contain letters and numbers.";
    }

    // Validate password
    if (!password) {
      errors.passwordError = "Password is required.";
    } else if (password.length < 6) {
      errors.passwordError = "Password must be at least 6 characters.";
    }

    const apiChecks = [];

    // Check email availability if format is valid
    if (!errors.emailError) {
      apiChecks.push(
        fetch(
          "https://nodes-blog-api-production.up.railway.app/user/check-email",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        )
          .then((response) => {
            if (response.status === 429) {
              alert("Too many requests, try again in few minutes");
            }
            return response.json();
          })
          .then((data) => {
            if (!data.available) {
              errors.emailError = "Email already taken.";
            }
          })
          .catch((error) => {
            console.error("Error checking email:", error);
            errors.emailError = "Error checking email availability.";

            errors.hasApiError = true;
          })
      );
    }

    // Check username availability if format is valid
    if (!errors.usernameError) {
      apiChecks.push(
        fetch(
          "https://nodes-blog-api-production.up.railway.app/user/check-username",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
          }
        )
          .then((response) => {
            if (response.status === 429) {
              alert("Too many requests, try again in few minutes");
            }
            return response.json();
          })
          .then((data) => {
            if (!data.available) {
              errors.usernameError = "Username already taken.";
            }
          })
          .catch((error) => {
            console.error("Error checking username:", error);
            errors.usernameError = "Error checking username availability.";
            errors.hasApiError = true;
          })
      );
    }

    if (apiChecks.length > 0) {
      await Promise.all(apiChecks);
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
    setErrors({});
    e.preventDefault();
    setIsValidating(true);
    const loginErrors = validateUserLogin(credential, password);
    if (Object.keys(loginErrors).length > 0) {
      setIsValidating(false);
      setErrors(loginErrors);

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
        // console.log(message);
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
    } finally {
      setIsValidating(false);
    }
  }

  async function handleSubmit(e) {
    setErrors({});
    e.preventDefault();
    setIsValidating(true);
    const validationErrors = await validateForm(email, username, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsValidating(false);
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
              setIsValidating(false);
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

  const renderContent = () => {
    switch (activeTab) {
      case "signIn":
        return (
          <SignInDialog
            title={title}
            setErrors={setErrors}
            setActiveTab={setActiveTab}
            setDialogTitle={setDialogTitle}
          />
        );

      case "default":
        return (
          <DefaultDialog
            title={title}
            setActiveTab={setActiveTab}
            setErrors={setErrors}
            setDialogTitle={setDialogTitle}
          />
        );
      case "email":
        return (
          <SignUpForm
            handleSubmit={handleSubmit}
            email={email}
            handleEmailChange={handleEmailChange}
            errors={errors}
            username={username}
            handleUsernameChange={handleUsernameChange}
            password={password}
            handlePasswordChange={handlePasswordChange}
            isValidating={isValidating}
            setErrors={setErrors}
            setActiveTab={setActiveTab}
          />
        );
      case "emailSignIn":
        return (
          <SignInForm
            isValidating={isValidating}
            errors={errors}
            handleSignIn={handleSignIn}
            setErrors={setErrors}
            setDialogTitle={setDialogTitle}
            setActiveTab={setActiveTab}
            handleCredentialChange={handleCredentialChange}
            credential={credential}
            password={password}
            handlePasswordChange={handlePasswordChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="dialog-container" ref={dialogRef}>
        <div className="sign-in" ref={signContainer}>
          <CloseButton onClick={handleClose} />
          {renderContent()}
        </div>
      </div>
    </>
  );
}

function Landing() {
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
        <Loader />
      ) : (
        <>
          <canvas
            ref={canvasRef}
            style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}
            className="landing-canvas"
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
            <Sign
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

export default Landing;
