"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

export default function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <nav className={`fixed z-50 top-0 left-0 right-0 transition-all duration-300 ${isScrolled ? 'bg-gray-800 shadow-md' : 'bg-transparent md:bg-transparent'}`}>
            <div className="flex items-center justify-between h-16 px-4 max-w-7xl mx-auto">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <span className="text-2xl font-bold text-white">SummAIze</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-4">
                    <Link href="/products" className="text-white hover:text-gray-300 transition-colors">Products</Link>
                    <Link href="/tools" className="text-white hover:text-gray-300 transition-colors">Tools</Link>
                    <Link href="/blog" className="text-white hover:text-gray-300 transition-colors">Blog</Link>
                    <Link href="/pricing" className="text-white hover:text-gray-300 transition-colors">Pricing</Link>
                </div>

                {/* CTA Button */}
                <div className="hidden md:block">
                    <Button>Get Started</Button>
                </div>

                {/* Mobile Menu Button */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" className="md:hidden text-white">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="bg-gray-800">
                        <div className="flex flex-col space-y-4 mt-4">
                            <Link href="/products" className="text-white hover:text-gray-300 transition-colors" onClick={() => setIsOpen(false)}>Products</Link>
                            <Link href="/tools" className="text-white hover:text-gray-300 transition-colors" onClick={() => setIsOpen(false)}>Tools</Link>
                            <Link href="/blog" className="text-white hover:text-gray-300 transition-colors" onClick={() => setIsOpen(false)}>Blog</Link>
                            <Link href="/pricing" className="text-white hover:text-gray-300 transition-colors" onClick={() => setIsOpen(false)}>Pricing</Link>
                            <Button onClick={() => setIsOpen(false)}>Get Started</Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
            <div className={`h-px bg-gray-700 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}></div>
        </nav>
    )
}