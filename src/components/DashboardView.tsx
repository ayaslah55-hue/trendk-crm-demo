import React from 'react';
import { Customer, ProductionOrder, InventoryItem, ProjectCosting, AppView } from '../types';
import {
  TrendingUp,
  Boxes,
  ArrowUpRight,
  Ruler,
  Hammer,
  FileCheck2,
  Users,
  Package,
  ArrowRight,
  Clock,
  AlertTriangle,
  Building,
  DollarSign,
} from 'lucide-react';

interface DashboardViewProps {
  customers: Customer[];
  productionOrders: ProductionOrder[];
  inventory: InventoryItem[];
  projectCostings: ProjectCosting[];
  onNavigate: (view: AppView) => void;
  onOpenStory?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  customers,
  productionOrders,
  inventory,
  projectCostings,
  onNavigate,
}) => {
  // Key metrics calculated
  const totalMonthlySales = 1450000;
  const totalCollections = 920000;
  const customerReceivables = (customers || []).reduce((sum, c) => sum + (c.remainingBalance || 0), 0);
  const supplierPayables = 210000;
  const inventoryTotalValue = 3120500;
  const activeProjectsCount = (customers || []).filter((c) => c.status !== 'completed').length;
  const delayedOrdersCount = (productionOrders || []).filter((wo) => wo.status === 'متأخر').length;
  const totalExpenses = 217000;
  const grossMarginPercent = 33.8;
  const netProfit = 348000;

  const topSellingProducts = [
    { name: 'أبواب غرف قشرة بلوط طبيعي (D-01)', salesQty: 46, revenue: 437000, growth: '+18%' },
    { name: 'أبواب حمامات HDF مقاوم للرطوبة', salesQty: 28, revenue: 238000, growth: '+12%' },
    { name: 'غرف ملابس Dressing Room مودرن', salesQty: 5, revenue: 325000, growth: '+24%' },
    { name: 'أبواب مداخل فيلات زان ماسيف CNC', salesQty: 6, revenue: 168000, growth: '+8%' },
    { name: 'مطابخ كاونتر خشب أرو طبيعي', salesQty: 4, revenue: 132000, growth: '+15%' },
  ];

  const highestDebtCustomers = [...(customers || [])]
    .sort((a, b) => (b.remainingBalance || 0) - (a.remainingBalance || 0))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 4 Main Minimalist KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Monthly Sales */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">مبيعات الشهر (Monthly Sales)</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1 font-mono">
            {totalMonthlySales.toLocaleString()} <span className="text-xs font-normal text-slate-400">ج.م</span>
          </h3>
          <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12% عن الشهر السابق</span>
          </div>
        </div>

        {/* 2. Collections (AR) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">التحصيلات الفعلية (Collections)</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1 font-mono">
            {totalCollections.toLocaleString()} <span className="text-xs font-normal text-slate-400">ج.م</span>
          </h3>
          <div className="mt-2 flex items-center text-xs text-orange-600 font-medium">
            <span>متبقي مستحق للتحصيل: {(customerReceivables ?? 0).toLocaleString()} ج.م</span>
          </div>
        </div>

        {/* 3. Inventory Value */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">قيمة المخزون (Inventory Value)</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1 font-mono">
            {inventoryTotalValue.toLocaleString()} <span className="text-xs font-normal text-slate-400">ج.م</span>
          </h3>
          <div className="mt-2 flex items-center text-xs text-slate-500 font-medium">
            <span>420 لوح خشب وأبواب ومفصلات</span>
          </div>
        </div>

        {/* 4. Gross Margin */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">هامش الربح الإجمالي (Gross Margin)</p>
          <h3 className="text-2xl font-bold text-emerald-700 mt-1 font-mono">
            {grossMarginPercent}%
          </h3>
          <div className="mt-2 flex items-center text-xs text-emerald-600 font-medium">
            <span>معدل صحي ومطابق للميزانية</span>
          </div>
        </div>
      </div>

      {/* Signature Split Section: Live Projects Pipeline & Automated Journal Entries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Projects & Production Pipeline (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-slate-800 text-base">
                خط الإنتاج والمشاريع الحية (Live Projects & Pipeline)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                متابعة حركة الأوامر التشغيلية من القص والتجميع حتى الدهان والجودة
              </p>
            </div>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded uppercase tracking-wider">
              متابعة نشطة Active
            </span>
          </div>

          <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
            <div className="space-y-3.5">
              {/* Project 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 gap-3">
                <div className="flex-1">
                  <p className="text-xs text-slate-400 font-bold font-mono">PROJ-772 • أحمد محمد الشناوي</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    فيلا التجمع الخامس - 8 أبواب داخلية قشرة أرو + خزانة ملابس
                  </p>
                </div>
                <div className="flex items-center gap-6 sm:gap-8 justify-between sm:justify-end">
                  <div className="text-right">
                    <p className="text-[10px] uppercase text-slate-400 font-bold">المرحلة الحالية</p>
                    <p className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded inline-block mt-0.5">
                      الدهان وفحص QC
                    </p>
                  </div>
                  <div>
                    <div className="w-28 sm:w-32 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full w-[75%]" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono block text-left mt-1">75% مكتمل</span>
                  </div>
                </div>
              </div>

              {/* Project 2 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 gap-3">
                <div className="flex-1">
                  <p className="text-xs text-slate-400 font-bold font-mono">PROJ-781 • شركة إعمار المعمارية</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    مجمع مكاتب العاصمة - 45 باب قواطع مكتبية زجاج وخشب
                  </p>
                </div>
                <div className="flex items-center gap-6 sm:gap-8 justify-between sm:justify-end">
                  <div className="text-right">
                    <p className="text-[10px] uppercase text-slate-400 font-bold">المرحلة الحالية</p>
                    <p className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded inline-block mt-0.5">
                      التجميع والكوايل
                    </p>
                  </div>
                  <div>
                    <div className="w-28 sm:w-32 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-[40%]" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono block text-left mt-1">40% مكتمل</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 2 Clean Alert Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg">
                <p className="text-xs font-bold text-emerald-800 uppercase">
                  أحدث عرض سعر معتمد • Q-2026-99
                </p>
                <p className="text-sm text-emerald-700 mt-1 font-medium">
                  أبواب HDF مقاومة للرطوبة ومعالجة (6 وحدات)
                </p>
                <p className="text-lg font-bold text-emerald-900 mt-2 font-mono">
                  51,000 <span className="text-xs font-normal">ج.م</span>
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => onNavigate('quotations')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] px-3 py-1.5 rounded font-bold transition-colors"
                  >
                    معاينة العرض والفاتورة ↗
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg">
                <p className="text-xs font-bold text-amber-800 uppercase">
                  تنبيه هالك التشغيل • Waste Alert
                </p>
                <p className="text-sm text-amber-700 mt-1 font-medium">
                  فضلات ألواح MDF وشرائح البلوط (PROJ-772)
                </p>
                <div className="flex items-end justify-between mt-2">
                  <p className="text-2xl font-bold text-amber-900 font-mono">
                    9.2% <span className="text-xs font-normal opacity-70">نسبة هالك</span>
                  </p>
                  <span className="text-[10px] bg-white border border-amber-200 text-amber-800 px-2 py-0.5 rounded font-semibold mb-1">
                    +1.2% فوق المعياري
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Automated Journal Entries Dark Card (1 Column) */}
        <div className="bg-[#1E293B] rounded-xl flex flex-col p-6 text-white shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-700/80 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                القيود اليومية التلقائية
              </h3>
              <p className="text-[11px] text-slate-300 font-medium">
                Automated Journal Entries
              </p>
            </div>
            <button
              onClick={() => onNavigate('accounting_ledger')}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-medium hover:underline"
            >
              دفتر الأستاذ ↗
            </button>
          </div>

          <div className="space-y-4 flex-1">
            {/* Entry 1 */}
            <div className="border-r-2 border-emerald-500 pr-4 py-1">
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-emerald-300 font-mono">
                  JV-4402 • ADVANCE PAYMENT
                </p>
                <span className="text-[10px] text-slate-400">اليوم 09:12</span>
              </div>
              <div className="flex justify-between mt-1.5 text-[11px]">
                <p className="text-slate-300">Dr: البنك الأهلي التجاري 101</p>
                <p className="font-mono text-emerald-400 font-semibold">+100,000</p>
              </div>
              <div className="flex justify-between text-[11px]">
                <p className="text-slate-300">Cr: إيرادات مقدمة (فيلا التجمع)</p>
                <p className="font-mono text-slate-400">-100,000</p>
              </div>
            </div>

            {/* Entry 2 */}
            <div className="border-r-2 border-blue-400 pr-4 py-1">
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-blue-300 font-mono">
                  JV-4401 • RAW MATERIAL PO
                </p>
                <span className="text-[10px] text-slate-400">أمس 14:30</span>
              </div>
              <div className="flex justify-between mt-1.5 text-[11px]">
                <p className="text-slate-300">Dr: مخزن الأخشاب والألواح</p>
                <p className="font-mono text-blue-400 font-semibold">+120,000</p>
              </div>
              <div className="flex justify-between text-[11px]">
                <p className="text-slate-300">Cr: حساب الموردين - شركة الأخشاب</p>
                <p className="font-mono text-slate-400">-120,000</p>
              </div>
            </div>

            {/* Entry 3 */}
            <div className="border-r-2 border-orange-500 pr-4 py-1">
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-orange-300 font-mono">
                  JV-4399 • SITE INSTALLATION
                </p>
                <span className="text-[10px] text-slate-400">أمس 18:00</span>
              </div>
              <div className="flex justify-between mt-1.5 text-[11px]">
                <p className="text-slate-300">Dr: تكلفة التركيبات والتشغيل</p>
                <p className="font-mono text-orange-400 font-semibold">+6,000</p>
              </div>
              <div className="flex justify-between text-[11px]">
                <p className="text-slate-300">Cr: عهدة نقدية / أجور الفنيين</p>
                <p className="font-mono text-slate-400">-6,000</p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-700">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">الربحية التقديرية الحالية:</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">+220,000 ج.م</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              *صافي بعد خصم تكلفة الخامات المباشرة والأجور والمصروفات
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Row: 4 Operational Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">مستحق للموردين AP</span>
            <Package className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-800">
            {supplierPayables.toLocaleString()} ج.م
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            4 موردين خامات رئيسية
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">المشاريع قيد التنفيذ</span>
            <Building className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-800">
            {activeProjectsCount} مشاريع
          </div>
          <span className="text-[11px] text-emerald-600 block mt-1 font-medium">
            ضمن المخطط الزمني
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">أوامر تصنيع متأخرة</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-lg font-bold font-mono text-emerald-700">
            {delayedOrdersCount} أوامر
          </div>
          <span className="text-[11px] text-emerald-600 block mt-1 font-medium">
            نسبة الالتزام 98%
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">مصروفات الشهر الإدارية</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-800">
            {totalExpenses.toLocaleString()} ج.م
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            إيجار، صيانة، نقل، كهرباء
          </span>
        </div>
      </div>

      {/* Two Minimalist Detailed Tables: Top Selling & Receivables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-500" />
              <span>أكثر المنتجات طلباً ومبيعاً هذا الربع</span>
            </h3>
            <span className="text-xs text-slate-400">إجمالي الوحدات والمبيعات</span>
          </div>

          <div className="space-y-2.5">
            {topSellingProducts.map((prod, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 hover:bg-slate-100/70 rounded-lg border border-slate-100 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold text-slate-800 text-xs sm:text-sm block">
                    {prod.name}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    تم تصنيع: {prod.salesQty} وحدة • معدل النمو {prod.growth}
                  </span>
                </div>
                <div className="text-left font-mono font-bold text-slate-800 text-xs sm:text-sm">
                  {prod.revenue.toLocaleString()} <span className="text-[10px] text-slate-400">ج.م</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Receivables */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <span>أرصدة العملاء المستحقة للتحصيل</span>
            </h3>
            <button
              onClick={() => onNavigate('contracts')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              عرض جدول الدفعات ↗
            </button>
          </div>

          <div className="space-y-2.5">
            {highestDebtCustomers.map((cust) => (
              <div
                key={cust.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-800 text-xs sm:text-sm">{cust.name}</h4>
                    <span className="text-[11px] text-slate-400">{cust.projectTitle}</span>
                  </div>
                  <div className="text-left">
                    <span className="font-bold font-mono text-sm text-slate-800 block">
                      {(cust.remainingBalance ?? 0).toLocaleString()} ج.م
                    </span>
                    <span className="text-[10px] text-slate-400">
                      محصل: {(cust.totalPaid ?? 0).toLocaleString()} ج.م
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
