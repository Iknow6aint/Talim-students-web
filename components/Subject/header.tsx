import { Search, Bell } from 'lucide-react'
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search"
          className="pl-8"
        />
      </div>
      <div className="flex items-center gap-4">
        <time className="text-sm text-muted-foreground">12 Oct, 2024</time>
        <button className="relative hover:opacity-80">
          <Bell className="h-5 w-5" />
        </button>
        <img
          src="/placeholder.svg?height=40&width=40"
          alt="User avatar"
          className="h-10 w-10 rounded-full"
        />
      </div>
    </header>
  )
}

