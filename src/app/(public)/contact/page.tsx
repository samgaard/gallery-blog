'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

declare global {
  interface Window {
    _turnstileCallback?: (token: string) => void
    _turnstileExpired?: () => void
  }
}

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')

  useEffect(() => {
    window._turnstileCallback = (token: string) => setTurnstileToken(token)
    window._turnstileExpired = () => setTurnstileToken('')
    return () => {
      delete window._turnstileCallback
      delete window._turnstileExpired
    }
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!turnstileToken) {
      setStatus('error')
      setErrorMsg('Please wait for the bot check to complete.')
      return
    }

    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, turnstileToken }),
      })
      const json = await res.json()
      if (!res.ok) {
        setStatus('error')
        setErrorMsg(json.error ?? 'Something went wrong. Please try again.')
        setTurnstileToken('')
      } else {
        setStatus('success')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="max-w-lg space-y-4">
        <h1 className="font-semibold text-2xl">Contact</h1>
        <p className="text-foreground">Thanks for reaching out. We'll be in touch soon.</p>
      </div>
    )
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />

      <div className="max-w-lg space-y-6">
        <h1 className="font-semibold text-2xl">Contact</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot — hidden from real users, bots fill it in */}
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>

          <div className="space-y-1">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" rows={5} required />
          </div>

          <div
            className="cf-turnstile"
            data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            data-callback="_turnstileCallback"
            data-expired-callback="_turnstileExpired"
          />

          {status === 'error' && (
            <p className="text-sm text-destructive">{errorMsg}</p>
          )}

          <Button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Sending…' : 'Send message'}
          </Button>
        </form>
      </div>
    </>
  )
}
