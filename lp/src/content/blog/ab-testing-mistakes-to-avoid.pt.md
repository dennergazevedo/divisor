---
title: "7 Erros Que Invalidam Seus Experimentos (E Quase Ninguém Percebe)"
description: "Aborde problemas sérios como: parar o teste cedo demais, múltiplas métricas primárias, sample ratio mismatch. Saiba por que seu teste a/b não funciona."
date: "2024-11-04"
author: "Divisor Team"
---

Muitos times de produto se questionam com frequência: "por que meu teste ab não funciona" ou por que as supostas melhorias das taxas de conversão (CRO) não se refletem na conta bancária da empresa no final do mês? 

Rodar testes é uma ciência. Executar **erros em teste ab** não só desperdiça seu tráfego e esforço de engenharia, como muitas vezes faz você aprovar recursos que prejudicam os usuários.

Aqui estão 7 erros silenciosos que condenam os experimentos:

### 1. Parar o Teste Cedo Demais (Peeking)
Estatisticamente, se você rastrear dados continuamente dia-a-dia de um teste A/B, a chance de declarar um "Vencedor" provisoriamente falso em algum momento beira os 60%. Deixe o teste chegar ao tamanho da amostra calculada. Ponto final.

### 2. Múltiplas Métricas Primárias (Multi-testing problem)
Se você testa se um botão altera cliques, conversão em vendas, adicionar ao carrinho E visualizações da página do termo de uso *ao mesmo tempo*, você está aumentando infinitamente o ruído estatístico. Escolha APENAS UMA métrica principal OEC (Overall Evaluation Criterion). 

### 3. Sample Ratio Mismatch (SRM)
Você configurou a plataforma para dividir 50/50, porém o Analytics reporta que a Variante B recebeu 52% dos usuários e a Variante A 48%. Este desvio (Sample Ratio Mismatch) indica uma falha de engenharia gravíssima (geralmente lentidão de script, ou redirects inconsistentes) — a confiança do seu experimento foi pelo ralo. *Dica: Com o Divisor de roteamento no Edge, você não possui problemas de SRM.*

### 4. Testar Múltiplas Coisas na Mesma Variante
Mudar a cor do botão, o título, a imagem *e* o preço da assinatura ao mesmo tempo em uma Variante versus Controle. Se você vencer, a qual desses fatores você atribui a vitória? O **experimento sem significancia** causal é inútil para aprendizado de longo prazo.

### 5. Simpson's Paradox (Falha na Segmentação Geográfica)
Usuários do iOS podem preferir a Variante B. Usuários de Android podem odiá-la. Juntos, no pacote genérico do teste, a média fica inalterada, te levando a pensar que sua ideia falhou. Segmentar análises depois que o teste fechou é crucial em certas ferramentas (um teste "neutro" no aspecto geral pode ser absurdamente otimizado para pequenos bolsões populacionais).

### 6. Interferência de Outros Testes Ocorrendo Junto
Se você tem dois testes gigantes A/B concorrentes modificando o processo de Checkout, pode haver colisões severas. Os testes devem ser controlados via tags independentes e estratificados verticalmente.

### 7. Não Otimizar Por "Seasonality" ou Ciclos Departamentais (Sazonalidade)
Rodar durante a semana do Black Friday e tomar ações precipitadas. Usuários se comportam completamente diferente quando impulsionados por campanhas externas. Fuja de tomar decisões baseadas em eventos raros e pontuais do calendário como base empírica estendida para o ano todo.
