# Finishing the open items

## What's still open, and what I'll do
1. **Translations**: the new text (gallery counter and link message, social feed notice, "Binnenkort", support-page tour) is only in Dutch. I'll add it in NL/EN/FR/DE so it follows the chosen language.
2. **Free photo limit actually enforced**: the gallery counter shows the limit, but gallery uploads don't check it yet. Uploads over the free limit get refused with a clear message.
3. **Saving even sooner**: besides switching tab/page, the Studio also saves right away when you add a video or component, and when you leave a link title or link field.
4. **Mastodon posts with photos**: Mastodon posts never show images yet (Bluesky does). Public photos are added and loaded through the privacy proxy.
5. **Snapchat card in the same style**: the Snapchat card gets the same button shape as your other links, plus the green check with the name popover.
6. **Green check everywhere with the name**: the small social buttons under the profile also show the member's name in the popover.

## Technical details
- Locale keys in `src/locales/studio/{nl,en,fr,de}.json` (gallery, socialFeed, tipTour) plus profile keys for the feed fallback via the existing i18n provider; replace the hard-coded strings in GalleryBlockSettings, SocialFeedBlockSettings, SocialFeedCard and TipTour.
- `gallery-media.functions.ts`: before uploading, call `usage(userId)` + `withinQuota` (as in `assets.server.ts`); otherwise throw `quota_exceeded`, which the dialog shows as a message. Test: an upload over the limit is refused.
- ProfileEditor: `requestFlush` flag in state; after `addBlock`/AddComponentModal `onAdd`/`onWidget`, set it, and an effect after commit calls `save(true)`. Pass `onFlushSave` through ProfileContentAccordion → ProfileLinksManager and wire it to `onBlur` of the label and URL inputs.
- `social-feed.functions.ts` Mastodon: `media_attachments[0]` with type image → `preview_url`; shown only when `proxied()` accepts it (host allowlist; add common Mastodon media hosts).
- SnapchatProfile: accept `buttonStyle` from ProfileView and add `VerifiedAccountCheck`.
- ProfileView line ~259: pass `name`.
- Run the full test suite and the type check.

## Still needs your session
The final check while signed in (QR on the profile, saving in the Studio) needs a real ROUT login.
