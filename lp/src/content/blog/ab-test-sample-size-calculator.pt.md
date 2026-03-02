---
title: "Como Calcular o Tamanho Ideal de Amostra Antes de Rodar um Experimento"
description: "Descubra como definir o tamanho mínimo da amostra para seus testes A/B. Entenda a matemática por trás e evite erros que invalidam conclusões estatísticas."
date: "2024-11-03"
author: "Divisor Team"
---

Se você for lançar um teste A/B para todos os seus usuários sem calcular quantas pessoas devem passar pelo experimento antes, as chances são altíssimas de você cometer um erro grave: acreditar num **falso positivo** (declarar que a Variante B venceu quando na verdade foi puro acaso).

É imperativo saber quantos usuários ou sessões você precisa (`sample size calculator ab test`) antes de sequer ligar a chave do seu experimento.

## A Matemática do Teste A/B

A essência de calcular um **tamanho de amostra teste ab** se resume a um balanço entre três variáveis cruciais:

1. **Taxa de Conversão Atual (Baseline):** A taxa de conversão original da página que você está testando (por exemplo, 5%).
2. **Efeito Mínimo Detectável (MDE):** O aumento mínimo (impacto) relativo ou absoluto que você quer ser capaz de detectar. Se seu MDE for 10% relativo, significa que você espera que a conversão salte de 5% para 5.5%. Quanto menor o MDE, mais usuários você vai precisar.
3. **Poder Estatístico & Nível de Significância (Alpha/Beta):** Por padrão da indústria, usamos *Significância Estatística de 95%* (aceitamos 5% de chance de erro falso positivo) e *Poder de 80%* (assumimos que o teste detectará o efeito real caso ele exista 80% das vezes).

## A Pergunta de Ouro: "Quantos usuários preciso para teste ab?"

Muitas empresas criam testes absurdos tentando detectar melhorias minúsculas.

Imagine que seu baseline seja 2% e você espera aumentar isso apenas relativamente em 5% (ir para 2.1%). A sua calculadora exigiria *centenas de milhares* de visualizações para confirmar cientificamente essa hipótese. Se você não tem esse tráfego no mês, o teste é inválido. A regra geral é: se você tem pouco tráfego mensal (menos de 10.000 usuários), concentre-se em testes que providenciem um grande impacto na convenção (um *MDE* muito mais amplo, na casa dos 30% a 50%). 

## Erros que invalidam Testes Relacionados a Amostra

1. **"Peeking" prematuro:** Olhar para o teste que exige 10.000 amostras depois de 1.000 visitas. Ao ver a variante ganhando estatisticamente (puramente pela flutuação aleatória do início), você pausa e declara um vencedor fraudulento.
2. **Ignorar ciclos de negócios:** Sempre deixe o teste rodar por ciclos completos de semanas completas (7 dias, 14 dias), independente de você já ter atingido a amostra. O comportamento dos usuários às segundas é bem diferente do domingo.

Defina os números antes; deixe a matemática confirmar seu trabalho duro!
