---
title: Usage with Angular
sidebar_position: 4
---

# Usage with Angular

For Angular applications, the best way to integrate the Divisor SDK is through a **Service**.

## Creating the Divisor Service

```typescript
// divisor.service.ts
import { Injectable } from '@angular/core';
import { DivisorClient, ExperimentResult } from '@divisor.dev/sdk';

@Injectable({
  providedIn: 'root'
})
export class DivisorService {
  private client: DivisorClient;

  constructor() {
    this.client = new DivisorClient({
      tenantId: 'your-tenant-id'
    });
  }

  async getVariant(experimentName: string, fallback?: string): Promise<string | null> {
    const result = await this.client.getVariant({
      experimentName,
      variantFallback: fallback
    });
    return result.variant;
  }
}
```

## Using in Component

```typescript
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { DivisorService } from './divisor.service';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="variant === 'v1'">
      <h1>Special Launch Offer!</h1>
    </div>
    <div *ngIf="variant !== 'v1'">
      <h1>Welcome to our website</h1>
    </div>
  `
})
export class AppComponent implements OnInit {
  variant: string | null = null;

  constructor(private divisor: DivisorService) {}

  async ngOnInit() {
    this.variant = await this.divisor.getVariant('home-hero-test', 'control');
  }
}
```

## Angular Tips

- **Dependency Injection**: Use the `tenantId` as an `InjectionToken` to make the service more flexible.
- **Observables**: If you prefer working with Angular reactivity, you can convert the SDK Promise:
  
```typescript
import { from } from 'rxjs';

getVariant$(name: string) {
  return from(this.client.getVariant({ experimentName: name }));
}
```
