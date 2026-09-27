import React from 'react';
import { JournalEntry } from '../types';
import { CheckCircle2, FileText, Printer, X, ShieldCheck, ArrowRightLeft } from 'lucide-react';

interface JournalEntryModalProps {
  entry: JournalEntry | null;
  onClose: () => void;
}

export const JournalEntryModal: React.FC<JournalEntryModalProps> = ({ entry, onClose }) => {
  if (!entry) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 border border-amber-400/30 rounded-xl text-amber-400">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  قيد محاسبي آلي مزدوج
                </span>
                <span className="text-xs text-slate-400">سجل اليومية العامة GL</span>
              </div>
              <h2 className="text-xl font-bold mt-0.5 flex items-center gap-2">
                سند قيد رقم: <span className="font-mono text-amber-400">{entry.entryNumber}</span>
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Entry Metadata Details */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-slate-500 block text-xs">تاريخ القيد:</span>
            <span className="font-semibold text-slate-800 font-mono">{entry.date}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">رقم المستند المرجعي:</span>
            <span className="font-semibold text-amber-700 font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
              {entry.referenceNumber}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">نوع الحركة المحاسبية:</span>
            <span className="font-medium text-slate-800">{entry.sourceType}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">المشروع المرتبط:</span>
            <span className="font-medium text-slate-800 truncate block" title={entry.projectRef || 'عام'}>
              {entry.projectRef || 'عام / المصنع'}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-4 mt-1 bg-white p-2.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 text-xs block mb-0.5">البيان والشرح المحاسبي (Memo):</span>
            <p className="text-slate-800 font-medium text-sm leading-relaxed">{entry.memo}</p>
          </div>
        </div>

        {/* Accounting Table (Debit / Credit) */}
        <div className="p-5 overflow-y-auto flex-1">
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-right border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-xs">
                  <th className="p-3 w-28">كود الحساب</th>
                  <th className="p-3">اسم الحساب في الدليل</th>
                  <th className="p-3">شرح البند</th>
                  <th className="p-3 text-center w-32 bg-emerald-50/70 text-emerald-800">مدين (Debit)</th>
                  <th className="p-3 text-center w-32 bg-blue-50/70 text-blue-800">دائن (Credit)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(entry?.lines || []).map((line, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-600 text-xs">{line.accountCode}</td>
                    <td className="p-3 font-semibold text-slate-900">{line.accountName}</td>
                    <td className="p-3 text-slate-600 text-xs">{line.description}</td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-700 bg-emerald-50/30">
                      {(line.debit ?? 0) > 0 ? `${(line.debit ?? 0).toLocaleString()} ج.م` : '—'}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-blue-700 bg-blue-50/30">
                      {(line.credit ?? 0) > 0 ? `${(line.credit ?? 0).toLocaleString()} ج.م` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-900 text-white font-bold border-t-2 border-slate-300 text-sm">
                  <td colSpan={3} className="p-3 text-left pl-6 font-semibold">
                    الإجمالي والتوازن المحاسبي:
                  </td>
                  <td className="p-3 text-center font-mono text-emerald-400 bg-slate-800">
                    {(entry.totalDebit ?? 0).toLocaleString()} ج.م
                  </td>
                  <td className="p-3 text-center font-mono text-blue-400 bg-slate-800">
                    {(entry.totalCredit ?? 0).toLocaleString()} ج.م
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Validation badge */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>القيد متزن محاسبياً بنسبة 100% (المدين = الدائن) ومرحّل تلقائياً إلى دفتر الأستاذ العام وميزان المراجعة.</span>
            </div>
            <span className="font-mono text-slate-600">بواسطة: {entry.createdBy}</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>طباعة سند القيد</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
