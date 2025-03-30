import { useAuth } from "../../contexts/AuthContext";

const Dashboard = () => {
  const { user, isAdmin, isActive, logout } = useAuth();

  if (!user) return <p>Please log in</p>;
  if (!isActive) return <p>Your account is inactive. Contact support.</p>;

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      {isAdmin && <p>You have admin access</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;