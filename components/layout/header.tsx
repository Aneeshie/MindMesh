import { SignedIn, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Badge } from '../ui/badge'
import { TrophyIcon } from 'lucide-react'

const Header = () => {

    //will handle later
    const isPro = true


    return (
        <header>
            <div className="layout-container">
                <div className="flex items-center gap-6">
                    <Link href={"/"} className='font-bold text-2xl'>MeshMind</Link>
                    <SignedIn>
                        <nav className='hidden md:flex items-center gap-6'>
                            <Link href={"/dashboard"}>
                                Dashboard
                            </Link>
                            <Link href={"/communities"}>
                                Communities
                            </Link>
                            <Link href={"/chat"}>
                                Chat
                            </Link>

                        </nav>
                    </SignedIn>
                </div>
                <div className='flex items-center gap-4'>
                    <SignedIn>
                        {isPro && <Badge variant={"outline"} className='flex items-center gap-2'>
                            <TrophyIcon className='size-3 text-primary' /> Pro
                        </Badge>}
                        <UserButton appearance={{
                            elements: {
                                avatarBox: "size-8"
                            }
                        }} />
                    </SignedIn>

                </div>
            </div>
        </header>
    )
}

export default Header
