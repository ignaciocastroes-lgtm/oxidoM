import Link from 'next/link'
import { getArtists, getOwnedLabel, getReleases } from '@/lib/admin/queries'

export default async function AdminDashboard() {
  const label = await getOwnedLabel()
  if (!label) return null

  const [artists, releases] = await Promise.all([getArtists(label.id), getReleases(label.id)])

  const byStatus = (status: string) => releases.filter((r) => r.status === status).length

  const stats = [
    { label: 'Artistas', value: artists.length, href: '/admin/artistas' },
    { label: 'Lanzamientos', value: releases.length, href: '/admin/lanzamientos' },
    { label: 'En borrador', value: byStatus('borrador'), href: '/admin/lanzamientos' },
    { label: 'Publicados', value: byStatus('publicado'), href: '/admin/lanzamientos' },
  ]

  return (
    <div className="flex flex-col gap-10">
      <h1 className="font-display text-4xl">Resumen</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="flex flex-col gap-2 border border-border p-5 transition-colors hover:border-primary"
          >
            <span className="font-display text-4xl">{stat.value}</span>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-display text-2xl">Últimos lanzamientos</h2>
        <div className="flex flex-col divide-y divide-border border-y border-border">
          {releases.slice(0, 6).map((release) => (
            <Link
              key={release.id}
              href={`/admin/lanzamientos/${release.id}`}
              className="flex items-center justify-between gap-4 py-3 text-sm transition-colors hover:text-primary"
            >
              <span className="font-medium">{release.title}</span>
              <span className="text-muted-foreground">{release.status}</span>
            </Link>
          ))}
          {releases.length === 0 && (
            <p className="py-6 text-sm text-muted-foreground">Todavía no hay lanzamientos.</p>
          )}
        </div>
      </div>
    </div>
  )
}
