import React, { useState, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";

function InvoiceItems() {
    const [items, setItems] = useState([{ description: "", quantity: 1, price: 0 }]);
    const [discount, setDiscount] = useState(0);
    const [discountType, setDiscountType] = useState<"amount" | "percent">("amount");

    const TAX_RATE = 0.085; // 8.5%

    // ➗ Calcular totais
    const { subtotal, tax, total } = useMemo(() => {
        const subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
        const tax = subtotal * TAX_RATE;

        let discountValue = 0;
        if (discountType === "amount") {
            discountValue = discount;
        } else if (discountType === "percent") {
            discountValue = (subtotal * discount) / 100;
        }

        const total = subtotal + tax - discountValue;
        return {
            subtotal,
            tax,
            total: total < 0 ? 0 : total, // evita negativo
        };
    }, [items, discount, discountType]);

    // ➕ Adicionar item
    const addInvoiceItem = () => {
        setItems([...items, { description: "", quantity: 1, price: 0 }]);
    };

    // ❌ Remover item
    const removeInvoiceItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    // Atualizar valores de inputs
    const updateItem = (index: number, field: string, value: string | number) => {
        const newItems = [...items];
        (newItems[index] as any)[field] = value;
        setItems(newItems);
    };

    return (
        <div>
            {/* Services & Items */}
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-display font-semibold">Services & Items</h4>
                <button
                    type="button"
                    onClick={addInvoiceItem}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium font-body focus:outline-none"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                </button>
            </div>

            <div id="invoiceItemsList" className="space-y-4">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="invoice-item grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-700"
                    >
                        <div className="md:col-span-5">
                            <label className="block text-sm font-medium mb-2 font-body">
                                Service/Item Description
                            </label>
                            <input
                                type="text"
                                value={item.description}
                                onChange={(e) => updateItem(index, "description", e.target.value)}
                                placeholder="e.g., General Consultation"
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body focus:outline-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 font-body">
                                Quantity
                            </label>
                            <input
                                type="number"
                                value={item.quantity}
                                min="1"
                                onChange={(e) =>
                                    updateItem(index, "quantity", Number(e.target.value))
                                }
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body focus:outline-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 font-body">
                                Unit Price
                            </label>
                            <input
                                type="number"
                                value={item.price}
                                step="0.01"
                                placeholder="0.00"
                                onChange={(e) =>
                                    updateItem(index, "price", Number(e.target.value))
                                }
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body focus:outline-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 font-body">
                                Total
                            </label>
                            <input
                                type="text"
                                readOnly
                                value={`$${(item.quantity * item.price).toFixed(2)}`}
                                className="item-total w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 font-body focus:outline-none"
                            />
                        </div>

                        <div className="md:col-span-1 flex items-end">
                            <button
                                type="button"
                                onClick={() => removeInvoiceItem(index)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors focus:outline-none"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Invoice Totals */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mt-6">
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="font-medium font-body">Subtotal:</span>
                        <span className="font-semibold font-display">
                            ${subtotal.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-medium font-body">Tax (8.5%):</span>
                        <span className="font-semibold font-display">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <label className="font-medium font-body">Discount:</label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={discount}
                                onChange={(e) => setDiscount(Number(e.target.value))}
                                className="w-20 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded text-sm font-body bg-white dark:bg-gray-900 focus:outline-none"
                            />
                            <select
                                value={discountType}
                                onChange={(e) =>
                                    setDiscountType(e.target.value as "amount" | "percent")
                                }
                                className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded text-sm font-body bg-white dark:bg-gray-900 focus:outline-none"
                            >
                                <option value="amount">$</option>
                                <option value="percent">%</option>
                            </select>
                        </div>
                    </div>
                    <hr className="border-gray-300 dark:border-gray-600" />
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold font-display">Total:</span>
                        <span className="text-lg font-bold text-purple-600 font-display">
                            ${total.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InvoiceItems;
