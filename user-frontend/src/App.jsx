import Navigation from "./components/Navbar";
import { Outlet } from "react-router-dom";
import { ProfileProvider } from "./contexts/ProfileProvider";
function App() {
  return (
    <>
      <ProfileProvider>
        <Navigation />
        <Outlet />
      </ProfileProvider>
    </>
  );
}

export default App;
