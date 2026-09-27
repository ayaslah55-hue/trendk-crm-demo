export type AppView =
  | 'story'
  | 'dashboard'
  | 'customers'
  | 'measurements'
  | 'quotations'
  | 'contracts'
  | 'production'
  | 'bom_warehouse'
  | 'waste'
  | 'purchases'
  | 'expenses_profitability'
  | 'installation_warranty'
  | 'invoices'
  | 'accounting_ledger'
  | 'financial_reports';

export interface CustomerCommunicationLog {
  id: string;
  date: string;
  type: 'visit' | 'call' | 'meeting' | 'whatsapp' | 'note';
  summary: string;
  recordedBy: string;
}

export interface CustomerPaymentRecord {
  id: string;
  date: string;
  title: string;
  amount: number;
  voucherNumber: string;
  paymentMethod: string;
  status: 'confirmed' | 'pending';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  projectTitle: string;
  customerType?: 'individual' | 'contractor' | 'consultant_office' | 'developer';
  location?: string;
  address?: string;
  consultant?: string;
  contractDate?: string;
  expectedDeliveryDate?: string;
  contractorOrConsultant?: string;
  totalContractValue: number;
  totalPaid: number;
  remainingBalance: number;
  status: 'lead' | 'quoted' | 'contracted' | 'in_production' | 'installed' | 'completed' | 'manufacturing' | 'installation';
  notes: string;
  itemsSummary?: string[];
  requestedProducts?: string[];
  communicationLogs?: CustomerCommunicationLog[];
  paymentHistory?: CustomerPaymentRecord[];
}

export type FinancialPeriod = 'Q3-2026' | 'H1-2026' | 'FY-2025-2026';

export interface DoorMeasurement {
  id: string;
  doorCode: string; // e.g. D-01
  location: string; // e.g. Master Bedroom
  widthCm: number; // e.g. 90
  heightCm: number; // e.g. 220
  wallThicknessCm: number; // e.g. 15
  openingDirection: 'يمين' | 'يسار' | 'سحاب' | 'مزدوج';
  jambType: string; // نوع الحلق: زان طبيعي 2 بوصة
  leafType: string; // نوع الضلفة: MDF 18mm + قشرة بلوط
  architrave: string; // البرور: برور زان 10 سم
  finishColor: string; // Walnut 07 / دوكو أبيض مط
  hardware: string; // كالون يال + 3 مفصلات هيدروليك + مقبض ستانلس
  quantity: number;
  unitPrice: number;
  status:
    | 'تم القياس'
    | 'معتمد للتصنيع'
    | 'قيد التصنيع'
    | 'تم الدهان'
    | 'تم التركيب'
    | 'تم التجهيز'
    | 'فحص جودة QC';
  notes?: string;
}

export interface SiteInspectionItem {
  id: string;
  doorCode: string;
  location: string;
  masonryWidthCm: number;
  masonryHeightCm: number;
  wallThicknessCm: number;
  direction: 'يمين' | 'يسار' | 'سحاب' | 'مزدوج';
  jambType: string;
  leafType: string;
  woodType: string;
  finishColor: string;
  hardware: string;
  notes?: string;
}

export interface SiteInspectionReport {
  id: string;
  reportNumber: string;
  date: string;
  time: string;
  inspectorName: string;
  inspectorPhone: string;
  customerId: string;
  customerName: string;
  projectName: string;
  projectAddress: string;
  siteEngineerName: string;
  siteEngineerPhone: string;
  benchMarkStatus: 'determined_laser' | 'rough_approx' | 'not_determined';
  flooringType: 'ceramic_installed' | 'porcelain_installed' | 'parquet' | 'screed_unfinished' | 'marble';
  flooringClearanceMm: number;
  plasterStatus: 'plumb_90_square' | 'minor_tilt_subframe_needed' | 'uneven_rough';
  wallLintelType: 'concrete_lintel' | 'brick_arch' | 'steel_lintel';
  wallMoisturePercent: number;
  subFrameRequired: boolean;
  doors: SiteInspectionItem[];
  generalNotes: string;
  recommendations: string[];
  inspectorSignature: boolean;
  clientSignature: boolean;
  status: 'draft' | 'approved_for_production' | 'completed';
}

