import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { LayoutDashboard, ShoppingBag, MapPin, Box, Tag } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import Catalog from "./pages/Catalog";
import Stores from "./pages/Stores";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";

function Sidebar() {
  const location = useLocation();
  const links = [
    { name: "Overview", path: "/", icon: LayoutDashboard },
    { name: "Catalog", path: "/catalog", icon: Tag },
    { name: "Stores", path: "/stores", icon: MapPin },
    { name: "Inventory", path: "/inventory", icon: Box },
    { name: "Orders", path: "/orders", icon: ShoppingBag },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0 flex flex-col p-4">
      <h1 className="text-xl font-bold mb-8 pl-2 text-blue-400">Q-Commerce</h1>
      <nav className="space-y-2">
        {links.map((l) => (
          <Link
            key={l.path}
            to={l.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              location.pathname === l.path
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`}
          >
            <l.icon size={20} />
            {l.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="ml-64 flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
