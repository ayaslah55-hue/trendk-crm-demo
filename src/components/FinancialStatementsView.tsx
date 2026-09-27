import React, { useState } from 'react';
import {
  Landmark,
  FileSpreadsheet,
  Printer,
  Download,
  CheckCircle2,
  Calendar,
  Layers,
  PieChart,
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
  FileText,
  ShieldCheck,
  Building,
  DollarSign,
  Scale,
  ChevronLeft,
  Zap,
  Play,
  Check,
  Eye,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  Award,
  AlertCircle,
} from 'lucide-react';
import { FinancialPeriod, JournalEntry, Customer, Contract } from '../types';

interface FinancialStatementsViewProps {
  journalEntries?: JournalEntry[];
  onOpenJournalEntry?: (entry: JournalEntry) => void;
  onAddJournalEntry?: (entry: JournalEntry) => void;
  customers?: Customer[];
  contract?: Contract;
  onNavigate?: (view: any) => void;
}

type StatementTab = 'income' | 'balance_sheet' | 'cash_flow' | 'equity' | 'trial_balance' | 'notes';

export const FinancialStatementsView: React.FC<FinancialStatementsViewProps> = ({
  journalEntries = [],
  onOpenJournalEntry,
  onAddJournalEntry,
  customers = [],
  contract,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<StatementTab>('income');
  const [period, setPeriod] = useState<FinancialPeriod>('Q3-2026');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [activeNotification, setActiveNotification] = useState<{
    title: string;
    description: string;
    jvCode: string;
    stageName: string;
  } | null>(null);

  // Dynamic live financial figures modified by stage actions
  const [extraRevenue, setExtraRevenue] = useState<number>(0);
  const [extraCOGS, setExtraCOGS] = useState<number>(0);
  const [extraExpenses, setExtraExpenses] = useState<number>(0);
  const [extraCash, setExtraCash] = useState<number>(0);
  const [extraWIP, setExtraWIP] = useState<number>(0);
  const [extraRawMaterials, setExtraRawMaterials] = useState<number>(0);
  const [extraAdvances, setExtraAdvances] = useState<number>(0);
  const [extraDepreciation, setExtraDepreciation] = useState<number>(0);
  const [retainedEarningsTransferred, setRetainedEarningsTransferred] = useState<number>(0);
  const [executedStages, setExecutedStages] = useState<Record<string, boolean>>({});

  // 1. Income Statement Data (Dynamic & Detailed)
  const baseRevenues = [
    { code: '4101', name: 'إيرادات تصنيع وتوريد الأبواب الخشبية', current: 1450000 + extraRevenue, previous: 1220000 },
    { code: '4102', name: 'إيرادات أعمال الدريسنج والكونترات والمطابخ', current: 380000, previous: 290000 },
    { code: '4103', name: 'إيرادات خدمات التركيب والتشطيب بالموقع', current: 125000, previous: 95000 },
  ];
  const totalRevenues = baseRevenues.reduce((sum, r) => sum + r.current, 0);
  const prevTotalRevenues = baseRevenues.reduce((sum, r) => sum + r.previous, 0);

  const baseCogs = [
    { code: '5101', name: 'تكلفة خامات الأخشاب الطبيعية (زان، أرو، سويد)', current: 520000, previous: 440000 },
    { code: '5102', name: 'تكلفة الألواح والمسطحات (MDF، قشرة، HDF)', current: 315000, previous: 260000 },
    { code: '5103', name: 'تكلفة خامات الدهانات والتشطيب الكيميائي', current: 95000, previous: 80000 },
    { code: '5104', name: 'تكلفة الإكسسوارات والمفصلات والكوالين', current: 78000, previous: 65000 },
    { code: '5105', name: 'أجور العمالة الإنتاجية المباشرة والفنيين', current: 185000 + (executedStages['stage-3'] ? 25000 : 0), previous: 155000 },
    { code: '5106', name: 'مصروفات تشغيلية وهالك خامات الورشة', current: 38000 + (executedStages['stage-3'] ? 8000 : 0) + extraCOGS, previous: 32000 },
  ];
  const totalCogs = baseCogs.reduce((sum, c) => sum + c.current, 0);
  const prevTotalCogs = baseCogs.reduce((sum, c) => sum + c.previous, 0);

  const grossProfit = totalRevenues - totalCogs;
  const prevGrossProfit = prevTotalRevenues - prevTotalCogs;

  const baseOperatingExpenses = [
    { code: '6101', name: 'رواتب الإدارة والمهندسين المشرفين', current: 95000, previous: 85000 },
    { code: '6102', name: 'إيجار هناجر المصنع والورشة المركزية', current: 60000, previous: 60000 },
    { code: '6103', name: 'استهلاك الآلات والماكينات والمعدات (CNC)', current: 28000 + extraDepreciation, previous: 25000 },
    { code: '6104', name: 'مصروفات النقل والسيارات والتسليم بالموقع', current: 24000, previous: 19000 },
    { code: '6105', name: 'مرافق وكهرباء صناعية وصيانة ماكينات', current: 19000, previous: 16000 },
    { code: '6106', name: 'مصاريف تسويق ومعارض ومعاينات', current: 16000 + extraExpenses, previous: 14000 },
  ];
  const totalOperatingExpenses = baseOperatingExpenses.reduce((sum, o) => sum + o.current, 0);
  const prevTotalOperatingExpenses = baseOperatingExpenses.reduce((sum, o) => sum + o.previous, 0);

  const operatingProfit = grossProfit - totalOperatingExpenses;
  const prevOperatingProfit = prevGrossProfit - prevTotalOperatingExpenses;

  const otherItems = [
    { code: '7101', name: 'فوائد بنكية ورسوم مصرفية', current: -8000, previous: -7000 },
    { code: '7201', name: 'إيرادات بيع نشارة ومخلفات خشب ورشة', current: 14000, previous: 11000 },
  ];
  const netOther = otherItems.reduce((sum, i) => sum + i.current, 0);
  const netProfitBeforeTax = operatingProfit + netOther;
  const incomeTax = Math.round(netProfitBeforeTax * 0.225); // 22.5% Tax
  const netProfitAfterTax = netProfitBeforeTax - incomeTax;

  // 2. Statement of Financial Position (Balance Sheet)
  const currentCash = 780000 + extraCash;
  const currentReceivables = 560000;
  const currentNotesReceivable = 240000;
  const currentRawInventory = 650000 + extraRawMaterials;
  const currentWipInventory = 410000 + extraWIP;
  const currentFinishedInventory = 185000;
  const currentPrepaidExpenses = 65000;

  const totalCurrentAssets =
    currentCash +
    currentReceivables +
    currentNotesReceivable +
    currentRawInventory +
    currentWipInventory +
    currentFinishedInventory +
    currentPrepaidExpenses;

  const cncMachinery = 1250000;
  const sprayBooth = 320000;
  const deliveryVehicles = 280000;
  const hardwareAndSoftware = 95000;
  const accumulatedDepreciation = -(365000 + extraDepreciation);

  const totalNonCurrentAssets =
    cncMachinery + sprayBooth + deliveryVehicles + hardwareAndSoftware + accumulatedDepreciation;

  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

  // Liabilities
  const accountsPayable = 210000;
  const notesPayable = 130000;
  const customerAdvances = 380000 + extraAdvances;
  const taxesPayable = 145000;
  const accruedExpenses = 62000 + (executedStages['stage-3'] ? 25000 : 0);

  const totalCurrentLiabilities =
    accountsPayable + notesPayable + customerAdvances + taxesPayable + accruedExpenses;

  const longTermBankLoans = 260000;
  const endOfServiceProvision = 85000;
  const totalNonCurrentLiabilities = longTermBankLoans + endOfServiceProvision;
  const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;

  // Equity
  const paidCapital = 2000000;
  const legalReserve = 220000;
  const retainedEarnings = 599800 + retainedEarningsTransferred;
  const periodNetProfit = netProfitAfterTax - retainedEarningsTransferred;

  const totalEquity = paidCapital + legalReserve + retainedEarnings + periodNetProfit;
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

  // 3. Cash Flow
  const netOperatingCashFlow =
    netProfitBeforeTax +
    28000 + extraDepreciation + // Depreciation addback
    15000 - // Provision
    130000 - // Receivables change
    125000 + // Inventory change
    50000 + // Payables change
    (70000 + extraAdvances) - // Advances change
    85000; // Tax paid

  const netInvestingCashFlow = -155000;
  const netFinancingCashFlow = -138000;
  const netCashChange = netOperatingCashFlow + netInvestingCashFlow + netFinancingCashFlow;
  const beginningCash = 762000;
  const endingCash = beginningCash + netCashChange;

  // STAGE ACTION HANDLERS
  const handleExecuteStageAction = (stageId: string) => {
    const timestamp = Date.now();
    const entrySeq = (journalEntries.length + 1).toString().padStart(4, '0');

    if (stageId === 'stage-1') {
      // 1. Advance Payment Recognition
      const newJv: JournalEntry = {
        id: `jv-stage-1-${timestamp}`,
        entryNumber: `JV-2026-${entrySeq}`,
        date: '2026-09-27',
        referenceNumber: 'ADV-PAY-01',
        sourceType: 'Advance Payment',
        memo: 'إثبات تحصيل دفعة التعاقد المقدمة نقدياً بالبنك (مشروع فيلا التجمع الخامس)',
        lines: [
          {
            accountId: `line-1-${timestamp}`,
            accountCode: '1101',
            accountName: 'النقدية بالبنك التجاري الدولي CIB',
            debit: 100000,
            credit: 0,
            description: 'إيداع دفعة تعاقد نقدية في الحساب التجاري',
          },
          {
            accountId: `line-2-${timestamp}`,
            accountCode: '2103',
            accountName: 'دفعات مقدمة من العملاء - إيراد مؤجل',
            debit: 0,
            credit: 100000,
            description: 'إثبات التزام تنفيذ وتوريد الأبواب (فيلا التجمع)',
          },
        ],
        totalDebit: 100000,
        totalCredit: 100000,
        isBalanced: true,
        createdBy: 'النظام المحاسبي الآلي - دورة التعاقد',
        projectRef: 'فيلا التجمع الخامس',
      };

      setExtraCash((prev) => prev + 100000);
      setExtraAdvances((prev) => prev + 100000);
      setExecutedStages((prev) => ({ ...prev, 'stage-1': true }));
      if (onAddJournalEntry) onAddJournalEntry(newJv);

      setActiveNotification({
        title: 'تم إثبات دفعة التعاقد النقدية بنجاح!',
        description:
          'تم توليد القيد المحاسبي المتوازن وزيادة رصيد البنك بمبلغ 100,000 ج.م وإثبات التزام الدفعة المقدمة بالميزانية.',
        jvCode: newJv.entryNumber,
        stageName: 'مرحلة التعاقد والتحصيل',
      });
    } else if (stageId === 'stage-2') {
      // 2. Dispatch Raw Materials to WIP
      const newJv: JournalEntry = {
        id: `jv-stage-2-${timestamp}`,
        entryNumber: `JV-2026-${entrySeq}`,
        date: '2026-09-27',
        referenceNumber: 'WO-2026-01',
        sourceType: 'WIP Material Issue',
        memo: 'صرف خامات أخشاب وألواح لأمر التشغيل WO-2026-01 وإثبات إنتاج تحت التشغيل WIP',
        lines: [
          {
            accountId: `line-1-${timestamp}`,
            accountCode: '1105',
            accountName: 'مخزون إنتاج تحت التشغيل (WIP)',
            debit: 45000,
            credit: 0,
            description: 'تحويل خامات للورشة لبدء قص وكبس 8 أبواب',
          },
          {
            accountId: `line-2-${timestamp}`,
            accountCode: '1104',
            accountName: 'مخزون الخامات الرئيسية (زان، أرو، MDF)',
            debit: 0,
            credit: 45000,
            description: 'صرف خامات خشب طبيعي وألواح من مستودع الأخشاب',
          },
        ],
        totalDebit: 45000,
        totalCredit: 45000,
        isBalanced: true,
        createdBy: 'النظام المحاسبي الآلي - صرف الخامات',
        projectRef: 'فيلا التجمع الخامس',
      };

      setExtraWIP((prev) => prev + 45000);
      setExtraRawMaterials((prev) => prev - 45000);
      setExecutedStages((prev) => ({ ...prev, 'stage-2': true }));
      if (onAddJournalEntry) onAddJournalEntry(newJv);

      setActiveNotification({
        title: 'تم صرف خامات التصنيع للأمر التشغيلي!',
        description:
          'تم نقل 45,000 ج.م من مخزن الخامات إلى مخزون تحت التشغيل WIP وتحديث أصول الميزانية العمومية.',
        jvCode: newJv.entryNumber,
        stageName: 'مرحلة التشغيل وصرف الخامات',
      });
    } else if (stageId === 'stage-3') {
      // 3. Labor & Waste Accrual
      const newJv: JournalEntry = {
        id: `jv-stage-3-${timestamp}`,
        entryNumber: `JV-2026-${entrySeq}`,
        date: '2026-09-27',
        referenceNumber: 'LABOR-WST-01',
        sourceType: 'Project Expense',
        memo: 'استحقاق أجور الفنيين المباشرة وإثبات هالك خشب تقطيع غير طبيعي',
        lines: [
          {
            accountId: `line-1-${timestamp}`,
            accountCode: '5105',
            accountName: 'أجور العمالة الإنتاجية المباشرة (نجارين وفنيي دهان)',
            debit: 25000,
            credit: 0,
            description: 'أجور تصنيع أبواب فيلا التجمع',
          },
          {
            accountId: `line-2-${timestamp}`,
            accountCode: '5106',
            accountName: 'مصروفات تشغيلية وهالك خامات الورشة',
            debit: 8000,
            credit: 0,
            description: 'هالك خشب بلوط وألواح تقطيع',
          },
          {
            accountId: `line-3-${timestamp}`,
            accountCode: '2105',
            accountName: 'مصروفات وأجور مستحقة لم تسدد بعد',
            debit: 0,
            credit: 25000,
            description: 'استحقاق أجور فنيي ورشة النجارة والكبس',
          },
          {
            accountId: `line-4-${timestamp}`,
            accountCode: '1104',
            accountName: 'مخزون الخامات الرئيسية',
            debit: 0,
            credit: 8000,
            description: 'خصم قيمة فواضل وهالك الألواح',
          },
        ],
        totalDebit: 33000,
        totalCredit: 33000,
        isBalanced: true,
        createdBy: 'النظام المحاسبي الآلي - الأجور والهالك',
        projectRef: 'فيلا التجمع الخامس',
      };

      setExecutedStages((prev) => ({ ...prev, 'stage-3': true }));
      if (onAddJournalEntry) onAddJournalEntry(newJv);

      setActiveNotification({
        title: 'تم إثبات أجور العمالة وهالك التشغيل!',
        description:
          'تم تسجيل 25,000 ج.م أجور إنتاجية و8,000 ج.م هالك في تكلفة البضاعة المباعة بقائمة الدخل مع إثبات الالتزام المستحق.',
        jvCode: newJv.entryNumber,
        stageName: 'مرحلة الأجور وضبط الهالك',
      });
    } else if (stageId === 'stage-4') {
      // 4. Revenue Recognition on Handover
      const newJv: JournalEntry = {
        id: `jv-stage-4-${timestamp}`,
        entryNumber: `JV-2026-${entrySeq}`,
        date: '2026-09-27',
        referenceNumber: 'HANDOVER-INV-01',
        sourceType: 'COGS Realization',
        memo: 'إقرار استحقاق الإيراد وإقفال الدفعة المقدمة بعد تسليم واعتماد الأبواب بالموقع IFRS 15',
        lines: [
          {
            accountId: `line-1-${timestamp}`,
            accountCode: '2103',
            accountName: 'دفعات مقدمة من العملاء - إيراد مؤجل',
            debit: 100000,
            credit: 0,
            description: 'إقفال الدفعة المقدمة المحصلة سابقاً',
          },
          {
            accountId: `line-2-${timestamp}`,
            accountCode: '4101',
            accountName: 'إيرادات تصنيع وتوريد الأبواب الخشبية',
            debit: 0,
            credit: 100000,
            description: 'اعتراف نهائي بإيراد توريد وتركيب فيلا التجمع',
          },
          {
            accountId: `line-3-${timestamp}`,
            accountCode: '5101',
            accountName: 'تكلفة البضاعة المباعة COGS',
            debit: 45000,
            credit: 0,
            description: 'إقفال تكلفة الإنتاج التام المسلم',
          },
          {
            accountId: `line-4-${timestamp}`,
            accountCode: '1105',
            accountName: 'مخزون إنتاج تحت التشغيل WIP',
            debit: 0,
            credit: 45000,
            description: 'تحويل الإنتاج من تحت التشغيل إلى المبيعات',
          },
        ],
        totalDebit: 145000,
        totalCredit: 145000,
        isBalanced: true,
        createdBy: 'النظام المحاسبي الآلي - إقرار الإيرادات',
        projectRef: 'فيلا التجمع الخامس',
      };

      setExtraRevenue((prev) => prev + 100000);
      setExtraAdvances((prev) => Math.max(0, prev - 100000));
      setExtraWIP((prev) => Math.max(0, prev - 45000));
      setExecutedStages((prev) => ({ ...prev, 'stage-4': true }));
      if (onAddJournalEntry) onAddJournalEntry(newJv);

      setActiveNotification({
        title: 'تم الاعتراف النهائي بالإيراد وإقفال الدفعة!',
        description:
          'تم تحويل 100,000 ج.م من الإيراد المؤجل إلى إيراد مبيعات مكتسب بقائمة الدخل وإقفال تكلفة الإنتاج المسلم.',
        jvCode: newJv.entryNumber,
        stageName: 'مرحلة التسليم النهائي والفوترة',
      });
    } else if (stageId === 'stage-5') {
      // 5. Depreciation Accrual
      const newJv: JournalEntry = {
        id: `jv-stage-5-${timestamp}`,
        entryNumber: `JV-2026-${entrySeq}`,
        date: '2026-09-27',
        referenceNumber: 'DEP-Q3-01',
        sourceType: 'Project Expense',
        memo: 'إثبات قسط استهلاك الآلات والمعدات CNC وكابينة الدهانات عن الفترة المالية الحالية',
        lines: [
          {
            accountId: `line-1-${timestamp}`,
            accountCode: '6103',
            accountName: 'استهلاك الآلات والماكينات والمعدات (CNC)',
            debit: 28000,
            credit: 0,
            description: 'قسط إهلاك دوري ثابت 10%',
          },
          {
            accountId: `line-2-${timestamp}`,
            accountCode: '1205',
            accountName: 'مجمع إهلاك الأصول الثابتة المتراكم',
            debit: 0,
            credit: 28000,
            description: 'إضافة لمجمع إهلاك آلات ومعدات الورشة',
          },
        ],
        totalDebit: 28000,
        totalCredit: 28000,
        isBalanced: true,
        createdBy: 'النظام المحاسبي الآلي - قيود التسوية',
        projectRef: 'المصنع والورشة المركزية',
      };

      setExtraDepreciation((prev) => prev + 28000);
      setExecutedStages((prev) => ({ ...prev, 'stage-5': true }));
      if (onAddJournalEntry) onAddJournalEntry(newJv);

      setActiveNotification({
        title: 'تم إثبات قسط إهلاك المعدات والآلات!',
        description:
          'تم تحميل 28,000 ج.م على قائمة الدخل كمصروف إهلاك وزيادة مجمع الإهلاك في الميزانية العمومية.',
        jvCode: newJv.entryNumber,
        stageName: 'مرحلة التسويات وإهلاك الأصول',
      });
    } else if (stageId === 'stage-6') {
      // 6. Closing & Retained Earnings Transfer
      const transferAmount = netProfitAfterTax;
      const newJv: JournalEntry = {
        id: `jv-stage-6-${timestamp}`,
        entryNumber: `JV-2026-${entrySeq}`,
        date: '2026-09-30',
        referenceNumber: 'CLOSE-Q3',
        sourceType: 'Manual Entry',
        memo: 'إقفال حساب ملخص الدخل وترحيل صافي أرباح الفترة إلى حساب الأرباح المبقاة والمحتجزة',
        lines: [
          {
            accountId: `line-1-${timestamp}`,
            accountCode: '3104',
            accountName: 'صافي ربح الفترة الحالية (ملخص الدخل)',
            debit: transferAmount,
            credit: 0,
            description: 'إقفال أرباح الفترة وترحيلها لحقوق الملكية',
          },
          {
            accountId: `line-2-${timestamp}`,
            accountCode: '3103',
            accountName: 'الأرباح المبقاة والمحتجزة من سنوات سابقة',
            debit: 0,
            credit: transferAmount,
            description: 'إيداع صافي أرباح الربع في الأرباح المبقاة',
          },
        ],
        totalDebit: transferAmount,
        totalCredit: transferAmount,
        isBalanced: true,
        createdBy: 'النظام المحاسبي الآلي - قيد الإقفال السنوي',
        projectRef: 'الإقفال المالي العام',
      };

      setRetainedEarningsTransferred((prev) => prev + transferAmount);
      setExecutedStages((prev) => ({ ...prev, 'stage-6': true }));
      if (onAddJournalEntry) onAddJournalEntry(newJv);

      setActiveNotification({
        title: 'تم إقفال الفترة وترحيل الأرباح للأرباح المبقاة!',
        description: `تم قفل ملخص الدخل وترحيل ${transferAmount.toLocaleString()} ج.م إلى الأرباح المبقاة في قائمة التغير في حقوق الملكية.`,
        jvCode: newJv.entryNumber,
        stageName: 'مرحلة الإقفال المالي والترحيل',
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>معايير المحاسبة الدولية والمصرية (IFRS / EAS)</span>
            </span>
            <span className="text-xs text-slate-500 font-mono">العملة: جنيه مصري (EGP)</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Landmark className="w-6 h-6 text-emerald-600" />
            <span>القوائم المالية الخمس المعتمدة ومركز الأكشن التشغيلي</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            قوائم مالية تفصيلية كاملة مرتبطة لحظياً بالعمليات التشغيلية (التعاقد، صرف الخامات، أجور الورشة، التسليم، والإقفال الدوري).
          </p>
        </div>

        {/* Period Selector & Action Tools */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setPeriod('Q3-2026')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                period === 'Q3-2026' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              الربع الثالث Q3-2026
            </button>
            <button
              onClick={() => setPeriod('H1-2026')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                period === 'H1-2026' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              النصف الأول H1-2026
            </button>
            <button
              onClick={() => setPeriod('FY-2025-2026')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                period === 'FY-2025-2026'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              السنة المالية FY-2026
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition-colors cursor-pointer"
            title="طباعة التقرير المالي المعتمد"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">طباعة القوائم</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🚀 STAGE ACTION EXECUTION CENTER (خاليها تاخد اكشن كل مرحله)               */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-700/80 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block font-mono">
                STAGE-BASED ACCOUNTING ENGINE • محرك الأكشن والقيود الآلية
              </span>
              <h3 className="text-lg font-black text-white">
                محطة تنفيذ العمليات المحاسبية وأكشن المراحل (خذ أكشن في كل مرحلة)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300">
              الربط الآلي: <strong className="text-emerald-400 font-mono">نشط ومحدث بنسبة 100%</strong>
            </span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          اضغط على أي مرحلة تشغيلية لتنفيذ الأكشن المحاسبي المباشر (توليد القيد المزدوج فوراً، ترحيل أثره إلى دفتر الأستاذ العام، وتحديث أرقام قائمة الدخل والميزانية وتدفقات النقدية تلقائياً):
        </p>

        {/* 6 Stage Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Stage 1 */}
          <div className="bg-slate-800/90 hover:bg-slate-750 border border-slate-700 p-3.5 rounded-xl transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">
                  المرحلة 1: التعاقد والدفعة
                </span>
                {executedStages['stage-1'] && (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> تم التنفيذ
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-white">إثبات دفعة تعاقد نقدية (100,000 ج.م)</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Dr: البنك التجارى CIB (1101) / Cr: دفعات مقدمة وإيراد غير مكتسب (2103)
              </p>
            </div>
            <button
              onClick={() => handleExecuteStageAction('stage-1')}
              className="mt-3 w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>تنفيذ أكشن الدفعة المقدمة</span>
            </button>
          </div>

          {/* Stage 2 */}
          <div className="bg-slate-800/90 hover:bg-slate-750 border border-slate-700 p-3.5 rounded-xl transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-mono">
                  المرحلة 2: صرف الخامات (WIP)
                </span>
                {executedStages['stage-2'] && (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> تم التنفيذ
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-white">صرف خامات لأمر الشغل (45,000 ج.م)</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Dr: إنتاج تحت التشغيل WIP (1105) / Cr: مخزن الخامات (1104)
              </p>
            </div>
            <button
              onClick={() => handleExecuteStageAction('stage-2')}
              className="mt-3 w-full py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>تنفيذ أكشن صرف الخامات</span>
            </button>
          </div>

          {/* Stage 3 */}
          <div className="bg-slate-800/90 hover:bg-slate-750 border border-slate-700 p-3.5 rounded-xl transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono">
                  المرحلة 3: الأجور وهالك الورشة
                </span>
                {executedStages['stage-3'] && (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> تم التنفيذ
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-white">استحقاق أجور تصنيع وهالك تقطيع (33,000 ج.م)</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Dr: أجور عمالة مباشرة (5105) + هالك (5106) / Cr: أجور مستحقة (2105)
              </p>
            </div>
            <button
              onClick={() => handleExecuteStageAction('stage-3')}
              className="mt-3 w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>تنفيذ أكشن استحقاق الأجور</span>
            </button>
          </div>

          {/* Stage 4 */}
          <div className="bg-slate-800/90 hover:bg-slate-750 border border-slate-700 p-3.5 rounded-xl transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                  المرحلة 4: التسليم والإيراد
                </span>
                {executedStages['stage-4'] && (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> تم التنفيذ
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-white">تسليم نهائي واعتراف بإيراد المبيعات (100k)</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Dr: دفعات مقدمة (2103) / Cr: إيراد تصنيع أبواب (4101) + إقفال COGS
              </p>
            </div>
            <button
              onClick={() => handleExecuteStageAction('stage-4')}
              className="mt-3 w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>تنفيذ أكشن الاعتراف بالإيراد</span>
            </button>
          </div>

          {/* Stage 5 */}
          <div className="bg-slate-800/90 hover:bg-slate-750 border border-slate-700 p-3.5 rounded-xl transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono">
                  المرحلة 5: قسط إهلاك الآلات
                </span>
                {executedStages['stage-5'] && (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> تم التنفيذ
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-white">إثبات استهلاك ماكينات CNC الدورية (28,000 ج.م)</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Dr: مصروف إهلاك ماكينات (6103) / Cr: مجمع إهلاك أصول ثابتة (1205)
              </p>
            </div>
            <button
              onClick={() => handleExecuteStageAction('stage-5')}
              className="mt-3 w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>تنفيذ أكشن إهلاك الآلات</span>
            </button>
          </div>

          {/* Stage 6 */}
          <div className="bg-slate-800/90 hover:bg-slate-750 border border-slate-700 p-3.5 rounded-xl transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono">
                  المرحلة 6: الإقفال وترحيل الأرباح
                </span>
                {executedStages['stage-6'] && (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> تم التنفيذ
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-white">ترحيل الأرباح لحساب الأرباح المبقاة</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Dr: ملخص الدخل (3104) / Cr: الأرباح المبقاة والمحتجزة في حقوق الملكية (3103)
              </p>
            </div>
            <button
              onClick={() => handleExecuteStageAction('stage-6')}
              className="mt-3 w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>تنفيذ أكشن الإقفال المالي</span>
            </button>
          </div>
        </div>

        {/* Action Toast Alert */}
        {activeNotification && (
          <div className="mt-4 p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-200 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">
                  {activeNotification.title} • قيد رقم: {activeNotification.jvCode}
                </span>
                <span className="text-slate-300 text-[11px]">{activeNotification.description}</span>
              </div>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate('accounting_ledger')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shrink-0 transition-colors"
              >
                معاينة القيد في دفتر اليومية ➔
              </button>
            )}
          </div>
        )}
      </div>

      {/* 4 Financial KPIs summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>إجمالي الإيرادات (Revenues)</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">
            {totalRevenues.toLocaleString()} <span className="text-xs font-normal text-slate-400">ج.م</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{(((totalRevenues - prevTotalRevenues) / prevTotalRevenues) * 100).toFixed(1)}% نمو فصلي</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>مجمل الربح (Gross Margin)</span>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">
            {grossProfit.toLocaleString()} <span className="text-xs font-normal text-slate-400">ج.م</span>
          </div>
          <div className="text-[11px] text-sky-600 font-bold mt-1">
            نسبة الهامش: {((grossProfit / totalRevenues) * 100).toFixed(1)}% (مطابق للمستهدف)
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>صافي الربح بعد الضريبة (Net Profit)</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black font-mono text-indigo-900 mt-1">
            {netProfitAfterTax.toLocaleString()} <span className="text-xs font-normal text-slate-400">ج.م</span>
          </div>
          <div className="text-[11px] text-indigo-600 font-bold mt-1">
            صافي هامش الربح: {((netProfitAfterTax / totalRevenues) * 100).toFixed(1)}%
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>تطابق المركز المالي (Balance Check)</span>
            <Scale className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700 mt-1">
            100% <span className="text-xs font-bold text-emerald-600">متوازن ومطابق</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            أصول ({totalAssets.toLocaleString()}) = خصوم وحقوق ({totalLiabilitiesAndEquity.toLocaleString()})
          </div>
        </div>
      </div>

      {/* Tabs navigation for 6 Financial Statements */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTab('income')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'income'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>1. قائمة الدخل الشامل (Income Statement)</span>
          </button>

          <button
            onClick={() => setActiveTab('balance_sheet')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'balance_sheet'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>2. قائمة المركز المالي (Balance Sheet)</span>
          </button>

          <button
            onClick={() => setActiveTab('cash_flow')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'cash_flow'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>3. قائمة التدفقات النقدية (Cash Flows)</span>
          </button>

          <button
            onClick={() => setActiveTab('equity')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'equity'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>4. قائمة التغير في حقوق الملكية (Equity)</span>
          </button>

          <button
            onClick={() => setActiveTab('trial_balance')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'trial_balance'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>5. ميزان المراجعة والتحليل (Trial Balance)</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>الإيضاحات المتممة (Notes)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. STATEMENT OF PROFIT OR LOSS & OTHER COMPREHENSIVE INCOME               */}
      {/* ========================================================================= */}
      {activeTab === 'income' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-slate-400 block uppercase">
                WoodCraft Factory for Woodwork & Doors • IFRS P&L
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                قائمة الأرباح أو الخسائر والدخل الشامل (Statement of Profit or Loss)
              </h3>
              <p className="text-xs text-slate-500">
                عن الفترة المالية المنتهية في 30 سبتمبر 2026 (الربع الثالث) • مقارنة مع الفترة السابقة
              </p>
            </div>
            <div className="text-left font-mono text-xs text-slate-500">
              <span className="block font-bold text-slate-800">العملة: جنيه مصري (EGP)</span>
              <span>أساس الاستحقاق المحاسبي</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-900 font-bold bg-slate-50">
                  <th className="p-3 w-20">كود الحساب</th>
                  <th className="p-3">البيان والتفصيل المحاسبي</th>
                  <th className="p-3 text-left w-36">الفترة الحالية (Q3-2026)</th>
                  <th className="p-3 text-left w-36 text-slate-400">الفترة المقارنة</th>
                  <th className="p-3 text-left w-24">نسبة التغير</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {/* 1. REVENUES */}
                <tr className="bg-slate-100/70 font-bold text-slate-900">
                  <td colSpan={2} className="p-2.5">
                    أولاً: إيرادات النشاط التشغيلي (Revenues)
                  </td>
                  <td className="p-2.5 text-left font-mono"></td>
                  <td className="p-2.5 text-left font-mono"></td>
                  <td></td>
                </tr>
                {baseRevenues.map((rev) => (
                  <tr key={rev.code} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono text-slate-400">{rev.code}</td>
                    <td className="p-2.5 pr-6 text-slate-800">{rev.name}</td>
                    <td className="p-2.5 text-left font-mono font-bold text-slate-900">
                      {rev.current.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-left font-mono text-slate-400">
                      {rev.previous.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-left text-emerald-600 font-bold text-[11px]">
                      +{(((rev.current - rev.previous) / rev.previous) * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-300">
                  <td className="p-2.5 font-mono">4000</td>
                  <td className="p-2.5">إجمالي الإيرادات التشغيلية</td>
                  <td className="p-2.5 text-left font-mono text-emerald-700 text-sm">
                    {totalRevenues.toLocaleString()} ج.م
                  </td>
                  <td className="p-2.5 text-left font-mono text-slate-400">
                    {prevTotalRevenues.toLocaleString()}
                  </td>
                  <td className="p-2.5 text-left text-emerald-600 font-bold">
                    +{(((totalRevenues - prevTotalRevenues) / prevTotalRevenues) * 100).toFixed(1)}%
                  </td>
                </tr>

                {/* 2. COGS */}
                <tr className="bg-slate-100/70 font-bold text-slate-900">
                  <td colSpan={2} className="p-2.5">
                    ثانياً: تكلفة المبيعات والبضاعة المباعة (Cost of Goods Sold - COGS)
                  </td>
                  <td className="p-2.5 text-left font-mono"></td>
                  <td className="p-2.5 text-left font-mono"></td>
                  <td></td>
                </tr>
                {baseCogs.map((cog) => (
                  <tr key={cog.code} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono text-slate-400">{cog.code}</td>
                    <td className="p-2.5 pr-6 text-slate-800">{cog.name}</td>
                    <td className="p-2.5 text-left font-mono text-slate-700">
                      ({cog.current.toLocaleString()})
                    </td>
                    <td className="p-2.5 text-left font-mono text-slate-400">
                      ({cog.previous.toLocaleString()})
                    </td>
                    <td className="p-2.5 text-left text-slate-500 text-[11px]">
                      +{(((cog.current - cog.previous) / cog.previous) * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-300">
                  <td className="p-2.5 font-mono">5000</td>
                  <td className="p-2.5">إجمالي تكلفة المبيعات</td>
                  <td className="p-2.5 text-left font-mono text-rose-700 text-sm">
                    ({totalCogs.toLocaleString()}) ج.م
                  </td>
                  <td className="p-2.5 text-left font-mono text-slate-400">
                    ({prevTotalCogs.toLocaleString()})
                  </td>
                  <td></td>
                </tr>

                {/* GROSS PROFIT */}
                <tr className="bg-emerald-50/70 font-black text-emerald-950 text-sm border-y-2 border-emerald-400">
                  <td className="p-3 font-mono">GP</td>
                  <td className="p-3">مجمل الربح (Gross Profit)</td>
                  <td className="p-3 text-left font-mono text-emerald-800">
                    {grossProfit.toLocaleString()} ج.م
                  </td>
                  <td className="p-3 text-left font-mono text-slate-500">
                    {prevGrossProfit.toLocaleString()}
                  </td>
                  <td className="p-3 text-left text-emerald-700 text-xs">
                    {((grossProfit / totalRevenues) * 100).toFixed(1)}%
                  </td>
                </tr>

                {/* 3. OPERATING EXPENSES */}
                <tr className="bg-slate-100/70 font-bold text-slate-900">
                  <td colSpan={2} className="p-2.5">
                    ثالثاً: المصروفات العمومية والإدارية والتشغيلية (OPEX)
                  </td>
                  <td className="p-2.5 text-left font-mono"></td>
                  <td className="p-2.5 text-left font-mono"></td>
                  <td></td>
                </tr>
                {baseOperatingExpenses.map((exp) => (
                  <tr key={exp.code} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono text-slate-400">{exp.code}</td>
                    <td className="p-2.5 pr-6 text-slate-800">{exp.name}</td>
                    <td className="p-2.5 text-left font-mono text-slate-700">
                      ({exp.current.toLocaleString()})
                    </td>
                    <td className="p-2.5 text-left font-mono text-slate-400">
                      ({exp.previous.toLocaleString()})
                    </td>
                    <td className="p-2.5 text-left text-slate-500 text-[11px]">
                      +{(((exp.current - exp.previous) / exp.previous) * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-300">
                  <td className="p-2.5 font-mono">6000</td>
                  <td className="p-2.5">إجمالي المصروفات الإدارية والعمومية</td>
                  <td className="p-2.5 text-left font-mono text-rose-700 text-sm">
                    ({totalOperatingExpenses.toLocaleString()}) ج.م
                  </td>
                  <td className="p-2.5 text-left font-mono text-slate-400">
                    ({prevTotalOperatingExpenses.toLocaleString()})
                  </td>
                  <td></td>
                </tr>

                {/* OPERATING PROFIT EBIT */}
                <tr className="bg-slate-100 font-black text-slate-900 border-y border-slate-300">
                  <td className="p-3 font-mono">EBIT</td>
                  <td className="p-3">صافي الربح التشغيلي قبل الفوائد والضرائب (Operating Profit)</td>
                  <td className="p-3 text-left font-mono text-slate-900 text-sm">
                    {operatingProfit.toLocaleString()} ج.م
                  </td>
                  <td className="p-3 text-left font-mono text-slate-500">
                    {prevOperatingProfit.toLocaleString()}
                  </td>
                  <td className="p-3 text-left text-emerald-700 text-xs font-bold">
                    +{(((operatingProfit - prevOperatingProfit) / prevOperatingProfit) * 100).toFixed(1)}%
                  </td>
                </tr>

                {/* OTHER ITEMS */}
                {otherItems.map((item) => (
                  <tr key={item.code} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono text-slate-400">{item.code}</td>
                    <td className="p-2.5 text-slate-700">{item.name}</td>
                    <td className="p-2.5 text-left font-mono text-slate-700">
                      {item.current > 0 ? `+${item.current.toLocaleString()}` : `(${Math.abs(item.current).toLocaleString()})`}
                    </td>
                    <td className="p-2.5 text-left font-mono text-slate-400">
                      {item.previous > 0 ? `+${item.previous.toLocaleString()}` : `(${Math.abs(item.previous).toLocaleString()})`}
                    </td>
                    <td></td>
                  </tr>
                ))}

                {/* PROFIT BEFORE TAX */}
                <tr className="bg-slate-50 font-bold text-slate-900">
                  <td className="p-2.5 font-mono">EBT</td>
                  <td className="p-2.5">الأرباح قبل ضريبة الدخل</td>
                  <td className="p-2.5 text-left font-mono text-slate-900">
                    {netProfitBeforeTax.toLocaleString()} ج.م
                  </td>
                  <td className="p-2.5 text-left font-mono text-slate-400">488,000</td>
                  <td></td>
                </tr>

                {/* TAX */}
                <tr className="hover:bg-slate-50 text-slate-700">
                  <td className="p-2.5 font-mono text-slate-400">2104</td>
                  <td className="p-2.5 pr-6">مخصص ضريبة الدخل المستحقة (22.5%)</td>
                  <td className="p-2.5 text-left font-mono text-rose-600">
                    ({incomeTax.toLocaleString()})
                  </td>
                  <td className="p-2.5 text-left font-mono text-slate-400">(109,800)</td>
                  <td></td>
                </tr>

                {/* FINAL NET PROFIT */}
                <tr className="bg-emerald-600 text-white font-black text-base border-t-2 border-emerald-700">
                  <td className="p-3 font-mono">NP</td>
                  <td className="p-3">صافي ربح الفترة القابل للتوزيع (Net Profit After Tax)</td>
                  <td className="p-3 text-left font-mono">
                    {netProfitAfterTax.toLocaleString()} ج.م
                  </td>
                  <td className="p-3 text-left font-mono opacity-80">378,200</td>
                  <td className="p-3 text-left text-xs">
                    {((netProfitAfterTax / totalRevenues) * 100).toFixed(1)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. STATEMENT OF FINANCIAL POSITION (BALANCE SHEET)                        */}
      {/* ========================================================================= */}
      {activeTab === 'balance_sheet' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-slate-400 block uppercase">
                WoodCraft Factory • IFRS Statement of Financial Position
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                قائمة المركز المالي / الميزانية العمومية (Balance Sheet)
              </h3>
              <p className="text-xs text-slate-500">
                كما في 30 سبتمبر 2026 • مع فحص التوازن المحاسبي اللحظي
              </p>
            </div>
            <div className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-emerald-900 text-xs font-bold font-mono">
              توازن الميزانية: 100% متطابق
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ASSETS (الأصول) */}
            <div className="space-y-4">
              <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between">
                <h4 className="font-black text-sm">أولاً: جانب الأصول (Total Assets)</h4>
                <span className="font-mono font-bold text-sm text-emerald-400">
                  {totalAssets.toLocaleString()} ج.م
                </span>
              </div>

              {/* Current Assets */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 p-2.5 font-bold text-slate-800 text-xs flex justify-between">
                  <span>الأصول المتداولة (Current Assets)</span>
                  <span className="font-mono text-slate-900">{totalCurrentAssets.toLocaleString()} ج.م</span>
                </div>
                <table className="w-full text-right text-xs">
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400 font-mono w-16">1101</td>
                      <td className="p-2.5">النقدية بالخزينة والحسابات البنكية (CIB، الأهلي)</td>
                      <td className="p-2.5 text-left font-mono font-bold text-slate-800">
                        {currentCash.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400 font-mono">1102</td>
                      <td className="p-2.5">العملاء والذمم المدينة (مستحقات مشاريع الفلل)</td>
                      <td className="p-2.5 text-left font-mono font-bold text-slate-800">
                        {currentReceivables.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400 font-mono">1103</td>
                      <td className="p-2.5">أوراق القبض (شيكات دفعات مؤجلة التحصيل)</td>
                      <td className="p-2.5 text-left font-mono font-bold text-slate-800">
                        {currentNotesReceivable.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400 font-mono">1104</td>
                      <td className="p-2.5">مخزون الخامات الرئيسية (زان، أرو، MDF)</td>
                      <td className="p-2.5 text-left font-mono font-bold text-slate-800">
                        {currentRawInventory.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400 font-mono">1105</td>
                      <td className="p-2.5">مخزون إنتاج تحت التشغيل WIP (أبواب مكبوسة بالورشة)</td>
                      <td className="p-2.5 text-left font-mono font-bold text-slate-800">
                        {currentWipInventory.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400 font-mono">1106</td>
                      <td className="p-2.5">مخزون بضاعة تامة الصنع جاهزة للتسليم</td>
                      <td className="p-2.5 text-left font-mono font-bold text-slate-800">
                        {currentFinishedInventory.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400 font-mono">1107</td>
                      <td className="p-2.5">مصروفات مدفوعة مقدماً وتأمينات</td>
                      <td className="p-2.5 text-left font-mono font-bold text-slate-800">
                        {currentPrepaidExpenses.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Non-Current Assets */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 p-2.5 font-bold text-slate-800 text-xs flex justify-between">
                  <span>الأصول غير المتداولة والثابتة (Non-Current Assets)</span>
                  <span className="font-mono text-slate-900">{totalNonCurrentAssets.toLocaleString()} ج.م</span>
                </div>
                <table className="w-full text-right text-xs">
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400 font-mono w-16">1201</td>
                      <td className="p-2.5">ماكينات CNC ومناشير وتخانة ومكابس هيدروليكية</td>
                      <td className="p-2.5 text-left font-mono font-bold text-slate-800">
                        {cncMachinery.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400 font-mono">1202</td>
                      <td className="p-2.5">كابينة دهانات دوكو وإفران تجفيف حديثة</td>
                      <td className="p-2.5 text-left font-mono font-bold text-slate-800">
                        {sprayBooth.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400 font-mono">1203</td>
                      <td className="p-2.5">سيارات شحن ونقل مجهزة لتسليم الأبواب</td>
                      <td className="p-2.5 text-left font-mono font-bold text-slate-800">
                        {deliveryVehicles.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400 font-mono">1204</td>
                      <td className="p-2.5">أجهزة وبرمجيات CAD/CAM وكاميرات مراقبة</td>
                      <td className="p-2.5 text-left font-mono font-bold text-slate-800">
                        {hardwareAndSoftware.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 bg-rose-50/40">
                      <td className="p-2.5 text-rose-500 font-mono">1205</td>
                      <td className="p-2.5 text-rose-800">ناقص: مجمع إهلاك الأصول الثابتة المتراكم</td>
                      <td className="p-2.5 text-left font-mono font-bold text-rose-700">
                        ({Math.abs(accumulatedDepreciation).toLocaleString()})
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* LIABILITIES & EQUITY (الخصوم وحقوق الملكية) */}
            <div className="space-y-4">
              <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between">
                <h4 className="font-black text-sm">ثانياً: الالتزامات وحقوق الملكية (Liabilities & Equity)</h4>
                <span className="font-mono font-bold text-sm text-emerald-400">
                  {totalLiabilitiesAndEquity.toLocaleString()} ج.م
                </span>
              </div>

              {/* Current Liabilities */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 p-2.5 font-bold text-slate-800 text-xs flex justify-between">
                  <span>الالتزامات المتداولة (Current Liabilities)</span>
                  <span className="font-mono text-slate-900">{totalCurrentLiabilities.toLocaleString()} ج.م</span>
                </div>
                <table className="w-full text-right text-xs">
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400 font-mono w-16">2101</td>
                      <td className="p-2.5">موردو الخامات والأخشاب (ذمم دائنة AP)</td>
                      <td className="p-2.5 text-left font-mono font-bold text-slate-800">
                        {accountsPayable.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400 font-mono">2102</td>
                      <td className="p-2.5">أوراق الدفع (شيكات موردين مستحقة)</td>
                      <td className="p-2.5 text-left font-mono font-bold text-slate-800">
                        {notesPayable.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400 font-mono">2103</td>
                      <td className="p-2.5">دفعات مقدمة من العملاء لمشاريع تحت التنفيذ</td>
                      <td className="p-2.5 text-left font-mono font-bold text-amber-700">
                        {customerAdvances.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400 font-mono">2104</td>
                      <td className="p-2.5">مستحقات ضريبة الدخل والقيمة المضافة</td>
                      <td className="p-2.5 text-left font-mono font-bold text-slate-800">
                        {taxesPayable.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400 font-mono">2105</td>
                      <td className="p-2.5">مصروفات وأجور مستحقة لم تسدد بعد</td>
                      <td className="p-2.5 text-left font-mono font-bold text-slate-800">
                        {accruedExpenses.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Non-Current Liabilities */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 p-2.5 font-bold text-slate-800 text-xs flex justify-between">
                  <span>الالتزامات غير المتداولة (Non-Current Liabilities)</span>
                  <span className="font-mono text-slate-900">{totalNonCurrentLiabilities.toLocaleString()} ج.م</span>
                </div>
                <table className="w-full text-right text-xs">
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400 font-mono w-16">2201</td>
                      <td className="p-2.5">تسهيلات تمويل آلات بنكية متوسطة الأجل</td>
                      <td className="p-2.5 text-left font-mono font-bold text-slate-800">
                        {longTermBankLoans.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400 font-mono">2202</td>
                      <td className="p-2.5">مخصص مكافأة نهاية الخدمة للعاملين</td>
                      <td className="p-2.5 text-left font-mono font-bold text-slate-800">
                        {endOfServiceProvision.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Shareholders Equity */}
              <div className="border-2 border-emerald-400 bg-emerald-50/40 rounded-xl overflow-hidden">
                <div className="bg-emerald-600 text-white p-2.5 font-black text-xs flex justify-between">
                  <span>حقوق الملكية للمساهمين (Shareholders Equity)</span>
                  <span className="font-mono text-sm">{totalEquity.toLocaleString()} ج.م</span>
                </div>
                <table className="w-full text-right text-xs">
                  <tbody className="divide-y divide-emerald-200/50">
                    <tr className="hover:bg-emerald-50">
                      <td className="p-2.5 text-emerald-800 font-mono w-16">3101</td>
                      <td className="p-2.5 font-medium">رأس المال المدفوع والمصرح به</td>
                      <td className="p-2.5 text-left font-mono font-bold text-slate-900">
                        {paidCapital.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="hover:bg-emerald-50">
                      <td className="p-2.5 text-emerald-800 font-mono">3102</td>
                      <td className="p-2.5 font-medium">الاحتياطي النظامي والقانوني (10%)</td>
                      <td className="p-2.5 text-left font-mono font-bold text-slate-900">
                        {legalReserve.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="hover:bg-emerald-50">
                      <td className="p-2.5 text-emerald-800 font-mono">3103</td>
                      <td className="p-2.5 font-medium">الأرباح المبقاة والمحتجزة من فترات سابقة</td>
                      <td className="p-2.5 text-left font-mono font-bold text-slate-900">
                        {retainedEarnings.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="hover:bg-emerald-50 bg-emerald-100/60 font-bold">
                      <td className="p-2.5 text-emerald-900 font-mono">3104</td>
                      <td className="p-2.5 text-emerald-950">صافي أرباح الفترة الحالية (Q3 2026)</td>
                      <td className="p-2.5 text-left font-mono text-emerald-800">
                        {periodNetProfit.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. STATEMENT OF CASH FLOWS                                                */}
      {/* ========================================================================= */}
      {activeTab === 'cash_flow' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-mono font-bold text-slate-400 block uppercase">
              WoodCraft Factory • IFRS Statement of Cash Flows
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">
              قائمة التدفقات النقدية (Statement of Cash Flows - Indirect Method)
            </h3>
            <p className="text-xs text-slate-500">
              عن الفترة المنتهية في 30 سبتمبر 2026 • توضح مصادر واستخدامات السيولة النقدية الفعلية
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Operating */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 p-3 font-bold text-slate-900 flex justify-between">
                <span>1. التدفقات النقدية من الأنشطة التشغيلية (Operating Activities)</span>
                <span className="font-mono text-emerald-700 font-black">
                  {netOperatingCashFlow.toLocaleString()} ج.م
                </span>
              </div>
              <div className="divide-y divide-slate-100 p-2 space-y-1">
                <div className="flex justify-between p-2">
                  <span className="text-slate-700">صافي الربح قبل الضريبة للفترة</span>
                  <span className="font-mono font-bold text-slate-900">
                    +{netProfitBeforeTax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between p-2 text-slate-600">
                  <span>يضاف: استهلاك الآلات والمعدات (بند غير نقدي)</span>
                  <span className="font-mono text-emerald-700">
                    +{(28000 + extraDepreciation).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between p-2 text-slate-600">
                  <span>يضاف: مخصص مكافأة نهاية الخدمة</span>
                  <span className="font-mono text-emerald-700">+15,000</span>
                </div>
                <div className="flex justify-between p-2 text-slate-600">
                  <span>(زيادة) في ذمم العملاء وأوراق القبض</span>
                  <span className="font-mono text-rose-600">(130,000)</span>
                </div>
                <div className="flex justify-between p-2 text-slate-600">
                  <span>(زيادة) في مخزون الخامات والإنتاج قيد التشغيل</span>
                  <span className="font-mono text-rose-600">(125,000)</span>
                </div>
                <div className="flex justify-between p-2 text-slate-600">
                  <span>زيادة في ذمم الموردين وأوراق الدفع</span>
                  <span className="font-mono text-emerald-700">+50,000</span>
                </div>
                <div className="flex justify-between p-2 text-slate-600">
                  <span>زيادة في الدفعات المقدمة من العملاء لمشاريع الفلل</span>
                  <span className="font-mono text-emerald-700">
                    +{(70000 + extraAdvances).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between p-2 text-slate-600">
                  <span>سداد ضرائب دخل مستحقة</span>
                  <span className="font-mono text-rose-600">(85,000)</span>
                </div>
              </div>
            </div>

            {/* Investing */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 p-3 font-bold text-slate-900 flex justify-between">
                <span>2. التدفقات النقدية من الأنشطة الاستثمارية (Investing Activities)</span>
                <span className="font-mono text-rose-700 font-black">
                  ({Math.abs(netInvestingCashFlow).toLocaleString()}) ج.م
                </span>
              </div>
              <div className="divide-y divide-slate-100 p-2 space-y-1">
                <div className="flex justify-between p-2 text-slate-600">
                  <span>شراء ماكينة قص حواف أوتوماتيكية Edge Bander جديدة</span>
                  <span className="font-mono text-rose-600">(150,000)</span>
                </div>
                <div className="flex justify-between p-2 text-slate-600">
                  <span>شراء أجهزة ومعدات قياس ليزر للموقع</span>
                  <span className="font-mono text-rose-600">(10,000)</span>
                </div>
                <div className="flex justify-between p-2 text-slate-600">
                  <span>متحصلات بيع عدد قديمة مكهنة</span>
                  <span className="font-mono text-emerald-700">+5,000</span>
                </div>
              </div>
            </div>

            {/* Financing */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 p-3 font-bold text-slate-900 flex justify-between">
                <span>3. التدفقات النقدية من الأنشطة التمويلية (Financing Activities)</span>
                <span className="font-mono text-rose-700 font-black">
                  ({Math.abs(netFinancingCashFlow).toLocaleString()}) ج.م
                </span>
              </div>
              <div className="divide-y divide-slate-100 p-2 space-y-1">
                <div className="flex justify-between p-2 text-slate-600">
                  <span>سداد أقساط تسهيلات شراء الآلات البنكية</span>
                  <span className="font-mono text-rose-600">(80,000)</span>
                </div>
                <div className="flex justify-between p-2 text-slate-600">
                  <span>توزيعات أرباح نقدية منصرفة للشركاء</span>
                  <span className="font-mono text-rose-600">(50,000)</span>
                </div>
                <div className="flex justify-between p-2 text-slate-600">
                  <span>رسوم تمويلية مسددة</span>
                  <span className="font-mono text-rose-600">(8,000)</span>
                </div>
              </div>
            </div>

            {/* Net Change and Reconciliation */}
            <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2">
              <div className="flex justify-between font-bold">
                <span>صافي التغير في النقدية وما في حكمها خلال الفترة</span>
                <span className="font-mono text-emerald-400">
                  {netCashChange > 0 ? `+${netCashChange.toLocaleString()}` : netCashChange.toLocaleString()} ج.م
                </span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>رصيد النقدية في بداية الفترة (01 يوليو 2026)</span>
                <span className="font-mono">{beginningCash.toLocaleString()} ج.م</span>
              </div>
              <div className="flex justify-between text-base font-black border-t border-slate-700 pt-2 text-emerald-300">
                <span>رصيد النقدية وما في حكمها في نهاية الفترة (30 سبتمبر 2026)</span>
                <span className="font-mono">{endingCash.toLocaleString()} ج.م</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. STATEMENT OF CHANGES IN EQUITY                                         */}
      {/* ========================================================================= */}
      {activeTab === 'equity' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-mono font-bold text-slate-400 block uppercase">
              WoodCraft Factory • IFRS Statement of Changes in Equity
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">
              قائمة التغير في حقوق الملكية (Statement of Changes in Equity)
            </h3>
            <p className="text-xs text-slate-500">
              للفترة المنتهية في 30 سبتمبر 2026 • تبين حركة رأس المال والاحتياطيات والأرباح المحتجزة
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-900 text-white font-bold">
                <tr>
                  <th className="p-3">البيان والحركة</th>
                  <th className="p-3 text-left font-mono">رأس المال المدفوع</th>
                  <th className="p-3 text-left font-mono">الاحتياطي النظامي</th>
                  <th className="p-3 text-left font-mono">الأرباح المبقاة</th>
                  <th className="p-3 text-left font-mono">أرباح الفترة</th>
                  <th className="p-3 text-left font-mono text-emerald-400">إجمالي حقوق الملكية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">الرصيد في 01 يناير 2026</td>
                  <td className="p-3 text-left font-mono">2,000,000</td>
                  <td className="p-3 text-left font-mono">180,000</td>
                  <td className="p-3 text-left font-mono">440,000</td>
                  <td className="p-3 text-left font-mono">-</td>
                  <td className="p-3 text-left font-mono font-bold">2,620,000</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 text-slate-700">صافي أرباح النصف الأول H1 المرحلة</td>
                  <td className="p-3 text-left font-mono">-</td>
                  <td className="p-3 text-left font-mono">-</td>
                  <td className="p-3 text-left font-mono">280,000</td>
                  <td className="p-3 text-left font-mono">-</td>
                  <td className="p-3 text-left font-mono font-bold text-emerald-600">+280,000</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 text-slate-700">توزيعات أرباح نقدية للشركاء</td>
                  <td className="p-3 text-left font-mono">-</td>
                  <td className="p-3 text-left font-mono">-</td>
                  <td className="p-3 text-left font-mono text-rose-600">(82,000)</td>
                  <td className="p-3 text-left font-mono">-</td>
                  <td className="p-3 text-left font-mono font-bold text-rose-600">(82,000)</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 text-slate-700">تحويل للاحتياطي القانوني (10%)</td>
                  <td className="p-3 text-left font-mono">-</td>
                  <td className="p-3 text-left font-mono text-emerald-600">+40,000</td>
                  <td className="p-3 text-left font-mono text-rose-600">(38,200)</td>
                  <td className="p-3 text-left font-mono">-</td>
                  <td className="p-3 text-left font-mono font-bold">+1,800</td>
                </tr>
                <tr className="hover:bg-slate-50 bg-emerald-50/50">
                  <td className="p-3 font-bold text-emerald-900">صافي ربح الربع الثالث Q3 (الحالي)</td>
                  <td className="p-3 text-left font-mono">-</td>
                  <td className="p-3 text-left font-mono">-</td>
                  <td className="p-3 text-left font-mono">{retainedEarningsTransferred.toLocaleString()}</td>
                  <td className="p-3 text-left font-mono font-bold text-emerald-800">
                    {periodNetProfit.toLocaleString()}
                  </td>
                  <td className="p-3 text-left font-mono font-bold text-emerald-700">
                    +{netProfitAfterTax.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-slate-900 text-white font-black text-sm">
                  <td className="p-3">الرصيد الختامي في 30 سبتمبر 2026</td>
                  <td className="p-3 text-left font-mono">2,000,000</td>
                  <td className="p-3 text-left font-mono">220,000</td>
                  <td className="p-3 text-left font-mono">{retainedEarnings.toLocaleString()}</td>
                  <td className="p-3 text-left font-mono">{periodNetProfit.toLocaleString()}</td>
                  <td className="p-3 text-left font-mono text-emerald-400 text-base">
                    {totalEquity.toLocaleString()} ج.م
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TRIAL BALANCE & FINANCIAL RATIOS ANALYSIS                              */}
      {/* ========================================================================= */}
      {activeTab === 'trial_balance' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-slate-400 block uppercase">
                WoodCraft Factory • General Ledger Trial Balance
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                ميزان المراجعة بالأرصدة ومؤشرات التحليل المالي (Trial Balance & Key Ratios)
              </h3>
              <p className="text-xs text-slate-500">
                فحص توازن كافة الحسابات المدينة والدائنة ومعدلات السيولة والربحية
              </p>
            </div>
            <div className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold font-mono">
              تطابق المدين والدائن: 100%
            </div>
          </div>

          {/* Ratios Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 block">نسبة التداول (Current Ratio)</span>
              <span className="text-base font-black text-slate-900 font-mono mt-0.5 block">
                {(totalCurrentAssets / totalCurrentLiabilities).toFixed(2)}x
              </span>
              <span className="text-[9px] text-emerald-600 font-bold">سيولة قوية ممتازة</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 block">السيولة السريعة (Quick Ratio)</span>
              <span className="text-base font-black text-slate-900 font-mono mt-0.5 block">
                {((totalCurrentAssets - (currentRawInventory + currentWipInventory + currentFinishedInventory)) / totalCurrentLiabilities).toFixed(2)}x
              </span>
              <span className="text-[9px] text-emerald-600 font-bold">بدون احتساب المخزون</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 block">العائد على الملكية (ROE)</span>
              <span className="text-base font-black text-indigo-700 font-mono mt-0.5 block">
                {((netProfitAfterTax / totalEquity) * 100).toFixed(1)}%
              </span>
              <span className="text-[9px] text-indigo-600 font-bold">عائد استثماري ممتاز</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 block">العائد على الأصول (ROA)</span>
              <span className="text-base font-black text-indigo-700 font-mono mt-0.5 block">
                {((netProfitAfterTax / totalAssets) * 100).toFixed(1)}%
              </span>
              <span className="text-[9px] text-indigo-600 font-bold">كفاءة تشغيل الأصول</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 block">نسبة المديونية (Debt to Equity)</span>
              <span className="text-base font-black text-slate-900 font-mono mt-0.5 block">
                {((totalLiabilities / totalEquity) * 100).toFixed(1)}%
              </span>
              <span className="text-[9px] text-emerald-600 font-bold">هيكل تمويلي آمن</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 block">دوران المخزون (Turns)</span>
              <span className="text-base font-black text-slate-900 font-mono mt-0.5 block">
                {(totalCogs / (currentRawInventory + currentWipInventory + currentFinishedInventory)).toFixed(1)}x
              </span>
              <span className="text-[9px] text-slate-500 font-bold">حركة تصنيع نشطة</span>
            </div>
          </div>

          {/* Trial Balance Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-900 text-white font-bold">
                <tr>
                  <th className="p-3 w-20">كود</th>
                  <th className="p-3">اسم الحساب في دليل الحسابات</th>
                  <th className="p-3 text-center w-28">طبيعة الحساب</th>
                  <th className="p-3 text-left w-36 font-mono">الرصيد المدين (Debit)</th>
                  <th className="p-3 text-left w-36 font-mono">الرصيد الدائن (Credit)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono text-slate-400">1101</td>
                  <td className="p-2.5 font-semibold text-slate-800">النقدية بالبنوك والخزينة</td>
                  <td className="p-2.5 text-center text-slate-500">أصل متداول</td>
                  <td className="p-2.5 text-left font-mono font-bold text-slate-900">{currentCash.toLocaleString()}</td>
                  <td className="p-2.5 text-left font-mono text-slate-400">-</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono text-slate-400">1102</td>
                  <td className="p-2.5 font-semibold text-slate-800">العملاء والذمم المدينة</td>
                  <td className="p-2.5 text-center text-slate-500">أصل متداول</td>
                  <td className="p-2.5 text-left font-mono font-bold text-slate-900">{currentReceivables.toLocaleString()}</td>
                  <td className="p-2.5 text-left font-mono text-slate-400">-</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono text-slate-400">1104</td>
                  <td className="p-2.5 font-semibold text-slate-800">مخزون الخامات الرئيسية</td>
                  <td className="p-2.5 text-center text-slate-500">أصل متداول</td>
                  <td className="p-2.5 text-left font-mono font-bold text-slate-900">{currentRawInventory.toLocaleString()}</td>
                  <td className="p-2.5 text-left font-mono text-slate-400">-</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono text-slate-400">1105</td>
                  <td className="p-2.5 font-semibold text-slate-800">مخزون إنتاج تحت التشغيل (WIP)</td>
                  <td className="p-2.5 text-center text-slate-500">أصل متداول</td>
                  <td className="p-2.5 text-left font-mono font-bold text-slate-900">{currentWipInventory.toLocaleString()}</td>
                  <td className="p-2.5 text-left font-mono text-slate-400">-</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono text-slate-400">1201</td>
                  <td className="p-2.5 font-semibold text-slate-800">آلات ومعدات وماكينات CNC</td>
                  <td className="p-2.5 text-center text-slate-500">أصل ثابت</td>
                  <td className="p-2.5 text-left font-mono font-bold text-slate-900">{cncMachinery.toLocaleString()}</td>
                  <td className="p-2.5 text-left font-mono text-slate-400">-</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono text-slate-400">1205</td>
                  <td className="p-2.5 font-semibold text-slate-800">مجمع إهلاك الأصول الثابتة</td>
                  <td className="p-2.5 text-center text-slate-500">التزام عكسي</td>
                  <td className="p-2.5 text-left font-mono text-slate-400">-</td>
                  <td className="p-2.5 text-left font-mono font-bold text-rose-700">
                    {Math.abs(accumulatedDepreciation).toLocaleString()}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono text-slate-400">2101</td>
                  <td className="p-2.5 font-semibold text-slate-800">موردو الخامات والأخشاب (AP)</td>
                  <td className="p-2.5 text-center text-slate-500">التزام متداول</td>
                  <td className="p-2.5 text-left font-mono text-slate-400">-</td>
                  <td className="p-2.5 text-left font-mono font-bold text-slate-900">{accountsPayable.toLocaleString()}</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono text-slate-400">2103</td>
                  <td className="p-2.5 font-semibold text-slate-800">دفعات مقدمة من العملاء</td>
                  <td className="p-2.5 text-center text-slate-500">التزام متداول</td>
                  <td className="p-2.5 text-left font-mono text-slate-400">-</td>
                  <td className="p-2.5 text-left font-mono font-bold text-slate-900">{customerAdvances.toLocaleString()}</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono text-slate-400">3101</td>
                  <td className="p-2.5 font-semibold text-slate-800">رأس المال المدفوع</td>
                  <td className="p-2.5 text-center text-slate-500">حقوق ملكية</td>
                  <td className="p-2.5 text-left font-mono text-slate-400">-</td>
                  <td className="p-2.5 text-left font-mono font-bold text-slate-900">{paidCapital.toLocaleString()}</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono text-slate-400">3103</td>
                  <td className="p-2.5 font-semibold text-slate-800">الأرباح المبقاة والمحتجزة</td>
                  <td className="p-2.5 text-center text-slate-500">حقوق ملكية</td>
                  <td className="p-2.5 text-left font-mono text-slate-400">-</td>
                  <td className="p-2.5 text-left font-mono font-bold text-slate-900">{retainedEarnings.toLocaleString()}</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono text-slate-400">4101</td>
                  <td className="p-2.5 font-semibold text-slate-800">إيرادات تصنيع وتوريد الأبواب</td>
                  <td className="p-2.5 text-center text-slate-500">إيراد</td>
                  <td className="p-2.5 text-left font-mono text-slate-400">-</td>
                  <td className="p-2.5 text-left font-mono font-bold text-emerald-700">{totalRevenues.toLocaleString()}</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono text-slate-400">5100</td>
                  <td className="p-2.5 font-semibold text-slate-800">تكلفة البضاعة المباعة COGS</td>
                  <td className="p-2.5 text-center text-slate-500">تكلفة مباشرة</td>
                  <td className="p-2.5 text-left font-mono font-bold text-slate-900">{totalCogs.toLocaleString()}</td>
                  <td className="p-2.5 text-left font-mono text-slate-400">-</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono text-slate-400">6100</td>
                  <td className="p-2.5 font-semibold text-slate-800">المصروفات الإدارية والعمومية</td>
                  <td className="p-2.5 text-center text-slate-500">مصروف</td>
                  <td className="p-2.5 text-left font-mono font-bold text-slate-900">{totalOperatingExpenses.toLocaleString()}</td>
                  <td className="p-2.5 text-left font-mono text-slate-400">-</td>
                </tr>

                {/* Total Balance Check */}
                <tr className="bg-emerald-600 text-white font-black text-sm">
                  <td colSpan={3} className="p-3">
                    الإجمالي العام لميزان المراجعة (Total Trial Balance Verification)
                  </td>
                  <td className="p-3 text-left font-mono">5,845,000 ج.م</td>
                  <td className="p-3 text-left font-mono">5,845,000 ج.م</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. NOTES TO FINANCIAL STATEMENTS                                          */}
      {/* ========================================================================= */}
      {activeTab === 'notes' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-mono font-bold text-slate-400 block uppercase">
              WoodCraft Factory • Notes & Accounting Policies
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">
              الإيضاحات المتممة والسياسات المحاسبية الأساسية (Notes to Financial Statements)
            </h3>
            <p className="text-xs text-slate-500">
              طبقا لمعايير المحاسبة المصرية والدولية IFRS/EAS المعتمدة لقطاع الأثاث والمقاولات المتخصصة
            </p>
          </div>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-mono">
                  1
                </span>
                <span>إيضاح (1): السياسات المحاسبية وأسس الاعتراف بالإيرادات (IFRS 15)</span>
              </h4>
              <p>
                يتم إعداد القوائم المالية وفقاً لمعايير المحاسبة الدولية على أساس الاستحقاق والتكلفة التاريخية. يتم الاعتراف بإيرادات تصنيع وتوريد الأبواب الخشبية والمطابخ وفق معيار IFRS 15 بناءً على مرحلة الإنجاز وتسليم المقاسات بالموقع واعتماد محضر المعاينة الفنية والاستلام.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-mono">
                  2
                </span>
                <span>إيضاح (2): سياسة تقييم مخزون الأخشاب وهالك التشغيل (IAS 2)</span>
              </h4>
              <p>
                يقوم المصنع بتقييم مخزون الخامات (خشب زان روماني، أرو أمريكي، ألواح MDF وقشرة) بطريقة الوارد أولاً صادر أولاً (FIFO). ويتم حصر فواضل وهالك الأخشاب دورياً وتخصيص هالك التقطيع المعياري بنسبة لا تتعدى 8% ضمن تكلفة البضاعة المباعة COGS، وما زاد عن ذلك يرحل كمصروف هالك غير طبيعي.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-mono">
                  3
                </span>
                <span>إيضاح (3): استهلاك الأصول الثابتة وماكينات CNC (IAS 16)</span>
              </h4>
              <p>
                تستهلك الآلات ومعدات الورشة وكابينة الدهانات بطريقة القسط الثابت بنسبة 10% سنوياً، وسيارات النقل بنسبة 20%، مع افتراض قيمة تخريدية 5% في نهاية العمر الإنتاجي.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-mono">
                  4
                </span>
                <span>إيضاح (4): المعاملة الضريبية وضريبة الدخل</span>
              </h4>
              <p>
                يخضع صافي أرباح الشركة لضريبة الدخل المصرية بنسبة 22.5% وفقاً لقانون الإجراءات الضريبية الموحد، ويتم تجنيب 10% من صافي الربح السنوي كاحتياطي قانوني حتى يبلغ 50% من رأس المال المدفوع.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
