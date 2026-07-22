import { AuthenticateWithRedirectCallback } from '@clerk/react'

export default function OAuthCallback() {
  return <AuthenticateWithRedirectCallback signInForceRedirectUrl="/app" />
}
