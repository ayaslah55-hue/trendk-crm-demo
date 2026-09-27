import React, { useState } from 'react';
import {
  Customer,
  Contract,
  ProductionOrder,
  DoorMeasurement,
  Quotation,
  JournalEntry,
  ProjectCosting,
} from '../types';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Ruler,
  FileSpreadsheet,
  FileCheck2,
  DollarSign,
  Hammer,
  Boxes,
  Percent,
  Truck,
  Receipt,
  TrendingUp,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  UserCheck,
  Building,
  Calendar,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';

interface StoryWalkthroughViewProps {
  customer: Customer;
  contract: Contract;
  quotation: Quotation;
  measurements: DoorMeasurement[];
  productionOrder: ProductionOrder;
  projectCosting: ProjectCosting;
  journalEntries: JournalEntry[];
  onOpenJournalEntry: (entry: JournalEntry) => void;
  onNavigateToView: (view: any) => void;
}

export const StoryWalkthroughView: React.FC<StoryWalkthroughViewProps> = ({
  customer,
  contract,
  quotation,
  measurements,
  productionOrder,
  projectCosting,
  journalEntries,
  onOpenJournalEntry,
  onNavigateToView,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const steps = [
    {
      id: 'step-1',
      title: '1. طلب العميل والمعاينة الميدانية',
      shortTitle: 'طلب العميل',
      icon: <UserCheck className="w-5 h-5 text-amber-500" />,
      badge: 'المبيعات و CRM',
    },
    {
      id: 'step-2',
      title: '2. رفع المقاسات الفنية بالموقع',
      shortTitle: 'المقاسات',
      icon: <Ruler className="w-5 h-5 text-sky-500" />,
      badge: 'الهندسة والموقع',
    },
    {
      id: 'step-3',
      title: '3. إعداد عرض السعر التفصيلي (Quotation)',
      shortTitle: 'عرض السعر',
      icon: <FileSpreadsheet className="w-5 h-5 text-purple-500" />,
      badge: 'التسعير والمبيعات',
    },
    {
      id: 'step-4',
      title: '4. اعتماد العقد وجدولة الدفعات (Contract)',
      shortTitle: 'العقد والدفعات',
      icon: <FileCheck2 className="w-5 h-5 text-emerald-500" />,
      badge: 'التعاقدات',
    },
    {
      id: 'step-5',
      title: '5. تحصيل الدفعة المقدمة 50% + القيد التلقائي',
      shortTitle: 'الدفعة المقدمة',
      icon: <DollarSign className="w-5 h-5 text-amber-600" />,
      badge: 'المالية والخزينة',
    },
    {
      id: 'step-6',
      title: '6. توليد أمر التشغيل والتصنيع (Work Order)',
      shortTitle: 'أمر التصنيع',
      icon: <Hammer className="w-5 h-5 text-blue-600" />,
      badge: 'إدارة الإنتاج والورش',
    },
    {
      id: 'step-7',
      title: '7. صرف خامات BOM وقيد الإنتاج تحت التشغيل (WIP)',
      shortTitle: 'صرف الخامات BOM',
      icon: <Boxes className="w-5 h-5 text-indigo-600" />,
      badge: 'المخازن والتكاليف',
    },
    {
      id: 'step-8',
      title: '8. مراقبة الهالك والفاقد وضبط الجودة QC',
      shortTitle: 'الهالك والجودة',
      icon: <Percent className="w-5 h-5 text-rose-500" />,
      badge: 'مراقبة الجودة',
    },
    {
      id: 'step-9',
      title: '9. التوريد والتركيب بالموقع ومحضر الاستلام',
      shortTitle: 'التركيب والتسليم',
      icon: <Truck className="w-5 h-5 text-teal-600" />,
      badge: 'العمليات والموقع',
    },
    {
      id: 'step-10',
      title: '10. الفاتورة الختامية وتحليل ربحية المشروع (P&L)',
      shortTitle: 'الربحية والتحصيل',
      icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
      badge: 'المحاسبة والربحية',
    },
  ];

  const currentStep = steps[currentStepIndex];

  // Find related journal entry for the current step if any
  const getStepJournalEntry = (): JournalEntry | undefined => {
    switch (currentStepIndex) {
      case 4: // Advance payment
        return journalEntries.find((j) => j.id === 'jv-001');
      case 6: // WIP Material Issue
        return journalEntries.find((j) => j.id === 'jv-005');
      case 9: // Sales Invoice & Final
        return journalEntries.find((j) => j.id === 'jv-101');
      default:
        return undefined;
    }
  };

  const activeEntry = getStepJournalEntry();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Clean Minimalism Presentation Header */}
      <div className="bg-[#1E293B] rounded-xl p-6 text-white shadow-xs border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-full text-xs font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                سيناريو العرض التقديمي المتكامل لشركات الأثاث والأبواب
              </span>
              <span className="text-slate-400 text-xs font-mono">مشروع: فيلا التجمع الخامس</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              دورة العمل الشاملة: من أول معاينة العميل حتى التصنيع والتركيب والربحية
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-3xl leading-relaxed">
              هذه الجولة التفاعلية تشرح لصاحب الشركة والمحاسب كيف يرتبط كل مستند تشغيلي (مقاس، عرض سعر، عقد، أمر تصنيع، إذن صرف، محضر تسليم)
              مباشرةً بالنظام المالي والقيود المحاسبية التلقائية.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              onClick={() => setCurrentStepIndex(0)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بدء القصة من البداية</span>
            </button>
            <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-center">
              <span className="text-[10px] text-slate-400 block font-medium uppercase">إجمالي العقد</span>
              <span className="text-base font-bold font-mono text-emerald-400">200,000 ج.م</span>
            </div>
          </div>
        </div>

        {/* 10-Step Interactive Breadcrumb Bar */}
        <div className="mt-6 pt-4 border-t border-slate-700/80 overflow-x-auto pb-2 scrollbar-thin">
          <div className="flex items-center gap-2 min-w-max">
            {steps.map((step, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-xs'
                      : isPast
                      ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'
                  } border border-slate-700/60`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                      isCurrent
                        ? 'bg-white text-blue-700'
                        : isPast
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {isPast ? '✓' : idx + 1}
                  </span>
                  <span>{step.shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Step Presentation Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Step Banner */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 text-amber-600">
              {currentStep.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {currentStep.badge}
                </span>
                <span className="text-xs text-slate-500">الخطوة {currentStepIndex + 1} من 10</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{currentStep.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeEntry && (
              <button
                onClick={() => onOpenJournalEntry(activeEntry)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all animate-bounce"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>عرض القيد المحاسبي المولد (JV)</span>
              </button>
            )}
            <button
              onClick={() => {
                const targetViews: Record<number, any> = {
                  1: 'measurements',
                  2: 'quotations',
                  3: 'contracts',
                  4: 'contracts',
                  5: 'production',
                  6: 'bom_warehouse',
                  7: 'waste',
                  8: 'installation_warranty',
                  9: 'expenses_profitability',
                };
                if (targetViews[currentStepIndex]) {
                  onNavigateToView(targetViews[currentStepIndex]);
                }
              }}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 transition-colors"
            >
              فتح شاشة النظام الكاملة ↗
            </button>
          </div>
        </div>

        {/* Dynamic Content for Each Step */}
        <div className="p-6">
          {/* STEP 1: Customer Lead */}
          {currentStepIndex === 0 && (
            <div className="space-y-6">
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-amber-900 text-sm">
                <span className="font-bold block mb-1">ملخص الخطوة:</span>
                تلقي طلب عميل لفيلا التجمع الخامس لتشطيب الأبواب والدريسنج والمطبخ، وفتح ملف عميل متكامل يربط المبيعات بالمقاسات والمالية.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-amber-600" />
                    <span>بيانات العميل والمشروع</span>
                  </h4>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">اسم العميل:</span>
                      <span className="font-bold text-slate-800">{customer.name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">رقم الهاتف:</span>
                      <span className="font-mono text-slate-800">{customer.phone}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">الموقع / العنوان:</span>
                      <span className="text-slate-800 font-medium">{customer.location}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">الاستشاري المشرف:</span>
                      <span className="text-slate-800 font-medium">{customer.contractorOrConsultant}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">حالة العميل:</span>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-xs">
                        مشروع قيد التنفيذ والتصنيع
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    <span>البنود المطلوبة مبدئياً للمشروع</span>
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {(customer?.itemsSummary || customer?.requestedProducts || []).map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-800 bg-white p-2 rounded-lg border border-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
                    💡 تم تحديد موعد المعاينة ورفع الشرب ومقاسات الحوائط بواسطة المهندس الفني المختص.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Measurements */}
          {currentStepIndex === 1 && (
            <div className="space-y-6">
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-sky-900 text-sm">
                <span className="font-bold block mb-1">المقاسات الهندسية التخصصية للأبواب:</span>
                تسجيل كود كل باب (D-01 حتى D-MAIN)، المقاس الدقيق (عرض × ارتفاع)، سمك الحائط (15 سم)، اتجاه الفتح، نوع الحلق (زان)، نوع الضلفة (MDF + قشرة بلوط)، واللون Walnut 07.
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
                <table className="w-full text-right text-xs sm:text-sm">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">كود الباب</th>
                      <th className="p-3">المكان بالموقع</th>
                      <th className="p-3 text-center">المقاس (عرض × ارتفاع)</th>
                      <th className="p-3 text-center">سمك الحائط</th>
                      <th className="p-3 text-center">اتجاه الفتح</th>
                      <th className="p-3">نوع الحلق والضلفة</th>
                      <th className="p-3">اللون والتشطيب</th>
                      <th className="p-3 text-center">السعر التقديري</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(measurements || []).slice(0, 5).map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-amber-700 bg-amber-50/50">{m.doorCode}</td>
                        <td className="p-3 font-semibold text-slate-800">{m.location}</td>
                        <td className="p-3 text-center font-mono">
                          {m.widthCm} × {m.heightCm} سم
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-slate-600">{m.wallThicknessCm} سم</td>
                        <td className="p-3 text-center font-medium">{m.openingDirection}</td>
                        <td className="p-3 text-xs text-slate-700">
                          <span className="block font-semibold">{m.jambType}</span>
                          <span className="text-slate-500">{m.leafType}</span>
                        </td>
                        <td className="p-3 text-xs font-medium text-slate-700">{m.finishColor}</td>
                        <td className="p-3 text-center font-mono font-bold text-emerald-700">
                          {(m.unitPrice ?? 0).toLocaleString()} ج.م
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span>تم إدراج صور الموقع ومخطط الـ Shop Drawing واعتماد العميل مهندسياً.</span>
                <span className="font-bold text-slate-700">عرض 5 من إجمالي 9 أبواب مسجلة</span>
              </div>
            </div>
          )}

          {/* STEP 3: Quotation */}
          {currentStepIndex === 2 && (
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-purple-900 text-sm">
                <span className="font-bold block mb-1">عرض السعر المفصل (Quotation QUO-2026-0048):</span>
                بنود تسعير واضحة بالمواصفات، الكمية، سعر الوحدة، الإجمالي، وتجهيزه للتحول بضغطة زر إلى أمر بيع وعقد رسمي.
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-right text-xs sm:text-sm">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">البند</th>
                      <th className="p-3">المواصفات الفنية المعتمدة</th>
                      <th className="p-3 text-center">الكمية</th>
                      <th className="p-3 text-center">السعر الفردي</th>
                      <th className="p-3 text-center">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(quotation?.items || []).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{item.item}</td>
                        <td className="p-3 text-xs text-slate-600 max-w-md leading-relaxed">{item.specs}</td>
                        <td className="p-3 text-center font-mono font-bold">{item.quantity}</td>
                        <td className="p-3 text-center font-mono text-slate-700">{(item.unitPrice ?? 0).toLocaleString()} ج.م</td>
                        <td className="p-3 text-center font-mono font-bold text-emerald-700">
                          {(item.totalPrice ?? 0).toLocaleString()} ج.م
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-900 text-white font-bold text-sm">
                      <td colSpan={4} className="p-3 text-left pl-6">
                        صافي قيمة عرض السعر الإجمالي:
                      </td>
                      <td className="p-3 text-center font-mono text-amber-400 text-base">
                        {(quotation?.netTotal ?? 0).toLocaleString()} ج.م
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-800 block font-semibold">حالة عرض السعر:</span>
                  <span className="text-emerald-950 font-bold text-sm">تم اعتماد العميل وتحويله إلى عقد بيع Sales Contract رقم CONT-2026-0032</span>
                </div>
                <span className="text-xs bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg">
                  ✓ معتمد
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: Contract & Milestones */}
          {currentStepIndex === 3 && (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900 text-sm">
                <span className="font-bold block mb-1">جدول الدفعات التعاقدية (العقد: 200,000 ج.م):</span>
                50% مقدم (100,000 ج.م) + 30% بداية التصنيع (60,000 ج.م) + 15% قبل التركيب (30,000 ج.م) + 5% بعد الاستلام (10,000 ج.م).
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-xs block">قيمة العقد:</span>
                  <span className="text-xl font-bold font-mono text-slate-900">200,000 ج.م</span>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <span className="text-emerald-700 text-xs block">تم التحصيل الفعلي:</span>
                  <span className="text-xl font-bold font-mono text-emerald-800">160,000 ج.م</span>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <span className="text-amber-700 text-xs block">الدفعة القادمة المستحقة:</span>
                  <span className="text-xl font-bold font-mono text-amber-800">30,000 ج.م</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-xs block">المتبقي الإجمالي:</span>
                  <span className="text-xl font-bold font-mono text-slate-800">40,000 ج.م</span>
                </div>
              </div>

              {/* Milestones list */}
              <div className="space-y-3">
                {(contract?.milestones || []).map((m, i) => (
                  <div
                    key={m.id}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      m.isPaid ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          m.isPaid ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                        }`}
                      >
                        {m.isPaid ? '✓' : i + 1}
                      </span>
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm">{m.title}</h5>
                        <span className="text-xs text-slate-500">{m.triggerEvent}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-base font-bold font-mono text-slate-900">{(m.amount ?? 0).toLocaleString()} ج.م</span>
                      {m.isPaid ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                          تم السداد ({m.receiptVoucherId})
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full">
                          مستحق السداد
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Advance Payment & Auto Accounting Entry */}
          {currentStepIndex === 4 && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 text-sm">
                <span className="font-bold block mb-1">الربط المالي والمحاسبي الفوري:</span>
                عند تحصيل مقدم العقد (100,000 ج.م)، يقوم النظام بإصدار سند قبض وإيصال دفعة مقدمة، وتوليد القيد المحاسبي المزدوج فوراً دون تدخل يدوي!
              </div>

              <div className="bg-slate-900 text-white p-5 rounded-xl">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-base">القيد المحاسبي لسند القبض: JV-2026-0001</span>
                  </div>
                  <button
                    onClick={() => activeEntry && onOpenJournalEntry(activeEntry)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors"
                  >
                    عرض تفاصيل السند الكاملة
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
                  <div className="bg-slate-800/80 p-3.5 rounded-lg border border-emerald-500/30">
                    <span className="text-xs text-emerald-400 block font-sans">طرف المدين (Debit):</span>
                    <span className="font-bold text-base text-white">من حـ/ البنك الأهلي المصري (1101)</span>
                    <span className="block text-emerald-400 font-bold text-lg mt-1">+100,000 ج.م</span>
                  </div>
                  <div className="bg-slate-800/80 p-3.5 rounded-lg border border-blue-500/30">
                    <span className="text-xs text-blue-400 block font-sans">طرف الدائن (Credit):</span>
                    <span className="font-bold text-base text-white">إلى حـ/ دفعات مقدمة من العملاء (2105)</span>
                    <span className="block text-blue-400 font-bold text-lg mt-1">-100,000 ج.م</span>
                  </div>
                </div>

                <div className="mt-4 text-xs text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>تأثير القيد: زيادة الرصيد البنكي 100 ألف ج.م + إثبات التزام تعاقدي لحساب العميل لحين إصدار الفاتورة النهائية.</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Production Order & 9 Stages */}
          {currentStepIndex === 5 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-900 text-sm">
                <span className="font-bold block mb-1">أمر التشغيل والتصنيع (WO-2026-00124):</span>
                متابعة دقيقة لمراحل الإنتاج التسعة: قص ➔ تجميع ➔ كبس ➔ قشرة ➔ صنفرة ➔ دهان ➔ إكسسوارات ➔ QC ➔ جاهز للتركيب مع تحديد المسؤول وتاريخ الإنجاز.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-xs block">رقم أمر التشغيل:</span>
                  <span className="font-bold font-mono text-amber-700 text-base">{productionOrder.workOrderNumber}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-xs block">المرحلة الحالية:</span>
                  <span className="font-bold text-blue-700 text-base">{productionOrder.currentStage}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-xs block">نسبة الإنجاز الكلية:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${productionOrder.overallProgress}%` }} />
                    </div>
                    <span className="font-bold font-mono text-emerald-700 text-sm">{productionOrder.overallProgress}%</span>
                  </div>
                </div>
              </div>

              {/* Stages grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(productionOrder?.stages || []).map((st, i) => (
                  <div
                    key={st.id}
                    className={`p-3.5 rounded-xl border ${
                      st.status === 'completed'
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : st.status === 'in_progress'
                        ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-200'
                        : 'bg-slate-50 border-slate-200 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-slate-900">
                        {i + 1}. {st.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          st.status === 'completed'
                            ? 'bg-emerald-200 text-emerald-900'
                            : st.status === 'in_progress'
                            ? 'bg-blue-200 text-blue-900 animate-pulse'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {st.status === 'completed' ? 'تم الإنجاز' : st.status === 'in_progress' ? 'قيد العمل' : 'بانتظار البدء'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-600 block truncate">المسؤول: {st.responsiblePerson}</span>
                    <span className="text-[11px] text-slate-500 font-mono block mt-1">
                      {st.startDate} إلى {st.endDate}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: BOM & WIP Accounting Entry */}
          {currentStepIndex === 6 && (
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-indigo-900 text-sm">
                <span className="font-bold block mb-1">جدول خامات الباب BOM وصرف الخامات من المخازن:</span>
                كل باب يحتاج: 0.12 م³ خشب موسكي + 2 لوح MDF + 1.8 م قشرة بلوط + 1 كالون + 3 مفصلات + دهان وسيلر + مقبض.
                وعند الصرف، يولد النظام فوراً قيد تشغيل صناعي:
                <br />
                <strong>مدين: إنتاج تحت التشغيل (WIP) 80,000 ج.م ➔ دائن: مخزون خامات (80,000 ج.م).</strong>
              </div>

              <div className="bg-slate-900 text-white p-5 rounded-xl">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
                    <span className="font-bold text-base">القيد المحاسبي لصرف الخامات: JV-2026-0005</span>
                  </div>
                  <button
                    onClick={() => activeEntry && onOpenJournalEntry(activeEntry)}
                    className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    عرض سند القيد التفصيلي
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
                  <div className="bg-slate-800/80 p-3.5 rounded-lg border border-indigo-500/30">
                    <span className="text-xs text-indigo-400 block font-sans">مدين (WIP):</span>
                    <span className="font-bold text-base text-white">من حـ/ إنتاج تحت التشغيل (1105)</span>
                    <span className="block text-indigo-400 font-bold text-lg mt-1">80,000 ج.م</span>
                  </div>
                  <div className="bg-slate-800/80 p-3.5 rounded-lg border border-amber-500/30">
                    <span className="text-xs text-amber-400 block font-sans">دائن (المخازن):</span>
                    <span className="font-bold text-base text-white">إلى حـ/ مخزون الخامات ومستلزمات الإنتاج (1104)</span>
                    <span className="block text-amber-400 font-bold text-lg mt-1">80,000 ج.م</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: Waste Management & Quality */}
          {currentStepIndex === 7 && (
            <div className="space-y-6">
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-900 text-sm">
                <span className="font-bold block mb-1">مراقبة الهالك الفعلي vs المسموح:</span>
                تم صرف 100 متر خشب موسكي، المستخدم الفعلي 91 متراً، والهالك 9 أمتار بنسبة 9%، والنظام يوضح الفارق مقارنة بالحد الطبيعي (5%) لكشف أي هدر بالخامات.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">المنصرف من المخزن</span>
                  <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">100 متر</span>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-center">
                  <span className="text-xs text-emerald-700 block">المستخدم الفعلي بالمنتج</span>
                  <span className="text-2xl font-bold font-mono text-emerald-800 mt-1 block">91 متر</span>
                </div>
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 text-center">
                  <span className="text-xs text-rose-700 block">الهالك الفعلي (Waste)</span>
                  <span className="text-2xl font-bold font-mono text-rose-800 mt-1 block">9 متر (9%)</span>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-center">
                  <span className="text-xs text-amber-700 block">الهالك الطبيعي المسموح</span>
                  <span className="text-2xl font-bold font-mono text-amber-800 mt-1 block">5% (فارق +4%)</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700">
                <span className="font-bold text-slate-900 block mb-1">إجراء قسم الجودة:</span>
                تم توجيه الفضلات الناتجة لقص العوارض والبرور الزان الداخلية، وتحديث معاملات برنامج التقطيع CNC لتقليل الهالك في الدفعة القادمة إلى أقل من 4.5%.
              </div>
            </div>
          )}

          {/* STEP 9: Installation & Sign-off */}
          {currentStepIndex === 8 && (
            <div className="space-y-6">
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-teal-900 text-sm">
                <span className="font-bold block mb-1">التركيب بالموقع ومحضر الاستلام النهائي:</span>
                تحميل الأبواب بسيارة الشركة الجامبو مع فريق التركيب (4 فنيين برئاسة الأسطى رضوان)، وتوقيع العميل على محضر الاستلام ومطابقة المقاسات.
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900 text-base">إذن خروج وتركيب رقم INST-2026-089</h4>
                  <span className="px-2.5 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-lg">
                    جاهز للتسليم بالموقع
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">رئيس فريق التركيب:</span>
                    <span className="font-bold text-slate-800">الأسطى رضوان منصور (4 فنيين)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">السيارة الناقلة:</span>
                    <span className="font-mono font-bold text-slate-800">أ ب ج 7643 جامبو مجهزة</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">تاريخ التركيب المحدد:</span>
                    <span className="font-mono font-bold text-slate-800">14 سبتمبر 2026</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">التوقيع الرقمي للعميل:</span>
                    <span className="text-slate-500">تم فحص الحركة والوزن ومفصلات الأبواب واستلام المفاتيح والضمان لمدة 3 سنوات.</span>
                  </div>
                  <div className="border border-dashed border-slate-300 rounded px-4 py-2 bg-slate-50 text-center">
                    <span className="font-mono text-xs text-emerald-700 font-bold block">✓ توقيع رقمي معتمد</span>
                    <span className="text-[10px] text-slate-500">أحمد محمد الشناوي</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 10: Profitability & Financial Summary */}
          {currentStepIndex === 9 && (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900 text-sm">
                <span className="font-bold block mb-1">التقرير المالي وربحية المشروع P&L:</span>
                النتيجة الختامية للمشروع توضح قيمة العقد الفعلية مقارنة بجميع التكاليف (خامات، أجور، نقل، تركيب) وصافي الربح المحقق بالأرقام المحاسبية!
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 text-white p-5 rounded-xl">
                  <span className="text-xs text-slate-400 block">قيمة التعاقد الكلي للمشروع:</span>
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 mt-1 block">
                    {(projectCosting?.contractValue ?? 0).toLocaleString()} ج.م
                  </span>
                  <span className="text-xs text-slate-400 mt-2 block">فيلا التجمع الخامس - تشطيب كامل</span>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">إجمالي التكلفة الفعلية الشاملة:</span>
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-rose-700 mt-1 block">
                    {(projectCosting?.totalActualCost ?? 0).toLocaleString()} ج.م
                  </span>
                  <span className="text-xs text-slate-500 mt-2 block">خامات + أجور + نقل + تركيب</span>
                </div>

                <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-200">
                  <span className="text-xs text-emerald-800 block">صافي الربح الإجمالي (Gross Profit):</span>
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-700 mt-1 block">
                    {(projectCosting?.grossProfit ?? 0).toLocaleString()} ج.م
                  </span>
                  <span className="text-xs font-bold text-emerald-900 mt-2 block">
                    هامش الربح: {projectCosting?.profitMarginPercentage ?? 0}%
                  </span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <h5 className="font-bold text-slate-900 text-sm">تفصيل عناصر تكلفة المشروع المحاسبية:</h5>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-500 block">خامات خشب ومسطحات:</span>
                    <span className="font-bold font-mono text-slate-800">{(projectCosting?.rawMaterialsCost ?? 0).toLocaleString()} ج.م</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-500 block">أجور عمالة وتصنيع:</span>
                    <span className="font-bold font-mono text-slate-800">{(projectCosting?.directLaborCost ?? 0).toLocaleString()} ج.م</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-500 block">تركيبات الموقع:</span>
                    <span className="font-bold font-mono text-slate-800">{(projectCosting?.installationCost ?? 0).toLocaleString()} ج.م</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-500 block">نقل وتشوين:</span>
                    <span className="font-bold font-mono text-slate-800">{(projectCosting?.transportationCost ?? 0).toLocaleString()} ج.م</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-500 block">مصروفات موقع وعامة:</span>
                    <span className="font-bold font-mono text-slate-800">{(projectCosting?.siteAndOtherExpenses ?? 0).toLocaleString()} ج.م</span>
                  </div>
                </div>
              </div>

              {/* Final CTA */}
              <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl">
                <div>
                  <span className="font-bold text-sm block">اكتملت دورة العمل النموذجية بنجاح!</span>
                  <span className="text-xs text-slate-400">يمكنك الآن تصفح باقي شاشات الـ ERP المتخصصة عبر القائمة العلوية.</span>
                </div>
                <button
                  onClick={() => onNavigateToView('dashboard')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                >
                  الانتقال لـ Dashboard الإدارة
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step Navigation Controls */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <button
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
            <span>الخطوة السابقة</span>
          </button>

          <span className="text-xs text-slate-500 font-medium">
            {currentStepIndex + 1} من {steps.length}
          </span>

          <button
            disabled={currentStepIndex === steps.length - 1}
            onClick={() => setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
            className="flex items-center gap-1.5 px-5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors shadow-xs"
          >
            <span>الخطوة التالية</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
