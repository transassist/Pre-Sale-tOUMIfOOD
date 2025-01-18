import { useState } from 'react'
import { supabase } from '../supabaseClient'
import Papa from 'papaparse'

export default function OrderForm({ session }) {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [quantity, setQuantity] = useState('')

  useEffect(() => {
    fetch('/data/products.csv')
      .then(response => response.text())
      .then(csvData => {
        Papa.parse(csvData, {
          header: true,
          complete: (results) => {
            setProducts(results.data)
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

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">إضافة طلب جديد</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">المنتج</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">اختر منتجاً</option>
            {products.map((product) => (
              <option key={product.SKU} value={product.SKU}>
                {product.Name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">الكمية</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {loading ? 'جاري الإضافة...' : 'إضافة الطلب'}
        </button>
      </form>
    </div>
  )
}
