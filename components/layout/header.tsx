
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Badge } from '../ui/badge'
import { GroupIcon, LayoutDashboard, MessageCircle, TrophyIcon, UsersIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { auth } from '@clerk/nextjs/server'

const Header = async () => {

    const { has } = await auth()

    const hasProPlan = has({ plan: "pro_plan" })


    return (
        <header>
            <div className="layout-container">
                <div className="flex items-center gap-6">
                    <Link href={"/"} className='font-bold text-2xl'>MeshMind</Link>
                    <SignedIn>
                        <nav className='hidden md:flex items-center gap-6'>
                            <Link href={"/dashboard"}>
                                <Button size={"sm"} variant={"ghost"}>
                                    <LayoutDashboard className='text-primary' />
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href={"/communities"}>
                                <Button size={"sm"} variant={"ghost"}>
                                    <UsersIcon className='text-primary' />
                                    Communities
                                </Button>
                            </Link>
                            <Link href={"/chat"}>
                                <Button size={"sm"} variant={"ghost"}>
                                    <MessageCircle className='text-primary' />
                                    Chat
                                </Button>
                            </Link>
                        </nav>
                    </SignedIn>
                </div>
                <div className='flex items-center gap-4'>
                    <SignedIn>
                        {hasProPlan && <Badge variant={"outline"} className='flex items-center gap-2'>
                            <TrophyIcon className='size-3 text-primary' /> Pro
                        </Badge>}
                        <UserButton appearance={{
                            elements: {
                                avatarBox: "size-8"
                            }
                        }} />
                    </SignedIn>
                    <SignedOut>
                        <div className='flex items-center gap-2'>
                            <Link href={"/sign-in"}>
                                <Button variant={"ghost"} size={"sm"}>
                                    Sign In
                                </Button>
                            </Link>
                            <Link href={"/sign-up"}>
                                <Button size="sm">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    </SignedOut>

                </div>
            </div>
        </header>
    )
}

export default Header
