import "../styles/LandingPage.css";
import { useRef, useEffect } from "react";
function LandingNav() {
  return (
    <div className="l-nav-container">
      <div className="nav-flex-container">
        <div className="left-nav">
          <p className="web-title">Nodes</p>
        </div>
        <div className="right-nav">
          <button className="write-btn">Write</button>
          <button className="sign-in-btn">Sign in</button>
          <button className="get-started-btn">Get started</button>
        </div>
      </div>
    </div>
  );
}

function LandingMain() {
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
      <button className="start-reading-btn">Start reading</button>
    </div>
  );
}

function LandingFooter() {
  return (
    <div className="l-foot-container">
      <div className="foot-flex-container">
        <a href="" className="about-footer">
          About
        </a>
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

function SignInDialog() {}

function SignUpDialog() {}

function LandingPage() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
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
  }, []);

  return (
    <div className="wrapper" style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}
      />
      <div className="landing-container" ref={containerRef}>
        <LandingNav />
        <LandingMain />
        <LandingFooter />
        <div className="dialog-container">
          <div className="sign-in">
            <button>Hello</button>
            <button>from</button>
            <form action="">
              <input type="text" placeholder="email" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
