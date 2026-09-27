import React from 'react';
import { AppView } from '../types';
import { Menu, User, Bell } from 'lucide-react';

interface HeaderProps {
  currentView: AppView;
  onOpenMobileMenu: () => void;
  onOpenQuickStory?: () => void;
}

const VIEW_TITLES: Record<AppView, { category: string; title: string }> = {
  story: { category: 'دورة العمل', title: 'سيناريو الديمو المتكامل (فيلا التجمع - 10 محطات)' },
  dashboard: { category: 'نظرة عامة', title: 'لوحة التحكم التنفيذية (أداء سبتمبر 2026)' },
  customers: { category: 'إدارة العملاء CRM', title: 'إدارة العملاء وملفات المشاريع وقنوات التواصل' },
  measurements: { category: 'الهندسة والموقع', title: 'جدول مقاسات الأبواب وتفاصيل الحلق (D-01)' },
  quotations: { category: 'المبيعات', title: 'عروض الأسعار التفصيلية والمواصفات' },
  contracts: { category: 'التعاقدات', title: 'العقود وجدول الدفعات والتحصيلات' },
  production: { category: 'التشغيل والتصنيع', title: 'أوامر التصنيع ومراحل خطوط الإنتاج' },
  bom_warehouse: { category: 'المخازن والتكاليف', title: 'قائمة المواد BOM والمخازن الأربعة المتخصصة' },
  waste: { category: 'مراقبة الجودة', title: 'تحليل الهالك والفاقد والانحرافات المعيارية' },
  purchases: { category: 'المشتريات', title: 'أوامر الشراء وإدارة حسابات الموردين AP' },
  invoices: { category: 'الفوترة', title: 'مركز الفواتير وسندات القبض والصرف' },
  accounting_ledger: { category: 'المالية والمحاسبة', title: 'دفتر اليومية العامة وسجل القيود المحاسبية GL' },
  expenses_profitability: { category: 'الربحية والتكاليف', title: 'تحليل تكاليف وأرباح المشاريع والمصروفات' },
  installation_warranty: { category: 'خدمات الموقع', title: 'محضر استلام التركيبات وقائمة الملاحظات والضمان' },
  financial_reports: { category: 'القوائم المالية IFRS', title: 'القوائم المالية الـ 5 الأساسية المعتمدة' },
};

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onOpenMobileMenu,
  onOpenQuickStory,
}) => {
  const currentInfo = VIEW_TITLES[currentView] || {
    category: 'نظام أركان',
    title: 'نظام إدارة تصنيع الأثاث والمحاسبة',
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-20">
      {/* Right Side (in RTL): Mobile Hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title="القائمة الجانبية"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-slate-400 font-medium hidden sm:inline">
            {currentInfo.category}
          </span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <span className="font-semibold text-slate-800 truncate max-w-[220px] sm:max-w-md">
            {currentInfo.title}
          </span>
        </div>
      </div>

      {/* Left Side (in RTL): Fiscal Balance & Profile */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Fiscal Balance display */}
        <div className="text-left border-l border-slate-200 pl-3 sm:pl-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            الرصيد المالي Fiscal Balance
          </p>
          <p className="text-xs sm:text-sm font-bold font-mono text-slate-800">
            2,840,000 <span className="text-[11px] font-normal text-slate-400">ج.م</span>
          </p>
        </div>

        {/* User avatar or status */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs" title="مدير الحسابات والإنتاج">
            <User className="w-4 h-4 text-slate-600" />
          </div>
        </div>
      </div>
    </header>
  );
};
