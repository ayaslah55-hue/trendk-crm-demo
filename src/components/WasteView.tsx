import React from 'react';
import { WasteRecord } from '../types';
import { Percent, AlertTriangle, CheckCircle2, TrendingDown, Info, ShieldAlert } from 'lucide-react';

interface WasteViewProps {
  wasteRecords: WasteRecord[];
}

export const WasteView: React.FC<WasteViewProps> = ({ wasteRecords }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
              رقابة الجودة وترشيد الخامات
            </span>
            <span className="text-xs text-slate-500 font-mono">تقرير الهالك والفاقد الصناعي</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Percent className="w-6 h-6 text-rose-600" />
            <span>مراقبة وتحليل نسبة الهالك (Waste & Scrap Control)</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            مقارنة الكميات المنصرفة من المخازن مقابل المستخدم الفعلي في تصنيع الأبواب وكشف سوء الاستخدام وهدر الأخشاب والألواح.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-rose-50 border border-rose-200 px-4 py-2 rounded-xl text-center">
            <span className="text-[11px] text-rose-800 font-medium block">متوسط الهالك الإجمالي</span>
            <span className="text-xl font-bold font-mono text-rose-900">6.3%</span>
          </div>
        </div>
      </div>

      {/* Featured Example Highlight (The 100m wood prompt scenario) */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 rounded-2xl p-6 text-white shadow-lg border border-rose-900/40">
        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <span className="text-xs font-bold text-rose-300 bg-rose-900/50 px-2.5 py-0.5 rounded-full border border-rose-700/40">
            حالة فحص عملي: أمر تشغيل WO-2026-00124 (أخشاب موسكي للحلولق)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mt-4">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 block mb-1">المنصرف من المخزن:</span>
            <span className="text-2xl font-black font-mono text-white">100 متر</span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <span className="text-xs text-emerald-400 block mb-1">المستخدم في الأبواب:</span>
            <span className="text-2xl font-black font-mono text-emerald-400">91 متر</span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-rose-500/40">
            <span className="text-xs text-rose-400 block mb-1">الهالك الفعلي (Waste):</span>
            <span className="text-2xl font-black font-mono text-rose-400">9 أمتار (9%)</span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-amber-500/40">
            <span className="text-xs text-amber-400 block mb-1">المسموح vs الفرق:</span>
            <span className="text-2xl font-black font-mono text-amber-400">5% (+4% انحراف)</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
          <span>السبب المسجل: استبعاد عقد خشبية لضمان استقامة الحلق، وتم إعادة توجيه الفاقد لقص البرور والعوارض الداخلية.</span>
          <span className="font-bold text-amber-400">إجراء تصحيحي معتمد</span>
        </div>
      </div>

      {/* Waste Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">سجل تحليل الهالك لأوامر الإنتاج</h3>
          <span className="text-xs text-slate-500">3 تقارير فحص حديثة</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">التاريخ</th>
                <th className="p-3.5">أمر التشغيل</th>
                <th className="p-3.5">الخامة</th>
                <th className="p-3.5 text-center">المنصرف</th>
                <th className="p-3.5 text-center">المستخدم</th>
                <th className="p-3.5 text-center">الهالك</th>
                <th className="p-3.5 text-center">نسبة الهالك</th>
                <th className="p-3.5 text-center">المسموح</th>
                <th className="p-3.5 text-center">الفرق</th>
                <th className="p-3.5 text-center">التقييم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {wasteRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono text-slate-600 text-xs">{r.date}</td>
                  <td className="p-3.5 font-mono font-bold text-amber-700">{r.workOrderNumber}</td>
                  <td className="p-3.5 font-bold text-slate-900">{r.materialName}</td>
                  <td className="p-3.5 text-center font-mono font-semibold">
                    {r.issuedQuantity} {r.unit}
                  </td>
                  <td className="p-3.5 text-center font-mono text-emerald-700 font-bold">
                    {r.usedInProduction} {r.unit}
                  </td>
                  <td className="p-3.5 text-center font-mono text-rose-700 font-bold">
                    {r.wasteQuantity} {r.unit}
                  </td>
                  <td className="p-3.5 text-center font-mono font-bold text-slate-900">{r.wastePercentage}%</td>
                  <td className="p-3.5 text-center font-mono text-slate-500">{r.normalAllowedPercentage}%</td>
                  <td className="p-3.5 text-center font-mono font-bold">
                    <span className={r.variancePercentage > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                      {r.variancePercentage > 0 ? `+${r.variancePercentage}%` : `${r.variancePercentage}%`}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        r.status === 'طبيعي'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
