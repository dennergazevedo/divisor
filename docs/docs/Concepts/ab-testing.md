---
title: A/B Testing
sidebar_position: 1
---

# A/B Testing Concepts

A/B testing (also known as split testing) is a randomized experimentation process where two or more versions of a variable (web page, page element, etc.) are shown to different segments of website visitors at the same time to determine which version leaves the maximum impact and drives business metrics.

## How it works in Divisor

Divisor simplifies the process of running A/B tests by handling the randomization and variant assignment at the **Edge**. This means the decision of which variant to show is made as close to the user as possible, ensuring zero flicker and minimal latency.

### 1. Experiments

An experiment is the container for your test. It defines what you are testing (e.g., "Login Button Color") and the different versions (variants) you want to compare.

### 2. Variants

Every experiment consists of at least two variants:

- **Control**: Usually the current version of your application.
- **Treatment (Variant A, B, etc.)**: The modified version you want to test.

### 3. Traffic Allocation

You can decide what percentage of your users will participate in the experiment. For example, you might want to run a test on only 10% of your total traffic. Within that 10%, Divisor will split the users between your variants based on your configuration (e.g., 50/50).

### 4. User Identification (UID)

To ensure a consistent experience (so a user doesn't see Version A on their first visit and Version B on their second), Divisor uses a Unique Identifier (UID). 

- If you provide a `userId` in the SDK, Divisor uses it.
- If not, the SDK generates and persists a random UID for that user.

## Best Practices

- **Test one variable at a time**: This ensures you know exactly which change caused the difference in performance.
- **Run tests for a significant duration**: Avoid stopping tests too early. Ensure you have enough data to reach statistical significance.
- **Have a clear goal**: Define what success looks like before starting the test (e.g., higher click-through rate, more sign-ups).

## Next Steps

- [Set up your first experiment](../get-started.md)
- [Integrate the SDK](../sdk/intro.md)
