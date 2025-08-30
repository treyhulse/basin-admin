import { ReactNode } from "react"

interface CollectionLayoutProps {
  children: ReactNode
  params: Promise<{ collection: string }>
}

export default async function CollectionLayout({ 
  children, 
  params 
}: CollectionLayoutProps) {
  const { collection } = await params
  
  // You can add collection-specific logic here
  // For example, validate collection exists, check permissions, etc.
  
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
