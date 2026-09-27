import React, { useState } from 'react';
import { BOMProduct, InventoryItem, JournalEntry } from '../types';
import {
  Boxes,
  Layers,
  Calculator,
  ArrowRightLeft,
  Plus,
  ArrowDownRight,
  ArrowUpLeft,
  AlertTriangle,
  Search,
  CheckCircle2,
  DollarSign,
  Package,
} from 'lucide-react';

interface BOMAndWarehouseViewProps {
  bomProducts: BOMProduct[];
  inventory: InventoryItem[];
  journalEntries: JournalEntry[];
  onOpenJournalEntry: (entry: JournalEntry) => void;
  onIssueMaterials?: (bomId: string, quantity: number) => void;
  onReceiveStock?: (itemId: string, quantity: number, unitCost: number) => void;
  onNavigate?: (view: any) => void;
}

export const BOMAndWarehouseView: React.FC<BOMAndWarehouseViewProps> = ({
  bomProducts,
  inventory,
  journalEntries,
  onOpenJournalEntry,
  onIssueMaterials,
  onReceiveStock,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'bom' | 'warehouses'>('bom');
  const [selectedBOM, setSelectedBOM] = useState<BOMProduct>(bomProducts[0]);
  const [selectedWarehouseCategory, setSelectedWarehouseCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [issueQuantity, setIssueQuantity] = useState<number>(10);
  const [isStockModalOpen, setIsStockModalOpen] = useState<boolean>(false);
  const [selectedItemForStock, setSelectedItemForStock] = useState<string>(inventory[0]?.id || '');
  const [addedStockQty, setAddedStockQty] = useState<number>(10);

  const categories = [
    { key: 'all', label: 'كافة المخازن', count: inventory.length },
    { key: 'أخشاب', label: 'مخزن الأخشاب الطبيعية (زان، موسكي، أرو، سويدي)', count: 4 },
    { key: 'ألواح', label: 'مخزن الألواح (MDF, HDF, Plywood, Melamine)', count: 4 },
    { key: 'إكسسوارات', label: 'مخزن الإكسسوارات والكوالين (مفصلات، مقابض، مجاري)', count: 4 },
    { key: 'دهانات', label: 'مخزن الدهانات والكيماويات (سيلر، برايمر، لاكيه، ورنيش)', count: 2 },
  ];

  const filteredInventory = inventory.filter((item) => {
    const matchesCategory = selectedWarehouseCategory === 'all' || item.category === selectedWarehouseCategory;
    const matchesSearch = item.name.includes(searchTerm) || item.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);

  // Total raw materials cost for selected BOM
  const rawMaterialsTotalCost = selectedBOM.materials.reduce((sum, m) => sum + m.totalCost, 0);
  const totalCostCalculated = rawMaterialsTotalCost + selectedBOM.directLaborCost + selectedBOM.overheadCost;
  const unitGrossProfit = selectedBOM.sellingPrice - totalCostCalculated;
  const calculatedMargin = Math.round((unitGrossProfit / selectedBOM.sellingPrice) * 100);

  const wipMaterialEntry = journalEntries.find((j) => j.id === 'jv-005');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              المخازن وقوائم المواد BOM
            </span>
            <span className="text-xs text-slate-500 font-mono">حساب التكلفة الفعلية للأثاث والأبواب</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Boxes className="w-6 h-6 text-indigo-600" />
            <span>جدول خامات المنتج (BOM) والمخازن التخصصية الأربعة</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            احتساب تكلفة الخامات بدقة (خشب، ألواح، قشرة، كوالين، دهانات) مع إدارة 4 مخازن وحدود الطلب والتأثير المحاسبي المباشر.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {wipMaterialEntry && (
            <button
              onClick={() => onOpenJournalEntry(wipMaterialEntry)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>قيد صرف الخامات WIP (JV-0005)</span>
            </button>
          )}
        </div>
      </div>

      {/* Mode Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('bom')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'bom'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>جدول خامات المنتج BOM والتكلفة الفعلية للباب</span>
        </button>

        <button
          onClick={() => setActiveTab('warehouses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'warehouses'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>المخازن الأربعة المتخصصة (الأخشاب، الألواح، الإكسسوارات، الدهانات)</span>
        </button>
      </div>

      {/* TAB 1: BOM CALCULATOR */}
      {activeTab === 'bom' && (
        <div className="space-y-6">
          {/* BOM Product Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">اختر نموذج الباب / المنتج:</span>
            {(bomProducts || []).map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedBOM(p)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  selectedBOM?.id === p.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
                }`}
              >
                {p.productName}
              </button>
            ))}
          </div>

          {/* BOM Materials Table */}
          {selectedBOM && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{selectedBOM.productName}</h3>
                  <span className="text-xs text-slate-500">حساب استهلاك الخامات المباشرة للباب الواحد</span>
                </div>
                <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-lg">
                  {selectedBOM.category}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs sm:text-sm">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">الخامة ومستلزم الإنتاج</th>
                      <th className="p-3.5">المخزن التابع</th>
                      <th className="p-3.5 text-center">الوحدة</th>
                      <th className="p-3.5 text-center">الكمية اللازمة</th>
                      <th className="p-3.5 text-center">تكلفة الوحدة</th>
                      <th className="p-3.5 text-center">إجمالي تكلفة الخامة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(selectedBOM?.materials || []).map((mat) => (
                    <tr key={mat.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">{mat.materialName}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                          {mat.warehouseCategory}
                        </span>
                      </td>
                      <td className="p-3.5 text-center text-slate-600">{mat.unit}</td>
                      <td className="p-3.5 text-center font-mono font-bold text-slate-800">
                        {mat.quantityPerUnit}
                      </td>
                      <td className="p-3.5 text-center font-mono text-slate-600">
                        {(mat.unitCost ?? 0).toLocaleString()} ج.م
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-slate-900">
                        {(mat.totalCost ?? 0).toLocaleString()} ج.م
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Costing calculation summary box */}
            <div className="p-5 bg-slate-900 text-white grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs font-mono">
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <span className="text-slate-400 block font-sans text-[11px]">إجمالي الخامات:</span>
                <span className="text-base font-bold text-white mt-1 block">
                  {(rawMaterialsTotalCost ?? 0).toLocaleString()} ج.م
                </span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <span className="text-slate-400 block font-sans text-[11px]">أجور تصنيع مباشرة:</span>
                <span className="text-base font-bold text-white mt-1 block">
                  {(selectedBOM.directLaborCost ?? 0).toLocaleString()} ج.م
                </span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <span className="text-slate-400 block font-sans text-[11px]">مصاريف صناعية وتشغيل:</span>
                <span className="text-base font-bold text-white mt-1 block">
                  {(selectedBOM.overheadCost ?? 0).toLocaleString()} ج.م
                </span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-lg border border-amber-500/30">
                <span className="text-amber-400 block font-sans text-[11px] font-bold">التكلفة الفعلية للباب:</span>
                <span className="text-lg font-bold text-amber-400 mt-1 block">
                  {(totalCostCalculated ?? 0).toLocaleString()} ج.م
                </span>
              </div>
              <div className="bg-emerald-950/80 p-3 rounded-lg border border-emerald-500/40">
                <span className="text-emerald-400 block font-sans text-[11px] font-bold">
                  سعر البيع ({(selectedBOM.sellingPrice ?? 0).toLocaleString()} ج.م):
                </span>
                <span className="text-lg font-bold text-emerald-400 mt-1 block">
                  ربح: {(unitGrossProfit ?? 0).toLocaleString()} ج.م ({calculatedMargin}%)
                </span>
              </div>
            </div>

            {/* Direct Workshop Dispatch (WIP Issue Action) */}
            <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold shrink-0">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    صرف خامات هذا المنتج لأمر التشغيل بالورشة (إذن صرف تشغيل WIP)
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    خصم الخامات آلياً من أرصدة المخازن وترحيل قيد (من حـ/ إنتاج تحت التشغيل 1105 إلى حـ/ مخزون الخامات 1104).
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 border border-slate-300 rounded-lg">
                  <span className="text-xs text-slate-600">الكمية:</span>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={issueQuantity}
                    onChange={(e) => setIssueQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-12 text-center font-bold text-xs"
                  />
                  <span className="text-xs text-slate-500">أبواب</span>
                </div>
                <button
                  onClick={() => onIssueMaterials && onIssueMaterials(selectedBOM.id, issueQuantity)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  <Package className="w-4 h-4" />
                  <span>إصدار إذن صرف تشغيل وقيد آلي</span>
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      )}

      {/* TAB 2: SPECIALIZED 4 WAREHOUSES */}
      {activeTab === 'warehouses' && (
        <div className="space-y-6">
          {/* Top warehouse stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-xs block">مخزن الأخشاب الطبيعية:</span>
              <span className="text-lg font-bold font-mono text-slate-900 mt-1 block">2,653,900 ج.م</span>
              <span className="text-[11px] text-slate-400">زان، موسكي، أرو، سويدي</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-xs block">مخزن الألواح والمسطحات:</span>
              <span className="text-lg font-bold font-mono text-slate-900 mt-1 block">611,350 ج.م</span>
              <span className="text-[11px] text-slate-400">MDF, HDF, Plywood, Melamine</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-xs block">مخزن الإكسسوارات والكوالين:</span>
              <span className="text-lg font-bold font-mono text-slate-900 mt-1 block">287,450 ج.م</span>
              <span className="text-[11px] text-slate-400">كوالين، مفصلات، مقابض، مجاري</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-xs block">مخزن الدهانات والكيماويات:</span>
              <span className="text-lg font-bold font-mono text-slate-900 mt-1 block">135,450 ج.م</span>
              <span className="text-[11px] text-slate-400">سيلر، برايمر، لاكيه، ورنيش</span>
            </div>
          </div>

          {/* Warehouses categories and search */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {(categories || []).map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedWarehouseCategory(cat.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                      selectedWarehouseCategory === cat.key
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative min-w-[180px]">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="بحث في المخزون أو الكود..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-3 pr-9 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  onClick={() => setIsStockModalOpen(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ إذن إضافة مخزنية</span>
                </button>
              </div>
            </div>

            {/* Inventory table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">كود الصنف</th>
                    <th className="p-3">اسم الخامة والمستلزم</th>
                    <th className="p-3">المخزن</th>
                    <th className="p-3 text-center">الوحدة</th>
                    <th className="p-3 text-center">الرصيد الحالي</th>
                    <th className="p-3 text-center">حد إعادة الطلب</th>
                    <th className="p-3 text-center">سعر الوحدة</th>
                    <th className="p-3 text-center">قيمة المخزون</th>
                    <th className="p-3">الموقع / الرف</th>
                    <th className="p-3 text-center">الإجراء المباشر</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(filteredInventory || []).map((item) => {
                    const isLowStock = item.currentStock <= item.minReorderLevel;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-700">{item.code}</td>
                        <td className="p-3 font-bold text-slate-900">{item.name}</td>
                        <td className="p-3 text-slate-600">{item.warehouseName}</td>
                        <td className="p-3 text-center text-slate-600">{item.unit}</td>
                        <td className="p-3 text-center font-mono font-bold text-slate-900 text-sm">
                          {item.currentStock}
                        </td>
                        <td className="p-3 text-center font-mono text-slate-500">
                          {item.minReorderLevel}
                        </td>
                        <td className="p-3 text-center font-mono text-slate-700">
                          {(item.unitPrice ?? 0).toLocaleString()} ج.م
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-indigo-700 text-sm">
                          {(item.totalValue ?? 0).toLocaleString()} ج.م
                        </td>
                        <td className="p-3 text-slate-500 text-[11px]">{item.locationShelf}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              setSelectedItemForStock(item.id);
                              setAddedStockQty(10);
                              setIsStockModalOpen(true);
                            }}
                            className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 text-indigo-700 hover:text-indigo-800 border border-slate-200 rounded text-[11px] font-bold transition-colors cursor-pointer"
                            title="إضافة رصيد مخزني وتوليد قيد التوريد"
                          >
                            + توريد
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Stock Addition Modal */}
      {isStockModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">إذن إضافة واستلام مخزني (توريد خامات)</h3>
            <p className="text-xs text-slate-500">
              سيتم زيادة رصيد الخامة المحددة بالمستودع فوراً وتوليد قيد محاسبي يثبت استحقاق المورد.
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اختر الصنف / الخامة:</label>
                <select
                  value={selectedItemForStock}
                  onChange={(e) => setSelectedItemForStock(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  {inventory.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.code}) - الرصيد الحالي: {i.currentStock} {i.unit}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">الكمية الواردة:</label>
                <input
                  type="number"
                  min="1"
                  value={addedStockQty}
                  onChange={(e) => setAddedStockQty(Math.max(1, Number(e.target.value)))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold font-mono"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsStockModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  const item = inventory.find((i) => i.id === selectedItemForStock);
                  if (item && onReceiveStock) {
                    onReceiveStock(item.id, addedStockQty, item.unitPrice);
                  }
                  setIsStockModalOpen(false);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                تأكيد الإضافة المخزنية وترحيل القيد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
