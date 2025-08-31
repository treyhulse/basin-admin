import { ReactNode } from "react"
import { Metadata } from "next"

interface CollectionLayoutProps {
  children: ReactNode
  params: Promise<{ collection: string }>
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ collection: string }> 
}): Promise<Metadata> {
  const { collection } = await params
  
  // Format collection name for display
  const displayName = collection
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  return {
    title: `${displayName} - Data Management`,
    description: `Manage ${displayName.toLowerCase()} data and records`
  }
}

export default async function CollectionLayout({ 
  children,
  params
}: CollectionLayoutProps) {
  // You can add collection-specific logic here
  // For example, validate collection exists, check permissions, etc.
  
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
