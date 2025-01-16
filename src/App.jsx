import React, { useState, useEffect } from 'react';
    import Papa from 'papaparse';
    import OrderForm from './components/OrderForm';
    import OrderList from './components/OrderList';
    import productsData from '../data/products.csv?raw';

    const App = () => {
      const [products, setProducts] = useState([]);
      const [orders, setOrders] = useState([]);
      const [fileName, setFileName] = useState('');

      useEffect(() => {
        loadProducts(productsData);
      }, []);

      const loadProducts = (csvData) => {
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setProducts(results.data);
          }
        });
      };

      const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
          setFileName(file.name);
          const reader = new FileReader();
          reader.onload = (e) => {
            loadProducts(e.target.result);
          };
          reader.readAsText(file);
        }
      };

      const addOrder = (order) => {
        const orderNumber = `ORD${orders.length + 1}-${Date.now()}`;
        setOrders([...orders, { ...order, orderNumber }]);
      };

      return (
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">إدارة طلبات البيع المسبق</h1>
            <div className="flex items-center">
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                {fileName ? 'تم الرفع: ' + fileName : 'رفع قائمة المنتجات'}
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
          <OrderForm products={products} addOrder={addOrder} />
          <OrderList orders={orders} />
        </div>
      );
    };

    export default App;
