import Navigation from "./components/Navbar";
import { Outlet } from "react-router-dom";
import { ProfileProvider } from "./contexts/ProfileProvider";
import { PostProvider } from "./contexts/PostPorvider";

function App() {
  return (
    <>
      <ProfileProvider>
        <PostProvider>
          <Navigation />
          <Outlet />
        </PostProvider>
      </ProfileProvider>
    </>
  );
}

export default App;
