
import React from 'react'
import { Card, CardDescription, CardHeader } from '../ui/card'
import { CardTitle } from '../ui/card'

const StatsCard = ({ title, value }: { title: string, value: number }) => {

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className='text-3xl font-bold'>{value}</CardDescription>
      </CardHeader>
    </Card>
  )
}

export default StatsCard