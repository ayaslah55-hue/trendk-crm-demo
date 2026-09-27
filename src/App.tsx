import React, { useState } from 'react';
import { AppView, JournalEntry, DoorMeasurement, PurchaseOrder } from './types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_DOOR_MEASUREMENTS,
  INITIAL_QUOTATIONS,
  INITIAL_CONTRACTS,
  INITIAL_PRODUCTION_ORDERS,
  INITIAL_BOM_PRODUCTS,
  INITIAL_INVENTORY,
  INITIAL_WASTE_RECORDS,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_EXPENSES,
  INITIAL_PROJECT_COSTINGS,
  INITIAL_INSTALLATION,
} from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StoryWalkthroughView } from './components/StoryWalkthroughView';
import { DashboardView } from './components/DashboardView';
import { DoorMeasurementsView } from './components/DoorMeasurementsView';
import { QuotationView } from './components/QuotationView';
import { ContractAndMilestonesView } from './components/ContractAndMilestonesView';
import { ProductionOrderView } from './components/ProductionOrderView';
import { BOMAndWarehouseView } from './components/BOMAndWarehouseView';
import { WasteView } from './components/WasteView';
import { PurchasesView } from './components/PurchasesView';
import { AccountingLedgerView } from './components/AccountingLedgerView';
import { ExpensesAndProfitabilityView } from './components/ExpensesAndProfitabilityView';
import { CustomersView } from './components/CustomersView';
import { FinancialStatementsView } from './components/FinancialStatementsView';
import { InstallationWarrantyView } from './components/InstallationWarrantyView';
import { JournalEntryModal } from './components/JournalEntryModal';

