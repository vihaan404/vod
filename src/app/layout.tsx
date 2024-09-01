import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import "~/styles/globals.css";

export const metadata = {
    title: 'vod',
    description: 'peer-to-peer video call solution',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <ClerkProvider>
        <html lang="en">
        <body>
        <header>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
        <main>{children}</main>
        </body>
        </html>
      </ClerkProvider>
  )
}