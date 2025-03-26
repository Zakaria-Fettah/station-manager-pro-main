
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Calendar, 
  Store, 
  ShoppingCart, 
  Droplets, 
  Package, 
  TruckIcon, 
  BarChart, 
  Settings,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { name: 'Dashboard', path: '/', icon: <BarChart className="w-5 h-5" /> },
  { name: 'Employés', path: '/employees', icon: <Users className="w-5 h-5" /> },
  { name: 'Planning', path: '/planning', icon: <Calendar className="w-5 h-5" /> },
  { name: 'Stations', path: '/stations', icon: <Store className="w-5 h-5" /> },
  { name: 'Ventes', path: '/ventes', icon: <ShoppingCart className="w-5 h-5" /> },
  { name: 'Citernes', path: '/citernes', icon: <Droplets className="w-5 h-5" /> },
  { name: 'Produits', path: '/produits', icon: <Package className="w-5 h-5" /> },
  { name: 'Fournisseurs', path: '/fournisseurs', icon: <TruckIcon className="w-5 h-5" /> },
  { name: 'Paramètres', path: '/settings', icon: <Settings className="w-5 h-5" /> },
];

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <aside className="hidden md:flex flex-col w-64 p-4 h-screen border-r border-border fixed">
        <div className="mb-8 px-4">
          <h1 className="text-2xl font-medium tracking-tight">Station Manager</h1>
        </div>
        
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex items-center w-full px-4 py-3 my-1 text-sm rounded-md transition-all duration-200 group hover:bg-accent",
                location.pathname === item.path
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              <span className={cn(
                "mr-3 transition-colors duration-200",
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-foreground"
              )}>
                {item.icon}
              </span>
              {item.name}
            </button>
          ))}
        </nav>
        
        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex items-center px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <span className="text-primary font-medium">
                {user?.email.substring(0, 2).toUpperCase() || 'SM'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email || 'Admin User'}</p>
              <p className="text-xs text-muted-foreground">admin@station.com</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
      
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-medium">Station Manager</h1>
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
        
        {isMobileMenuOpen && (
          <nav className="flex flex-col p-4 space-y-1 border-b animate-fade-in">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "flex items-center px-4 py-3 text-sm rounded-md",
                  location.pathname === item.path
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                <span className={cn(
                  "mr-3",
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                )}>
                  {item.icon}
                </span>
                {item.name}
              </button>
            ))}
            <div className="pt-2 mt-2 border-t border-border">
              <button 
                onClick={logout}
                className="flex items-center w-full px-4 py-3 text-sm rounded-md text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Déconnexion
              </button>
            </div>
          </nav>
        )}
      </div>
    </>
  );
};

export default Navigation;
