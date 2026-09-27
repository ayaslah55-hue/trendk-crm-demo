import React, { useState } from 'react';
import { Supplier, PurchaseOrder, JournalEntry } from '../types';
import {
  ShoppingCart,
  FileCheck2,
  PackageCheck,
  Receipt,
  ArrowRightLeft,
  Users,
  Search,
  Building,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface PurchasesViewProps {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  journalEntries: JournalEntry[];
  onOpenJournalEntry: (entry: JournalEntry) => void;
  onReceivePurchaseOrder?: (poId: string) => void;
  onPaySupplier?: (poId: string) => void;
  onCreatePO?: (newPO: PurchaseOrder) => void;
  onNavigate?: (view: any) => void;
}

export const PurchasesView: React.FC<PurchasesViewProps> = ({
  suppliers,
  purchaseOrders,
  journalEntries,
  onOpenJournalEntry,
  onReceivePurchaseOrder,
  onPaySupplier,
  onCreatePO,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'suppliers'>('orders');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder>(purchaseOrders[0]);
  const [isCreatePOOpen, setIsCreatePOOpen] = useState<boolean>(false);
  const [newPOSupplierId, setNewPOSupplierId] = useState<string>(suppliers[0]?.id || '');
  const [newPOItemDesc, setNewPOItemDesc] = useState<string>('خشب زان روماني مبخر مجفف');
  const [newPOQty, setNewPOQty] = useState<number>(5);
  const [newPOUnit, setNewPOUnit] = useState<string>('متر مكعب');
  const [newPOUnitPrice, setNewPOUnitPrice] = useState<number>(36000);

  // Find PO entry
  const poEntry = journalEntries.find((j) => j.id === 'jv-003' || j.sourceType === 'Purchase Invoice');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              سلاسل الإمداد والمشتريات
            </span>
            <span className="text-xs text-slate-500 font-mono">الدورة المستندية الكاملة للموردين</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-amber-600" />
            <span>المشتريات وإدارة الموردين ودورة الشراء (PR ➔ PO ➔ GRN ➔ Invoice)</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            متابعة أوامر الشراء، فواتير الموردين، أذون الاستلام المخزني GRN، وتوليد قيود الاستحقاق والسداد آلياً.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreatePOOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <span>+ إنشاء أمر شراء خامات (PO)</span>
          </button>
          {poEntry && (
            <button
              onClick={() => onOpenJournalEntry(poEntry)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>قيد فاتورة المورد (JV-0003)</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Procurement Lifecycle Stages Indicator */}
      <div className="bg-slate-900 text-white rounded-2xl p-5">
        <h3 className="text-xs font-bold text-slate-400 mb-3">الدورة المستندية لمشتريات الخامات بالمصنع:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
            <span className="text-emerald-400 font-bold block text-sm">1. طلب شراء PR</span>
            <span className="text-slate-400 text-[11px] mt-0.5 block">احتياج ورشة النجارة والتصنيع</span>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
            <span className="text-emerald-400 font-bold block text-sm">2. أمر توريد PO</span>
            <span className="text-slate-400 text-[11px] mt-0.5 block">اعتماد عروض أسعار الموردين</span>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
            <span className="text-emerald-400 font-bold block text-sm">3. إذن فحص واستلام GRN</span>
            <span className="text-slate-400 text-[11px] mt-0.5 block">مطابقة الرطوبة والمقاسات بالمخزن</span>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl border border-emerald-500/40">
            <span className="text-emerald-400 font-bold block text-sm">4. فاتورة وقيد استحقاق</span>
            <span className="text-slate-400 text-[11px] mt-0.5 block">ترحيل مباشر إلى حساب المورد والضريبة</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'orders' ? 'bg-amber-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          أوامر الشراء وفواتير التوريد (PO)
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'suppliers' ? 'bg-amber-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          كشف حساب الموردين والمديونيات
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">أوامر التوريد الجارية للخامات</h3>
            <span className="text-xs text-slate-500 font-mono">إجمالي 2 أمر توريد مسجل</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">رقم الأمر PO</th>
                  <th className="p-3.5">المورد</th>
                  <th className="p-3.5">الخامات الموردة</th>
                  <th className="p-3.5 text-center">التاريخ</th>
                  <th className="p-3.5 text-center">إجمالي القيمة</th>
                  <th className="p-3.5 text-center">حالة الفاتورة</th>
                  <th className="p-3.5 text-center">القيد المحاسبي</th>
                  <th className="p-3.5 text-center">الإجراء المباشر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(purchaseOrders || []).map((po) => {
                  const entryId = (po as any).journalEntryId || (po.purchaseInvoiceId ? 'jv-003' : null);
                  const isFullyPaid = po.status === 'مسدد بالكامل';
                  const isReceived = po.status === 'تم الاستلام';
                  const isPendingSupply = po.status === 'قيد التوريد';

                  return (
                    <tr key={po.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-mono font-bold text-amber-700">{po.poNumber}</td>
                      <td className="p-3.5 font-bold text-slate-900">{po.supplierName}</td>
                      <td className="p-3.5 text-xs text-slate-600">
                        {(po.items || []).map((i) => `${i.itemDescription || (i as any).itemName || 'خامات'} (${i.quantity} ${i.unit})`).join('، ')}
                      </td>
                      <td className="p-3.5 text-center font-mono text-slate-600">{po.date}</td>
                      <td className="p-3.5 text-center font-mono font-bold text-slate-900">
                        {(po.totalAmount ?? 0).toLocaleString()} ج.م
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            isFullyPaid
                              ? 'bg-emerald-100 text-emerald-800'
                              : isPendingSupply
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {po.status || 'تم الاستلام'}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        {entryId ? (
                          <button
                            onClick={() => {
                              const entry = journalEntries.find((j) => j.id === entryId) || poEntry;
                              if (entry) onOpenJournalEntry(entry);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />
                            <span>عرض القيد JV</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs font-mono">يولد قيد آلي</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        {isFullyPaid ? (
                          <span className="text-emerald-700 text-xs font-bold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>مسدد</span>
                          </span>
                        ) : isPendingSupply ? (
                          <button
                            onClick={() => onReceivePurchaseOrder && onReceivePurchaseOrder(po.id)}
                            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            استلام فحص GRN
                          </button>
                        ) : (
                          <button
                            onClick={() => onPaySupplier && onPaySupplier(po.id)}
                            className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            سداد الفاتورة
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Purchase Order Modal */}
      {isCreatePOOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">إنشاء أمر شراء خامات جديد (Purchase Order)</h3>
            <p className="text-xs text-slate-500">
              سيتم إرسال أمر الشراء للمورد واعتماده بالدورة المستندية مع إمكانية استلام الخامات وسداد الفاتورة.
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">المورد المعتمد:</label>
                <select
                  value={newPOSupplierId}
                  onChange={(e) => setNewPOSupplierId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">بيان الخامة / المستلزم:</label>
                <input
                  type="text"
                  value={newPOItemDesc}
                  onChange={(e) => setNewPOItemDesc(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الكمية:</label>
                  <input
                    type="number"
                    min="1"
                    value={newPOQty}
                    onChange={(e) => setNewPOQty(Math.max(1, Number(e.target.value)))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الوحدة:</label>
                  <input
                    type="text"
                    value={newPOUnit}
                    onChange={(e) => setNewPOUnit(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">سعر الوحدة:</label>
                  <input
                    type="number"
                    min="1"
                    value={newPOUnitPrice}
                    onChange={(e) => setNewPOUnitPrice(Math.max(1, Number(e.target.value)))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                <span className="font-bold text-slate-800">إجمالي قيمة أمر الشراء:</span>
                <span className="font-mono font-black text-amber-800 text-base">
                  {(newPOQty * newPOUnitPrice).toLocaleString()} ج.م
                </span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatePOOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  const sup = suppliers.find((s) => s.id === newPOSupplierId) || suppliers[0];
                  const total = newPOQty * newPOUnitPrice;
                  const newPO: PurchaseOrder = {
                    id: `po-${Date.now()}`,
                    poNumber: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
                    supplierId: sup.id,
                    supplierName: sup.name,
                    date: new Date().toISOString().split('T')[0],
                    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
                    items: [
                      {
                        id: `poi-${Date.now()}`,
                        itemDescription: newPOItemDesc,
                        quantity: newPOQty,
                        unit: newPOUnit,
                        unitPrice: newPOUnitPrice,
                        total,
                      },
                    ],
                    totalAmount: total,
                    paidAmount: 0,
                    remainingAmount: total,
                    status: 'قيد التوريد',
                  };
                  if (onCreatePO) onCreatePO(newPO);
                  setIsCreatePOOpen(false);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                إصدار أمر الشراء واعتماده
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'suppliers' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">أرصدة ومديونيات موردي الخامات</h3>
            <span className="text-xs text-slate-500 font-mono">
              إجمالي المديونية:{' '}
              {(suppliers || [])
                .reduce((sum, s) => sum + (s.balanceDue ?? s.currentBalance ?? 0), 0)
                .toLocaleString()}{' '}
              ج.م
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">اسم المورد والشركة</th>
                  <th className="p-3.5">التخصص والخامات</th>
                  <th className="p-3.5">الهاتف والمسؤول</th>
                  <th className="p-3.5 text-center">شروط السداد</th>
                  <th className="p-3.5 text-center">الرصيد المستحق (ج.م)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(suppliers || []).map((sup) => {
                  const bal = sup.balanceDue ?? sup.currentBalance ?? 0;
                  return (
                    <tr key={sup.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">{sup.name}</td>
                      <td className="p-3.5 text-slate-600">{sup.category}</td>
                      <td className="p-3.5 font-mono text-slate-600">{sup.phone}</td>
                      <td className="p-3.5 text-center">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                          {sup.paymentTerms || 'أجل 30 يوم'}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-rose-700 text-base">
                        {bal.toLocaleString()} ج.م
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
