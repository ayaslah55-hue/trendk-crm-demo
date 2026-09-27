import React, { useState } from 'react';
import { ProductionOrder, ProductionStage, JournalEntry } from '../types';
import {
  Hammer,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRightLeft,
  Boxes,
  Users,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ProductionOrderViewProps {
  productionOrders: ProductionOrder[];
  journalEntries: JournalEntry[];
  onOpenJournalEntry: (entry: JournalEntry) => void;
  onAdvanceStage?: (orderId: string, stageId: string) => void;
  onCompleteProductionOrder?: (orderId: string) => void;
  onNavigate?: (view: any) => void;
}

export const ProductionOrderView: React.FC<ProductionOrderViewProps> = ({
  productionOrders,
  journalEntries,
  onOpenJournalEntry,
  onAdvanceStage,
  onCompleteProductionOrder,
  onNavigate,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(productionOrders[0]?.id || '');
  const activeOrder = productionOrders.find((o) => o.id === selectedOrderId) || productionOrders[0];

  const wipMaterialEntry = journalEntries.find((j) => j.id === 'jv-005' || j.sourceType === 'WIP Material Issue');
  const finishedGoodsEntry = journalEntries.find((j) => j.id === 'jv-007' || j.sourceType === 'Finished Goods');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              إدارة الإنتاج والعمليات الصناعية
            </span>
            <span className="text-xs text-slate-500 font-mono">أمر تشغيل: {activeOrder?.workOrderNumber}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Hammer className="w-6 h-6 text-blue-600" />
            <span>أوامر التصنيع ومراحل الإنتاج (Work Order)</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            متابعة خطوط تصنيع الأبواب والأثاث عبر 9 مراحل تنفيذية من التقطيع والكبس حتى الفحص النهائي QC والجاهزية للتركيب.
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

      {/* Orders Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(productionOrders || []).map((order) => (
          <button
            key={order.id}
            onClick={() => setSelectedOrderId(order.id)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              selectedOrderId === order.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <span className="font-mono text-amber-400">{order.workOrderNumber}</span>
            <span>- {order.projectTitle.slice(0, 30)}...</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                order.status === 'قيد التنفيذ' ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}
            >
              {order.overallProgress}%
            </span>
          </button>
        ))}
      </div>

      {/* Active Work Order Details Card */}
      {activeOrder && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pb-4 border-b border-slate-200">
            <div>
              <span className="text-slate-500 block">رقم أمر التشغيل:</span>
              <span className="font-bold font-mono text-slate-900 text-sm">{activeOrder.workOrderNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block">العميل والمشروع:</span>
              <span className="font-bold text-slate-800 text-sm">{activeOrder.customerName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">تاريخ الإطلاق:</span>
              <span className="font-mono text-slate-800">{activeOrder.createdAt}</span>
            </div>
            <div>
              <span className="text-slate-500 block">تاريخ التسليم المستهدف:</span>
              <span className="font-mono font-bold text-rose-700">{activeOrder.deliveryDate}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-4">
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">نسبة الإنجاز الإجمالية:</span>
            <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${activeOrder.overallProgress}%` }}
              />
            </div>
            <span className="text-sm font-black font-mono text-slate-900">{activeOrder.overallProgress}%</span>
          </div>
        </div>
      )}

      {/* 9 Stages Pipeline Workflow */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>مراحل خط الإنتاج التسعة (قص ➔ تجميع ➔ كبس ➔ قشرة ➔ صنفرة ➔ دهان ➔ إكسسوار ➔ QC ➔ تركيب)</span>
          </h3>
          <span className="text-xs text-slate-500">9 مراحل تشغيلية</span>
        </div>

        <div className="divide-y divide-slate-200">
          {(activeOrder?.stages || []).map((stage, idx) => {
            const isCompleted = stage.status === 'completed';
            const isInProgress = stage.status === 'in_progress';
            const isWaiting = stage.status === 'waiting';
            const isDelayed = stage.status === 'delayed';

            return (
              <div
                key={stage.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  isInProgress ? 'bg-blue-50/40' : isCompleted ? 'bg-emerald-50/20' : 'bg-white'
                }`}
              >
                {/* Left: Stage number, name, responsible */}
                <div className="flex items-start sm:items-center gap-3.5 flex-1">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isInProgress
                        ? 'bg-blue-600 text-white animate-pulse ring-4 ring-blue-100'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm sm:text-base text-slate-900">{stage.name}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isInProgress
                            ? 'bg-blue-100 text-blue-800'
                            : isDelayed
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isCompleted
                          ? 'مكتمل'
                          : isInProgress
                          ? 'قيد التشغيل'
                          : isDelayed
                          ? 'متأخر'
                          : 'بانتظار المرحلة السابقة'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{stage.responsiblePerson}</span>
                      </span>
                      <span className="font-mono text-slate-400">
                        {stage.startDate} ➔ {stage.endDate}
                      </span>
                      {stage.notes && <span className="text-amber-800 font-medium bg-amber-50 px-1.5 rounded">{stage.notes}</span>}
                    </div>
                  </div>
                </div>

                {/* Right: Progress & Status & Action */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200 hidden sm:block">
                    <div
                      className={`h-2 rounded-full ${isCompleted ? 'bg-emerald-600' : 'bg-blue-600'}`}
                      style={{ width: `${stage.progressPercentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700 w-10 text-center">
                    {stage.progressPercentage}%
                  </span>

                  {/* Stage action buttons */}
                  {isInProgress && (
                    <button
                      onClick={() => onAdvanceStage && onAdvanceStage(activeOrder.id, stage.id)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>إتمام المرحلة ➔</span>
                    </button>
                  )}
                  {isWaiting && (
                    <button
                      onClick={() => onAdvanceStage && onAdvanceStage(activeOrder.id, stage.id)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Play className="w-3 h-3 text-slate-500 inline ml-1" />
                      <span>بدء التشغيل</span>
                    </button>
                  )}
                  {isCompleted && (
                    <span className="text-[11px] text-emerald-700 font-bold px-2 py-1 bg-emerald-50 rounded-lg">
                      معتمد QC
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion & Handover Banner */}
      {activeOrder?.overallProgress >= 100 ? (
        <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                  اكتمال التصنيع 100%
                </span>
                <span className="text-xs text-slate-500 font-mono">{activeOrder.workOrderNumber}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base mt-0.5">
                تم الانتهاء من تصنيع كافة الأبواب وفحص الجودة النهائي QC بنجاح
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                جاهز للتغليف وإصدار إذن نقل منتج تام إلى الموقع وبدء إجراءات التركيب والتسليم النهائي.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
            {finishedGoodsEntry && (
              <button
                onClick={() => onOpenJournalEntry(finishedGoodsEntry)}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                قيد المنتج التام ↗
              </button>
            )}
            <button
              onClick={() => onCompleteProductionOrder && onCompleteProductionOrder(activeOrder.id)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <span>إصدار إذن منتج تام والانتقال للتركيب بالموقع ➔</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Boxes className="w-4 h-4 text-slate-400" />
            <span>بحاجة لخامات إضافية أو إذن صرف من المخازن؟</span>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('bom_warehouse')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors cursor-pointer"
            >
              الانتقال للمخازن وصرف الخامات ➔
            </button>
          )}
        </div>
      )}
    </div>
  );
};