export interface QuotationItem {
  id: string;
  item: string;
  specs: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  projectTitle: string;
  date: string;
  validUntil: string;
  items: QuotationItem[];
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  taxPercentage: number; // ضريبة القيمة المضافة 14%
  taxAmount: number;
  netTotal: number;
  status: 'draft' | 'sent' | 'approved' | 'converted';
  associatedContractId?: string;
}

export interface PaymentMilestone {
  id: string;
  title: string; // e.g. 50% مقدم تعاقد
  percentage: number;
  amount: number;
  triggerEvent: string; // عند التعاقد، عند بدء التصنيع، قبل التركيب، بعد الاستلام النهائي
  dueDate: string;
  isPaid: boolean;
  paidDate?: string;
  receiptVoucherId?: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  customerId: string;
  customerName: string;
  projectTitle: string;
  date: string;
  deliveryDate: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  nextMilestoneAmount: number;
  nextMilestoneTitle: string;
  milestones: PaymentMilestone[];
  status: 'active' | 'in_progress' | 'completed';
  quotationId: string;
}

export type ProductionStageName =
  | 'قص وتقطيع'
  | 'تجميع وهياكل'
  | 'كبس هيدروليكي'
  | 'قشرة وتفريغ'
  | 'صنفرة وتجهيز'
  | 'دهان وتشطيب'
  | 'تركيب إكسسوارات'
  | 'فحص جودة QC'
  | 'جاهز للتركيب';

export interface ProductionStage {
  id: string;
  name: ProductionStageName;
  responsiblePerson: string;
  startDate: string;
  endDate: string;
  status: 'waiting' | 'in_progress' | 'completed' | 'delayed';
  progressPercentage: number;
  notes?: string;
}

export interface ProductionOrder {
  id: string;
  workOrderNumber: string; // WO-2026-00124
  contractId: string;
  customerName: string;
  projectTitle: string;
  itemsDescription: string;
  quantityTotal: number;
  createdAt: string;
  deliveryDate: string;
  currentStage: ProductionStageName;
  overallProgress: number;
  stages: ProductionStage[];
  status: 'قيد التنفيذ' | 'متأخر' | 'مكتمل' | 'جاهز للتركيب';
  materialsIssued: boolean;
  materialIssueVoucherId?: string;
}

export interface BOMMaterialRequirement {
  id: string;
  materialName: string;
  warehouseCategory: 'أخشاب' | 'ألواح' | 'إكسسوارات' | 'دهانات';
  unit: string;
  quantityPerUnit: number;
  totalQuantity: number;
  unitCost: number;
  totalCost: number;
}

export interface BOMProduct {
  id: string;
  productName: string;
  category: 'أبواب داخلية' | 'باب رئيسي' | 'Dressing Room' | 'مطابخ';
  materials: BOMMaterialRequirement[];
  directLaborCost: number;
  overheadCost: number;
  totalCostPerUnit: number;
  sellingPrice: number;
  profitMarginPercentage: number;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: 'أخشاب' | 'ألواح' | 'إكسسوارات' | 'دهانات';
  warehouseName: string;
  unit: string;
  currentStock: number;
  minReorderLevel: number;
  unitPrice: number;
  totalValue: number;
  locationShelf: string;
}

export interface WasteRecord {
  id: string;
  date: string;
  workOrderNumber: string;
  materialName: string;
  issuedQuantity: number;
  usedInProduction: number;
  wasteQuantity: number;
  unit: string;
  wastePercentage: number;
  normalAllowedPercentage: number;
  variancePercentage: number;
  status: 'طبيعي' | 'تجاوز للحد';
  notes: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  category: string;
  totalPurchases: number;
  totalPaid: number;
  balanceDue: number;
  currentBalance?: number;
  paymentTerms?: string;
}

export interface PurchaseOrderItem {
  id: string;
  itemDescription: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  dueDate: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'تم الاستلام' | 'قيد التوريد' | 'مسدد بالكامل' | 'مستحق السداد';
  purchaseInvoiceId?: string;
}

