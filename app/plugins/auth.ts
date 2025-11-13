// plugins/auth.ts
import { useCookie } from '#app'

export default defineNuxtPlugin(() => {
  const token = useCookie<string | null>('access_token')

  const authFetch = $fetch.create({
    onRequest({ options }) {
      if (token.value) {
        // Always normalize headers to a Headers object
        const headers = new Headers(options.headers || {})
        headers.set('Authorization', `Bearer ${token.value}`)
        options.headers = headers
      }
    },
  })

  return {
    provide: { authFetch },
  }
})
