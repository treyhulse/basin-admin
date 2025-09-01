import Link from "next/link"
import Image from "next/image"
import { GitHubStarsWidget } from "@/components/layout/github-stars-widget"

export function SidebarHeader() {
  return (
    <div className="flex items-center justify-start w-full gap-3">
      <Link href="/dashboard" className="shrink-0">
        <Image
          src="/logo.svg"
          alt="Basin"
          width={36}
          height={36}
          className="shrink-0"
        />
      </Link>
      <GitHubStarsWidget owner="treyhulse" repo="basin-admin" />
    </div>
  )
}