export type InvoiceType =
  | 'sales_invoice'
  | 'advance_payment'
  | 'tax_invoice'
  | 'proforma'
  | 'purchase_invoice'
  | 'credit_note'
  | 'expense_invoice';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: InvoiceType;
  date: string;
  dueDate: string;
  partnerName: string; // customer or supplier
  partnerRole: 'عميل' | 'مورد' | 'جهة صرف';
  projectRef?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  netTotal: number;
  paidAmount: number;
  status: 'مدفوعة' | 'مدفوعة جزئياً' | 'غير مدفوعة';
  journalEntryId: string;
}

export interface JournalLine {
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
}

export interface JournalEntry {
  id: string;
  entryNumber: string; // JV-0001
  date: string;
  referenceNumber: string; // e.g. INV-101, RV-051, WO-00124
  sourceType:
    | 'Sales Invoice'
    | 'Advance Payment'
    | 'Purchase Invoice'
    | 'Payment Voucher'
    | 'Receipt Voucher'
    | 'WIP Material Issue'
    | 'Finished Goods'
    | 'COGS Realization'
    | 'Project Expense'
    | 'Manual Entry';
  memo: string;
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
  createdBy: string;
  projectRef?: string;
}

export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'أصول' | 'خصوم' | 'حقوق ملكية' | 'إيرادات' | 'تكاليف ومشتريات' | 'مصروفات تشغيلية';
  subType: 'أصول متداولة' | 'أصول ثابتة' | 'خصوم متداولة' | 'إيرادات نشاط' | 'تكاليف مباشرة' | 'مصاريف بيع وإدارة';
  balance: number;
  nature: 'debit' | 'credit';
}

export interface ProjectCosting {
  id?: string;
  projectId: string;
  projectCode?: string;
  projectName: string;
  projectTitle?: string;
  customerName: string;
  contractValue: number;
  contractAmount?: number;
  rawMaterialsCost: number;
  materialsCost?: number;
  directLaborCost: number;
  laborCost?: number;
  paintCost?: number;
  accessoriesCost?: number;
  installationCost: number;
  transportationCost: number;
  transportAndInstallationCost?: number;
  siteAndOtherExpenses: number;
  wasteCost?: number;
  totalActualCost: number;
  totalCost?: number;
  grossProfit: number;
  netProfit?: number;
  profitMarginPercentage: number;
  status: 'قيد التنفيذ' | 'مكتمل ومسلم';
}

export interface InstallationOrder {
  id: string;
  orderNumber: string; // INST-2026-089
  customerName: string;
  projectName: string;
  siteAddress: string;
  installationTeamLeader: string;
  techniciansCount: number;
  vehicleNumber: string;
  scheduledDate: string;
  itemsToInstall: string[];
  status: 'مجدول' | 'فريق التركيب بالموقع' | 'تم التركيب وبانتظار التوقيع' | 'تم الاستلام النهائي';
  customerSignatureDate?: string;
  signedByName?: string;
  clientRating?: number;
  reportNotes?: string;
}

export interface Expense {
  id: string;
  title: string;
  category: 'مصروفات تشغيل' | 'مصروفات إدارية';
  amount: number;
  date: string;
  allocatedProject: string;
  paymentMethod: string;
}

export interface SnagItem {
  id: string;
  item: string;
  isResolved: boolean;
}

export interface InstallationRecord {
  id: string;
  handoverNumber: string;
  customerName: string;
  projectTitle: string;
  installationDate: string;
  teamLead: string;
  technicians: string[];
  snagList: SnagItem[];
  customerSignature: string;
  customerSignatureDate: string;
  warrantyStartDate: string;
  warrantyEndDate: string;
}

export interface MaintenanceTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  projectName: string;
  productCode: string;
  productTitle: string;
  issueDescription: string;
  installationDate: string;
  warrantyPeriodMonths: number;
  isUnderWarranty: boolean;
  assignedTechnician: string;
  visitDate: string;
  status: 'مفتوحة' | 'قيد الفحص' | 'تم الإصلاح' | 'مغلقة';
  repairCost: number;
}


