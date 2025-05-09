"use client"

import { useNavigationHistory } from "@/hooks/use-navigation-history"
import { useState } from "react"

export default function DebugNavigation() {
  const { getHistory, clearHistory } = useNavigationHistory()
  const [showDebug, setShowDebug] = useState(false)

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <button onClick={() => setShowDebug(!showDebug)} className="bg-gray-800 text-white p-2 rounded-full shadow-lg">
        🔍
      </button>

      {showDebug && (
        <div className="fixed inset-0 bg-black/80 z-50 overflow-auto p-4">
          <div className="bg-white rounded-lg p-4 max-w-lg mx-auto my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Navigation History</h2>
              <div className="space-x-2">
                <button onClick={clearHistory} className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                  Clear History
                </button>
                <button
                  onClick={() => setShowDebug(false)}
                  className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="overflow-auto max-h-96">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">#</th>
                    <th className="text-left p-2">Path</th>
                    <th className="text-left p-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {getHistory().map((entry, index) => (
                    <tr key={entry.id} className="border-b">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2 font-mono">{entry.path}</td>
                      <td className="p-2 text-xs">{new Date(entry.timestamp).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
