"use client"
import { useUser } from '@clerk/nextjs'
import { useQuery } from '@tanstack/react-query'

const DashboardPage = () => {
  const { user } = useUser();
  const { data, isLoading, error } = useQuery({
    queryKey: ["communities"],
    queryFn: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ id: 1, name: "test community" });
        }, 1000)
      })
    }
  })

  if (isLoading) {
    return <div>Loading ......</div>
  }

  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="page-wrapper">
      <div>
        <h1>Dashboard</h1>
        <p className='text-muted-foreground'>Welcome back, {user?.fullName}!</p>
      </div>
    </div>
  )
}

export default DashboardPage