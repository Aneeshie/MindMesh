"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCommunites } from '@/hooks/use-community'
import { useEffect, useState } from 'react';


const CommunitiesPage = () => {

  const { data, isLoading, error } = useCommunites();

  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'my-goals' | 'find-study-mate'>('my-goals');

  useEffect(() => {

    if (data && data.length > 0) {
      setSelectedCommunity(data[0].community.id);
    }
  }, [data?.length])

  return (
    <div className="page-wrapper">

      <div className='flex items-start justify-between'>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Communities
          </h1>
          <p className="text-muted-foreground">
            Manage your communities and find new ones.
          </p>
        </div>
        <div>
          <Button variant={"outline"}>
            + Join more Community
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>
              Communities
            </CardTitle>
            <CardDescription>
              {data?.length} communities found.
            </CardDescription>
            <CardContent className='space-y-2'>
              {data?.map((community) => (
                <Button key={community.community.id} className={`w-full justify-start ${selectedCommunity === community.community.id ? 'bg-muted' : ''}`} onClick={() => setSelectedCommunity(community.community.id)}>
                  {community.community.name}
                </Button>
              ))}
            </CardContent>
          </CardHeader>
        </Card>


        <Card className='lg:col-span-2'>
          <CardHeader>
            <div className="flex gap-2 mb-4">
              <Button onClick={() => setActiveTab('my-goals')} className={activeTab === 'my-goals' ? 'bg-muted' : ''}>My Goals</Button>
              <Button onClick={() => setActiveTab('find-study-mate')} className={activeTab === 'find-study-mate' ? 'bg-muted' : ''}>Find Your StudyMate With AI</Button>
            </div>
            <CardTitle>Learning Goals</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

export default CommunitiesPage