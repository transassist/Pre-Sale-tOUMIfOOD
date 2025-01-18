import { useState } from 'react'

export default function DateRangePicker({ dateRange, setDateRange }) {
  const handleStartDateChange = (e) => {
    setDateRange(prev => ({
      ...prev,
      startDate: new Date(e.target.value)
    }))
  }

  const handleEndDateChange = (e) => {
    setDateRange(prev => ({
      ...prev,
      endDate: new Date(e.target.value)
    }))
  }

  return (
    <div className="flex space-x-4 rtl:space-x-reverse">
      <div>
        <label className="block text-sm font-medium text-gray-700">من تاريخ</label>
        <input
          type="date"
          value={dateRange.startDate.toISOString().split('T')[0]}
          onChange={handleStartDateChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">إلى تاريخ</label>
        <input
          type="date"
          value={dateRange.endDate.toISOString().split('T')[0]}
          onChange={handleEndDateChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
    </div>
  )
}
