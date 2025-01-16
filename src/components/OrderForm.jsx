import React, { useState } from 'react';
    import { FaSearch, FaPlus, FaMinus } from 'react-icons/fa';

    const OrderForm = ({ products, addOrder }) => {
      const [clientInfo, setClientInfo] = useState({
        name: '',
        phone: '',
        deliveryDate: ''
      });
      const [selectedProducts, setSelectedProducts] = useState([]);
      const [searchTerm, setSearchTerm] = useState('');
      const [selectedCategory, setSelectedCategory] = useState('');
      const [selectedProduct, setSelectedProduct] = useState(null);

      const handleAddProduct = () => {
        if (selectedProduct) {
          setSelectedProducts([...selectedProducts, {
            ...selectedProduct,
            quantity: 1,
            unit: 'KG',
          }]);
          setSelectedProduct(null);
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!clientInfo.name || selectedProducts.length === 0) return;
        addOrder({
          client: clientInfo,
          products: selectedProducts,
          date: new Date().toISOString()
        });
        setClientInfo({ name: '', phone: '', deliveryDate: '' });
        setSelectedProducts([]);
      };

      const filteredProducts = products.filter(product => {
        const matchesSearch = product.Name.includes(searchTerm) ||
          product.SKU.includes(searchTerm);
        const matchesCategory = selectedCategory ?
          product.Category === selectedCategory : true;
        return matchesSearch && matchesCategory;
      });

      return (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              placeholder="اسم العميل"
              value={clientInfo.name}
              onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
              className="p-2 border rounded"
              required
            />
            <input
              type="tel"
              placeholder="رقم الهاتف"
              value={clientInfo.phone}
              onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="date"
              value={clientInfo.deliveryDate}
              onChange={(e) => setClientInfo({ ...clientInfo, deliveryDate: e.target.value })}
              className="p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <div className="flex gap-2 mb-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">كل الفئات</option>
                <option value="مكسرات">مكسرات</option>
                <option value="القطاني">القطاني</option>
                <option value="العطرية">العطرية</option>
                <option value="فواكه جافة">فواكه جافة</option>
              </select>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="بحث بالاسم أو SKU"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 border rounded w-full pl-10"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <select
                value={selectedProduct ? selectedProduct.SKU : ''}
                onChange={(e) => {
                  const selected = filteredProducts.find(p => p.SKU === e.target.value);
                  setSelectedProduct(selected || null);
                }}
                className="p-2 border rounded flex-1"
              >
                <option value="">اختر منتج</option>
                {filteredProducts.map(product => (
                  <option key={product.SKU} value={product.SKU}>
                    {product.Name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddProduct}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={!selectedProduct}
              >
                <FaPlus />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">المنتجات المختارة</h2>
            {selectedProducts.map((product, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <span className="font-bold">{product.Name}</span>
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => {
                    const newProducts = [...selectedProducts];
                    newProducts[index].quantity = e.target.value;
                    setSelectedProducts(newProducts);
                  }}
                  className="p-2 border rounded w-16 text-center"
                  min="1"
                />
                <span className="p-2 border rounded">كيلوغرام</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
                  }}
                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                >
                  <FaMinus size="0.7em"/>
                </button>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            إضافة الطلب
          </button>
        </form>
      );
    };

    export default OrderForm;
