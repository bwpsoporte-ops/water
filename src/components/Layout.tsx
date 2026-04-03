import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  CreditCard, 
  LogOut, 
  Menu, 
  X, 
  Truck, 
  ShoppingBag, 
  FileText, 
  Settings, 
  UserCircle, 
  History,
  Wrench,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export const Layout: React.FC = () => {
  const { profile, isAdmin, isIT, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isManagement = isAdmin || isIT;

  const navItems = isManagement ? [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Vendedores', path: '/sellers', icon: Users },
    { name: 'Productos', path: '/products', icon: ShoppingBag },
    { name: 'Despachos', path: '/dispatches', icon: Truck },
    { name: 'Ventas', path: '/sales', icon: Package },
    { name: 'Cierre de Caja', path: '/closures', icon: History },
    { name: 'Clientes', path: '/customers', icon: UserCircle },
    { name: 'Gastos', path: '/expenses', icon: CreditCard },
    { name: 'Mantenimiento', path: '/maintenance', icon: Wrench },
    { name: 'Reportes', path: '/reports', icon: FileText },
    { name: 'Configuración', path: '/settings', icon: Settings },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar for Management */}
      {isManagement && (
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-blue-950 text-white transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-6 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight">BWP WATER</span>
              <span className="text-xs text-blue-300">Business Water Platform</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden">
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="mt-6 px-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  location.pathname === item.path
                    ? "bg-blue-800 text-white"
                    : "text-blue-100 hover:bg-blue-900"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 w-full p-6 border-t border-blue-900 bg-blue-950">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold">
                {profile?.name?.[0]}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium truncate">{profile?.name}</p>
                <p className="text-[10px] text-blue-400 truncate uppercase font-bold tracking-widest">{profile?.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-blue-100 hover:bg-blue-900 rounded-lg transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Cerrar Sesión
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header for Mobile */}
        {isManagement && (
          <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between md:hidden">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-blue-950">BWP WATER</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Business Water Platform</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-6 w-6 text-slate-600" />
            </button>
          </header>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
