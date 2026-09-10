/**
 * Cookie-gated app shell — never serve a Full Route Cache hit for these routes.
 * Middleware only peeks JWT shape; views call /me via requireAuthSession.
 */
export const dynamic = 'force-dynamic';

export default function AppSectionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
