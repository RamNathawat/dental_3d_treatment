import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    const forwardedHost = request.headers.get('x-forwarded-host')
    const isLocalEnv = process.env.NODE_ENV === 'development'
    const baseUrl = isLocalEnv ? origin : forwardedHost ? `https://${forwardedHost}` : origin

    // Forward any OAuth or provider errors to login page
    if (error || errorDescription) {
      console.error("Auth callback error:", error, errorDescription)
      return NextResponse.redirect(
        `${baseUrl}/auth/login?error=${encodeURIComponent(errorDescription || error || "Authentication failed")}`
      )
    }

    if (code) {
      const supabase = await createClient()
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      if (exchangeError) {
        console.error("Error exchanging code for session:", exchangeError)
        return NextResponse.redirect(
          `${baseUrl}/auth/login?error=${encodeURIComponent(exchangeError.message)}`
        )
      }
    }

    return NextResponse.redirect(`${baseUrl}/dashboard`)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("Fatal callback exception:", err)
    const { origin } = new URL(request.url)
    const forwardedHost = request.headers.get('x-forwarded-host')
    const baseUrl = forwardedHost ? `https://${forwardedHost}` : origin
    return NextResponse.redirect(
      `${baseUrl}/auth/login?error=${encodeURIComponent(msg || "Internal authentication error")}`
    )
  }
}