export default function App() {
  // Default to dashboard for immediate executive overview or story
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [selectedJournalEntry, setSelectedJournalEntry] = useState<JournalEntry | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // App persistent demo states
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [doorMeasurements, setDoorMeasurements] = useState(INITIAL_DOOR_MEASUREMENTS);
  const [quotation, setQuotation] = useState(INITIAL_QUOTATIONS[0]);
  const [contract, setContract] = useState(INITIAL_CONTRACTS[0]);
  const [productionOrders, setProductionOrders] = useState(INITIAL_PRODUCTION_ORDERS);
  const [bomProducts, setBomProducts] = useState(INITIAL_BOM_PRODUCTS);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [wasteRecords, setWasteRecords] = useState(INITIAL_WASTE_RECORDS);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [purchaseOrders, setPurchaseOrders] = useState(INITIAL_PURCHASE_ORDERS);
  const [journalEntries, setJournalEntries] = useState(INITIAL_JOURNAL_ENTRIES);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [projectCostings, setProjectCostings] = useState(INITIAL_PROJECT_COSTINGS);
  const [installation, setInstallation] = useState(INITIAL_INSTALLATION);

  const handleOpenJournalEntry = (entry: JournalEntry) => {
    setSelectedJournalEntry(entry);
  };

  const handleCloseJournalModal = () => {
    setSelectedJournalEntry(null);
  };

  const handleConvertToContract = () => {
    setQuotation((prev) => ({ ...prev, status: 'converted' }));
    setCurrentView('contracts');
  };

  // 1. Record Customer Payment (from CustomersView)
  const handleRecordCustomerPayment = (
    customerId: string,
    amount: number,
    paymentMethod: string,
    notes?: string
  ) => {
    const cust = customers.find((c) => c.id === customerId);
    const customerName = cust?.name || 'العميل';

    // Update customers state
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const newPaid = (c.totalPaid || 0) + amount;
          const newBalance = Math.max(0, (c.currentBalance || 0) - amount);
          return {
            ...c,
            totalPaid: newPaid,
            currentBalance: newBalance,
          };
        }
        return c;
      })
    );

    // Also update contract if matching
    if (contract && (contract.customerName === customerName || cust?.id === 'cust-001')) {
      setContract((prev) => ({
        ...prev,
        receivedAmount: (prev.receivedAmount || 0) + amount,
        remainingAmount: Math.max(0, (prev.remainingAmount || 0) - amount),
      }));
    }

    // Generate Journal Entry
    const newJv: JournalEntry = {
      id: `jv-pmt-${Date.now()}`,
      entryNumber: `JV-2026-${(journalEntries.length + 1).toString().padStart(4, '0')}`,
      date: new Date().toISOString().split('T')[0],
      memo: `تحصيل دفعة مالية من العميل (${customerName}) - ${notes || 'سداد رصيد تعاقدي'}`,
      referenceNumber: `REC-${Date.now().toString().slice(-4)}`,
      sourceType: 'Receipt Voucher',
      lines: [
        {
          accountId: 'acc-1101',
          accountCode: '1101',
          accountName: paymentMethod === 'bank_transfer' ? 'البنك الأهلي المصري - جاري' : 'الخزينة النقدية الرئيسية',
          debit: amount,
          credit: 0,
          description: `سند قبض نقدي / بنكي (${paymentMethod})`,
        },
        {
          accountId: 'acc-1103',
          accountCode: '1103',
          accountName: 'العملاء وحسابات المدينين',
          debit: 0,
          credit: amount,
          description: `تسوية وتخفيض مديونية العميل: ${customerName}`,
        },
      ],
      totalDebit: amount,
      totalCredit: amount,
      isBalanced: true,
      createdBy: 'النظام المحاسبي الآلي',
      projectRef: 'PROJ-NEW-CAIRO',
    };

    setJournalEntries((prev) => [newJv, ...prev]);
  };

  // 2. Record Milestone Payment (from ContractAndMilestonesView)
  const handleRecordContractPayment = (
    milestoneId: string,
    amount: number,
    milestoneName: string
  ) => {
    // Update contract milestones
    setContract((prev) => {
      const updatedMilestones = prev.milestones.map((m) =>
        m.id === milestoneId ? { ...m, status: 'paid' as const } : m
      );
      const newReceived = (prev.receivedAmount || 0) + amount;
      const newRemaining = Math.max(0, (prev.totalContractValue || 0) - newReceived);
      return {
        ...prev,
        milestones: updatedMilestones,
        receivedAmount: newReceived,
        remainingAmount: newRemaining,
      };
    });

    // Update customer balance
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.name === contract.customerName || c.id === 'cust-001') {
          return {
            ...c,
            totalPaid: (c.totalPaid || 0) + amount,
            currentBalance: Math.max(0, (c.currentBalance || 0) - amount),
          };
        }
        return c;
      })
    );

    // Create journal entry
    const newJv: JournalEntry = {
      id: `jv-milestone-${Date.now()}`,
      entryNumber: `JV-2026-${(journalEntries.length + 1).toString().padStart(4, '0')}`,
      date: new Date().toISOString().split('T')[0],
      memo: `تحصيل دفعة مرحلية عقدية (${milestoneName}) - مشروع ${contract.projectName}`,
      referenceNumber: `MS-REC-${milestoneId.slice(-3)}`,
      sourceType: 'Advance Payment',
      lines: [
        {
          accountId: 'acc-1101',
          accountCode: '1101',
          accountName: 'البنك الأهلي المصري - جاري',
          debit: amount,
          credit: 0,
          description: `تحصيل ${milestoneName}`,
        },
        {
          accountId: 'acc-2103',
          accountCode: '2103',
          accountName: 'دفعات مقدمة من العملاء والتعاقدات',
          debit: 0,
          credit: amount,
          description: `إثبات دفعة عقدية - العميل: ${contract.customerName}`,
        },
      ],
      totalDebit: amount,
      totalCredit: amount,
      isBalanced: true,
      createdBy: 'النظام المحاسبي الآلي',
      projectRef: contract.projectName,
    };

    setJournalEntries((prev) => [newJv, ...prev]);
  };

  // 3. Issue Materials to WIP (from BOMAndWarehouseView)
  const handleIssueMaterials = (
    orderId: string,
    itemId: string,
    quantity: number,
    stageName?: string
  ) => {
    const item = inventory.find((i) => i.id === itemId);
    const itemName = item?.name || 'خامات تصنيع';
    const unitPrice = item?.unitPrice || 100;
    const totalCost = quantity * unitPrice;

    // Deduct from inventory
    setInventory((prev) =>
      prev.map((i) => {
        if (i.id === itemId) {
          const newQty = Math.max(0, i.currentStock - quantity);
          return {
            ...i,
            currentStock: newQty,
            totalValue: newQty * i.unitPrice,
          };
        }
        return i;
      })
    );

    // Generate Journal Entry: Dr. WIP (1106), Cr. Raw Materials (1104)
    const newJv: JournalEntry = {
      id: `jv-issue-${Date.now()}`,
      entryNumber: `JV-2026-${(journalEntries.length + 1).toString().padStart(4, '0')}`,
      date: new Date().toISOString().split('T')[0],
      memo: `صرف خامات لورشة التصنيع (${itemName}) - كمية (${quantity} ${item?.unit || ''}) لمرحلة: ${stageName || 'التشغيل'}`,
      referenceNumber: `MRQ-${Date.now().toString().slice(-4)}`,
      sourceType: 'WIP Material Issue',
      lines: [
        {
          accountId: 'acc-1106',
          accountCode: '1106',
          accountName: 'تشغيل تحت التنفيذ (WIP) - خامات ومستلزمات',
          debit: totalCost,
          credit: 0,
          description: `صرف خامات لأمر تشغيل: ${orderId}`,
        },
        {
          accountId: 'acc-1104',
          accountCode: '1104',
          accountName: 'مخزون خامات ومستلزمات إنتاج',
          debit: 0,
          credit: totalCost,
          description: `صرف من مخزن الخامات (${itemName})`,
        },
      ],
      totalDebit: totalCost,
      totalCredit: totalCost,
      isBalanced: true,
      createdBy: 'النظام المحاسبي الآلي',
      projectRef: orderId,
    };

    setJournalEntries((prev) => [newJv, ...prev]);
  };

  // 4. Receive Stock / Raw materials (from BOMAndWarehouseView)
  const handleReceiveStock = (
    itemId: string,
    quantity: number,
    unitPrice: number
  ) => {
    const item = inventory.find((i) => i.id === itemId);
    const itemName = item?.name || 'خامات واردة';
    const totalCost = quantity * unitPrice;

    setInventory((prev) =>
      prev.map((i) => {
        if (i.id === itemId) {
          const newQty = i.currentStock + quantity;
          return {
            ...i,
            currentStock: newQty,
            totalValue: newQty * i.unitPrice,
          };
        }
        return i;
      })
    );

    // Generate Journal Entry: Dr. Raw Materials (1104), Cr. Accounts Payable (2101)
    const newJv: JournalEntry = {
      id: `jv-rec-${Date.now()}`,
      entryNumber: `JV-2026-${(journalEntries.length + 1).toString().padStart(4, '0')}`,
      date: new Date().toISOString().split('T')[0],
      memo: `توريد خامات للمخازن (${itemName}) - إذن إضافة مخزني كمية (${quantity} ${item?.unit || ''})`,
      referenceNumber: `GRN-${Date.now().toString().slice(-4)}`,
      sourceType: 'Purchase Invoice',
      lines: [
        {
          accountId: 'acc-1104',
          accountCode: '1104',
          accountName: 'مخزون خامات ومستلزمات إنتاج',
          debit: totalCost,
          credit: 0,
          description: `إضافة مخزنية - توريد خامات: ${itemName}`,
        },
        {
          accountId: 'acc-2101',
          accountCode: '2101',
          accountName: 'الموردون وحسابات الدائنين',
          debit: 0,
          credit: totalCost,
          description: `استحقاق فاتورة مورد خامات`,
        },
      ],
      totalDebit: totalCost,
      totalCredit: totalCost,
      isBalanced: true,
      createdBy: 'النظام المحاسبي الآلي',
    };

    setJournalEntries((prev) => [newJv, ...prev]);
  };

  // 5. Advance Stage in Production Order
  const handleAdvanceStage = (orderId: string, stageId: string) => {
    setProductionOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const stageIndex = order.stages.findIndex((s) => s.id === stageId);
          if (stageIndex === -1) return order;

          const updatedStages = order.stages.map((s, idx) => {
            if (idx === stageIndex) {
              return { ...s, status: 'completed' as const, progressPercentage: 100 };
            }
            if (idx === stageIndex + 1 && s.status === 'waiting') {
              return { ...s, status: 'in_progress' as const, progressPercentage: 25 };
            }
            return s;
          });

          const completedCount = updatedStages.filter((s) => s.status === 'completed').length;
          const newOverallProgress = Math.round((completedCount / updatedStages.length) * 100);

          return {
            ...order,
            stages: updatedStages,
            overallProgress: newOverallProgress,
            status: newOverallProgress >= 100 ? ('completed' as const) : order.status,
          };
        }
        return order;
      })
    );
  };

  // 6. Complete Production Order and Handover to Site
  const handleCompleteProductionOrder = (orderId: string) => {
    // Check if Finished Goods JV already exists
    const hasFgJv = journalEntries.some((j) => j.sourceType === 'Finished Goods');
    if (!hasFgJv) {
      const fgCost = 52000;
      const newJv: JournalEntry = {
        id: `jv-fg-${Date.now()}`,
        entryNumber: `JV-2026-${(journalEntries.length + 1).toString().padStart(4, '0')}`,
        date: new Date().toISOString().split('T')[0],
        memo: `إتمام تصنيع الأبواب وتحويلها من تشغيل تحت التنفيذ (WIP) إلى مخزون منتج تام`,
        referenceNumber: `FG-${orderId.slice(-3)}`,
        sourceType: 'Finished Goods',
        lines: [
          {
            accountId: 'acc-1105',
            accountCode: '1105',
            accountName: 'مخزون إنتاج تام (Finished Goods)',
            debit: fgCost,
            credit: 0,
            description: 'استلام الأبواب تامة الصنع من خط الإنتاج',
          },
          {
            accountId: 'acc-1106',
            accountCode: '1106',
            accountName: 'تشغيل تحت التنفيذ (WIP)',
            debit: 0,
            credit: fgCost,
            description: 'إقفال تكاليف التشغيل المباشرة',
          },
        ],
        totalDebit: fgCost,
        totalCredit: fgCost,
        isBalanced: true,
        createdBy: 'النظام المحاسبي الآلي',
        projectRef: orderId,
      };
      setJournalEntries((prev) => [newJv, ...prev]);
    }

    setCurrentView('installation_warranty');
  };

  // 7. Receive Purchase Order (GRN)
  const handleReceivePurchaseOrder = (poId: string) => {
    const po = purchaseOrders.find((p) => p.id === poId);
    if (!po) return;

    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === poId ? { ...p, status: 'تم الاستلام' } : p))
    );

    // Increase stock for items
    if (po.items && po.items.length > 0) {
      setInventory((prev) =>
        prev.map((inv) => {
          const matchedItem = po.items.find((i) =>
            inv.name.includes(i.itemDescription) || i.itemDescription.includes(inv.name)
          );
          if (matchedItem) {
            const newStock = inv.currentStock + matchedItem.quantity;
            return {
              ...inv,
              currentStock: newStock,
              totalValue: newStock * inv.unitPrice,
            };
          }
          return inv;
        })
      );
    }

    // Generate Journal Entry
    const newJv: JournalEntry = {
      id: `jv-grn-${Date.now()}`,
      entryNumber: `JV-2026-${(journalEntries.length + 1).toString().padStart(4, '0')}`,
      date: new Date().toISOString().split('T')[0],
      memo: `استلام خامات وفحص جودة GRN - أمر شراء: ${po.poNumber} (${po.supplierName})`,
      referenceNumber: `GRN-${po.poNumber}`,
      sourceType: 'Purchase Invoice',
      lines: [
        {
          accountId: 'acc-1104',
          accountCode: '1104',
          accountName: 'مخزون خامات ومستلزمات إنتاج',
          debit: po.totalAmount,
          credit: 0,
          description: `استلام خامات من المورد: ${po.supplierName}`,
        },
        {
          accountId: 'acc-2101',
          accountCode: '2101',
          accountName: 'الموردون وحسابات الدائنين',
          debit: 0,
          credit: po.totalAmount,
          description: `استحقاق فاتورة توريد أمر الشراء: ${po.poNumber}`,
        },
      ],
      totalDebit: po.totalAmount,
      totalCredit: po.totalAmount,
      isBalanced: true,
      createdBy: 'النظام المحاسبي الآلي',
      projectRef: po.poNumber,
    };

    setJournalEntries((prev) => [newJv, ...prev]);
  };

  // 8. Pay Supplier
  const handlePaySupplier = (poId: string) => {
    const po = purchaseOrders.find((p) => p.id === poId);
    if (!po) return;

    setPurchaseOrders((prev) =>
      prev.map((p) =>
        p.id === poId
          ? {
              ...p,
              status: 'مسدد بالكامل',
              paidAmount: p.totalAmount,
              remainingAmount: 0,
            }
          : p
      )
    );

    // Update supplier balance
    setSuppliers((prev) =>
      prev.map((s) => {
        if (s.id === po.supplierId || s.name === po.supplierName) {
          return {
            ...s,
            balanceDue: Math.max(0, (s.balanceDue || 0) - po.totalAmount),
          };
        }
        return s;
      })
    );

    // Generate Journal Entry: Dr. Suppliers (2101), Cr. Bank (1101)
    const newJv: JournalEntry = {
      id: `jv-supp-pay-${Date.now()}`,
      entryNumber: `JV-2026-${(journalEntries.length + 1).toString().padStart(4, '0')}`,
      date: new Date().toISOString().split('T')[0],
      memo: `سداد مستحقات المورد (${po.supplierName}) - تحويل بنكي لفاتورة أمر الشراء: ${po.poNumber}`,
      referenceNumber: `PAY-${Date.now().toString().slice(-4)}`,
      sourceType: 'Payment Voucher',
      lines: [
        {
          accountId: 'acc-2101',
          accountCode: '2101',
          accountName: 'الموردون وحسابات الدائنين',
          debit: po.totalAmount,
          credit: 0,
          description: `تسوية وسداد مديونية: ${po.supplierName}`,
        },
        {
          accountId: 'acc-1101',
          accountCode: '1101',
          accountName: 'البنك الأهلي المصري - جاري',
          debit: 0,
          credit: po.totalAmount,
          description: `تحويل بنكي صادر لسداد أمر شراء: ${po.poNumber}`,
        },
      ],
      totalDebit: po.totalAmount,
      totalCredit: po.totalAmount,
      isBalanced: true,
      createdBy: 'النظام المحاسبي الآلي',
      projectRef: po.poNumber,
    };

    setJournalEntries((prev) => [newJv, ...prev]);
  };

  // 9. Create Purchase Order
  const handleCreatePO = (newPO: PurchaseOrder) => {
    setPurchaseOrders((prev) => [newPO, ...prev]);
  };

  // 10. Complete Handover
  const handleCompleteHandover = (signatureName: string) => {
    const today = new Date().toISOString().split('T')[0];

    setInstallation((prev) => ({
      ...prev,
      customerSignature: signatureName,
      customerSignatureDate: today,
      status: 'تسليم نهائي معتمد',
    }));

    setCustomers((prev) =>
      prev.map((c) => (c.id === 'cust-001' ? { ...c, projectStatus: 'completed' as const } : c))
    );

    // Generate Final Sales Recognition and COGS entries
    const cogsAmount = 52000;
    const newJv: JournalEntry = {
      id: `jv-handover-${Date.now()}`,
      entryNumber: `JV-2026-${(journalEntries.length + 1).toString().padStart(4, '0')}`,
      date: today,
      memo: `إثبات تكلفة البضاعة المباعة (COGS) وتسليم فيلا التجمع النهائي للعميل (${signatureName})`,
      referenceNumber: `HO-${Date.now().toString().slice(-4)}`,
      sourceType: 'COGS Realization',
      lines: [
        {
          accountId: 'acc-5101',
          accountCode: '5101',
          accountName: 'تكلفة البضاعة المباعة (COGS) - تصنيع أخشاب',
          debit: cogsAmount,
          credit: 0,
          description: `إقفال تكلفة تصنيع الأبواب بعد الاستلام النهائي`,
        },
        {
          accountId: 'acc-1105',
          accountCode: '1105',
          accountName: 'مخزون إنتاج تام (Finished Goods)',
          debit: 0,
          credit: cogsAmount,
          description: `صرف الأبواب وتثبيتها بموقع العميل`,
        },
      ],
      totalDebit: cogsAmount,
      totalCredit: cogsAmount,
      isBalanced: true,
      createdBy: 'النظام المحاسبي الآلي',
      projectRef: 'PROJ-NEW-CAIRO',
    };

    setJournalEntries((prev) => [newJv, ...prev]);
  };

  // 11. Add Door Measurement
  const handleAddDoorMeasurement = (newDoor: DoorMeasurement) => {
    setDoorMeasurements((prev) => [...prev, newDoor]);
  };

  const handleUpdateDoorStatus = (id: string, status: DoorMeasurement['status']) => {
    setDoorMeasurements((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d))
    );
  };

  // 12. Add Journal Entry from Financial Actions
  const handleAddJournalEntry = (newEntry: JournalEntry) => {
    setJournalEntries((prev) => [newEntry, ...prev]);
  };

  return (
    <div className="h-screen w-full flex overflow-hidden font-sans text-slate-800 bg-[#F1F5F9] selection:bg-blue-100 selection:text-blue-900">
      {/* Clean Minimalism Sidebar (Dark Slate #1E293B) */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Clean Minimalism Top Header */}
        <Header
          currentView={currentView}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Scrollable Main Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {currentView === 'story' && (
            <StoryWalkthroughView
              customer={customers[0]}
              contract={contract}
              quotation={quotation}
              measurements={doorMeasurements}
              productionOrder={productionOrders[0]}
              projectCosting={projectCostings[0]}
              journalEntries={journalEntries}
              onOpenJournalEntry={handleOpenJournalEntry}
              onNavigateToView={setCurrentView}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardView
              customers={customers}
              productionOrders={productionOrders}
              inventory={inventory}
              projectCostings={projectCostings}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'customers' && (
            <CustomersView
              customers={customers}
              onUpdateCustomers={setCustomers}
              onRecordCustomerPayment={handleRecordCustomerPayment}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'quotations' && (
            <QuotationView
              quotation={quotation}
              onConvertToContract={handleConvertToContract}
            />
          )}

          {currentView === 'contracts' && (
            <ContractAndMilestonesView
              contract={contract}
              journalEntries={journalEntries}
              onOpenJournalEntry={handleOpenJournalEntry}
              onRecordPayment={handleRecordContractPayment}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'measurements' && (
            <DoorMeasurementsView
              measurements={doorMeasurements}
              customers={customers}
              onAddDoorMeasurement={handleAddDoorMeasurement}
              onUpdateStatus={handleUpdateDoorStatus}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'production' && (
            <ProductionOrderView
              productionOrders={productionOrders}
              journalEntries={journalEntries}
              onOpenJournalEntry={handleOpenJournalEntry}
              onAdvanceStage={handleAdvanceStage}
              onCompleteProductionOrder={handleCompleteProductionOrder}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'bom_warehouse' && (
            <BOMAndWarehouseView
              bomProducts={bomProducts}
              inventory={inventory}
              journalEntries={journalEntries}
              onOpenJournalEntry={handleOpenJournalEntry}
              onIssueMaterials={handleIssueMaterials}
              onReceiveStock={handleReceiveStock}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'waste' && (
            <WasteView
              wasteRecords={wasteRecords}
            />
          )}

          {currentView === 'purchases' && (
            <PurchasesView
              suppliers={suppliers}
              purchaseOrders={purchaseOrders}
              journalEntries={journalEntries}
              onOpenJournalEntry={handleOpenJournalEntry}
              onReceivePurchaseOrder={handleReceivePurchaseOrder}
              onPaySupplier={handlePaySupplier}
              onCreatePO={handleCreatePO}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'financial_reports' && (
            <FinancialStatementsView
              journalEntries={journalEntries}
              onOpenJournalEntry={handleOpenJournalEntry}
              onAddJournalEntry={handleAddJournalEntry}
              customers={customers}
              contract={contract}
              onNavigate={setCurrentView}
            />
          )}

          {(currentView === 'accounting_ledger' || currentView === 'invoices') && (
            <AccountingLedgerView
              journalEntries={journalEntries}
              onOpenJournalEntry={handleOpenJournalEntry}
            />
          )}

          {currentView === 'expenses_profitability' && (
            <ExpensesAndProfitabilityView
              projectCostings={projectCostings}
              expenses={expenses}
            />
          )}

          {currentView === 'installation_warranty' && (
            <InstallationWarrantyView
              installation={installation}
              journalEntries={journalEntries}
              onOpenJournalEntry={handleOpenJournalEntry}
              onCompleteHandover={handleCompleteHandover}
              onNavigate={setCurrentView}
            />
          )}
        </main>
      </div>

      {/* Global Accounting Entry Modal */}
      <JournalEntryModal
        entry={selectedJournalEntry}
        isOpen={!!selectedJournalEntry}
        onClose={handleCloseJournalModal}
      />
    </div>
  );
}
