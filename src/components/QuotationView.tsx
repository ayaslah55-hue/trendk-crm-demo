import React, { useState } from 'react';
import { Quotation, QuotationItem, Contract } from '../types';
import {
  FileSpreadsheet,
  Printer,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Percent,
  Calculator,
  Plus,
  Trash2,
  FileCheck2,
} from 'lucide-react';

interface QuotationViewProps {
  quotation: Quotation;
  onConvertToContract: () => void;
}

export const QuotationView: React.FC<QuotationViewProps> = ({ quotation, onConvertToContract }) => {
  const [items, setItems] = useState<QuotationItem[]>(quotation.items);
  const [discountPercent, setDiscountPercent] = useState<number>(quotation.discountPercentage);
  const [taxPercent, setTaxPercent] = useState<number>(quotation.taxPercentage);
  const [isConverted, setIsConverted] = useState<boolean>(quotation.status === 'converted');

  const subtotal = items.reduce((sum, it) => sum + it.totalPrice, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = (afterDiscount * taxPercent) / 100;
  const netTotal = afterDiscount + taxAmount;

  const handleConvert = () => {
    setIsConverted(true);
    onConvertToContract();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
              قسم المبيعات والتسعير
            </span>
            <span className="text-xs text-slate-500 font-mono">رقم العرض: {quotation.quotationNumber}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-purple-600" />
            <span>عرض السعر المعتمد (Detailed Quotation)</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            تفصيل كامل لبنود التصنيع والمواصفات المعتمدة، مع التحويل الآلي بضغطة زر إلى أمر بيع وعقد معتمد.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>طباعة العرض</span>
          </button>

          {!isConverted ? (
            <button
              onClick={handleConvert}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-emerald-700/20 transition-all hover:scale-105"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>تحويل إلى عقد وأمر بيع معتمد (Sales Order)</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>تم التحويل لعقد معتمد (CONT-2026-0032)</span>
            </div>
          )}
        </div>
      </div>

      {/* Quotation Document Body */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Document Meta */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block">اسم العميل:</span>
            <span className="font-bold text-slate-900 text-sm">{quotation.customerName}</span>
          </div>
          <div>
            <span className="text-slate-500 block">المشروع / الموقع:</span>
            <span className="font-semibold text-slate-800">{quotation.projectTitle}</span>
          </div>
          <div>
            <span className="text-slate-500 block">تاريخ العرض:</span>
            <span className="font-mono font-semibold text-slate-800">{quotation.date}</span>
          </div>
          <div>
            <span className="text-slate-500 block">صالح حتى:</span>
            <span className="font-mono font-semibold text-slate-800">{quotation.validUntil}</span>
          </div>
        </div>

        {/* Quotation Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5 w-12 text-center">#</th>
                <th className="p-3.5">البند</th>
                <th className="p-3.5">المواصفات الفنية المعتمدة</th>
                <th className="p-3.5 text-center w-24">الكمية</th>
                <th className="p-3.5 text-center w-32">السعر (ج.م)</th>
                <th className="p-3.5 text-center w-36">الإجمالي (ج.م)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 text-center font-mono text-slate-400">{idx + 1}</td>
                  <td className="p-3.5 font-bold text-slate-900">{item.item}</td>
                  <td className="p-3.5 text-xs text-slate-600 max-w-lg leading-relaxed">{item.specs}</td>
                  <td className="p-3.5 text-center font-mono font-bold text-slate-800">{item.quantity}</td>
                  <td className="p-3.5 text-center font-mono text-slate-700">{(item.unitPrice ?? 0).toLocaleString()}</td>
                  <td className="p-3.5 text-center font-mono font-bold text-slate-900">
                    {(item.totalPrice ?? 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals and Calculation Box */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="text-xs text-slate-500 space-y-1.5">
            <h5 className="font-bold text-slate-800 text-sm mb-1">الشروط والأحكام التعاقدية:</h5>
            <p>• الأسعار تشمل التوريد والتشوين والتركيب داخل القاهرة الكبرى.</p>
            <p>• الدفعات: 50% مقدم تعاقد، 30% بدء التصنيع، 15% قبل التركيب، 5% استلام نهائي.</p>
            <p>• مدة التوريد والتصنيع 40 يوماً من تاريخ اعتماد الشوب دروينج وسداد الدفعة الأولى.</p>
            <p>• فترة الضمان 36 شهراً ضد عيوب الصناعة مع شهادة ضمان معتمدة.</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>إجمالي البنود (Subtotal):</span>
              <span className="font-mono font-bold text-slate-900">{(subtotal ?? 0).toLocaleString()} ج.م</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-1">
                <span>الخصم الممنوح:</span>
                <span className="font-mono text-slate-400">({discountPercent}%)</span>
              </span>
              <span className="font-mono text-emerald-700 font-bold">
                {(discountAmount ?? 0) > 0 ? `-${(discountAmount ?? 0).toLocaleString()} ج.م` : '0 ج.م'}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-1">
                <span>ضريبة القيمة المضافة (VAT):</span>
                <span className="font-mono text-slate-400">({taxPercent}%)</span>
              </span>
              <span className="font-mono text-slate-700 font-bold">
                {(taxAmount ?? 0) > 0 ? `+${(taxAmount ?? 0).toLocaleString()} ج.م` : 'شامل الضريبة'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-300 flex justify-between items-center text-sm font-bold text-slate-900">
              <span className="text-base text-slate-950">صافي قيمة العرض (Net Total):</span>
              <span className="font-mono text-xl text-amber-700 font-black">{(netTotal ?? 0).toLocaleString()} ج.م</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
