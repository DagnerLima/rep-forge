# Fluxo de trabalho — melhor resultado, menor consumo de token

## Papéis

- **Opus (modelo caro):** diagnostica, gera prompts, audita. **NÃO implementa.**
- **Sonnet (modelo barato):** implementa a partir dos prompts.

Raciocínio caro planeja e audita; modelo barato escreve o volume.

## Construção de prompts

- Referenciar arquivo por **caminho + linha**; nunca colar o conteúdo inteiro no prompt.
- Quebrar em prompts pequenos: **máx. 3 entregáveis** cada, independentes e executáveis sozinhos.
- Separar **SQL/migrations** do prompt do Sonnet (rodar à parte).
- **Validação manual vai FORA do prompt** — nota pro usuário (caminho na UI + resultado esperado). Quem valida é o usuário, não o Sonnet.

## Lotes e turnos

- **Prompts irmãos** (dependem só da fundação, não um do outro): entregar **JUNTOS numa mensagem**. Menos turnos = menos re-envio de contexto.
- **Um-por-um** só quando um prompt depende do anterior (evita bug em cascata).

## Auditoria

- Auditar pelo **`git diff`** (só o que mudou), não relendo arquivos inteiros.
- A fundo só **fundações** (schema, estado compartilhado, lógica não-óbvia) ou quando o usuário reportar problema.
- Trivial/cosmético/UI isolada: **confiar** + validação visual do usuário.
- Auditar **em lote**: vários prompts irmãos num diff só.

## Commits

- Commitar só **fundações/marcos**, não a cada prompt.
- Commitar **antes do próximo passo do Sonnet**, pro próximo diff sair limpo.
- Publicação: o app é servido pelo GitHub Pages a partir do `main` — só vai ao ar **depois do push**.

## Comunicação

- Resumos **curtos e não-técnicos**: veredito em 1-2 linhas. Detalhe técnico só se pedirem.
- Quando tiver o suficiente pra agir, **agir** — não re-derivar fato já estabelecido nem re-mandar prompt ainda não enviado.

## Memória (entre sessões)

- Persistir **decisões, dívida técnica, feedback e ideias adiadas** — um fato por arquivo, índice enxuto.
- Evita re-derivar contexto a cada sessão.
