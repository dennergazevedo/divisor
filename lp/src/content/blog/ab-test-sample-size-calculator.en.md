---
title: "How to Calculate the Ideal Sample Size Before Running an Experiment"
description: "Discover how to define the minimum sample size for your A/B tests. Understand the math behind it and prevent critical errors that invalidate your findings."
date: "2024-11-03"
author: "Divisor Team"
---

If you launch an A/B test without calculating how many people must experience it first, the chances are incredibly high that you'll commit a critical error: falling for a **false positive** (declaring Variant B the winner when the lift was just due to random chance).

It's absolutely imperative to know how many users or sessions you need (a `sample size calculator ab test` approach) before even turning the experiment's switch on.

## The Mathematics of A/B Testing

The essence of an **ab test sample size calculator** boils down to balancing three crucial variables:

1. **Current Conversion Rate (Baseline):** The original conversion rate of the page you are testing (e.g., 5%).
2. **Minimum Detectable Effect (MDE):** The minimum relative or absolute lift you want to be able to detect. If your relative MDE is 10%, it means you expect conversion to jump from 5% to 5.5%. The smaller the MDE, the more users you will need.
3. **Statistical Power & Significance Level (Alpha/Beta):** By industry standard, we use an *Statistical Significance of 95%* (we accept a 5% chance of a false positive) and a *Power of 80%* (we assume the test will successfully detect the true effect 80% of the times it actually exists).

## The Golden Question: "How many users do I need?"

Many companies design absurd tests trying to detect minuscule improvements.

Imagine your baseline is 2% and you expect a tiny relative lift of 5% (going to 2.1%). Your calculator would demand *hundreds of thousands* of views to scientifically confirm this hypothesis. If you don't get that traffic volume in a reasonable time, the test is invalid. The general rule is: if you have low monthly traffic (less than 10,000 users), focus exclusively on tests designed to drive a massive impact (a much broader *MDE*, around 30% to 50%).

## Sample Size Errors that Invalidate A/B Tests

1. **Premature "Peeking":** Looking at an A/B test that requires a 10,000 sample size when it's only hit 1,000 visits. Upon seeing the variant winning "significantly" (purely due to early random fluctuation), you pause and mistakenly declare a fraudulent winner.
2. **Ignoring Business Cycles:** Always let the test run for full week cycles (7 days, 14 days, 21 days), regardless of whether you’ve already hit the sample target. User behavior on a Monday is vastly different from user behavior on a Sunday.

Set the numbers before; let the math objectively confirm your hard work!
