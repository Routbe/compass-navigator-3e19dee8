import { useQuery } from "@tanstack/react-query";
import { getSocialFeed } from "@/lib/social-feed.functions";
import { parseSocialFeedConfig } from "@/lib/social-feed";
import { proxied } from "@/lib/image-proxy-rules";

/** Automatically loaded Bluesky/Mastodon posts, as a grid or horizontal carousel. */
export function SocialFeedCard({ value, style }: { value: string; style?: React.CSSProperties }) {
  const c = parseSocialFeedConfig(value);
  const q = useQuery({
    queryKey: ["social-feed", c.platform, c.handle, c.count],
    queryFn: () => getSocialFeed({ data: { platform: c.platform, handle: c.handle, count: c.count } }),
    enabled: Boolean(c.handle),
    staleTime: 5 * 60_000,
  });
  const posts = q.data?.posts ?? [];
  if (!c.handle || (!q.isLoading && posts.length === 0)) return null;
  const horizontal = c.direction === "horizontal";
  const label = c.platform === "bluesky" ? "Bluesky" : "Mastodon";
  return (
    <section className="w-full lg:col-span-full" aria-label={`${label} — @${c.handle}`}>
      <p className="mb-2 text-center text-[10px] uppercase tracking-wider opacity-70">{label} · @{c.handle}</p>
      <div
        className={horizontal ? "flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2" : "grid gap-2"}
        style={horizontal ? undefined : { gridTemplateColumns: `repeat(${c.columns}, minmax(0, 1fr))` }}
      >
        {q.isLoading
          ? Array.from({ length: Math.min(3, c.count) }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl" style={{ ...style, opacity: 0.5 }} />)
          : posts.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block snap-start overflow-hidden rounded-2xl border p-3 text-left text-sm transition-opacity hover:opacity-90"
                style={{ ...style, ...(horizontal ? { flex: `0 0 calc((100% - ${(c.columns - 1) * 0.5}rem) / ${c.columns})` } : {}) }}
              >
                {p.image && <img src={proxied(p.image) ?? ""} alt="" loading="lazy" className="mb-2 aspect-video w-full rounded-lg object-cover" />}
                <p className="line-clamp-6 whitespace-pre-line break-words">{p.text}</p>
                {p.createdAt && <p className="mt-2 text-[10px] opacity-60">{new Date(p.createdAt).toLocaleDateString()}</p>}
              </a>
            ))}
      </div>
    </section>
  );
}
