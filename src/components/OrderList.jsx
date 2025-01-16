import React, { useState } from 'react';
    import { FaFileExport } from 'react-icons/fa';
    import jsPDF from 'jspdf';
    import 'jspdf-autotable';

    const OrderList = ({ orders }) => {
      const [expandedOrder, setExpandedOrder] = useState(null);

      const handleExport = () => {
        if (orders.length === 0) return;

        const aggregatedProducts = orders.reduce((acc, order) => {
          order.products.forEach(product => {
            const key = `${product.SKU}-${product.unit}`;
            if (!acc[key]) {
              acc[key] = {
                SKU: product.SKU,
                Name: product.Name,
                Unit: product.unit,
                Quantity: 0
              };
            }
            acc[key].Quantity += parseFloat(product.quantity);
          });
          return acc;
        }, {});

        const doc = new jsPDF();
        doc.setFont('Amiri-Regular', 'normal');
        doc.text('طلبات البيع المسبق', 10, 10, { align: 'right' });

        const firstOrderDate = new Date(orders[0].date);
        const lastOrderDate = new Date(orders[orders.length - 1].date);
        const formattedDateRange = `${firstOrderDate.toLocaleDateString()} - ${lastOrderDate.toLocaleDateString()}`;
        doc.text(formattedDateRange, 10, 20, { align: 'right' });

        const tableData = Object.values(aggregatedProducts).map(product => [
          product.SKU,
          product.Name,
          product.Quantity,
          product.Unit
        ]);

        doc.autoTable({
          head: [['SKU', 'اسم المنتج', 'الكمية', 'الوحدة']],
          body: tableData,
          styles: { font: 'Amiri-Regular', halign: 'right' },
          headStyles: { font: 'Amiri-Regular', halign: 'right' },
          margin: { top: 30 }
        });

        doc.save('aggregated_orders.pdf');
      };

      return (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">قائمة الطلبات</h2>
            <button
              onClick={handleExport}
              className="bg-green-500 text-white p-2 rounded flex items-center gap-2"
            >
              <FaFileExport />
              تصدير البيانات
            </button>
          </div>

          {orders.map((order, index) => (
            <div key={order.orderNumber} className="border rounded mb-4">
              <div
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedOrder(expandedOrder === index ? null : index)}
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold">{order.orderNumber}</h3>
                    <p>{order.client.name}</p>
                  </div>
                  <div>
                    <p>تاريخ الطلب: {new Date(order.date).toLocaleDateString()}</p>
                    <p>تاريخ التسليم: {order.client.deliveryDate}</p>
                  </div>
                </div>
              </div>

              {expandedOrder === index && (
                <div className="p-4 border-t">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left">المنتج</th>
                        <th className="text-left">الكمية</th>
                        <th className="text-left">الوحدة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products.map((product, i) => (
                        <tr key={i}>
                          <td>{product.Name}</td>
                          <td>{product.quantity}</td>
                          <td>{product.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    };

    export default OrderList;
