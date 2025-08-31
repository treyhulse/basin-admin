import { Suspense } from "react"
import CollectionsClient from "./collections-client"

export default function DataPage() {
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<div>Loading collections...</div>}>
        <CollectionsClient />
      </Suspense>
    </div>
  )
}
