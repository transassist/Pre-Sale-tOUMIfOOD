import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/Auth'
import OrderForm from './components/OrderForm'
import OrderList from './components/OrderList'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      {!session ? (
        <Auth />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <OrderForm session={session} />
          <OrderList session={session} />
        </div>
      )}
    </div>
  )
}

export default App
