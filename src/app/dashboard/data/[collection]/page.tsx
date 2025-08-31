"use client"

import { useState, useEffect } from "react"
import { CollectionDataTableWrapper } from "@/components/data/collection-data-table-wrapper"
import { useCollectionCrud } from "@/hooks/use-collection-crud"

interface CollectionPageProps {
  params: Promise<{ collection: string }>
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const [collectionName, setCollectionName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  // Always call the hook to maintain hook order consistency
  const { actions, state } = useCollectionCrud({ collectionName })

  useEffect(() => {
    const getCollectionName = async () => {
      try {
        const { collection } = await params
        setCollectionName(collection)
      } catch (error) {
        console.error('Error getting collection name from params:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getCollectionName()
  }, [params])

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading collection...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <CollectionDataTableWrapper 
        collectionName={collectionName}
        crudActions={actions}
        crudState={state}
      />
    </div>
  )
}
