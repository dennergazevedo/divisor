---
title: "Como Rodar Experimentos em Produção Sem Impactar Performance (Core Web Vitals)"
description: "Mostre como experimentos mal implementados podem prejudicar LCP, CLS e INP, afetando SEO e conversão. Explique como evitar flicker, layout shift e scripts bloqueando renderização — comparando client-side vs server-side."
date: "2026-03-02"
author: "Divisor Team"
---

Testes A/B são fundamentais para o crescimento, mas se não forem bem implementados, podem ser um "tiro no pé". Um experimento que degrada a performance do site pode anular qualquer ganho de conversão e ainda prejudicar o seu posicionamento nos motores de busca (SEO) através das Core Web Vitals.

Neste artigo, vamos explorar como rodar testes de forma invisível para as métricas de performance.

## Problemas comuns em Testes A/B mal implementados

1. **Flicker (Anti-flicker snippets):** O usuário vê a versão original por um milissegundo antes da variante carregar. Para "resolver", muitos usam scripts que escondem o corpo da página, o que detona o **LCP (Largest Contentful Paint)**.
2. **Layout Shift (CLS):** Quando o teste altera o tamanho de elementos ou injeta novos sem reservar espaço, a página "pula", aumentando o **Cumulative Layout Shift**.
3. **Scripts Pesados:** Bibliotecas de 100kb+ carregadas no `<head>` bloqueiam a renderização e aumentam o **INP (Interaction to Next Paint)**.

## Como medir o impacto?

Antes de subir qualquer teste, você deve validar o impacto nas métricas reais. Utilize o **PageSpeed Insights** ou o **Lighthouse** em ambiente de staging comparando o controle com a variante. 

Fique de olho em:
- **TBT (Total Blocking Time):** Indica quanto o seu script está travando a main thread.
- **LCP:** Se o teste altera a imagem de destaque ou o título principal.

## Como rodar testes sem degradar performance

### 1. Server-Side Rendering (SSR) ou Edge Middleware
A melhor forma de evitar o flicker é decidir qual variante mostrar antes mesmo do HTML chegar ao navegador. Utilizando tecnologias como **Next.js com Edge Middleware**, o Divisor consegue rotear o usuário para a variante correta sem latência perceptível.

### 2. CSS-only Variations
Se possível, implemente as mudanças via CSS. Classes aplicadas no nível do `<html>` ou `<body>` permitem que o navegador renderize a variante sem precisar de execuções complexas de JavaScript.

### 3. Reserva de Espaço
Se o seu teste injeta um banner, reserve a altura desse banner via CSS no código base. Isso mantém o **CLS em zero**.

## Checklist Técnico para Experimentos de Alta Performance

- [ ] A decisão da variante é feita no servidor ou no Edge?
- [ ] O script de teste é carregado de forma assíncrona/defer?
- [ ] Existe reserva de espaço (skeleton/min-height) para novos elementos?
- [ ] A variante foi testada em conexões 3G lentas?
- [ ] O CLS permanece abaixo de 0.1 em ambas as versões?

Rodar experimentos não precisa ser um trade-off com a performance. Usando as ferramentas certas e a arquitetura moderna, você ganha dados sem perder velocidade.
