import Link from 'next/link';

const links = [
  { href: '/inbox', label: 'Inbox' },
  { href: '/sources', label: 'Sources' },
  { href: '/drafts', label: 'Drafts' },
  { href: '/settings', label: 'Settings' },
];

export function Nav() {
  return (
    <nav className="border-b mb-6">
      <div className="max-w-6xl mx-auto px-4 py-3 flex gap-4 items-center">
        <h1 className="font-bold">NewsDrafts</h1>
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground">
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
