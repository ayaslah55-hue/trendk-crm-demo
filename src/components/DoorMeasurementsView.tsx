import React, { useState } from 'react';
import { DoorMeasurement, Customer, SiteInspectionReport, SiteInspectionItem } from '../types';
import {
  Ruler,
  FileText,
  Image,
  Upload,
  CheckCircle2,
  Plus,
  Compass,
  FileSpreadsheet,
  Layers,
  Search,
  CheckCheck,
  Building,
  Printer,
  Calculator,
  ClipboardList,
  AlertTriangle,
  HardHat,
  Eye,
  Trash2,
  Save,
  Check,
  Sparkles,
  Info,
  Calendar,
  User,
  Phone,
  MapPin,
} from 'lucide-react';

interface DoorMeasurementsViewProps {
  measurements: DoorMeasurement[];
  customers?: Customer[];
  onAddDoorMeasurement?: (door: DoorMeasurement) => void;
  onUpdateStatus?: (id: string, status: DoorMeasurement['status']) => void;
  onNavigate?: (view: any) => void;
}

type TabType = 'inspection_form' | 'door_schedule' | 'clearance_calculator';

export const DoorMeasurementsView: React.FC<DoorMeasurementsViewProps> = ({
  measurements,
  customers = [],
  onAddDoorMeasurement,
  onUpdateStatus,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('inspection_form');
  const [selectedDoor, setSelectedDoor] = useState<DoorMeasurement>(measurements[0] || {
    id: 'dm-default',
    doorCode: 'D-01',
    location: 'غرفة النوم الرئيسية',
    widthCm: 90,
    heightCm: 220,
    wallThicknessCm: 15,
    openingDirection: 'يمين',
    jambType: 'سويد مصمت ملبس قشرة أرو طبيعي',
    architrave: 'برور زان عريضة 10 سم ملبسة قشرة',
    leafType: 'كبس حراري قشاط زان حشو فونتكس ألماني',
    finishColor: 'دهان بولي يوريثان أرو طبيعي',
    hardware: 'مفصلات استانلس مخفية + كالون صامت + مقبض نحاسي',
    quantity: 1,
    unitPrice: 6500,
    status: 'معتمد للتصنيع',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDirection, setFilterDirection] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  // Default initial inspection report data
  const [inspectionData, setInspectionData] = useState<SiteInspectionReport>({
    id: 'insp-2026-088',
    reportNumber: 'INS-2026-088',
    date: '2026-09-27',
    time: '11:30 ص',
    inspectorName: 'م. حسام الدين عبد الرحمن',
    inspectorPhone: '01098877661',
    customerId: customers[0]?.id || 'cust-001',
    customerName: customers[0]?.name || 'أحمد محمد الشناوي',
    projectName: customers[0]?.projectTitle || 'فيلا التجمع الخامس - قطاع النرجس 42',
    projectAddress: 'القاهرة الجديدة، التجمع الخامس، حي النرجس، فيلا 42',
    siteEngineerName: 'م. طارق الاستشاري',
    siteEngineerPhone: '01223344550',
    benchMarkStatus: 'determined_laser',
    flooringType: 'porcelain_installed',
    flooringClearanceMm: 15,
    plasterStatus: 'plumb_90_square',
    wallLintelType: 'concrete_lintel',
    wallMoisturePercent: 5.5,
    subFrameRequired: false,
    generalNotes:
      'تم فحص الشرب المعماري بالليزر على منسوب +1.00م من الفنش النهائي. فتحات الأبواب مطابقة للشاقول، سمك الحوائط يتراوح بين 12 إلى 15 سم. يوصى باستخدام فوم بولي يوريثان كثافة عالية وتثبيت 6 كانات مجلفنة لكل حلق.',
    recommendations: [
      'تثبيت الحلوق بعد الانتهاء من وش السيراميك الثاني وبياض الحوائط الأخير.',
      'ترك خلوص 15 مم أسفل الضلفة لسماح حركة الهواء والتكييف.',
      'استخدام حلوق زان روماني عريضة 15 سم لغرف النوم، وحلق زفر معالج ضد الرطوبة للحمامات.',
    ],
    inspectorSignature: true,
    clientSignature: true,
    status: 'approved_for_production',
    doors: [
      {
        id: 'insp-d-1',
        doorCode: 'D-01',
        location: 'غرفة النوم الرئيسية (Master Bed)',
        masonryWidthCm: 94,
        masonryHeightCm: 223,
        wallThicknessCm: 15,
        direction: 'يمين',
        jambType: 'زان طبيعي 2 بوصة مع حلق زفر',
        leafType: 'MDF 18 مم قشرة بلوط أمريكي',
        woodType: 'أرو طبيعي وقشاط زان',
        finishColor: 'Walnut 07 مط إيطالي',
        hardware: 'كالون كمبيوتر يال + 3 مفصلات هيدروليك',
        notes: 'الفتحة مستوية تماماً مع السيراميك.',
      },
      {
        id: 'insp-d-2',
        doorCode: 'D-02',
        location: 'غرفة الأطفال والضيوف',
        masonryWidthCm: 94,
        masonryHeightCm: 223,
        wallThicknessCm: 14,
        direction: 'يسار',
        jambType: 'سويد مصمت ملبس قشرة بلوط',
        leafType: 'حشو فونتكس ألماني عازل للصوت',
        woodType: 'سويد وقشرة أرو',
        finishColor: 'Walnut 07 مط إيطالي',
        hardware: 'كالون كمبيوتر يال + مقبض نحاسي أسود',
        notes: 'عتب خرساني علوي سليم.',
      },
      {
        id: 'insp-d-3',
        doorCode: 'D-03',
        location: 'حمام الماستر الداخلي',
        masonryWidthCm: 84,
        masonryHeightCm: 223,
        wallThicknessCm: 12,
        direction: 'يمين',
        jambType: 'خشب معالج مقاوم للرطوبة WPC/زان',
        leafType: 'HDF أخضر مضاد للمياه والحرارة',
        woodType: 'HDF مقاوم رطوبة',
        finishColor: 'دهان بولي يوريثان أبيض مط مقاوم للماء',
        hardware: 'كالون حمام مع مفتاح طوارئ خارجي',
        notes: 'الوزرة السيراميك منتهية ومنسوب البلاط مضبوط.',
      },
      {
        id: 'insp-d-4',
        doorCode: 'D-04',
        location: 'مطبخ الفيلا الرئيسي',
        masonryWidthCm: 104,
        masonryHeightCm: 223,
        wallThicknessCm: 15,
        direction: 'سحاب',
        jambType: 'حلق مخفي مع مجرى سحاب ألماني Hafele',
        leafType: 'ضلفة زجاج مثلج مع قواطع خشب أرو',
        woodType: 'أرو ماسيف مع زجاج أمان 8 مم',
        finishColor: 'Walnut 07 مط إيطالي',
        hardware: 'مجرى سحاب مخفي هافيلي 120 كجم',
        notes: 'تجهيز مسار الباب السحاب داخل التجويف الجداري.',
      },
    ],
  });

  // New Door input states for Modal & Quick add
  const [newDoorCode, setNewDoorCode] = useState(`D-0${measurements.length + 1}`);
  const [newDoorLocation, setNewDoorLocation] = useState('غرفة إضافية / جناح');
  const [newDoorWidth, setNewDoorWidth] = useState(90);
  const [newDoorHeight, setNewDoorHeight] = useState(220);
  const [newDoorWallThickness, setNewDoorWallThickness] = useState(15);
  const [newDoorDirection, setNewDoorDirection] = useState<'يمين' | 'يسار' | 'سحاب' | 'مزدوج'>('يمين');
  const [newDoorFinish, setNewDoorFinish] = useState('دهان بولي يوريثان أرو طبيعي');

  // Engineering Calculator State
  const [calcMasonryWidth, setCalcMasonryWidth] = useState<number>(94);
  const [calcMasonryHeight, setCalcMasonryHeight] = useState<number>(223);
  const [calcJambThickness, setCalcJambThickness] = useState<number>(4.5); // سم سمك الحلق
  const [calcFoamGap, setCalcFoamGap] = useState<number>(1.5); // سم خلوص الفوم من كل جانب
  const [calcFloorClearance, setCalcFloorClearance] = useState<number>(1.5); // سم خلوص السيراميك
  const [calcRebateDepth, setCalcRebateDepth] = useState<number>(1.5); // سم عمق المفحار

  // Calculator outputs
  const calcFrameOuterWidth = calcMasonryWidth - calcFoamGap * 2;
  const calcFrameOuterHeight = calcMasonryHeight - calcFoamGap;
  const calcClearPassWidth = calcFrameOuterWidth - calcJambThickness * 2;
  const calcLeafWidth = calcClearPassWidth + calcRebateDepth * 2 - 0.4; // 4 مم خلوص الدوران
  const calcLeafHeight = calcFrameOuterHeight - calcJambThickness - calcFloorClearance;

  // Filtered doors in schedule
  const filteredDoors = measurements.filter((door) => {
    const matchesSearch =
      door.doorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      door.location.includes(searchTerm) ||
      door.finishColor.includes(searchTerm);
    const matchesDirection = filterDirection === 'all' || door.openingDirection === filterDirection;
    return matchesSearch && matchesDirection;
  });

  // Add door to inspection form list
  const handleAddDoorToInspection = () => {
    const newItem: SiteInspectionItem = {
      id: `insp-d-${Date.now()}`,
      doorCode: `D-${(inspectionData.doors.length + 1).toString().padStart(2, '0')}`,
      location: 'فراغ إضافي جديد',
      masonryWidthCm: 94,
      masonryHeightCm: 223,
      wallThicknessCm: 15,
      direction: 'يمين',
      jambType: 'زان طبيعي 2 بوصة مع برور 10 سم',
      leafType: 'كبس حراري قشرة بلوط طبيعي',
      woodType: 'أرو طبيعي وزان',
      finishColor: 'Walnut 07 مط',
      hardware: 'كالون يال + 3 مفصلات هيدروليك',
      notes: 'تم أخذ الشرب الميداني بالليزر.',
    };
    setInspectionData((prev) => ({
      ...prev,
      doors: [...prev.doors, newItem],
    }));
  };

  const handleRemoveDoorFromInspection = (id: string) => {
    setInspectionData((prev) => ({
      ...prev,
      doors: prev.doors.filter((d) => d.id !== id),
    }));
  };

  const handleUpdateInspectionDoor = (id: string, field: keyof SiteInspectionItem, val: any) => {
    setInspectionData((prev) => ({
      ...prev,
      doors: prev.doors.map((d) => (d.id === id ? { ...d, [field]: val } : d)),
    }));
  };

  // Convert Inspection Doors to Official Production Door Schedule
  const handleApproveAndSyncDoors = () => {
    inspectionData.doors.forEach((inspDoor) => {
      // Calculate door leaf width/height
      const widthCm = Math.round(inspDoor.masonryWidthCm - 4); // Deduct foam and jamb
      const heightCm = Math.round(inspDoor.masonryHeightCm - 3);

      const officialDoor: DoorMeasurement = {
        id: `door-sync-${inspDoor.id}`,
        doorCode: inspDoor.doorCode,
        location: inspDoor.location,
        widthCm: widthCm > 0 ? widthCm : 90,
        heightCm: heightCm > 0 ? heightCm : 220,
        wallThicknessCm: inspDoor.wallThicknessCm,
        openingDirection: inspDoor.direction,
        jambType: inspDoor.jambType,
        architrave: 'برور زان 10 سم مشطوفة ملبسة قشرة',
        leafType: inspDoor.leafType,
        finishColor: inspDoor.finishColor,
        hardware: inspDoor.hardware,
        quantity: 1,
        unitPrice: 7200,
        status: 'معتمد للتصنيع',
        notes: `مأخوذة من تقرير المعاينة ${inspectionData.reportNumber}. ${inspDoor.notes || ''}`,
      };

      if (onAddDoorMeasurement) {
        onAddDoorMeasurement(officialDoor);
      }
    });

    setSavedSuccessMsg(
      `تم اعتماد محضر المعاينة ${inspectionData.reportNumber} وترحيل ${inspectionData.doors.length} باب إلى خطة التصنيع بنجاح!`
    );
    setTimeout(() => setSavedSuccessMsg(null), 5000);
  };

  const handlePrintInspectionForm = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200 flex items-center gap-1">
              <HardHat className="w-3.5 h-3.5 text-sky-700" />
              <span>الهندسة الميدانية والمعاينات الفنية</span>
            </span>
            <span className="text-xs text-slate-500 font-mono">
              تقرير رقم: {inspectionData.reportNumber} • {inspectionData.projectName}
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Ruler className="w-6 h-6 text-sky-600" />
            <span>استمارة تقرير المعاينة الفنية وجدول مقاسات الأبواب</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            توثيق كامل للفتحات الإنشائية، مناسيب الشرب، سمك الحوائط، اتجاهات الفتح، واحتساب أبعاد الحلق والضلفة الصافية للتصنيع المباشر.
          </p>
        </div>

        {/* Global Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('inspection_form')}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'inspection_form'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>استمارة المعاينة والمقاسات</span>
            </button>

            <button
              onClick={() => setActiveTab('door_schedule')}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'door_schedule'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>جدول الأبواب والمطابقة ({measurements.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('clearance_calculator')}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'clearance_calculator'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>حاسبة الخلوص والضلفة</span>
            </button>
          </div>

          <button
            onClick={handlePrintInspectionForm}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition-colors cursor-pointer"
            title="طباعة نموذج المعاينة والمقاسات المعتمد"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">طباعة الاستمارة</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {savedSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center justify-between text-xs sm:text-sm font-semibold animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{savedSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActiveTab('door_schedule')}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer"
          >
            عرض جدول الأبواب ➔
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: FORM FOR SITE INSPECTION & MEASUREMENTS (Requested Form)           */}
      {/* ========================================================================= */}
      {activeTab === 'inspection_form' && (
        <div className="space-y-6">
          {/* Main Inspection Form Dossier Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Form Top Title Bar */}
            <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center font-black text-xl shadow-xs">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded font-mono font-bold">
                      FORM NO: {inspectionData.reportNumber}
                    </span>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      معتمد ميدانياً
                    </span>
                  </div>
                  <h3 className="text-xl font-black mt-1">
                    محضر المعاينة الفنية الميدانية ورفع المقاسات (Site Inspection Form)
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleApproveAndSyncDoors}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>اعتماد المعاينة وتوليد الأبواب للتصنيع</span>
                </button>
              </div>
            </div>

            {/* Form Body: 3 Structured Sections */}
            <div className="p-6 space-y-6">
              {/* Section 1: Project & Client Identification Grid */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Building className="w-4 h-4 text-sky-600" />
                  <span>1. بيانات المشروع والعميل والموقع الميداني (Project & Location Info)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {/* Customer / Project Selector */}
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">اسم العميل / المشروع:</label>
                    <select
                      value={inspectionData.customerName}
                      onChange={(e) => {
                        const cust = customers.find((c) => c.name === e.target.value);
                        setInspectionData((prev) => ({
                          ...prev,
                          customerName: e.target.value,
                          projectName: cust?.projectTitle || prev.projectName,
                          projectAddress: cust?.address || cust?.location || prev.projectAddress,
                        }));
                      }}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    >
                      {customers.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.projectTitle})
                        </option>
                      ))}
                      {!customers.length && (
                        <option value="أحمد محمد الشناوي">أحمد محمد الشناوي (فيلا التجمع الخامس)</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">تاريخ المعاينة:</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="date"
                        value={inspectionData.date}
                        onChange={(e) => setInspectionData({ ...inspectionData, date: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-medium focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">مهندس المعاينة المشرف:</label>
                    <input
                      type="text"
                      value={inspectionData.inspectorName}
                      onChange={(e) => setInspectionData({ ...inspectionData, inspectorName: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">هاتف المهندس المعاين:</label>
                    <input
                      type="text"
                      value={inspectionData.inspectorPhone}
                      onChange={(e) => setInspectionData({ ...inspectionData, inspectorPhone: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-bold mb-1">عنوان الموقع الدقيق:</label>
                    <input
                      type="text"
                      value={inspectionData.projectAddress}
                      onChange={(e) => setInspectionData({ ...inspectionData, projectAddress: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">استشاري المشروع / المقاول:</label>
                    <input
                      type="text"
                      value={inspectionData.siteEngineerName}
                      onChange={(e) => setInspectionData({ ...inspectionData, siteEngineerName: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">هاتف مسؤول الموقع:</label>
                    <input
                      type="text"
                      value={inspectionData.siteEngineerPhone}
                      onChange={(e) => setInspectionData({ ...inspectionData, siteEngineerPhone: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Architectural & Site Readiness Assessment Checklist */}
              <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-200/80 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-600" />
                  <span>2. تقييم الجاهزية الإنشائية والمعمارية للموقع (Site Readiness & Civil Conditions)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  {/* Bench Mark Status */}
                  <div className="bg-white p-3 rounded-lg border border-amber-200">
                    <label className="block font-bold text-slate-800 mb-1">منسوب الشرب المعماري (Bench Mark):</label>
                    <select
                      value={inspectionData.benchMarkStatus}
                      onChange={(e: any) => setInspectionData({ ...inspectionData, benchMarkStatus: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md font-medium text-slate-800 focus:outline-hidden"
                    >
                      <option value="determined_laser">محدد بالليزر بدقة على +1.00 م (معتمد)</option>
                      <option value="rough_approx">تقريبي يتطلب مراجعة مع السيراميك</option>
                      <option value="not_determined">غير محدد (الموقع عظم)</option>
                    </select>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      أساس احتساب ارتفاع الحلق من وش الأرضية
                    </span>
                  </div>

                  {/* Flooring Type */}
                  <div className="bg-white p-3 rounded-lg border border-amber-200">
                    <label className="block font-bold text-slate-800 mb-1">حالة ونوع تشطيب الأرضيات:</label>
                    <select
                      value={inspectionData.flooringType}
                      onChange={(e: any) => setInspectionData({ ...inspectionData, flooringType: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md font-medium text-slate-800 focus:outline-hidden"
                    >
                      <option value="porcelain_installed">بورسلين / سيراميك منتهي بالكامل</option>
                      <option value="ceramic_installed">سيراميك قائم مع وجود وزرات</option>
                      <option value="parquet">باركيه طبيعي / HDF (يتطلب خلوص 12 مم)</option>
                      <option value="marble">رخام طبيعي مع فواصل تمدد</option>
                      <option value="screed_unfinished">خرسانة لياسة (متبقي 4 سم فنش)</option>
                    </select>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      خلوص أسفل الضلفة: {inspectionData.flooringClearanceMm} مم
                    </span>
                  </div>

                  {/* Plaster Quality & Squareness */}
                  <div className="bg-white p-3 rounded-lg border border-amber-200">
                    <label className="block font-bold text-slate-800 mb-1">شاقولية وزوايا المحارة (Plaster):</label>
                    <select
                      value={inspectionData.plasterStatus}
                      onChange={(e: any) => setInspectionData({ ...inspectionData, plasterStatus: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md font-medium text-slate-800 focus:outline-hidden"
                    >
                      <option value="plumb_90_square">رأسية تامة 90° زوايا قائمة (ممتازة)</option>
                      <option value="minor_tilt_subframe_needed">ميول طفيف يتطلب حلق زفر وضبط خلوص</option>
                      <option value="uneven_rough">محارة غير مستوية تتطلب برور عريضة 12 سم</option>
                    </select>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      يحدد نوع الحلق والبرور المناسبة
                    </span>
                  </div>

                  {/* Lintel Type */}
                  <div className="bg-white p-3 rounded-lg border border-amber-200">
                    <label className="block font-bold text-slate-800 mb-1">نوع العتب العلوي للفتحات:</label>
                    <select
                      value={inspectionData.wallLintelType}
                      onChange={(e: any) => setInspectionData({ ...inspectionData, wallLintelType: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md font-medium text-slate-800 focus:outline-hidden"
                    >
                      <option value="concrete_lintel">عتب خرساني مسلح صلب (تثبيت مباشر)</option>
                      <option value="brick_arch">قوس طوب مفرغ (يتطلب كانات طويلة)</option>
                      <option value="steel_lintel">كمرة حديد زاوية (تثبيت مسامير صلب)</option>
                    </select>
                  </div>

                  {/* Wall Moisture */}
                  <div className="bg-white p-3 rounded-lg border border-amber-200">
                    <label className="block font-bold text-slate-800 mb-1">فحص رطوبة الجدران الرقمي:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        value={inspectionData.wallMoisturePercent}
                        onChange={(e) =>
                          setInspectionData({ ...inspectionData, wallMoisturePercent: Number(e.target.value) })
                        }
                        className="w-24 p-2 bg-slate-50 border border-slate-300 rounded-md font-mono font-bold text-slate-800 focus:outline-hidden"
                      />
                      <span className="text-slate-600 font-bold">%</span>
                      <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
                        {inspectionData.wallMoisturePercent < 8 ? 'جاف ومثالي للتركيب' : 'رطوبة مرتفعة'}
                      </span>
                    </div>
                  </div>

                  {/* Subframe requirement */}
                  <div className="bg-white p-3 rounded-lg border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">هل يتطلب حلق زفر (Sub-Frame)؟</span>
                      <span className="text-[10px] text-slate-500">حلق خشب زفر معالج قبل المحارة</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inspectionData.subFrameRequired}
                        onChange={(e) => setInspectionData({ ...inspectionData, subFrameRequired: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 3: Doors & Openings Schedule Table Inside Form */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-sky-600" />
                      <span>3. جدول تسجيل مقاسات الفتحات والمواصفات الميدانية ({inspectionData.doors.length} فتحة)</span>
                    </h4>
                    <p className="text-slate-500 text-xs mt-0.5">
                      يتم إدخال أبعاد الفتحة البنائية الصافية (Masonry Rough Opening) وتلقائياً يتم تجهيز خلوص الحلق والتصنيع.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddDoorToInspection}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ إضافة فتحة باب للاستمارة</span>
                  </button>
                </div>

                {/* Table of Openings */}
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3 w-16">الكود</th>
                        <th className="p-3 min-w-[140px]">المكان / الفراغ</th>
                        <th className="p-3 text-center min-w-[120px]">فتحة المباني (عرض×ارتفاع)</th>
                        <th className="p-3 text-center min-w-[100px]">سمك الحائط</th>
                        <th className="p-3 text-center min-w-[100px]">اتجاه الفتح</th>
                        <th className="p-3 min-w-[150px]">مواصفات الحلق والضلفة</th>
                        <th className="p-3 min-w-[130px]">اللون والدهان</th>
                        <th className="p-3 min-w-[140px]">الإكسسوار والكالون</th>
                        <th className="p-3 text-center w-12">حذف</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {inspectionData.doors.map((door, idx) => (
                        <tr key={door.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Code */}
                          <td className="p-2.5 font-mono font-bold text-amber-700">
                            <input
                              type="text"
                              value={door.doorCode}
                              onChange={(e) => handleUpdateInspectionDoor(door.id, 'doorCode', e.target.value)}
                              className="w-full p-1 bg-white border border-slate-300 rounded font-mono font-bold text-center"
                            />
                          </td>

                          {/* Location */}
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={door.location}
                              onChange={(e) => handleUpdateInspectionDoor(door.id, 'location', e.target.value)}
                              className="w-full p-1 bg-white border border-slate-300 rounded font-semibold text-slate-800"
                            />
                          </td>

                          {/* Masonry Width & Height */}
                          <td className="p-2.5">
                            <div className="flex items-center justify-center gap-1 font-mono">
                              <input
                                type="number"
                                value={door.masonryWidthCm}
                                onChange={(e) =>
                                  handleUpdateInspectionDoor(door.id, 'masonryWidthCm', Number(e.target.value))
                                }
                                className="w-14 p-1 bg-white border border-slate-300 rounded text-center font-bold"
                                title="عرض الفتحة بالمباني (سم)"
                              />
                              <span className="text-slate-400">×</span>
                              <input
                                type="number"
                                value={door.masonryHeightCm}
                                onChange={(e) =>
                                  handleUpdateInspectionDoor(door.id, 'masonryHeightCm', Number(e.target.value))
                                }
                                className="w-14 p-1 bg-white border border-slate-300 rounded text-center font-bold"
                                title="ارتفاع الفتحة بالمباني من الشرب (سم)"
                              />
                            </div>
                          </td>

                          {/* Wall Thickness */}
                          <td className="p-2.5 text-center">
                            <div className="inline-flex items-center gap-1 font-mono">
                              <input
                                type="number"
                                value={door.wallThicknessCm}
                                onChange={(e) =>
                                  handleUpdateInspectionDoor(door.id, 'wallThicknessCm', Number(e.target.value))
                                }
                                className="w-14 p-1 bg-white border border-slate-300 rounded text-center font-bold text-amber-700"
                              />
                              <span className="text-slate-400 text-[10px]">سم</span>
                            </div>
                          </td>

                          {/* Direction */}
                          <td className="p-2.5 text-center">
                            <select
                              value={door.direction}
                              onChange={(e: any) => handleUpdateInspectionDoor(door.id, 'direction', e.target.value)}
                              className="p-1 bg-white border border-slate-300 rounded text-xs text-slate-800 font-medium"
                            >
                              <option value="يمين">يمين</option>
                              <option value="يسار">يسار</option>
                              <option value="سحاب">سحاب</option>
                              <option value="مزدوج">مزدوج</option>
                            </select>
                          </td>

                          {/* Jamb & Leaf */}
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={door.jambType}
                              onChange={(e) => handleUpdateInspectionDoor(door.id, 'jambType', e.target.value)}
                              className="w-full p-1 bg-white border border-slate-300 rounded text-slate-700 text-[11px]"
                            />
                          </td>

                          {/* Finish Color */}
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={door.finishColor}
                              onChange={(e) => handleUpdateInspectionDoor(door.id, 'finishColor', e.target.value)}
                              className="w-full p-1 bg-white border border-slate-300 rounded text-slate-700 text-[11px]"
                            />
                          </td>

                          {/* Hardware */}
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={door.hardware}
                              onChange={(e) => handleUpdateInspectionDoor(door.id, 'hardware', e.target.value)}
                              className="w-full p-1 bg-white border border-slate-300 rounded text-slate-700 text-[11px]"
                            />
                          </td>

                          {/* Delete */}
                          <td className="p-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveDoorFromInspection(door.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                              title="حذف هذا الباب من الاستمارة"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 4: Engineering Recommendations & General Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-sky-600" />
                    <span>ملاحظات مهندس الموقع المعاين:</span>
                  </label>
                  <textarea
                    rows={3}
                    value={inspectionData.generalNotes}
                    onChange={(e) => setInspectionData({ ...inspectionData, generalNotes: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden"
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                    <span>توصيات التركيب وضبط الجودة (Installation Quality Checklist):</span>
                  </label>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    {inspectionData.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-1.5 bg-white p-2 rounded border border-slate-200">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 5: Official Approvals & Signatures Block */}
              <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center md:text-right">
                  <span className="text-xs text-sky-400 font-bold uppercase tracking-wider block">
                    اعتماد المحضر ومطابقة المقاسات الميدانية
                  </span>
                  <h5 className="text-base font-bold">
                    جاهز لإصدار أمر التشغيل وتوريد خامات الأخشاب والحلوق
                  </h5>
                  <p className="text-xs text-slate-300">
                    يعتبر هذا المحضر وثيقة هندسية ملزمة لمقاسات التصنيع، ولا يجوز تعديل أبعاد الفتحات بعد التوقيع.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {/* Inspector Signature Box */}
                  <div className="bg-slate-800/90 border border-slate-700 p-3 rounded-xl text-center min-w-[150px]">
                    <span className="text-[10px] text-slate-400 block mb-1">توقيع مهندس المعاينة:</span>
                    <span className="text-xs font-bold text-emerald-400 block font-mono">
                      ✓ {inspectionData.inspectorName}
                    </span>
                    <span className="text-[9px] text-slate-400">معتمد وموثق</span>
                  </div>

                  {/* Customer Signature Box */}
                  <div className="bg-slate-800/90 border border-slate-700 p-3 rounded-xl text-center min-w-[150px]">
                    <span className="text-[10px] text-slate-400 block mb-1">اعتماد العميل / الاستشاري:</span>
                    <span className="text-xs font-bold text-sky-400 block font-mono">
                      ✓ {inspectionData.customerName}
                    </span>
                    <span className="text-[9px] text-slate-400">موافق على المقاسات والاتجاهات</span>
                  </div>

                  {/* Action Sync Button */}
                  <button
                    type="button"
                    onClick={handleApproveAndSyncDoors}
                    className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>ترحيل الأبواب إلى جدول التصنيع ({inspectionData.doors.length})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DOOR SCHEDULE & INSPECTION DOSSIER (Existing schedule table)       */}
      {/* ========================================================================= */}
      {activeTab === 'door_schedule' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Doors Schedule Table (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Controls Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="بحث بالكود (D-01) أو الغرفة أو اللون..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-3 pr-9 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <select
                  value={filterDirection}
                  onChange={(e) => setFilterDirection(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-hidden"
                >
                  <option value="all">كل اتجاهات الفتح</option>
                  <option value="يمين">يمين</option>
                  <option value="يسار">يسار</option>
                  <option value="سحاب">سحاب</option>
                  <option value="مزدوج">مزدوج</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">{filteredDoors.length} باب معروض</span>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ إضافة باب</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">الكود</th>
                    <th className="p-3">المكان بالموقع</th>
                    <th className="p-3 text-center">المقاس الصافي (عرض×ارتفاع)</th>
                    <th className="p-3 text-center">سمك الحائط</th>
                    <th className="p-3 text-center">الفتح</th>
                    <th className="p-3">الحلق والضلفة</th>
                    <th className="p-3">اللون</th>
                    <th className="p-3 text-center">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredDoors.map((door) => {
                    const isSelected = selectedDoor?.id === door.id;
                    return (
                      <tr
                        key={door.id}
                        onClick={() => setSelectedDoor(door)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-sky-50/80 font-medium' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-3 font-mono font-bold text-amber-700">{door.doorCode}</td>
                        <td className="p-3 font-semibold text-slate-900">{door.location}</td>
                        <td className="p-3 text-center font-mono">
                          {door.widthCm} × {door.heightCm} سم
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-slate-700">
                          {door.wallThicknessCm} سم
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[11px] font-medium">
                            {door.openingDirection}
                          </span>
                        </td>
                        <td
                          className="p-3 max-w-[150px] truncate text-slate-600"
                          title={`${door.jambType} | ${door.leafType}`}
                        >
                          {door.leafType}
                        </td>
                        <td className="p-3 font-medium text-slate-700">{door.finishColor}</td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            {door.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Selected Door Engineering Dossier (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <div>
                  <span className="text-[11px] text-slate-500 font-mono block">بطاقة المواصفات الفنية التنفيذية</span>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-amber-600 font-mono font-black">{selectedDoor.doorCode}</span>
                    <span>- {selectedDoor.location}</span>
                  </h3>
                </div>
                <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-bold text-xs rounded-lg">
                  {selectedDoor.status}
                </span>
              </div>

              {/* Spec items list */}
              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">المقاسات الميدانية (Finished Dimensions):</span>
                  <div className="grid grid-cols-3 gap-2 mt-1 font-mono font-bold text-slate-800 text-center">
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <span className="text-[9px] text-slate-400 block">العرض</span>
                      <span>{selectedDoor.widthCm} سم</span>
                    </div>
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <span className="text-[9px] text-slate-400 block">الارتفاع</span>
                      <span>{selectedDoor.heightCm} سم</span>
                    </div>
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <span className="text-[9px] text-slate-400 block">سمك الحائط</span>
                      <span className="text-amber-700">{selectedDoor.wallThicknessCm} سم</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">نوع الحلق (Jamb / Frame):</span>
                  <span className="font-semibold text-slate-900 block mt-0.5">{selectedDoor.jambType}</span>
                  <span className="text-slate-500 block text-[10px] mt-1.5">البرور والزوايا:</span>
                  <span className="font-medium text-slate-800 block">{selectedDoor.architrave}</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">نوع الضلفة (Door Leaf):</span>
                  <span className="font-semibold text-slate-900 block mt-0.5">{selectedDoor.leafType}</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">اللون والدهان المعتمد (Finish):</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-4 h-4 rounded-full bg-amber-900 border border-amber-700" />
                    <span className="font-bold text-slate-900">{selectedDoor.finishColor}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">الإكسسوارات والكوالين (Hardware):</span>
                  <span className="text-slate-800 font-medium block mt-0.5 leading-relaxed">
                    {selectedDoor.hardware}
                  </span>
                </div>

                {/* Attachments and Drawings Box */}
                <div className="border-t border-slate-200 pt-3">
                  <span className="text-slate-700 font-bold block mb-2">المرفقات الهندسية وملفات الموقع:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 flex items-center gap-2 cursor-pointer transition-colors">
                      <FileText className="w-4 h-4 text-sky-600" />
                      <div>
                        <span className="font-bold text-[11px] block">Shop Drawing</span>
                        <span className="text-[9px] text-slate-500">PDF / AutoCAD</span>
                      </div>
                    </div>
                    <div className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 flex items-center gap-2 cursor-pointer transition-colors">
                      <Image className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-[11px] block">صورة الموقع</span>
                        <span className="text-[9px] text-slate-500">تم رفع الشرب</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer approval badge & navigation */}
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center gap-2.5">
                  <CheckCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="text-[11px]">
                    <span className="font-bold block">موافقة العميل والاستشاري معتمدة</span>
                    <span>تمت مراجعة اتجاه الفتح والسيراميك وجاهز لإصدار أمر التشغيل.</span>
                  </div>
                </div>

                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate('production')}
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <span>متابعة خط الإنتاج والتصنيع ➔</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CLEARANCE & FRAME CALCULATOR (Engineering Tools)                  */}
      {/* ========================================================================= */}
      {activeTab === 'clearance_calculator' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-sky-600" />
              <span>حاسبة الخلوصات الهندسية وأبعاد الحلق والضلفة (Clearance & Frame Calculator)</span>
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              أداة هندسية لحساب المقاسات الصافية لقص الألواح وتصنيع الحلق بناءً على أبعاد فتحة المباني والشرب الميداني.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Inputs */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs">
              <h4 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2">
                1. المدخلات الميدانية (Site Measurements Input)
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">عرض فتحة المباني (سم):</label>
                  <input
                    type="number"
                    value={calcMasonryWidth}
                    onChange={(e) => setCalcMasonryWidth(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900 text-center"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Masonry Opening Width</span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ارتفاع فتحة المباني (سم):</label>
                  <input
                    type="number"
                    value={calcMasonryHeight}
                    onChange={(e) => setCalcMasonryHeight(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900 text-center"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Height from Finished Floor</span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">سمك قطاع الحلق الخشب (سم):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={calcJambThickness}
                    onChange={(e) => setCalcJambThickness(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900 text-center"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">المعياري 4.5 إلى 5.0 سم (2 بوصة)</span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">خلوص فوم التركيب (سم):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={calcFoamGap}
                    onChange={(e) => setCalcFoamGap(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900 text-center"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">1.5 سم من كل جانب</span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">خلوص أسفل الضلفة / السيراميك (سم):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={calcFloorClearance}
                    onChange={(e) => setCalcFloorClearance(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900 text-center"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">1.0 إلى 1.5 سم لحركة السجاد والهواء</span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">عمق مفحار الحلق (سم):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={calcRebateDepth}
                    onChange={(e) => setCalcRebateDepth(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900 text-center"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Rebate Depth 1.5 سم</span>
                </div>
              </div>
            </div>

            {/* Right Outputs */}
            <div className="space-y-4 bg-sky-50/60 p-5 rounded-xl border border-sky-200 text-xs">
              <h4 className="font-bold text-sky-950 text-sm border-b border-sky-200 pb-2">
                2. نتائج الحساب الهندسية للتصنيع والقص (Calculated Production Specs)
              </h4>

              <div className="space-y-3 font-mono">
                {/* 1. Frame Outer */}
                <div className="bg-white p-3 rounded-lg border border-sky-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block text-xs font-sans">
                      مقاس الحلق الخارجي (Outer Frame Size):
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans">خصم خلوص الفوم من فتحة المباني</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-sky-800 block">
                      {calcFrameOuterWidth.toFixed(1)} × {calcFrameOuterHeight.toFixed(1)} سم
                    </span>
                  </div>
                </div>

                {/* 2. Clear Opening Pass */}
                <div className="bg-white p-3 rounded-lg border border-sky-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block text-xs font-sans">
                      فتحة المرور الصافية (Clear Pass Opening):
                    </span>
                    <span className="text-[10px] text-slate-500 font-sans">عرض الفراغ الصافي لمرور الأشخاص والأثاث</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-slate-800 block">
                      {calcClearPassWidth.toFixed(1)} سم
                    </span>
                  </div>
                </div>

                {/* 3. Door Leaf Final Dimensions */}
                <div className="bg-emerald-50 p-4 rounded-lg border-2 border-emerald-400 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="font-bold text-emerald-950 block text-sm font-sans">
                      مقاس ضلفة الباب للقص والكبس (Door Leaf Cutting Size):
                    </span>
                    <span className="text-[11px] text-emerald-700 font-sans">
                      المقاس الدقيق لتجهيز الخشب قبل الدهان (شاملاً قشاط الزان)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-800 block">
                      {calcLeafWidth.toFixed(1)} × {calcLeafHeight.toFixed(1)} سم
                    </span>
                    <span className="text-[10px] text-emerald-600 font-sans">سمك الضلفة: 4.5 سم</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-sky-200 text-slate-600 text-[11px] space-y-1 font-sans">
                <span className="font-bold text-slate-800 block">قاعدة التحقق الهندسي:</span>
                <p>
                  • عرض البرور الموصى به: لا يقل عن 8 سم لتغطية خلوص الفوم (1.5 سم) والمفحار مع ركوب 2 سم على المحارة.
                </p>
                <p>
                  • في حالة الحمامات: يُضاف عزل إيبوكسي شفاف أو كعب ستانلس أسفل الحلق بارتفاع 5 سم للحماية من مياه الغسيل.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Door Quick Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">إضافة مقاس باب ومطابقة ميدانية جديدة</h3>
            <p className="text-xs text-slate-500">
              تسجيل كود الباب والمقاسات بعد أخذ الشرب الميداني واعتماده للتصنيع.
            </p>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">كود الباب:</label>
                  <input
                    type="text"
                    value={newDoorCode}
                    onChange={(e) => setNewDoorCode(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المكان بالموقع:</label>
                  <input
                    type="text"
                    value={newDoorLocation}
                    onChange={(e) => setNewDoorLocation(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">العرض (سم):</label>
                  <input
                    type="number"
                    value={newDoorWidth}
                    onChange={(e) => setNewDoorWidth(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الارتفاع (سم):</label>
                  <input
                    type="number"
                    value={newDoorHeight}
                    onChange={(e) => setNewDoorHeight(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">سمك الحائط (سم):</label>
                  <input
                    type="number"
                    value={newDoorWallThickness}
                    onChange={(e) => setNewDoorWallThickness(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اتجاه الفتح:</label>
                  <select
                    value={newDoorDirection}
                    onChange={(e: any) => setNewDoorDirection(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  >
                    <option value="يمين">يمين</option>
                    <option value="يسار">يسار</option>
                    <option value="سحاب">سحاب</option>
                    <option value="مزدوج">مزدوج</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نوع الدهان:</label>
                  <input
                    type="text"
                    value={newDoorFinish}
                    onChange={(e) => setNewDoorFinish(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  const newDoor: DoorMeasurement = {
                    id: `dm-${Date.now()}`,
                    doorCode: newDoorCode,
                    location: newDoorLocation,
                    widthCm: newDoorWidth,
                    heightCm: newDoorHeight,
                    wallThicknessCm: newDoorWallThickness,
                    openingDirection: newDoorDirection,
                    jambType: 'سويد مصمت ملبس قشرة أرو طبيعي',
                    architrave: 'برور زان عريضة 10 سم ملبسة قشرة',
                    leafType: 'كبس حراري قشاط زان حشو فونتكس ألماني',
                    finishColor: newDoorFinish,
                    hardware: 'مفصلات استانلس مخفية + كالون صامت + مقبض نحاسي',
                    quantity: 1,
                    unitPrice: 6500,
                    status: 'معتمد للتصنيع',
                  };
                  if (onAddDoorMeasurement) onAddDoorMeasurement(newDoor);
                  setSelectedDoor(newDoor);
                  setShowAddModal(false);
                }}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                حفظ المقاس والاعتماد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
