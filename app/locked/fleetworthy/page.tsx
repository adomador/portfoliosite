import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NAME } from '@/lib/profile'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: `Fleetworthy, ${NAME}`,
  robots: { index: false },
}

export default function FleetworthyLockedPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const failed = searchParams.error === '1'

  return (
    <main className={styles.page}>
      <Link href="/?section=work" className={styles.back}>
        <span aria-hidden="true">‹</span> All work
      </Link>

      <form className={styles.card} method="post" action="/api/unlock/fleetworthy">
        <Image
          src="/work/FW.svg"
          alt="Fleetworthy"
          width={56}
          height={56}
          className={styles.logo}
          priority
        />
        <p className={styles.eyebrow}>Protected case study</p>
        <h1 className={styles.title}>Password required</h1>
        <p className={styles.lead}>Enter the password to view the Fleetworthy case study.</p>

        <label htmlFor="password" className={styles.srOnly}>
          Password
        </label>
        <div className={styles.field}>
          <input
            id="password"
            name="password"
            type="password"
            className={styles.input}
            placeholder="Password"
            autoComplete="current-password"
            autoFocus
            required
            aria-invalid={failed || undefined}
            aria-describedby={failed ? 'password-error' : undefined}
          />
          <button type="submit" className={styles.submit}>
            View
          </button>
        </div>
        {failed && (
          <p id="password-error" className={styles.error} role="alert">
            That password didn&apos;t work. Try again.
          </p>
        )}
      </form>
    </main>
  )
}
