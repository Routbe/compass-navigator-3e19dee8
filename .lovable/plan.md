# Plan: "Zet dit account om naar een Workspace"

Combines both briefs: a company that signed up as a person can move everything to a workspace owned by a real person, safely and all-or-nothing.

## What the user sees
1. **Settings > Account > "Zet om naar Workspace"** opens a wizard.
2. **Overzicht (pre-flight):** exact counts of what moves — links, QR codes, custom domains, apps (OAuth clients), API keys, badges, active subscriptions, analytics period. Warning that the blue check is removed (blue is only for private people; black B2B badge can be bought later).
3. **Nieuwe eigenaar:** enter the email of a personal ROUT account. If no account exists yet, an invite is sent: "Maak je persoonlijke ROUT account aan om eigenaar te worden van [Workspace]".
4. **Bevestigen:** 6-digit code mailed to the current account.
5. **Owner accepts** (notification + email link; confirm on a page with a POST button, never on link open). If the owner had to sign up, acceptance appears right after registration.
6. Only when both sides agree, the move runs in one go.
7. **Afterwards:** owner manages the company via the workspace switcher. The old login shows a full-screen, non-closable screen: "Deze entiteit is nu een Workspace. Log in via je persoonlijke account. Deze inlogmethode vervalt op [datum]." (only a sign-out / go-to-workspace button).
8. **After 30 days** the old login is permanently deleted so its email is free again (e.g. as billing or public contact email of the workspace).

## Rules (with tests)
- Owner must be a different, real person account; never a workspace-converted or sunset account.
- Both confirmations required; code expires after 10 minutes, max 5 attempts; transfer request expires after 14 days.
- Blue badge always stripped on conversion; nothing else grants a badge.
- If any step fails, nothing changes (rollback).
- Re-running a finished transfer does nothing (idempotent).
- Old login: read-only proxy for exactly 30 days, then deleted.

## Technical details
- **Migration `db/123_workspace_conversion.sql`** (idempotent):
  - `workspace_transfers` (id, legacy_user_id, target_email, target_user_id null, workspace_name, status `pending_otp|pending_owner|completed|cancelled|expired`, otp_hash, otp_attempts, token_hash, expires_at, completed_at, workspace_id).
  - `users.account_status` (`active|migrated_sunset`), `users.sunset_at`, `users.migrated_workspace_id`.
  - Add `workspace_id` (nullable FK) to user-owned tables that lack it: profiles, alias_profiles, qr tables, custom domains, link_clicks/profile_visits, api keys, subscriptions/billing (stripe customer id + VAT/name copied, not recreated, so billing never stops). oauth_clients already has it.
- **Transaction:** one `neonExecute` batch (single Postgres transaction) in `src/lib/workspace-conversion.server.ts`: create workspace, add owner member, set `workspace_id` on all listed rows, strip `verified` badge, set sunset status, mark transfer completed — guarded by `where status='pending_owner'` so a retry is a no-op.
- **Server functions** `workspace-conversion.functions.ts`: `getConversionPreflight`, `startConversion` (sends OTP via existing localized auth email), `verifyConversionOtp`, `acceptWorkspaceTransfer`, `cancelConversion`. All verify the session server-side; acceptance checks that the signed-in user's verified email matches the target.
- **Pending signup:** after account creation (`/auth/continue`), look up open transfers for the new verified email and show the acceptance page.
- **Sunset guard:** session check returns `migrated_sunset`; root layout renders the blocking overlay; server functions that write (except sign-out) refuse for sunset accounts.
- **Scrubber:** daily server route under `/api/public/cron/sunset-scrubber` (secret-verified) hard-deletes `migrated_sunset` users past `sunset_at` (sessions, accounts, user row); workspace data is untouched because it now hangs on `workspace_id`.
- **Emails:** new templates for OTP, owner invite, owner-accepted, and "login expires in 7 days"; NL/EN/FR/DE.
- **Tests:** `workspace-conversion.test.ts` for each rule above (badge stripped, rollback on failure, idempotent retry, OTP expiry/attempts, owner ≠ legacy, sunset at +30 days, scrubber only deletes expired).
- Record the architecture rule in AGENTS.md.

## Open point
The cron route needs a scheduler on Vercel (cron config) — I'll add the config; it only runs once published.
