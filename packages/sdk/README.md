
# Divisor SDK

The official JavaScript SDK for **Divisor**, an edge-native A/B testing platform designed to be **stateless, fast, and scalable**.

Divisor is built **by developers, for developers**, focusing on simplicity, performance, and modern architectures powered by Edge Functions.

---

## ✨ Features

- Edge-native A/B testing
- Stateless by design
- Sticky variant assignment (deterministic)
- Percentage-based traffic split
- Multi-tenant support
- Works with JavaScript, TypeScript, React, Next.js, and vanilla apps
- Zero backend dependency on the client side

---

## 📦 Installation

### npm

```bash
npm install @divisor/sdk
CDN (unpkg)
<script type="module">
  import { DivisorClient } from "https://unpkg.com/@divisor/sdk/dist/index.mjs";
</script>
🚀 Basic Usage
import { DivisorClient } from "@divisor/sdk";

const divisor = new DivisorClient({
  tenantId: "tenant-uuid",
});

const result = await divisor.get("checkout_button");

if (result.variant === "B") {
  // show new CTA
}
```

## ⚙️ Configuration
### DivisorClient
```bash
new DivisorClient({
  tenantId: string;
});
```
| Option | Type | Required	Description |
|--|--|--|
| tenantId | string | ✅ Yes	Your Divisor tenant ID |
| edgeUrl | string | ❌ No	Divisor Edge endpoint |

⚠️ Note

> The edgeUrl is currently hardcoded internally in the SDK for early
> versions. This will become configurable in a future release.


### 🔁 How it works

 1. The SDK generates (or reuses) a persistent user identifier (uid)
 2. A request is sent to the Divisor Edge Function
 3. The Edge resolves the experiment variant deterministically
 4. The same user always receives the same variant
 5. No session storage or per-user state is required


### 🧠 Sticky sessions without sessions
Divisor uses a deterministic hashing strategy:
```bash
hash(userId + tenantId + experimentName)
```
This guarantees:
- Stable variant assignment
- No cookies required by default
- No database reads per request
- Fully stateless architecture

### 🧩 Response format
```json
{
  "experiment": "checkout_button",
  "variant": "A"
}
```
If the experiment is inactive or not found:

```json
{
  "experiment": "checkout_button",
  "variant": null
}
```

## ⚛️ Usage with React

```code
import { DivisorClient } from "@divisor/sdk";
import { useEffect, useState } from "react";

const divisor = new DivisorClient({
  tenantId: "tenant-uuid",
});

export function CheckoutButton() {
  const [variant, setVariant] = useState<string | null>(null);

  useEffect(() => {
    divisor.get("checkout_button").then((res) => {
      setVariant(res.variant);
    });
  }, []);

  if (!variant) return null;

  return variant === "B" ? <NewButton /> : <OldButton />;
}
```

## 🧪 Browser support
- Modern browsers (ES2020+)
- Works with:
	- React
	- Next.js (client components)
	- Vite
	- Vanilla JavaScript

### ⚠️ SSR considerations
The SDK currently generates the user identifier on the client side.
When used with SSR frameworks (like Next.js):

- The experiment decision happens after hydration
- This may cause a brief UI mismatch

> SSR-safe and cookie-first support is planned.


## 🛣️ Roadmap
- Configurable edgeUrl
- React hooks (useExperiment)
- Cookie-first UID strategy
-  Exposure counters
- Kill switch support
- Documentation site
- CLI tooling

## 🧑‍💻 Philosophy
Divisor is designed around a few core principles:
- Edge-first
- Stateless by default
- Minimal SDK, powerful backend
- Clear separation of concerns
- No magic, no hidden state

## 📄 License
MIT © Divisor

## 🌐 Links
Website: https://divisor.dev
GitHub: https://github.com/dennergazevedo/divisor
Edge Engine: Cloudflare Workers