import { NavLink } from "react-router-dom";

const links = [
  { path: "/", label: "Dashboard" },
  { path: "/posts", label: "Posts" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">Nodes Admin</div>
      <nav>
        {links.map((link) => (
          <NavLink key={link.path} to={link.path} className="nav-link">
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
