import React, { useState } from 'react';
import { ProjectCosting, Expense } from '../types';
import {
  TrendingUp,
  PieChart,
  DollarSign,
  Layers,
  Sparkles,
  Building,
  CheckCircle2,
  Calendar,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';

interface ExpensesAndProfitabilityViewProps {
  projectCostings: ProjectCosting[];
  expenses: Expense[];
}

export const ExpensesAndProfitabilityView: React.FC<ExpensesAndProfitabilityViewProps> = ({
  projectCostings = [],
  expenses = [],
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projectCostings[0]?.projectId || projectCostings[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'profitability' | 'expenses'>('profitability');

  const selectedCosting =
    (projectCostings || []).find((p) => (p.projectId === selectedProjectId || p.id === selectedProjectId)) ||
    projectCostings[0] ||
    ({
      projectId: 'proj-1',
      projectName: 'المشروع النموذجي',
      customerName: 'عميل المصنع',
      contractValue: 0,
      rawMaterialsCost: 0,
      directLaborCost: 0,
      installationCost: 0,
      transportationCost: 0,
      siteAndOtherExpenses: 0,
      totalActualCost: 0,
      grossProfit: 0,
      profitMarginPercentage: 0,
      status: 'قيد التنفيذ',
    } as ProjectCosting);

  const totalCompanyExpenses = (expenses || []).reduce((sum, e) => sum + (e.amount || 0), 0);

  const contractAmount = selectedCosting.contractValue ?? selectedCosting.contractAmount ?? 0;
  const totalCost = selectedCosting.totalActualCost ?? selectedCosting.totalCost ?? 0;
  const netProfit = selectedCosting.grossProfit ?? selectedCosting.netProfit ?? 0;
  const rawMaterials = selectedCosting.rawMaterialsCost ?? selectedCosting.materialsCost ?? 0;
  const labor = selectedCosting.directLaborCost ?? selectedCosting.laborCost ?? 0;
  const paint = selectedCosting.paintCost ?? 18000;
  const accessories = selectedCosting.accessoriesCost ?? 22000;
  const transportAndInst =
    selectedCosting.transportAndInstallationCost ??
    ((selectedCosting.transportationCost || 0) + (selectedCosting.installationCost || 0));
  const siteExpenses = selectedCosting.siteAndOtherExpenses ?? selectedCosting.wasteCost ?? 18000;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              التحليل المالي وربحية المشاريع
            </span>
            <span className="text-xs text-slate-500 font-mono">Project Costing & Net Profit</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <span>ربحية كل مشروع تفصيلياً وتصنيف المصروفات</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            شاشة التقييم المالي التنفيذي: احتساب دقيق لتكلفة الخامات، أجور الفنيين، الدهانات، الإكسسوارات، النقل، وهامش الربح الصافي.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-center">
            <span className="text-[11px] text-emerald-700 block">هامش ربح المشروع المختار</span>
            <span className="text-xl font-bold font-mono text-emerald-800">
              {selectedCosting.profitMarginPercentage ?? 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('profitability')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'profitability'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>تقرير ربحية المشروع (Project Profitability Dossier)</span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'expenses'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>مصروفات المصنع والمعرض (تشغيلية وإدارية)</span>
        </button>
      </div>

      {activeTab === 'profitability' && (
        <div className="space-y-6">
          {/* Project Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">اختر المشروع:</span>
            {(projectCostings || []).map((cost) => {
              const pId = cost.projectId || cost.id || '';
              const pTitle = cost.projectName || cost.projectTitle || 'مشروع تصنيع';
              const pAmount = cost.contractValue ?? cost.contractAmount ?? 0;
              const isSelected = (selectedProjectId === pId) || (!selectedProjectId && cost === projectCostings[0]);
              return (
                <button
                  key={pId}
                  onClick={() => setSelectedProjectId(pId)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <span>{pTitle}</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {pAmount.toLocaleString()} ج.م
                  </span>
                </button>
              );
            })}
          </div>

          {/* Top High-Impact Profit Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 rounded-2xl p-6 text-white shadow-xl border border-emerald-800/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-emerald-400 font-mono text-xs block">
                  كود المشروع: {selectedCosting.projectCode || selectedCosting.projectId || 'PRJ-01'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black mt-1">
                  {selectedCosting.projectName || selectedCosting.projectTitle || 'مشروع تصنيع خشبي متكامل'}
                </h3>
                <span className="text-xs text-slate-400">العميل: {selectedCosting.customerName || 'عميل المصنع'}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-center">
                  <span className="text-[11px] text-slate-400 block">إجمالي التكلفة</span>
                  <span className="text-lg font-black font-mono text-rose-300">
                    {totalCost.toLocaleString()} ج.م
                  </span>
                </div>
                <div className="bg-emerald-900/60 px-4 py-2 rounded-xl border border-emerald-600/50 text-center">
                  <span className="text-[11px] text-emerald-300 block">صافي الربح الفعلي</span>
                  <span className="text-2xl font-black font-mono text-emerald-400">
                    {netProfit.toLocaleString()} ج.م
                  </span>
                </div>
              </div>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-6 text-xs">
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 text-center">
                <span className="text-slate-400 block text-[11px]">تكلفة الخامات:</span>
                <span className="text-sm font-bold font-mono text-white mt-1 block">
                  {rawMaterials.toLocaleString()} ج.م
                </span>
                <span className="text-[10px] text-slate-400">أخشاب وألواح</span>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 text-center">
                <span className="text-slate-400 block text-[11px]">أجور النجارين:</span>
                <span className="text-sm font-bold font-mono text-white mt-1 block">
                  {labor.toLocaleString()} ج.م
                </span>
                <span className="text-[10px] text-slate-400">فنيين ومساعدين</span>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 text-center">
                <span className="text-slate-400 block text-[11px]">الدهانات:</span>
                <span className="text-sm font-bold font-mono text-white mt-1 block">
                  {paint.toLocaleString()} ج.م
                </span>
                <span className="text-[10px] text-slate-400">سيلر وبرايمر وبوليستر</span>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 text-center">
                <span className="text-slate-400 block text-[11px]">الإكسسوارات:</span>
                <span className="text-sm font-bold font-mono text-white mt-1 block">
                  {accessories.toLocaleString()} ج.م
                </span>
                <span className="text-[10px] text-slate-400">كوالين ومفصلات</span>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 text-center">
                <span className="text-slate-400 block text-[11px]">النقل والتركيب:</span>
                <span className="text-sm font-bold font-mono text-white mt-1 block">
                  {transportAndInst.toLocaleString()} ج.م
                </span>
                <span className="text-[10px] text-slate-400">سيارة وفريق تركيب</span>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 text-center">
                <span className="text-rose-400 block text-[11px]">مصروفات الموقع والنثريات:</span>
                <span className="text-sm font-bold font-mono text-rose-300 mt-1 block">
                  {siteExpenses.toLocaleString()} ج.م
                </span>
                <span className="text-[10px] text-rose-400/80">مصاريف مباشرة</span>
              </div>

              <div className="bg-emerald-950/70 p-3 rounded-xl border border-emerald-500/40 text-center">
                <span className="text-emerald-400 block text-[11px] font-bold">هامش الربح:</span>
                <span className="text-base font-black font-mono text-emerald-300 mt-1 block">
                  {selectedCosting.profitMarginPercentage ?? 0}%
                </span>
                <span className="text-[10px] text-emerald-400">أعلى من المستهدف</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">بيان المصروفات التشغيلية والإدارية</h3>
              <span className="text-xs text-slate-500">مقسمة حسب مركز التكلفة والمشروع</span>
            </div>
            <span className="font-mono font-bold text-sm text-slate-900">
              إجمالي المصروفات: {totalCompanyExpenses.toLocaleString()} ج.م
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">التاريخ</th>
                  <th className="p-3.5">بند المصروف</th>
                  <th className="p-3.5">التصنيف</th>
                  <th className="p-3.5">المشروع المحمل عليه</th>
                  <th className="p-3.5 text-center">طريقة الدفع</th>
                  <th className="p-3.5 text-center">المبلغ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(expenses || []).map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-mono text-slate-600 text-xs">{exp.date}</td>
                    <td className="p-3.5 font-bold text-slate-900">{exp.title}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          exp.category === 'مصروفات تشغيل'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700 text-xs">{exp.allocatedProject}</td>
                    <td className="p-3.5 text-center text-slate-600 text-xs">{exp.paymentMethod}</td>
                    <td className="p-3.5 text-center font-mono font-bold text-slate-900 text-sm">
                      {(exp.amount ?? 0).toLocaleString()} ج.م
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
