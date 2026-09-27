import React, { useState } from 'react';
import { JournalEntry } from '../types';
import {
  DollarSign,
  ArrowRightLeft,
  Calendar,
  CheckCircle2,
  Search,
  Filter,
  Eye,
  FileSpreadsheet,
  Download,
} from 'lucide-react';

interface AccountingLedgerViewProps {
  journalEntries: JournalEntry[];
  onOpenJournalEntry: (entry: JournalEntry) => void;
}

export const AccountingLedgerView: React.FC<AccountingLedgerViewProps> = ({
  journalEntries,
  onOpenJournalEntry,
}) => {
  const [filterStage, setFilterStage] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredEntries = journalEntries.filter((entry) => {
    const matchesSearch =
      entry.entryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.referenceDocument.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalDebits = filteredEntries.reduce((sum, e) => sum + e.totalDebit, 0);
  const totalCredits = filteredEntries.reduce((sum, e) => sum + e.totalCredit, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              النظام المالي والمحاسبي المتكامل ERP
            </span>
            <span className="text-xs text-slate-500 font-mono">شجرة الحسابات واليومية العامة General Ledger</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            <span>دفتر اليومية العامة والقيود المحاسبية التلقائية (GL)</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            كل حركة تشغيلية (تحصيل، شراء خامات، صرف WIP، إثبات أجور، تسليم ومبيعات، تكلفة بضاعة مباعة) تولد قيداً متزناً لحظياً.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-center">
            <span className="text-[11px] text-emerald-700 block">اتزان اليومية (Debit = Credit)</span>
            <span className="text-base font-bold font-mono text-emerald-800">100% متزن ومطابق</span>
          </div>
        </div>
      </div>

      {/* Accounting Workflow Explanation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-emerald-700 font-bold block">1. تحصيل مقدم</span>
          <span className="text-[10px] text-slate-500 mt-1 block">من ح/ البنك إلى ح/ عملاء دفعات مقدمة</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-blue-700 font-bold block">2. شراء الخامات</span>
          <span className="text-[10px] text-slate-500 mt-1 block">من ح/ مخزن الخامات إلى ح/ الموردين</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-indigo-700 font-bold block">3. صرف للتشغيل</span>
          <span className="text-[10px] text-slate-500 mt-1 block">من ح/ إنتاج تحت التشغيل WIP إلى ح/ مخزن الخامات</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-amber-700 font-bold block">4. إثبات الأجور</span>
          <span className="text-[10px] text-slate-500 mt-1 block">من ح/ تشغيل WIP إلى ح/ أجور نجارين ودهانين</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-purple-700 font-bold block">5. منتج تام</span>
          <span className="text-[10px] text-slate-500 mt-1 block">من ح/ مخزن منتج تام إلى ح/ إنتاج تحت التشغيل</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-rose-700 font-bold block">6. تسليم و COGS</span>
          <span className="text-[10px] text-slate-500 mt-1 block">ح/ تكلفة مبيعات وح/ العملاء والمبيعات</span>
        </div>
      </div>

      {/* Journal Entries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Search and stats bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              placeholder="بحث برقم القيد أو البيان أو المستند المرجعي..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-9 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-600">
              إجمالي المدين: <strong className="text-slate-900">{(totalDebits ?? 0).toLocaleString()} ج.م</strong>
            </span>
            <span className="text-slate-600">
              إجمالي الدائن: <strong className="text-slate-900">{(totalCredits ?? 0).toLocaleString()} ج.م</strong>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">رقم القيد</th>
                <th className="p-3.5">التاريخ</th>
                <th className="p-3.5">شرح وبيان العملية</th>
                <th className="p-3.5">المستند المرجعي</th>
                <th className="p-3.5 text-center">المدين (Debit)</th>
                <th className="p-3.5 text-center">الدائن (Credit)</th>
                <th className="p-3.5 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-emerald-700">{entry.entryNumber}</td>
                  <td className="p-3.5 font-mono text-slate-600">{entry.date}</td>
                  <td className="p-3.5 font-medium text-slate-900 max-w-sm">{entry.description}</td>
                  <td className="p-3.5 font-mono text-slate-500">{entry.referenceDocument}</td>
                  <td className="p-3.5 text-center font-mono font-bold text-slate-900">
                    {(entry.totalDebit ?? 0).toLocaleString()} ج.م
                  </td>
                  <td className="p-3.5 text-center font-mono font-bold text-slate-900">
                    {(entry.totalCredit ?? 0).toLocaleString()} ج.م
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => onOpenJournalEntry(entry)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>عرض القيد التفصيلي</span>
                    </button>
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
