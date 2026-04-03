import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Calendar, DollarSign, Droplet } from 'lucide-react';
import { format, startOfDay } from 'date-fns';
import { cn } from '../lib/utils';

export const Sales: React.FC = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [filterDate, setFilterDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const fetchSales = async () => {
    try {
      const data = await api.get('/api/sales');
      const start = startOfDay(new Date(filterDate)).getTime();
      const filtered = data.filter((s: any) => startOfDay(new Date(s.timestamp)).getTime() === start);
      setSales(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [filterDate]);

  const totalBottles = sales.reduce((acc, s) => acc + (s.quantity || 0), 0);
  const totalRevenue = sales.reduce((acc, s) => acc + Number(s.total_amount || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Historial de Ventas</h1>
          <p className="text-slate-500 text-sm">Registro detallado de transacciones</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 mr-4">
            <Droplet className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Botellones</p>
            <p className="text-2xl font-black text-slate-900">{totalBottles}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 mr-4">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Ingresos</p>
            <p className="text-2xl font-black text-slate-900">L. {totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Hora</th>
                <th className="px-6 py-4">Correlativa</th>
                <th className="px-6 py-4">Vendedor</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Pago</th>
                <th className="px-6 py-4">Cantidad</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sales.length > 0 ? sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">
                    {format(new Date(sale.timestamp), 'HH:mm')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                      {sale.correlative}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    {sale.seller_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {sale.customer_name || 'Venta directa'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      sale.payment_type === 'cash' ? "bg-emerald-50 text-emerald-600" : 
                      sale.payment_type === 'transfer' ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {sale.payment_type === 'cash' ? 'Efectivo' : sale.payment_type === 'transfer' ? 'Transf.' : 'Crédito'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-slate-900">
                    {sale.quantity} bot.
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-black text-slate-900">
                    L. {Number(sale.total_amount).toLocaleString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No hay ventas registradas para esta fecha.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
