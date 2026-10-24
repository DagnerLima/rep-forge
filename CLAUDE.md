# Fluxo de trabalho

O Claude da sessão implementa, testa e audita direto — não há divisão Opus/Sonnet nem prompts para copiar.

## Implementação e testes

- Testar rodando antes de entregar: compilar o JSX com o mesmo Babel do app, testar funções puras em node e o fluxo real no navegador (Supabase simulado quando precisar de login).
- Teste que vale é o que falha na versão antiga e passa na nova.
- Validação manual (caminho na UI + resultado esperado) vai como nota para o usuário no fim.

## Commits

- Commitar só **marcos** (conjunto de correções testado), não a cada edição.
- Publicação: o app é servido pelo GitHub Pages a partir do `main` — só vai ao ar **depois do push**. O app instalado pega a versão nova ao abrir com internet (o service worker busca o `index.html` na rede primeiro; o Pages guarda cache por até 10 min).

## Comunicação

- Resumos **curtos e não-técnicos**: veredito em 1-2 linhas. Detalhe técnico só se pedirem.
- Quando tiver o suficiente pra agir, **agir** — não re-derivar fato já estabelecido.

## Memória (entre sessões)

- Persistir **decisões, dívida técnica, feedback e ideias adiadas** — um fato por arquivo, índice enxuto.
- Evita re-derivar contexto a cada sessão.
