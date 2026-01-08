import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Overview</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="1. Setup Catalog"
          desc="Add Categories & Products"
          link="/catalog"
          color="bg-blue-500"
        />
        <DashboardCard
          title="2. Create Stores"
          desc="Add locations & Map"
          link="/stores"
          color="bg-purple-500"
        />
        <DashboardCard
          title="3. Manage Inventory"
          desc="Assign Products to Stores"
          link="/inventory"
          color="bg-orange-500"
        />
        <DashboardCard
          title="4. View Orders"
          desc="Live Kitchen View"
          link="/orders"
          color="bg-green-500"
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, desc, link, color }: any) {
  return (
    <Link
      to={link}
      className={`${color} text-white p-6 rounded-xl shadow-lg hover:opacity-90 transition-opacity`}
    >
      <h3 className="font-bold text-xl">{title}</h3>
      <p className="text-white/80">{desc}</p>
    </Link>
  );
}
