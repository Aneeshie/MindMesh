
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Badge } from "../ui/badge";
import {
  LayoutDashboard,
  MessageCircle,
  Sparkles,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { auth } from "@clerk/nextjs/server";

const Header = async () => {
  const { has } = await auth();

  const hasProPlan = has({ plan: "pro_plan" });

  return (
    <header>
      <div className="layout-container">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-2xl tracking-tight">MeshMind</span>
            <span className="hidden text-xs font-medium text-muted-foreground sm:inline-flex items-center gap-1">
              <Sparkles className="size-3 text-primary" />
              AI study partner network
            </span>
          </Link>
          <SignedIn>
            <nav className="hidden md:flex items-center gap-4 lg:gap-6">
              <Link href="/dashboard">
                <Button size="sm" variant="ghost">
                  <LayoutDashboard className="text-primary" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/communities">
                <Button size="sm" variant="ghost">
                  <UsersIcon className="text-primary" />
                  Communities
                </Button>
              </Link>
              <Link href="/chat">
                <Button size="sm" variant="ghost">
                  <MessageCircle className="text-primary" />
                  Chat
                </Button>
              </Link>
            </nav>
          </SignedIn>
        </div>
        <div className="flex items-center gap-4">
          <SignedIn>
            {hasProPlan && (
              <Badge
                variant="outline"
                className="hidden items-center gap-2 sm:inline-flex"
              >
                <TrophyIcon className="size-3 text-primary" /> Pro
              </Badge>
            )}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-8",
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
