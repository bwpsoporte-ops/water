import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Droplets, Lock, User, Eye, EyeOff, Key, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Login: React.FC = () => {
  const { login, changePassword } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mustChange, setMustChange] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await login(identifier, password);
      if (data.user.mustChange) {
        setMustChange(true);
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (newPassword.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await changePassword(newPassword);
      window.location.reload(); // Reload to fetch full profile
    } catch (err: any) {
      setError(err.message || 'Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-950 flex flex-col items-center justify-center p-6 text-white font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden text-slate-900 border border-white/10"
      >
        <div className="p-8 md:p-10 flex flex-col items-center">
          <div className="h-20 w-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner rotate-3">
            <Droplets className="h-10 w-10 text-blue-600 -rotate-3" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-blue-950 mb-1">BWP WATER</h1>
          <p className="text-slate-400 text-center text-sm mb-10 font-medium uppercase tracking-widest">
            {mustChange ? 'Actualizar Contraseña' : 'Acceso al Sistema'}
          </p>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold mb-6 overflow-hidden"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {!mustChange ? (
            <form onSubmit={handleLogin} className="w-full space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Usuario / ID</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Correo o ID de 6 dígitos"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Cargando..." : "Entrar al Sistema"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="w-full space-y-5">
              <div className="p-4 bg-blue-50 rounded-2xl mb-4">
                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                  Por seguridad, debe cambiar su contraseña temporal por una nueva que pueda recordar.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    required
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 4 caracteres"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirmar Contraseña</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita la contraseña"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Actualizando..." : "Guardar y Continuar"}
              </button>
            </form>
          )}

          <div className="mt-10 w-full space-y-4">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center">Accesos Rápidos</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => { setIdentifier('it@bwpwater.com'); setPassword('1995951995b'); }}
                className="py-3 px-4 bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 hover:bg-slate-200 transition-all"
              >
                IT ADMIN
              </button>
              <button 
                onClick={() => { setIdentifier('admin@bwpwater.com'); setPassword('123456'); }}
                className="py-3 px-4 bg-blue-50 border border-blue-100 rounded-xl text-[10px] font-bold text-blue-600 hover:bg-blue-100 transition-all"
              >
                ADMIN
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      <p className="mt-8 text-blue-300/50 text-[10px] font-bold uppercase tracking-widest">
        BWP WATER | Business Water Platform v2.0
      </p>
    </div>
  );
};
