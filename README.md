
# Divisor

**Divisor** is an open-source, edge-first A/B testing and feature flag platform designed to be simple, fast, and extremely scalable.

The project focuses on **deterministic traffic splitting**, **edge execution**, and **minimal infrastructure cost**, making it suitable for products that need to run experiments for millions of users without complex backend state.

> ⚠️ **Status:** This project is in its early stages.  
> The repository has been initialized and the architecture is being actively designed.

---

## ✨ Goals

- Edge-first decision making
- Deterministic A/B testing (A/B/C…)
- Stateless sticky sessions
- Minimal infrastructure cost
- Multi-tenant ready
- Open-source by default


## 🧠 Core Concepts

Divisor is built around a few key ideas:

- **Deterministic hashing**  
  Users are assigned to variants using a hash function, ensuring the same user always receives the same variant without storing sessions.

- **Edge execution**  
  Variant decisions happen at the edge (Cloudflare Workers), close to the user, reducing latency and backend load.

- **Cache-first architecture**  
  Redis is used for fast configuration lookup and lightweight counters. PostgreSQL is only used for persistence and the dashboard.

- **No per-user storage**  
  Divisor does not store user sessions or identities. Assignment is computed, not stored.

---

## 🏗 Project Architecture (Planned)

This repository follows a **monorepo** structure.

```txt
├─ apps/
│  └─ dashboard/          # Admin panel (Next.js)
│
├─ packages/
│  ├─ sdk-js/             # JavaScript SDK
│  ├─ edge-runtime/       # Cloudflare Workers runtime
│  ├─ core/               # Hashing, bucket logic, shared rules
│  └─ types/              # Shared TypeScript types
│
├─ docs/                  # Documentation (WIP)
└─ README.md
```
⚠️ Most packages are scaffolds only at this stage.

## 🧩 Components Overview
### 🟢 Edge Runtime
- Runs on Cloudflare Workers
- Fetches test configuration from Redis
- Applies deterministic hashing
- Returns the assigned variant
- Increments lightweight counters asynchronously

### 🔵 Redis (Cache + Counters)
- Stores active A/B test configurations
- Indexed by test name
- Maintains aggregated counters per variant
- No per-user data stored

### 🟡 PostgreSQL (Configuration)
- Used by the dashboard only
- Stores tenants, tests, variants and metadata
- Not accessed by the SDK or edge runtime

### 🧑‍💻 Dashboard
- Built with Next.js
- Multi-tenant ready
- Used to create and manage tests
- Syncs configuration to Redis

### 📦 SDK
- Lightweight client SDK
- Requests variant decisions from the edge
- Does not contain business logic
- Framework-agnostic

## 🔁 A/B Decision Flow
```txt
Client SDK
   ↓
Edge Function (Cloudflare Workers)
   ↓
Redis (Upstash)
   ↓
Deterministic hash
   ↓
Variant selected
   ↓
Counter increment
   ↓
Response returned
```
- No backend bottlenecks
- No session storage
- Fully stateless

## 🚧 Current Status
✔ Repository initialized
✔ Architecture defined
✔ Naming and domain selected (divisor.dev)

## 🚧 In progress:
- SDK implementation
- Edge runtime logic
- Redis schema
- Dashboard UI
- Documentation

### 🛣 Roadmap (High-level)
- SDK (JavaScript)
- Cloudflare Worker runtime
- Redis cache integration
- Dashboard MVP
- Documentation site
- Examples (Next.js, React and Javascript)
- Feature flags
- Analytics (future)

## 🤝 Contributing
Divisor is open source and contributions will be welcome once the core structure is in place.

Contribution guidelines will be added soon.

## 📄 License
This project will be released under an open-source license (TBD).

## 🌐 Links
Website: https://divisor.dev

## 💬 Final Notes
Divisor is intentionally designed to start small and focused.

The goal is to build a reliable, transparent foundation that can evolve over time without architectural rewrites.

If you're interested in edge computing, feature flags, or large-scale experimentation, feel free to follow the project.