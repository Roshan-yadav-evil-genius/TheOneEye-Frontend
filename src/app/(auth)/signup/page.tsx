import Image from "next/image"
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <Image src="/logo.png" width={60} height={24} alt='TheOneEye' />
          <span className="text-xl font-bold">TheOneEye</span>
        </Link>
        
        {/* TEMPORARILY DISABLED: New user registration is currently disabled */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Registration Temporarily Disabled</CardTitle>
            <CardDescription>
              New user registration is currently unavailable
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              We're currently not accepting new user registrations. 
              Please contact support if you need access to the platform.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/login">Go to Login</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Original SignupForm component (commented out for easy re-enabling) */}
        {/* <SignupForm /> */}
      </div>
    </div>
  )
}
