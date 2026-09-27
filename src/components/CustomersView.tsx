import React, { useState } from 'react';
import { Customer, AppView, CustomerCommunicationLog, CustomerPaymentRecord } from '../types';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Building,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  ChevronLeft,
  ArrowUpRight,
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  DollarSign,
  Printer,
  Calendar,
  Layers,
  FileCheck2,
  Ruler,
  Hammer,
  Truck,
  X,
  AlertCircle,
  Receipt,
  UserCheck,
} from 'lucide-react';

interface CustomersViewProps {
  customers: Customer[];
  onUpdateCustomers?: (updated: Customer[]) => void;
  onNavigate: (view: AppView) => void;
  onRecordCustomerPayment?: (customer: Customer, payment: CustomerPaymentRecord) => void;
}

type DossierTab = 'overview' | 'financial' | 'communications' | 'linked_docs';

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers: initialCustomers,
  onUpdateCustomers,
  onNavigate,
  onRecordCustomerPayment,
}) => {
  const [customersList, setCustomersList] = useState<Customer[]>(initialCustomers);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    initialCustomers[0]?.id || 'cust-1'
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeDossierTab, setActiveDossierTab] = useState<DossierTab>('overview');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState<boolean>(false);

  // New Customer Form State
  const [newCustomer, setNewCustomer] = useState<{
    name: string;
    phone: string;
    email: string;
    projectTitle: string;
    location: string;
    customerType: 'individual' | 'contractor' | 'consultant_office' | 'developer';
    consultant: string;
    status: Customer['status'];
    totalContractValue: number;
    totalPaid: number;
    contractDate: string;
    expectedDeliveryDate: string;
    requestedProducts: string;
    notes: string;
  }>({
    name: '',
    phone: '',
    email: '',
    projectTitle: '',
    location: '',
    customerType: 'individual',
    consultant: '',
    status: 'lead',
    totalContractValue: 150000,
    totalPaid: 50000,
    contractDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: '',
    requestedProducts: 'أبواب داخلية، باب رئيسي زان',
    notes: '',
  });

  // Edit Customer Form State
  const [editFormData, setEditFormData] = useState<Partial<Customer>>({});

  // Payment Form State
  const [paymentForm, setPaymentForm] = useState<{
    title: string;
    amount: number;
    voucherNumber: string;
    paymentMethod: string;
  }>({
    title: 'دفعة مرحلية من الحساب',
    amount: 20000,
    voucherNumber: `RV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    paymentMethod: 'تحويل بنكي',
  });

  // Interaction Form State
  const [interactionForm, setInteractionForm] = useState<{
    type: 'visit' | 'call' | 'meeting' | 'whatsapp' | 'note';
    summary: string;
    recordedBy: string;
  }>({
    type: 'visit',
    summary: '',
    recordedBy: 'م. حسام الدين (مهندس الموقع)',
  });

  const selectedCustomer =
    customersList.find((c) => c.id === selectedCustomerId) || customersList[0] || initialCustomers[0];

  // Sync state upward when list changes
  const updateList = (newList: Customer[]) => {
    setCustomersList(newList);
    if (onUpdateCustomers) {
      onUpdateCustomers(newList);
    }
  };

  // KPIs
  const totalCustomers = customersList.length;
  const totalContractsValue = customersList.reduce((acc, c) => acc + (c.totalContractValue ?? 0), 0);
  const totalPaidCollections = customersList.reduce((acc, c) => acc + (c.totalPaid ?? 0), 0);
  const totalRemaining = customersList.reduce((acc, c) => acc + (c.remainingBalance ?? 0), 0);
  const collectionRate =
    totalContractsValue > 0 ? Math.round((totalPaidCollections / totalContractsValue) * 100) : 0;

  // Filtered customers
  const filteredCustomers = customersList.filter((c) => {
    const matchesSearch =
      (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.projectTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone || '').includes(searchTerm) ||
      (c.id || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      c.status === statusFilter ||
      (statusFilter === 'manufacturing' && c.status === 'in_production');

    const matchesType = typeFilter === 'all' || c.customerType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Handle Add Customer Submit
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) {
      alert('يرجى ملء اسم العميل ورقم الهاتف على الأقل');
      return;
    }

    const newId = `cust-${Date.now().toString().slice(-4)}`;
    const remaining = Math.max(0, newCustomer.totalContractValue - newCustomer.totalPaid);
    const productsArray = newCustomer.requestedProducts
      ? newCustomer.requestedProducts.split(/[,،]/).map((s) => s.trim()).filter(Boolean)
      : ['أبواب داخلية'];

    const createdCustomer: Customer = {
      id: newId,
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email,
      customerType: newCustomer.customerType,
      projectTitle: newCustomer.projectTitle || `مشروع ${newCustomer.name}`,
      location: newCustomer.location || 'القاهرة',
      address: newCustomer.location || 'القاهرة',
      consultant: newCustomer.consultant || 'إشراف العميل',
      contractDate: newCustomer.contractDate,
      expectedDeliveryDate: newCustomer.expectedDeliveryDate || '2026-11-30',
      totalContractValue: Number(newCustomer.totalContractValue) || 0,
      totalPaid: Number(newCustomer.totalPaid) || 0,
      remainingBalance: remaining,
      status: newCustomer.status,
      notes: newCustomer.notes || 'تم إنشاء ملف العميل بالنظام.',
      requestedProducts: productsArray,
      itemsSummary: productsArray,
      communicationLogs: [
        {
          id: `log-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          type: 'note',
          summary: 'تم فتح ملف العميل الجديد وتسجيل بيانات المشروع.',
          recordedBy: 'إدارة خدمة العملاء والمبيعات',
        },
      ],
      paymentHistory:
        newCustomer.totalPaid > 0
          ? [
              {
                id: `pay-${Date.now()}`,
                date: newCustomer.contractDate,
                title: 'دفعة حجز أولى',
                amount: Number(newCustomer.totalPaid),
                voucherNumber: `RV-${new Date().getFullYear()}-001`,
                paymentMethod: 'نقدي بالخزينة',
                status: 'confirmed',
              },
            ]
          : [],
    };

    const updated = [createdCustomer, ...customersList];
    updateList(updated);
    setSelectedCustomerId(newId);
    setIsAddModalOpen(false);
    setNewCustomer({
      name: '',
      phone: '',
      email: '',
      projectTitle: '',
      location: '',
      customerType: 'individual',
      consultant: '',
      status: 'contracted',
      totalContractValue: 150000,
      totalPaid: 50000,
      contractDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: '',
      requestedProducts: 'أبواب داخلية، باب رئيسي زان',
      notes: '',
    });
  };

  // Open Edit Modal
  const handleOpenEdit = (customer: Customer) => {
    setEditFormData({
      ...customer,
      requestedProducts: [...(customer.requestedProducts || [])],
    });
    setIsEditModalOpen(true);
  };

  // Handle Edit Submit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.id) return;

    const updatedList = customersList.map((c) => {
      if (c.id === editFormData.id) {
        const val = editFormData.totalContractValue ?? c.totalContractValue;
        const paid = editFormData.totalPaid ?? c.totalPaid;
        const rem = Math.max(0, val - paid);
        return {
          ...c,
          ...editFormData,
          totalContractValue: val,
          totalPaid: paid,
          remainingBalance: rem,
        } as Customer;
      }
      return c;
    });

    updateList(updatedList);
    setIsEditModalOpen(false);
  };

  // Handle Delete / Archive Customer
  const handleDeleteCustomer = (customerId: string) => {
    if (customersList.length <= 1) {
      alert('لا يمكن حذف العميل الوحيد المتبقي في النظام');
      return;
    }
    if (window.confirm('هل أنت متأكد من حذف أو أرشفة ملف هذا العميل؟')) {
      const remaining = customersList.filter((c) => c.id !== customerId);
      updateList(remaining);
      setSelectedCustomerId(remaining[0].id);
    }
  };

  // Record New Payment
  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    const amount = Number(paymentForm.amount);
    if (!amount || amount <= 0) {
      alert('يرجى إدخال مبلغ صحيح');
      return;
    }

    const newPaymentRecord: CustomerPaymentRecord = {
      id: `pay-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: paymentForm.title || 'دفعة تحصيل',
      amount,
      voucherNumber: paymentForm.voucherNumber || 'RV-NEW',
      paymentMethod: paymentForm.paymentMethod || 'تحويل بنكي',
      status: 'confirmed',
    };

    const updatedPaid = (selectedCustomer.totalPaid ?? 0) + amount;
    const updatedRem = Math.max(0, (selectedCustomer.totalContractValue ?? 0) - updatedPaid);
    const existingHistory = selectedCustomer.paymentHistory || [];

    const updatedList = customersList.map((c) => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          totalPaid: updatedPaid,
          remainingBalance: updatedRem,
          paymentHistory: [newPaymentRecord, ...existingHistory],
        };
      }
      return c;
    });

    updateList(updatedList);
    setIsPaymentModalOpen(false);

    if (onRecordCustomerPayment) {
      onRecordCustomerPayment(
        { ...selectedCustomer, totalPaid: updatedPaid, remainingBalance: updatedRem },
        newPaymentRecord
      );
    }
  };

  // Record New Interaction
  const handleAddInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !interactionForm.summary) return;

    const newLog: CustomerCommunicationLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: interactionForm.type,
      summary: interactionForm.summary,
      recordedBy: interactionForm.recordedBy || 'مهندس الموقع',
    };

    const existingLogs = selectedCustomer.communicationLogs || [];

    const updatedList = customersList.map((c) => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          communicationLogs: [newLog, ...existingLogs],
        };
      }
      return c;
    });

    updateList(updatedList);
    setIsInteractionModalOpen(false);
    setInteractionForm({
      type: 'visit',
      summary: '',
      recordedBy: 'م. حسام الدين (مهندس الموقع)',
    });
  };

  const getStatusBadge = (status: Customer['status']) => {
    switch (status) {
      case 'in_production':
      case 'manufacturing':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-200">قيد التصنيع بالورشة</span>;
      case 'installation':
      case 'installed':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-bold border border-blue-200">مرحلة التركيب بالموقع</span>;
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-200">تم التسليم والاعتماد</span>;
      case 'contracted':
        return <span className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full text-xs font-bold border border-purple-200">تعاقد معتمد</span>;
      case 'quoted':
        return <span className="bg-cyan-100 text-cyan-800 px-2.5 py-0.5 rounded-full text-xs font-bold border border-cyan-200">عرض سعر مقدم</span>;
      case 'lead':
      default:
        return <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-slate-200">عميل محتمل / معاينة</span>;
    }
  };

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case 'contractor':
        return 'شركة مقاولات';
      case 'consultant_office':
        return 'مكتب استشاري';
      case 'developer':
        return 'مطور عقاري / فندق';
      case 'individual':
      default:
        return 'مالك خاص / فيلا';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-slate-500 font-mono">سجل العملاء 360° ودورة حياة المشروع</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>إدارة ملفات العملاء، العقود، والتنسيق الهندسي</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            متابعة شاملة لبيانات العميل، سجل الدفعات، مستحقات التحصيل، المعاينات وملاحظات الموقع، والربط مع أوامر التصنيع.
          </p>
        </div>

        {/* Action Button: Add New Customer */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة عميل جديد</span>
          </button>
        </div>
      </div>

      {/* Top CRM Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-xs font-medium block">إجمالي العملاء المسجلين:</span>
          <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">
            {totalCustomers} <span className="text-xs font-normal text-slate-400">عميل</span>
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {customersList.filter((c) => c.status !== 'completed').length} مشاريع نشطة حالياً
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-500 text-xs font-medium block">إجمالي قيمة التعاقدات:</span>
          <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">
            {(totalContractsValue ?? 0).toLocaleString()} <span className="text-xs font-normal text-slate-400">ج.م</span>
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">شامل جميع المشاريع والفلل</span>
        </div>

        <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200 shadow-xs">
          <span className="text-emerald-800 text-xs font-medium block">إجمالي المحصل الفعلي:</span>
          <span className="text-2xl font-bold font-mono text-emerald-800 mt-1 block">
            {(totalPaidCollections ?? 0).toLocaleString()} <span className="text-xs font-normal text-emerald-600">ج.م</span>
          </span>
          <span className="text-[11px] text-emerald-700 font-bold mt-1 block">
            نسبة التحصيل الإجمالية: {collectionRate}%
          </span>
        </div>

        <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200 shadow-xs">
          <span className="text-rose-800 text-xs font-medium block">مستحقات ذمم تحت التحصيل:</span>
          <span className="text-2xl font-bold font-mono text-rose-800 mt-1 block">
            {(totalRemaining ?? 0).toLocaleString()} <span className="text-xs font-normal text-rose-600">ج.م</span>
          </span>
          <span className="text-[11px] text-rose-700 mt-1 block font-medium">مرتبطة بدفعات التوريد والتركيب</span>
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">جاهزية العقود</span>
            <UserCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">
              100% موثقة
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              مربوطة بجدول المقاسات والأستاذ
            </span>
          </div>
        </div>
      </div>

      {/* Main CRM Workspace: Customer List (Left) + Dossier 360 (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Customers Master List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search & Filter Bar */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="بحث بالاسم، الهاتف، المشروع، الاستشاري..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
              >
                <option value="all">كل المراحل</option>
                <option value="manufacturing">قيد التصنيع بالورشة</option>
                <option value="installation">مرحلة التركيب</option>
                <option value="contracted">تعاقد معتمد</option>
                <option value="completed">تم التسليم</option>
                <option value="quoted">عرض سعر</option>
                <option value="lead">عميل محتمل</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
              >
                <option value="all">كل أنواع العملاء</option>
                <option value="individual">أفراد وفلل</option>
                <option value="contractor">شركات مقاولات</option>
                <option value="consultant_office">مكاتب استشارية</option>
                <option value="developer">مطورون / فنادق</option>
              </select>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-0.5">
            {filteredCustomers.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
                لا توجد نتائج مطابقة لبحثك
              </div>
            ) : (
              filteredCustomers.map((cust) => {
                const isSelected = selectedCustomerId === cust.id;
                const paidRate =
                  cust.totalContractValue > 0
                    ? Math.round(((cust.totalPaid ?? 0) / cust.totalContractValue) * 100)
                    : 0;

                return (
                  <div
                    key={cust.id}
                    onClick={() => setSelectedCustomerId(cust.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-50/80 border-amber-500 shadow-sm ring-2 ring-amber-400/20'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-slate-400 font-bold">{cust.id}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                            {getTypeLabel(cust.customerType)}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mt-0.5">{cust.name}</h4>
                        <p className="text-xs text-slate-500">{cust.projectTitle}</p>
                      </div>
                      <div>{getStatusBadge(cust.status)}</div>
                    </div>

                    {/* Progress Bar for Payment */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                        <span>نسبة سداد الدفعات: {paidRate}%</span>
                        <span className="font-mono text-slate-700">
                          {(cust.totalPaid ?? 0).toLocaleString()} من {(cust.totalContractValue ?? 0).toLocaleString()} ج.م
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            paidRate === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${paidRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-mono text-[11px] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{cust.phone}</span>
                      </span>
                      <span className="font-mono text-rose-700 font-bold">
                        متبقي: {(cust.remainingBalance ?? 0).toLocaleString()} ج.م
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Customer Profile Dossier 360° (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
            {/* Dossier Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-amber-700 font-bold">كود العميل: {selectedCustomer.id}</span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                    {getTypeLabel(selectedCustomer.customerType)}
                  </span>
                  {getStatusBadge(selectedCustomer.status)}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{selectedCustomer.name}</h3>
                <span className="text-xs text-slate-500 block mt-0.5">{selectedCustomer.projectTitle}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(selectedCustomer)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                  title="تعديل بيانات العميل"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCustomer(selectedCustomer.id)}
                  className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-colors"
                  title="حذف أو أرشفة العميل"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dossier Tabs: Overview / Financials / Communications / Documents */}
            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 text-xs">
              <button
                onClick={() => setActiveDossierTab('overview')}
                className={`px-3 py-2 rounded-lg font-bold transition-all ${
                  activeDossierTab === 'overview'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                1. البيانات الفنية والمشروع
              </button>
              <button
                onClick={() => setActiveDossierTab('financial')}
                className={`px-3 py-2 rounded-lg font-bold transition-all ${
                  activeDossierTab === 'financial'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                2. كشف الحساب والمدفوعات
              </button>
              <button
                onClick={() => setActiveDossierTab('communications')}
                className={`px-3 py-2 rounded-lg font-bold transition-all ${
                  activeDossierTab === 'communications'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                3. سجل التواصل والموقع ({selectedCustomer.communicationLogs?.length || 0})
              </button>
              <button
                onClick={() => setActiveDossierTab('linked_docs')}
                className={`px-3 py-2 rounded-lg font-bold transition-all ${
                  activeDossierTab === 'linked_docs'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                4. المستندات وأوامر الشغل
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeDossierTab === 'overview' && (
              <div className="space-y-4 text-xs">
                {/* Contact details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">رقم الهاتف والواتساب:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm block mt-0.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedCustomer.phone}</span>
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">البريد الإلكتروني:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm block mt-0.5 flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{selectedCustomer.email || 'غير مسجل'}</span>
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">موقع المشروع / العنوان:</span>
                    <span className="font-semibold text-slate-900 block mt-0.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{selectedCustomer.address || selectedCustomer.location || 'القاهرة الجديدة'}</span>
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">الاستشاري أو المهندس المشرف:</span>
                    <span className="font-semibold text-slate-900 block mt-0.5 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{selectedCustomer.consultant || 'إشراف مباشر'}</span>
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">تاريخ التعاقد والتسليم:</span>
                    <span className="font-mono font-semibold text-slate-900 block mt-0.5">
                      تعاقد: {selectedCustomer.contractDate || '2026-08-15'} | تسليم: {selectedCustomer.expectedDeliveryDate || '2026-10-20'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">النوع والتصنيف:</span>
                    <span className="font-bold text-slate-800 block mt-0.5">
                      {getTypeLabel(selectedCustomer.customerType)} - عميل VIP
                    </span>
                  </div>
                </div>

                {/* Requested Products */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-800 block mb-2">
                    المنتجات الخشبية والأبواب المطلوبة بالمشروع:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(selectedCustomer.requestedProducts || selectedCustomer.itemsSummary || []).map(
                      (prod, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 shadow-2xs"
                        >
                          {prod}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Technical Notes */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-800 block mb-1">المواصفات الفنية والملاحظات:</span>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    {selectedCustomer.notes || 'لا توجد ملاحظات إضافية.'}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: FINANCIAL STATEMENT & PAYMENTS */}
            {activeDossierTab === 'financial' && (
              <div className="space-y-4">
                {/* Financial Summary Cards */}
                <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-amber-400 font-bold">الملخص المالي وموقف السداد:</span>
                    <button
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>تسجيل دفعة جديدة</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center font-mono">
                    <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                      <span className="text-[10px] text-slate-400 block">إجمالي العقد</span>
                      <span className="text-sm sm:text-base font-bold text-white">
                        {(selectedCustomer?.totalContractValue ?? 0).toLocaleString()} ج.م
                      </span>
                    </div>
                    <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                      <span className="text-[10px] text-emerald-400 block">المسدد فعلياً</span>
                      <span className="text-sm sm:text-base font-bold text-emerald-400">
                        {(selectedCustomer?.totalPaid ?? 0).toLocaleString()} ج.م
                      </span>
                    </div>
                    <div className="bg-slate-800/80 p-2.5 rounded-lg border border-rose-500/40">
                      <span className="text-[10px] text-rose-400 block">المتبقي للتحصيل</span>
                      <span className="text-sm sm:text-base font-bold text-rose-400">
                        {(selectedCustomer?.remainingBalance ?? 0).toLocaleString()} ج.م
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment History Table */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                  <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      سجل الدفعات وسندات القبض المسجلة:
                    </span>
                    <button
                      onClick={() => window.print()}
                      className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>طباعة كشف الحساب</span>
                    </button>
                  </div>

                  <div className="divide-y divide-slate-200 text-xs">
                    {(selectedCustomer.paymentHistory || []).length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        لم يتم تسجيل دفعات نقدية بعد لهذا العميل.
                      </div>
                    ) : (
                      selectedCustomer.paymentHistory?.map((pay) => (
                        <div key={pay.id} className="p-3 flex items-center justify-between hover:bg-white transition-colors">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{pay.title}</span>
                              <span className="font-mono text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                {pay.voucherNumber}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 mt-0.5 block">
                              التاريخ: {pay.date} | طريقة السداد: {pay.paymentMethod}
                            </span>
                          </div>
                          <div className="text-left">
                            <span className="font-mono font-bold text-emerald-700 text-sm block">
                              +{(pay.amount ?? 0).toLocaleString()} ج.م
                            </span>
                            <span className="text-[10px] text-emerald-600 font-semibold">تم الإيداع بالخزينة</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: COMMUNICATIONS & SITE LOGS */}
            {activeDossierTab === 'communications' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    سجل المعاينات والتواصل الفني والهندسي بالموقع:
                  </span>
                  <button
                    onClick={() => setIsInteractionModalOpen(true)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة تقرير معاينة / تواصل</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(selectedCustomer.communicationLogs || []).length === 0 ? (
                    <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs">
                      لا توجد سجلات تواصل مسجلة بعد.
                    </div>
                  ) : (
                    selectedCustomer.communicationLogs?.map((log) => (
                      <div key={log.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                              {log.type === 'visit'
                                ? 'زيارة ومعاينة موقع'
                                : log.type === 'call'
                                ? 'مكالمة هاتفية'
                                : log.type === 'whatsapp'
                                ? 'واتساب وصور اعتماد'
                                : log.type === 'meeting'
                                ? 'جلسة تفاوض واعتماد'
                                : 'ملاحظة فنية'}
                            </span>
                            <span className="font-mono text-slate-400 text-[11px]">{log.date}</span>
                          </div>
                          <span className="text-slate-500 text-[11px]">{log.recordedBy}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed pt-1">{log.summary}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: LINKED DOCUMENTS */}
            {activeDossierTab === 'linked_docs' && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  المستندات وأوامر العمل المترابطة بالعميل:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Contract Card */}
                  <div
                    onClick={() => onNavigate('contracts')}
                    className="p-3.5 bg-purple-50/60 hover:bg-purple-100/60 rounded-xl border border-purple-200 cursor-pointer transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-purple-900">
                      <span className="flex items-center gap-1.5">
                        <FileCheck2 className="w-4 h-4 text-purple-600" />
                        <span>عقد المشروع المعتمد</span>
                      </span>
                      <span>عرض ↗</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      قيمة العقد: {(selectedCustomer.totalContractValue ?? 0).toLocaleString()} ج.م مع جدول الدفعات.
                    </p>
                  </div>

                  {/* Door Schedule Card */}
                  <div
                    onClick={() => onNavigate('measurements')}
                    className="p-3.5 bg-blue-50/60 hover:bg-blue-100/60 rounded-xl border border-blue-200 cursor-pointer transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-blue-900">
                      <span className="flex items-center gap-1.5">
                        <Ruler className="w-4 h-4 text-blue-600" />
                        <span>جدول مقاسات الأبواب D-01</span>
                      </span>
                      <span>عرض ↗</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      مقاسات الفتحات، أسماك الحلق 2 بوصة، مواصفات القشرة، وكوالين يال.
                    </p>
                  </div>

                  {/* Production Order Card */}
                  <div
                    onClick={() => onNavigate('production')}
                    className="p-3.5 bg-amber-50/60 hover:bg-amber-100/60 rounded-xl border border-amber-200 cursor-pointer transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-amber-900">
                      <span className="flex items-center gap-1.5">
                        <Hammer className="w-4 h-4 text-amber-600" />
                        <span>أمر التصنيع والتشغيل (WO)</span>
                      </span>
                      <span>عرض ↗</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      مراحل النجارة، التقطيع، الكبس الهيدروليكي، وكابينة دهانات الدوكو.
                    </p>
                  </div>

                  {/* Installation Warranty Card */}
                  <div
                    onClick={() => onNavigate('installation_warranty')}
                    className="p-3.5 bg-emerald-50/60 hover:bg-emerald-100/60 rounded-xl border border-emerald-200 cursor-pointer transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-emerald-900">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-emerald-600" />
                        <span>محضر التركيب وشهادة الضمان</span>
                      </span>
                      <span>عرض ↗</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      قائمة ملاحظات الموقع (Snag list) وشهادة الضمان 5 سنوات.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD NEW CUSTOMER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">إضافة عميل ومشروع جديد</h3>
                  <span className="text-[11px] text-slate-500">تسجيل بيانات العميل وفتح ملف المشروع في CRM</span>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">اسم العميل بالكامل *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: م. مصطفى الشامي"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">رقم الهاتف والواتساب *</label>
                  <input
                    type="tel"
                    required
                    placeholder="010XXXXXXXX"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    placeholder="client@example.com"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">نوع العميل</label>
                  <select
                    value={newCustomer.customerType}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        customerType: e.target.value as any,
                      })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="individual">مالك فيلا / شقة خاصة</option>
                    <option value="contractor">شركة مقاولات</option>
                    <option value="consultant_office">مكتب استشاري</option>
                    <option value="developer">مطور عقاري / فندق</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">اسم ووصف المشروع</label>
                  <input
                    type="text"
                    placeholder="مثال: فيلا زايد - كمبوند الربوة"
                    value={newCustomer.projectTitle}
                    onChange={(e) => setNewCustomer({ ...newCustomer, projectTitle: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">العنوان / موقع الفيلا</label>
                  <input
                    type="text"
                    placeholder="الشيخ زايد، الجيزة"
                    value={newCustomer.location}
                    onChange={(e) => setNewCustomer({ ...newCustomer, location: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">الاستشاري أو المهندس المشرف</label>
                  <input
                    type="text"
                    placeholder="مكتب التصميم والاستشارات"
                    value={newCustomer.consultant}
                    onChange={(e) => setNewCustomer({ ...newCustomer, consultant: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">مرحلة العميل الحالية</label>
                  <select
                    value={newCustomer.status}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="lead">عميل محتمل / معاينة</option>
                    <option value="quoted">عرض سعر مقدم</option>
                    <option value="contracted">تعاقد معتمد</option>
                    <option value="in_production">قيد التصنيع بالورشة</option>
                    <option value="installation">مرحلة التركيب بالموقع</option>
                    <option value="completed">تم التسليم</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">قيمة التعاقد التقديرية (ج.م)</label>
                  <input
                    type="number"
                    value={newCustomer.totalContractValue}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, totalContractValue: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">الدفعة المقدمة المسددة (ج.م)</label>
                  <input
                    type="number"
                    value={newCustomer.totalPaid}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, totalPaid: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  المنتجات الخشبية المطلوبة (افصل بينها بفاصلة)
                </label>
                <input
                  type="text"
                  placeholder="8 أبواب غرف قشرة، باب مدخل زان، غرفة ملابس"
                  value={newCustomer.requestedProducts}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, requestedProducts: e.target.value })
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">ملاحظات التنسيق الفني</label>
                <textarea
                  rows={2}
                  placeholder="ملاحظات حول تشطيب الحوائط، موعد المعاينة، متطلبات الدهان..."
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-colors shadow-xs"
                >
                  حفظ العميل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT CUSTOMER */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-black text-slate-900 text-base">تعديل بيانات العميل والمشروع</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">اسم العميل</label>
                <input
                  type="text"
                  value={editFormData.name || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الهاتف</label>
                  <input
                    type="tel"
                    value={editFormData.phone || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={editFormData.email || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">المشروع</label>
                <input
                  type="text"
                  value={editFormData.projectTitle || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, projectTitle: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الحالة</label>
                  <select
                    value={editFormData.status || 'lead'}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="lead">عميل محتمل</option>
                    <option value="quoted">عرض سعر</option>
                    <option value="contracted">تعاقد معتمد</option>
                    <option value="in_production">قيد التصنيع</option>
                    <option value="installation">مرحلة التركيب</option>
                    <option value="completed">تم التسليم</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الاستشاري</label>
                  <input
                    type="text"
                    value={editFormData.consultant || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, consultant: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">الملاحظات</label>
                <textarea
                  rows={2}
                  value={editFormData.notes || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-xs"
                >
                  تحديث
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: RECORD PAYMENT */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base">تسجيل دفعة / سند قبض</h3>
                <span className="text-[11px] text-slate-500">للعميل: {selectedCustomer.name}</span>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPayment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">بيان الدفعة</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: دفعة اعتماد مرحلة الدهان"
                  value={paymentForm.title}
                  onChange={(e) => setPaymentForm({ ...paymentForm, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">المبلغ المحصل (ج.م)</label>
                <input
                  type="number"
                  required
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">رقم سند القبض</label>
                  <input
                    type="text"
                    value={paymentForm.voucherNumber}
                    onChange={(e) => setPaymentForm({ ...paymentForm, voucherNumber: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">طريقة السداد</label>
                  <select
                    value={paymentForm.paymentMethod}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="تحويل بنكي">تحويل بنكي</option>
                    <option value="شيك مصرفي">شيك مصرفي</option>
                    <option value="نقدي بالخزينة">نقدي بالخزينة</option>
                    <option value="إنستاباي InstaPay">إنستاباي InstaPay</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                سيتم تحديث رصيد العميل فوراً وتسجيل سند القبض في كشف الحساب ودفتر الأستاذ العام GL.
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs"
                >
                  تأكيد وقبض
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: RECORD INTERACTION / SITE NOTE */}
      {isInteractionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base">تسجيل تواصل / تقرير موقع</h3>
                <span className="text-[11px] text-slate-500">للعميل: {selectedCustomer.name}</span>
              </div>
              <button
                onClick={() => setIsInteractionModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddInteraction} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">نوع التفاعل</label>
                <select
                  value={interactionForm.type}
                  onChange={(e) => setInteractionForm({ ...interactionForm, type: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="visit">زيارة ومعاينة موقع</option>
                  <option value="meeting">جلسة تفاوض واعتماد بالورشة</option>
                  <option value="call">مكالمة هاتفية</option>
                  <option value="whatsapp">محادثة واتساب وصور</option>
                  <option value="note">ملاحظة فنية عامة</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">القائم بالتسجيل / المهندس المشرف</label>
                <input
                  type="text"
                  value={interactionForm.recordedBy}
                  onChange={(e) => setInteractionForm({ ...interactionForm, recordedBy: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">تفاصيل وتقرير المعاينة *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="سجل تفاصيل الزيارة، حالة الموقع، أو ما تم الاتفاق عليه مع العميل..."
                  value={interactionForm.summary}
                  onChange={(e) => setInteractionForm({ ...interactionForm, summary: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInteractionModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-xs"
                >
                  حفظ التقرير
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
