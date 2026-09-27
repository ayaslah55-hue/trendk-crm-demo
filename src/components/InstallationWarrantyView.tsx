import React, { useState } from 'react';
import { InstallationRecord, JournalEntry } from '../types';
import {
  Wrench,
  CheckCircle2,
  Calendar,
  Users,
  ShieldCheck,
  FileCheck2,
  Sparkles,
  AlertCircle,
  Printer,
  PenTool,
  Clock,
  ArrowRightLeft,
} from 'lucide-react';

interface InstallationWarrantyViewProps {
  installation: InstallationRecord;
  journalEntries: JournalEntry[];
  onOpenJournalEntry: (entry: JournalEntry) => void;
  onCompleteHandover?: (signatureName: string) => void;
  onNavigate?: (view: any) => void;
}

export const InstallationWarrantyView: React.FC<InstallationWarrantyViewProps> = ({
  installation,
  journalEntries,
  onOpenJournalEntry,
  onCompleteHandover,
  onNavigate,
}) => {
  const [snagItems, setSnagItems] = useState(installation.snagList);
  const [activeTab, setActiveTab] = useState<'handover' | 'warranty'>('handover');
  const [isSigned, setIsSigned] = useState<boolean>(Boolean(installation.customerSignature));
  const [signatureInput, setSignatureInput] = useState<string>(installation.customerSignature || 'د. شريف عزمي');

  const finalInvoiceEntry = journalEntries.find((j) => j.id === 'jv-007' || j.sourceType === 'COGS Realization' || j.sourceType === 'Sales Invoice');

  const toggleSnag = (id: string) => {
    setSnagItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isResolved: !s.isResolved } : s))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
              المرحلة النهائية وإغلاق المشروع
            </span>
            <span className="text-xs text-slate-500 font-mono">محضر استلام رقم: {installation.handoverNumber}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-sky-600" />
            <span>التركيب بالموقع، محضر الاستلام (Handover)، وشهادة الضمان</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            جدول فريق التركيب، فحص ملاحظات العميل (Snag List)، اعتماد توقيع الاستلام، وإصدار شهادة ضمان 3 سنوات ضد عيوب الصناعة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {finalInvoiceEntry && (
            <button
              onClick={() => onOpenJournalEntry(finalInvoiceEntry)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>قيد الفاتورة والاعتراف بالإيراد (JV-0007)</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>طباعة المستند</span>
          </button>
        </div>
      </div>

      {/* Mode Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('handover')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'handover'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>محضر تسليم الموقع وقائمة الملاحظات (Snag List)</span>
        </button>

        <button
          onClick={() => setActiveTab('warranty')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'warranty'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>شهادة الضمان المعتمدة (36 شهراً)</span>
        </button>
      </div>

      {activeTab === 'handover' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Handover Metadata & Snag List (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            {/* Team and Dates Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-3">بيانات التثبيت وفريق التركيبات</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">تاريخ التركيب بالموقع:</span>
                  <span className="font-mono font-bold text-slate-900 block mt-1">{installation.installationDate}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">مشرف الموقع والفريق:</span>
                  <span className="font-bold text-slate-900 block mt-1">{installation.teamLead}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">الأعضاء المساعدين:</span>
                  <span className="text-slate-700 block mt-1">{installation.technicians.join('، ')}</span>
                </div>
              </div>
            </div>

            {/* Snag List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">قائمة ملاحظات الاستلام (Snag List)</h3>
                  <span className="text-xs text-slate-500">ملاحظات المعاينة الميدانية مع العميل والاستشاري</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg">
                  تم استيفاء كافة الملاحظات
                </span>
              </div>

              <div className="divide-y divide-slate-200">
                {snagItems.map((item) => (
                  <div key={item.id} className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                    <button
                      onClick={() => toggleSnag(item.id)}
                      className={`w-6 h-6 rounded-md flex items-center justify-center border mt-0.5 transition-colors ${
                        item.isResolved
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <div className="flex-1">
                      <p
                        className={`text-xs sm:text-sm ${
                          item.isResolved ? 'text-slate-500 line-through' : 'text-slate-900 font-semibold'
                        }`}
                      >
                        {item.item}
                      </p>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        الحالة: {item.isResolved ? 'تم الضبط والتسليم للعميل' : 'قيد المتابعة'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Signature and Handover Acceptance (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-xs space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] text-slate-400 block font-mono">إقرار الاستلام النهائي</span>
                <h4 className="font-bold text-slate-900 text-sm mt-0.5">توقيع العميل والاستشاري</h4>
              </div>

              <p className="text-slate-600 leading-relaxed text-[11px]">
                أقر أنا الموقع أدناه بأنني عاينت واستلمت كافة الأبواب والدريسنج روم الخاصة بـ (فيلا التجمع الخامس) بحالة ممتازة ومطابقة تماماً للمواصفات والرسومات التنفيذية المعتمدة، وبدون أي تلفيات.
              </p>

              {/* Customer signature simulation box */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-300 text-center">
                <span className="text-[10px] text-slate-400 block mb-1">توقيع العميل المعتمد إلكترونياً</span>
                {isSigned ? (
                  <div className="h-14 flex items-center justify-center text-slate-800 italic font-serif text-lg font-bold">
                    {signatureInput}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={signatureInput}
                    onChange={(e) => setSignatureInput(e.target.value)}
                    placeholder="اسم المعتمد / العميل للتوقيع..."
                    className="w-full text-center p-2 bg-white border border-slate-300 rounded-lg text-sm font-bold my-1"
                  />
                )}
                <span className="text-[10px] text-emerald-700 font-semibold">
                  بتاريخ {installation.customerSignatureDate || new Date().toISOString().split('T')[0]}
                </span>
              </div>

              {!isSigned ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsSigned(true);
                    if (onCompleteHandover) onCompleteHandover(signatureInput);
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <PenTool className="w-4 h-4" />
                  <span>اعتماد الاستلام النهائي وإصدار الضمان والقيد المحاسبي</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold">
                      تم استحقاق الدفعة الختامية (10,000 ج.م) بعد الاستلام النهائي
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('warranty')}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>عرض شهادة الضمان الرسمية ➔</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'warranty' && (
        <div className="max-w-3xl mx-auto bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 rounded-3xl border-2 border-amber-300/80 p-8 shadow-xl text-center relative overflow-hidden">
          {/* Subtle watermark or corner ornament */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

          <div className="flex items-center justify-center gap-2 text-amber-700 mb-2">
            <ShieldCheck className="w-8 h-8 text-amber-600" />
            <span className="font-bold text-sm tracking-wide uppercase">شهادة ضمان جودة واعتصام مصنعي</span>
          </div>

          <h3 className="text-2xl font-black text-slate-900 mt-1 font-serif">
            شركة الأفق للتصنيع الخشبي والأبواب الذكية
          </h3>
          <p className="text-xs text-slate-500 font-mono mt-1">
            رقم الشهادة: WARR-2026-00452 | صالحة لمدة 36 شهراً (3 سنوات)
          </p>

          <div className="my-6 p-5 bg-white/80 rounded-2xl border border-amber-200/70 text-xs text-slate-700 leading-relaxed text-right space-y-3">
            <p>
              تشهد الشركة بأن جميع الأبواب ومنتجات الأخشاب الموردة إلى العميل الكريم{' '}
              <strong className="text-slate-900">{installation.customerName}</strong> في مشروع{' '}
              <strong className="text-slate-900">{installation.projectTitle}</strong> مصنعة وفق أعلى المعايير الهندسية، وتضمن الشركة الآتي:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-700 mr-2">
              <li>ضمان شامل لمدة 3 سنوات ضد تقوس الضلف (Anti-Warping Warranty).</li>
              <li>ضمان ضد تفكك القشرة الطبيعية (Oak Veneer) أو تقشر طبقات الدهان.</li>
              <li>ضمان ضد عيوب تصنيع الحلق الزان والبرور.</li>
              <li>خدمة صيانة مجانية دورية خلال العام الأول للتشغيل.</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs pt-4 border-t border-amber-200">
            <div>
              <span className="text-slate-400 block text-[10px]">تاريخ بدء الضمان:</span>
              <span className="font-mono font-bold text-slate-800">{installation.warrantyStartDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">تاريخ انتهاء الضمان:</span>
              <span className="font-mono font-bold text-slate-800">{installation.warrantyEndDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">الختم المصنعي:</span>
              <span className="font-bold text-amber-700">معتمد وقيد التفعيل ✓</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
