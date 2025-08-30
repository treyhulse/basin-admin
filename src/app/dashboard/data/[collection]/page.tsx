import { Suspense } from "react"
import { CollectionDataTableWrapper } from "@/components/data/collection-data-table-wrapper"

interface PageProps {
  params: Promise<{ collection: string }>
}

export default async function CollectionPage({ params }: PageProps) {
  const { collection } = await params
  
  // Format collection name for display
  const displayName = collection.charAt(0).toUpperCase() + collection.slice(1)
  
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<div>Loading collection...</div>}>
        <CollectionDataTableWrapper
          collectionName={displayName}
        />
      </Suspense>
    </div>
  )
}
