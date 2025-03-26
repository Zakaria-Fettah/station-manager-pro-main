
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="md:ml-64 pt-4 px-4">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
