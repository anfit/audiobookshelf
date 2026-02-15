# Node 18.20.4 + Debian i686 (Bookworm) Source-Build Recovery Plan (Server-First)

## Goal
Restore Audiobookshelf operation on a single, explicit baseline:

- **Runtime:** Node.js **18.20.4**
- **Host OS:** Debian 12 (Bookworm) **i686**
- **Package manager:** npm **9.2.0** (only if explicit pinning is needed for reproducibility)
- **Delivery model:** built and installed **from source on the target server** (no cross-target distribution artifacts)

The minimum viable product remains:

- Audiobookshelf runs as a server.
- Core API endpoints remain available for iOS/Android web clients.
- Playback/session sync remains functional.
- Optional desktop web UI can be reduced or removed from initial recovery scope.

## Repository findings that justify this direction

1. Docker and build stages are pinned to Node 20.
2. CI workflows are pinned to Node 20.
3. Packaging scripts target Node 20 x64 binaries.
4. Debian packaging metadata is fixed to `amd64`.
5. Developer docs currently call out Node 20.

Given the requested deployment model (single source build on target host), retaining multi-arch artifact pipelines is unnecessary and can be intentionally removed.

## Scope decision (explicit)

### In scope
- One supported environment: Bookworm i686 + Node 18.20.4.
- Source-based install/update workflow on the server.
- Server/API functionality needed by mobile clients.

### Out of scope / intentionally dropped
- Multi-architecture support (`amd64`, `arm64`, etc.).
- Dockerized deployment support.
- Packaged distribution targets (`pkg`, `.deb`, cross-compiled binaries).

## Success criteria

### Platform compatibility
- Server starts and runs reliably on Debian Bookworm i686 with Node 18.20.4.
- Native dependencies (especially `sqlite3`) compile/load on this target.

### Product compatibility (minimum)
- Auth/session endpoints work.
- Library/item browsing endpoints work.
- Playback session lifecycle and progress syncing work.
- Streaming endpoints (track + HLS) work.
- Public share endpoints work.

### Release process compatibility
- Build/install instructions are source-only and deterministic for the target host.
- CI validates only the supported target baseline.

## Phase 0 — Baseline proof on target model (1-2 days)

1. **Runtime proof (Node 18.20.4 on i686)**
   - Boot the app from source on Debian Bookworm i686.
   - Run migrations and smoke checks.
2. **Native dependency proof**
   - Validate install/build/load path for `sqlite3` on i686.
   - Capture toolchain prerequisites and exact install order.
3. **Server-core endpoint inventory**
   - Freeze mobile-critical endpoint list (auth, libraries, items, sessions, HLS/public share).

Deliverable: `docs/plans/node18-compatibility-audit.md` with blockers and required host prerequisites.

## Phase 1 — Tooling and repo alignment to single target (2-4 days)

1. **Node/tooling pinning**
   - Pin docs and CI to Node **18.20.4**.
   - Pin npm guidance to **9.2.0** only where needed for lockstep reproducibility.
2. **Remove unsupported delivery paths**
   - Remove or archive Docker build/release paths.
   - Remove or archive `pkg`/binary distribution scripts and x64-specific packaging steps.
   - Remove or archive architecture-matrix release jobs.
3. **Keep only source-install path**
   - Ensure all release/run docs point to source build on target host.

Deliverable: repository no longer advertises unsupported Docker/multi-arch/binary-distribution flows.

## Phase 2 — Server-core stabilization (2-5 days)

1. **Define `server-core` as release gate**
   - Prioritize `index.js` + API routers/controllers + stream/public endpoints.
2. **Must-pass smoke checks**
   - Startup health + authentication.
   - `/api/libraries`, `/api/me`, `/api/session/*` sync/close.
   - `/hls/:stream/:file` segment serving.
   - `/share/:slug` route health.
3. **UI reduction policy**
   - Allow temporary removal/disablement of desktop UI paths not required for mobile-client server workflows.

Deliverable: source-built server-core release candidate on Bookworm i686.

## Phase 3 — Hardening of source install lifecycle (1-3 days)

1. Add clear prerequisites (build tools, ffmpeg, node/npm versions) to docs.
2. Define one canonical install/upgrade sequence from git checkout.
3. Add one rollback procedure (known-good commit + reinstall sequence).
4. Add one health verification checklist after install.

Deliverable: reproducible, operator-friendly source deployment runbook.

## Concrete file-level implementation checklist

### Immediate first-wave edits
- `readme.md`
  - Change manual setup requirement to Node **18.20.4**.
  - Add npm **9.2.0** note (conditional pinning).
  - Replace Docker-first instructions with source-build-first instructions.
- `.github/workflows/*.yml`
  - Set Node version to **18.20.4**.
  - Remove matrix/targets for dropped architectures and dropped distribution channels.
- `package.json`
  - Remove or deprecate scripts for Docker and `pkg` binary targets.
  - Keep scripts required for source build + server run + tests.
- `build/linuxpackager` and related packaging metadata
  - Remove/archive if no packaged distribution is supported.
- `Dockerfile`, `docker-compose.yml`
  - Remove/archive or explicitly mark unsupported if Docker support is dropped.

### Optional cleanup follow-up
- Add a lightweight `scripts/verify-target-host.sh` to precheck required tools/versions on the target server.
- Add a concise `docs/source-install-bookworm-i686.md` runbook.

## Risk register

1. **i686 native module/toolchain fragility**
   - Mitigation: lock known-good dependency versions and document required compilers/libs.
2. **Node 18 compatibility gaps in newer dependencies**
   - Mitigation: pin/override dependency versions in server-critical path.
3. **Operational regressions after dropping Docker/distribution tooling**
   - Mitigation: provide explicit source-install/upgrade/rollback runbooks.
4. **Desktop UI feature loss impacts admin workflows**
   - Mitigation: ship server-core first, then restore only high-value UI paths.

## Acceptance test matrix (single target)

- **OS/Arch:** Debian 12 (Bookworm) i686.
- **Runtime:** Node 18.20.4.
- **npm:** 9.2.0 when pinned.
- **Test layers:**
  1. Unit tests (`npm test`).
  2. Integration smoke (boot + auth + `/api/me` + session sync).
  3. Streaming smoke (`/hls` segment request path).
  4. Public share smoke (`/share/:slug`).

## Rollout recommendation

1. Land tooling/docs cleanup that removes unsupported distribution models.
2. Ship a source-build server-core beta for Bookworm i686 + Node 18.20.4.
3. Stabilize with two cycles of zero mobile-client API regressions.
4. Restore selected UI/admin capabilities only after server-core remains stable.
