import "../styles/NotFoundPage.css";

function NotFound() {
  return (
    <div className="not-found-ctr">
      <div className="top-nf">404</div>
      <div className="main-middle-nf">Page not found</div>
      <div className="sub-middle-nf">
        Sorry, we couldn't find the page you're looking for
      </div>
      <div className="bottom-nf">
        <button className="go-home-btn">Go back home</button>
      </div>
    </div>
  );
}

export default NotFound;
