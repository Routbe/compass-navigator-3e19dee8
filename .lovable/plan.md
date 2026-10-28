# Profile, Studio and social feeds: finishing pass

## What you'll get
1. **Profile QR actually used**: the QR you design and save shows on your profile and in the Share menu right away, for both your main profile and alias profiles.
2. **Saving always works**: videos, links and blocks save immediately when you close a window, leave a field, or switch tab/page. The status bar shows "Opslaan..." then "Opgeslagen".
3. **Guestbook (Prikbord) visible**: shown as its own entry under "Links & componenten" with an on/off switch, off by default. On the public profile it only appears when switched on.
4. **Same popover on the green check**: clicking the green platform check gives the same "Officieel geverifieerd lid ... gevalideerd via ROUT" popover as the blue check / business badge, including the name and platform.
5. **Connected socials look like the other links**: Snapchat, Bluesky and similar no longer show up as sharp squares at the bottom. They use the same rounded button style as the other links.
6. **Gallery with image links**: in "Afbeelding / Galerij" you can paste image links as well as upload. A counter shows "X of N free photos used", and links don't count toward that limit. Linked images load through the privacy proxy.
7. **Automatic Bluesky / Mastodon posts**: a block that pulls your latest posts. You choose how many (1-12), how many per row (1-3), and whether it scrolls sideways or downwards. It shows a clean fallback when the account can't be reached. Instagram, TikTok and others appear as "Binnenkort".
8. **Tours and translations**: Studio and Dashboard tours point at the real elements. New labels come from the language files (NL/EN/FR/DE) instead of fixed text.

## Technical details
- `savePublishedProfileQr` currently always writes to `profiles.id = userId` and to the `space='verified'` draft. Extend it with a `space` parameter: alias → the alias profile row and the `space='alias'` draft. After saving, invalidate `['profile', handle]` and `['profile-draft']`.
- ProfileEditor autosave (debounced setTimeout): add `flushSave()` and call it on modal submit (video/component), `onBlur` of URL/title fields, tab/page switch, `visibilitychange` and unmount.
- First check why the Guestbook accordion isn't visible (render condition), then place it as a separate item with a switch; default `guestbookEnabled=false`. Public filtering stays server-side.
- Use `VerifiedAccountCheck` everywhere in ProfileView, SnapchatProfile and SocialFeedCard. Social link buttons use `var(--profile-radius)` / rounded-full.
- GalleryBlockSettings: URL input with https validation; quota counter from `asset-retention.ts` (`withinQuota`); rendering via `/api/public/proxy-image` and the allowlist in `image-proxy-rules.ts` (extend it with the Bluesky/Mastodon CDN hosts if needed).
- Social feed: check the existing `social-feed.ts` / `SocialFeedCard` / settings against the options above and add skeletons/fallback.
- Tours: check the data-tour anchors in Studio/Dashboard. i18n keys in `src/locales/studio|profile/*.json`.
- Add a test for each rule (QR for alias, guestbook off by default, gallery quota excludes links, feed limit 1-12 / columns 1-3), then run the full test suite.

## Not verifiable without a session
The final checks while signed in (saving, QR on the profile) need a real ROUT session. Everything else is tested with unit tests and the public pages.
