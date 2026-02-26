
# Divisor SDK
The official JavaScript SDK for **Divisor**, an edge-native A/B testing platform designed to be **stateless, fast, and scalable**.

Divisor is built **by developers, for developers**, focusing on simplicity, performance, and modern architectures powered by Edge Functions.

## ✨ Features

- Edge-native A/B testing
- Stateless by design
- Sticky variant assignment (deterministic)
- Percentage-based traffic split
- Multi-tenant support
- Works with JavaScript, TypeScript, React, Next.js, and vanilla apps
- Zero backend dependency on the client side
- Cookie-based caching for faster subsequent visits
---

  

## 📦 Installation

### npm
```bash
npm  install  @divisor.dev/sdk
```

### CDN (unpkg)
```html
<script  type="module">
import { DivisorClient } from  "https://unpkg.com/@divisor.dev/sdk/dist/index.mjs";
</script>
```

## 🚀 Basic Usage
### Initialize the client
```javascript
import { DivisorClient } from  "@divisor.dev/sdk";

const  divisor = new  DivisorClient({
   tenantId:  "your-tenant-id",
});
```

### Get a variant
```javascript
const  result = await  divisor.getVariant({
   experimentName:  "checkout_button",
   variantFallback:  "A",
});

if (result.variant === "A") {
   // show A variant
}
```

### Send a conversion
```javascript
await  divisor.conversion({
	experimentName:  "checkout_button",
	variant:  "B",
	value:  49.90,
	itensCount:  1,
});
```

## ⚙️ Configuration
### DivisorClient
```typescript
new  DivisorClient({
	tenantId:  string;
	userId?: string;
});
```

| Option | Type | Required | Description |
|--|--|--|--|
| tenantId | string | ✅ Yes | Your Divisor tenant ID |
| userId | string | ❌ No | Custom user identifier (defaults to a generated UUID) |

## 🧠 Sticky sessions

Divisor uses a deterministic hashing strategy and cookie caching to ensure:
- Stable variant assignment
- The same user always receives the same variant
- Efficient performance with minimal network overhead after the first assignment

### Response format
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
	"variant": null,
	"message": string
}
```

## ⚛️ Usage with React

```javascript
import { DivisorClient } from  "@divisor.dev/sdk";
import { useEffect, useState } from  "react";

const  divisor = new  DivisorClient({
	tenantId:  "your-tenant-id",
});

export  function  CheckoutButton() {
	const [variant, setVariant] = useState(null);

	useEffect(() => {
		divisor.getVariant({ experimentName:  "checkout_button" })
			.then((res) => {
				setVariant(res.variant);
			});
	}, []);

	if (!variant) return  <Loading  />;

	return  variant === "B" ? <NewButton  /> : <OldButton  />;
}
```

## 🧪 Browser support

- Modern browsers (ES2020+)
- Works with:
- React
- Next.js (client components)
- Vite
- Vanilla JavaScript

## 📄 License
MIT © Divisor

## 🌐 Links

-  **Website**: [divisor.dev](https://divisor.dev/?utm_source=npm)
-  **GitHub**: [dennergazevedo/divisor](https://github.com/dennergazevedo/divisor)
-  **Edge Engine**: Cloudflare Workers