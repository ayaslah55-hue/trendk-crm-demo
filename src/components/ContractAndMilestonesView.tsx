import React, { useState } from 'react';
import { Contract, JournalEntry } from '../types';
import {
  FileCheck2,
  Calendar,
  DollarSign,
  AlertCircle,
  Bell,
  CheckCircle2,
  ArrowRightLeft,
  Receipt,
  Download,
  CreditCard,
  Building,
} from 'lucide-react';

interface ContractAndMilestonesViewProps {
  contract: Contract;
  journalEntries: JournalEntry[];
  onOpenJournalEntry: (entry: JournalEntry) => void;
  onRecordPayment?: (milestoneId: string) => void;
  onNavigate?: (view: any) => void;
}

export const ContractAndMilestonesView: React.FC<ContractAndMilestonesViewProps> = ({
  contract,
  journalEntries,
  onOpenJournalEntry,
  onRecordPayment,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'milestones' | 'terms'>('milestones');

  const advancePaymentEntry = journalEntries.find((j) => j.id === 'jv-001');
  const secondPaymentEntry = journalEntries.find((j) => j.id === 'jv-006');
  const thirdPaymentEntry = journalEntries.find((j) => j.id === 'jv-008' || j.referenceNumber?.includes('RV-003') || j.memo?.includes('الدفعة الثالثة'));
  const finalPaymentEntry = journalEntries.find((j) => j.id === 'jv-009' || j.referenceNumber?.includes('RV-004') || j.memo?.includes('الدفعة الختامية'));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              إدارة العقود وجدولة الدفعات
            </span>
            <span className="text-xs text-slate-500 font-mono">رقم العقد: {contract.contractNumber}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-emerald-600" />
            <span>عقد التوريد والتركيب وجدول الدفعات المرحلية</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            ربط سداد الدفعات بنسب الإنجاز الفعلي بالمصنع والموقع، مع تنبيه آلي للمحاسب وتوليد سندات القبض والقيود اليومية.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-center">
            <span className="text-[11px] text-emerald-800 font-medium block">إجمالي قيمة العقد</span>
            <span className="text-xl font-bold font-mono text-emerald-900">
              {(contract?.totalAmount ?? 0).toLocaleString()} ج.م
            </span>
          </div>
        </div>
      </div>

      {/* 4 Financial Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-xs block">قيمة العقد المعتمد:</span>
          <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
            {(contract?.totalAmount ?? 0).toLocaleString()} ج.م
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">100% من إجمالي المشروع</span>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 shadow-xs">
          <span className="text-emerald-700 text-xs font-bold block">تم التحصيل الفعلي:</span>
          <span className="text-xl font-bold font-mono text-emerald-800 mt-1 block">
            {(contract?.paidAmount ?? 0).toLocaleString()} ج.م
          </span>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            نسبة 80% (مقدم + بدء التصنيع)
          </span>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 shadow-xs">
          <span className="text-amber-800 text-xs font-bold block">الدفعة القادمة المستحقة:</span>
          <span className="text-xl font-bold font-mono text-amber-800 mt-1 block">
            {(contract?.nextMilestoneAmount ?? 0).toLocaleString()} ج.م
          </span>
          <span className="text-[11px] text-amber-700 font-medium mt-1 block">
            {contract?.nextMilestoneTitle}
          </span>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-xs block">المتبقي الإجمالي:</span>
          <span className="text-xl font-bold font-mono text-slate-800 mt-1 block">
            {(contract?.remainingAmount ?? 0).toLocaleString()} ج.م
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">نسبة 20% متبقية</span>
        </div>
      </div>

      {/* Automatic Accountant Alert Box */}
      {contract.remainingAmount > 0 ? (
        <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-amber-950">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold shrink-0 mt-0.5">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                  تنبيه تلقائي للإدارة المالية والمحاسب
                </span>
                <span className="text-xs text-amber-800 font-mono">الاستحقاق: {contract.nextMilestoneTitle}</span>
              </div>
              <h4 className="font-bold text-sm sm:text-base text-slate-900 mt-1">
                استحقاق دفعة بقيمة <span className="font-mono text-amber-800 font-black">{contract.nextMilestoneAmount.toLocaleString()} ج.م</span>
              </h4>
              <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                أمر التشغيل رقم WO-2026-00124 شارف على انتهاء مرحلة الدهان والتجهيز للجودة QC. يرجى إرسال إشعار المطالبة المالية للعميل لتحصيل الدفعة قبل تحميل سيارة الشحن.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
            <button
              onClick={() => {
                const nextUnpaid = contract.milestones.find((m) => !m.isPaid);
                if (nextUnpaid && onRecordPayment) {
                  onRecordPayment(nextUnpaid.id);
                }
              }}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>تحصيل الدفعة المستحقة الآن (سند قبض + قيد آلي)</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 text-emerald-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                اكتمال التحصيل
              </span>
              <h4 className="font-bold text-sm sm:text-base text-emerald-900 mt-0.5">
                تم سداد 100% من إجمالي قيمة العقد ({(contract.totalAmount).toLocaleString()} ج.م)
              </h4>
              <p className="text-xs text-emerald-700 mt-0.5">
                كافة سندات القبض معتمدة ومرحلة إلى دفتر الأستاذ العام والقوائم المالية.
              </p>
            </div>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('financial_reports')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              عرض القوائم المالية ➔
            </button>
          )}
        </div>
      )}

      {/* Milestones Schedule Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>جدول الدفعات التعاقدية المرتبطة بمراحل الإنجاز</span>
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">العميل: {contract.customerName}</span>
            {onNavigate && (
              <button
                onClick={() => onNavigate('production')}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                أمر التصنيع بالورشة ➔
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">الدفعة ونسبتها</th>
                <th className="p-3.5">حدث الاستحقاق التشغيلي</th>
                <th className="p-3.5 text-center">المبلغ المستحق</th>
                <th className="p-3.5 text-center">تاريخ الاستحقاق</th>
                <th className="p-3.5 text-center">حالة السداد</th>
                <th className="p-3.5 text-center">الإجراء والقيد المحاسبي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(contract?.milestones || []).map((m, idx) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span>{m.title}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-xs text-slate-600 max-w-sm leading-relaxed">{m.triggerEvent}</td>
                  <td className="p-3.5 text-center font-mono font-bold text-slate-900 text-base">
                    {(m?.amount ?? 0).toLocaleString()} ج.م
                  </td>
                  <td className="p-3.5 text-center font-mono text-slate-600 text-xs">{m.dueDate}</td>
                  <td className="p-3.5 text-center">
                    {m.isPaid ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>تم التحصيل ({m.paidDate || 'مسدد'})</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onRecordPayment && onRecordPayment(m.id)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                        title="تحصيل هذه الدفعة وتوليد سند القبض والقيد آلياً"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>تحصيل الآن</span>
                      </button>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {m.isPaid ? (
                      <button
                        onClick={() => {
                          const entry =
                            idx === 0
                              ? advancePaymentEntry
                              : idx === 1
                              ? secondPaymentEntry
                              : idx === 2
                              ? (thirdPaymentEntry || secondPaymentEntry)
                              : (finalPaymentEntry || advancePaymentEntry);
                          if (entry) onOpenJournalEntry(entry);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />
                        <span>عرض القيد المحاسبي ↗</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono">يولد قيد آلي فور التحصيل</span>
                    )}
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
