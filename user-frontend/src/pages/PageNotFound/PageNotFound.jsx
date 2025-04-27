import "./PageNotFound.css";
import { Link } from "react-router-dom";

function PageNotFound({
  top = "404",
  title = "Page not found",
  subtitle = "Sorry, we couldn't find the page you're looking for",
}) {
  return (
    <div className="not-found-ctr">
      <div className="top-nf">{top}</div>
      <div className="main-middle-nf">{title}</div>
      <div className="sub-middle-nf">{subtitle}</div>
      <div className="bottom-nf">
        <Link to="/posts">
          <button className="go-home-btn">Go back home</button>
        </Link>
      </div>
    </div>
  );
}

export default PageNotFound;
