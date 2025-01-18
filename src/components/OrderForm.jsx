import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import Papa from 'papaparse'

export default function OrderForm({ session }) {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [quantity, setQuantity] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetch('/data/products.csv')
      .then(response => response.text())
      .then(csvData => {
        Papa.parse(csvData, {
          header: true,
          complete: (results) => {
            // Filter out any invalid products
            const validProducts = results.data.filter(product => 
              product && product.Name && product.SKU && product.Category
            )
            setProducts(validProducts)
          }
        })
      })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            product_sku: selectedProduct,
            quantity,
            user_id: session.user.id,
          },
        ])

      if (error) throw error
      alert('تم إضافة الطلب بنجاح!')
      setSelectedProduct('')
      setQuantity('')
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product?.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">إضافة طلب جديد</h2>
        <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2">
          {filteredProducts.map((product) => (
            <button
              key={product.SKU}
              type="button"
              onClick={() => setSelectedProduct(product.SKU)}
              className={`p-3 rounded-lg text-center transition-all ${
                selectedProduct === product.SKU
                  ? 'bg-indigo-100 border-2 border-indigo-500 text-indigo-700'
                  : 'bg-gray-50 border border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="font-medium">{product.Name}</div>
              <div className="text-sm text-gray-500">{product.Category}</div>
            </button>
          ))}
        </div>

        {/* Quantity Input */}
        {selectedProduct && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">الكمية</label>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <button
                type="button"
                onClick={() => setQuantity(prev => Math.max(0, Number(prev) - 1).toString())}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="block w-20 text-center rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
              <button
                type="button"
                onClick={() => setQuantity(prev => (Number(prev) + 1).toString())}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !selectedProduct || !quantity}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
            loading || !selectedProduct || !quantity
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              جاري الإضافة...
            </div>
          ) : (
            'إضافة الطلب'
          )}
        </button>
      </form>
    </div>
  )
}
