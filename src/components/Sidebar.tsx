import React from 'react';
import { AppView } from '../types';
import {
  LayoutDashboard,
  Users,
  Ruler,
  FileSpreadsheet,
  FileCheck2,
  Hammer,
  Boxes,
  Percent,
  ShoppingCart,
  Receipt,
  BookOpenCheck,
  TrendingUp,
  Truck,
  Landmark,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard' as AppView,
      label: 'لوحة التحكم التنفيذية',
      labelEn: 'Executive Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'customers' as AppView,
      label: 'إدارة العملاء CRM',
      labelEn: 'Customers & CRM',
      icon: <Users className="w-4 h-4 shrink-0" />,
      badge: 'CRM',
    },
    {
      id: 'measurements' as AppView,
      label: 'المقاسات والموقع (D-01)',
      labelEn: 'Door Schedule',
      icon: <Ruler className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'quotations' as AppView,
      label: 'عروض الأسعار',
      labelEn: 'Sales & Quotations',
      icon: <FileSpreadsheet className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'contracts' as AppView,
      label: 'العقود وجدول الدفعات',
      labelEn: 'Contracts & Milestones',
      icon: <FileCheck2 className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'production' as AppView,
      label: 'أوامر التصنيع (WO)',
      labelEn: 'Production Pipeline',
      icon: <Hammer className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'bom_warehouse' as AppView,
      label: 'قوائم الخامات والمخازن',
      labelEn: 'Inventory & BOM',
      icon: <Boxes className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'waste' as AppView,
      label: 'مراقبة الهالك والفاقد',
      labelEn: 'Waste Analysis',
      icon: <Percent className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'purchases' as AppView,
      label: 'المشتريات والموردين',
      labelEn: 'Purchases & AP',
      icon: <ShoppingCart className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'invoices' as AppView,
      label: 'الفواتير والمستندات',
      labelEn: 'Billing & Invoices',
      icon: <Receipt className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'accounting_ledger' as AppView,
      label: 'القيود المحاسبية والأستاذ',
      labelEn: 'Accounting Ledger',
      icon: <BookOpenCheck className="w-4 h-4 shrink-0" />,
      badge: 'GL',
    },
    {
      id: 'financial_reports' as AppView,
      label: 'القوائم المالية الـ 5',
      labelEn: '5 Financial Statements',
      icon: <Landmark className="w-4 h-4 text-emerald-400 shrink-0" />,
      badge: 'IFRS',
    },
    {
      id: 'expenses_profitability' as AppView,
      label: 'ربحية وتكاليف المشاريع',
      labelEn: 'Project Profitability',
      icon: <TrendingUp className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'installation_warranty' as AppView,
      label: 'التركيب ومحضر الاستلام',
      labelEn: 'Installation & Snag',
      icon: <Truck className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 right-0 z-50 w-64 lg:w-72 bg-[#1E293B] text-slate-100 flex flex-col border-l border-slate-700/80 transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center font-bold text-white text-base shadow-xs">
              W
            </div>
            <div>
              <span className="text-white font-semibold tracking-tight text-base block leading-none">
                WoodCraft ERP
              </span>
              <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                نظام أركان لتصنيع الأبواب
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-right ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span className={isActive ? 'font-semibold text-white' : ''}>
                    {item.label}
                  </span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* System Status Footer */}
        <div className="p-4 border-t border-slate-700">
          <div className="bg-slate-800 rounded p-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                حالة النظام SYSTEM STATUS
              </p>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-emerald-400 font-medium mt-1">
              المزامنة المحاسبية نشطة (Sync Active)
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              الربط الآلي بين أوامر التشغيل ودفتر الأستاذ
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
