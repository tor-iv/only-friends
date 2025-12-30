'use client'

import { useEffect, useState } from 'react'
import { testConnection } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function TestPage() {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const runConnectionTest = async () => {
    setConnectionStatus('testing')
    setErrorMessage('')
    
    try {
      const isConnected = await testConnection()
      if (isConnected) {
        setConnectionStatus('success')
      } else {
        setConnectionStatus('error')
        setErrorMessage('Connection test returned false')
      }
    } catch (error) {
      setConnectionStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred')
      console.error('Connection test failed:', error)
    }
  }

  useEffect(() => {
    // Automatically run test when page loads
    runConnectionTest()
  }, [])

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />
      default:
        return null
    }
  }

  const getStatusMessage = () => {
    switch (connectionStatus) {
      case 'testing':
        return 'Testing Supabase connection...'
      case 'success':
        return '✅ Supabase connection successful!'
      case 'error':
        return `❌ Supabase connection failed: ${errorMessage}`
      default:
        return 'Ready to test connection'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Supabase Connection Test</CardTitle>
          <CardDescription>
            Testing your database connection and environment setup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusMessage()}</span>
          </div>

          {connectionStatus === 'error' && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                Troubleshooting Tips:
              </h4>
              <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
                <li>• Check that .env.local exists with your Supabase credentials</li>
                <li>• Verify NEXT_PUBLIC_SUPABASE_URL is correct</li>
                <li>• Verify NEXT_PUBLIC_SUPABASE_ANON_KEY is correct</li>
                <li>• Make sure your Supabase project is active</li>
                <li>• Check browser console for detailed error messages</li>
              </ul>
            </div>
          )}

          {connectionStatus === 'success' && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-sm text-green-800 dark:text-green-200">
                Great! Your Supabase connection is working. You can now proceed with setting up your database schema.
              </p>
            </div>
          )}

          <Button 
            onClick={runConnectionTest} 
            disabled={connectionStatus === 'testing'}
            className="w-full"
          >
            {connectionStatus === 'testing' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Connection Again'
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Check the browser console for detailed logs
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
