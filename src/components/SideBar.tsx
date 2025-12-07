"use client"
import Link from "next/link";

export default function SideBar() {
    return (
        <aside className="flex flex-col items-center justify-around max-h-screen h-screen">
            <div onClick={() => { console.log("open search bar like in sora") }}>Search</div>
            <Link href="/explore">Explore</Link>
            <Link href="/presentations">Presentations</Link>
            <Link href="/trendings">Trendings</Link>
            <Link href="/settings">Settings</Link>

        </aside>
    )
}