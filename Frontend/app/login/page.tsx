'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify"
import  authApi  from "@/apis/auth"

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  
  const onSubmit = async function (values: { username: string; password: string }) {
    try {
      // Ensure username and password are strings
      const sanitizedUsername = String(values.username)
      const sanitizedPassword = String(values.password)

      const response = await authApi.signIn(
        sanitizedUsername,
        sanitizedPassword
      )
      console.log(response);
      if (response.payload) {
        const role = response.payload.role
        console.log(role);
        toast.success("Đăng nhập thành công")
        if (role === 1) {
          console.log("Vao director")
          router.replace("/director")
        } else if (role === 2) {
          console.log("Vao teacher")
          router.replace("/teacher")
        } else if (role === 3) {
          console.log("Vao officer")
          router.replace("/officer")
        } else if (role === 4) {
          console.log("Vao student")
          router.replace("/student")
        }
      } else {
        throw new Error(response.payload.EM)
      }
    } catch (error) {
      toast.error("Đăng nhập không thành công, vui lòng thử lại")
      setError((error as Error).message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ username, password }); }} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button 
            type="submit" 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Log In
          </button>
        </form>
        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-100 border border-red-400 rounded-md p-2">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}