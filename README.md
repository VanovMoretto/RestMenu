# Irius Gastronomia — Cardápio Digital & Room Service

Cardápio digital do restaurante **Irius** (complexo Swan, Novo Hamburgo), com pedidos de room service, pagamento antecipado e painel do restaurante em tempo real.

- **Hóspede:** vê o cardápio em PT/EN/ES, monta o pedido, informa quarto e dados, paga (PIX/cartão) ou pede para faturar no quarto / pagar em dinheiro, e acompanha o status.
- **Recepção e cozinha:** recebem os pedidos ao vivo com alerta sonoro, conferem os faturados, enviam para a cozinha e imprimem o cupom térmico de 80mm.
- **Dono:** pausa pratos em falta, muda preços, cria itens e sobe fotos sem mexer em código.

> 📘 **Guia completo (aula do zero, inclusive SQL):** [`docs/guia-do-app-irius.pdf`](docs/guia-do-app-irius.pdf)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Front-end | React 19 + TypeScript + Vite, CSS Modules, i18next, lucide-react |
| Back-end | [Supabase](https://supabase.com): Postgres, Auth, Storage e Realtime |
| Hospedagem | GitHub Pages (`/RestMenu/`) |

Não existe servidor próprio: o navegador fala direto com o Supabase, e a segurança fica **no banco** (GRANT + Row Level Security + funções `security definer`).

## Rotas

| Endereço | O que é |
|---|---|
| `/RestMenu/` | Cardápio do hóspede (carrinho, checkout e acompanhamento do pedido) |
| `/RestMenu/admin` | Painel do restaurante (login): **Pedidos ao Vivo** e **Gestão de Cardápio** |

---

## Rodando localmente

### 1. Pré-requisitos
- Node.js 20+
- Um projeto no Supabase

### 2. Banco de dados (Supabase → SQL Editor), nesta ordem
| Arquivo | O que faz |
|---|---|
| [`supabase/schema.sql`](supabase/schema.sql) | Tabelas, permissões (GRANT/RLS), funções, Realtime e bucket de fotos |
| [`supabase/seed.sql`](supabase/seed.sql) | Cardápio inicial: 37 categorias e 143 itens com traduções |
| [`supabase/dev/payment_simulator.sql`](supabase/dev/payment_simulator.sql) | **Só para testes:** simulador de pagamento PIX/cartão |

Todos podem ser rodados de novo sem duplicar dados.

### 3. Variáveis de ambiente
Copie `.env.example` para `.env.local` e preencha (Supabase → Project Settings → API):

```bash
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co   # sem /rest/v1
VITE_SUPABASE_ANON_KEY=sb_publishable_...            # chave PÚBLICA (nunca a secret)
```

Para ligar o simulador de pagamento no ambiente de desenvolvimento, crie `.env.development.local`:

```bash
VITE_PAYMENT_SIMULATOR=true
```

### 4. Admin do painel
1. Supabase → **Authentication → Users → Add user** (marque *Auto Confirm User*).
2. No SQL Editor:
   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'seu-email@exemplo.com';
   ```
3. Em **Authentication → Sign In / Providers**, desligue *Allow new users to sign up*.

### 5. Rodar
```bash
npm install
npm run dev
```

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checa os tipos, gera o build e copia `index.html` → `404.html` (necessário para `/admin` no GitHub Pages) |
| `npm run lint` | ESLint |
| `npm run deploy` | Build + publicação no GitHub Pages |

---

## Regras de negócio

**Status do pedido (`payment_status`)**

| Status | Quando |
|---|---|
| `pending` | PIX/cartão criado, aguardando pagamento (não aparece no painel) |
| `awaiting_approval` | Faturar no quarto ou dinheiro: recepção precisa conferir |
| `approved` | Liberado pela recepção; valor ainda a receber (check-out/entrega) |
| `paid` | Pago |
| `cancelled` | Recusado |

Só pedidos `paid` ou `approved` vão para a cozinha.

**Formas de pagamento ligadas/desligadas (`payment_settings`)**

Cada forma (PIX, cartão, faturar no quarto, dinheiro) tem uma chave `enabled`. **Todas começam desligadas.** Desligada, ela aparece apagada no checkout com "Indisponível no momento", e o banco **recusa** o pedido mesmo que alguém chame a API direto. Se todas estiverem desligadas, o checkout avisa que os pedidos estão pausados.

Para ligar ou desligar: **/admin → Pedidos ao Vivo → Formas de pagamento no app**, ou pelo SQL:
```sql
update public.payment_settings set enabled = true where method = 'pix';
```

**Segurança**
- O front **nunca envia preço**: a função `create_safe_order` busca os preços no banco, calcula o total e valida tudo (itens disponíveis, limites, faturamento permitido).
- Hóspedes não leem a tabela de pedidos; acompanham pelo `get_order_status(uuid)`, que não expõe dados pessoais.
- Admin só altera `payment_status` e `print_status`; valores e itens do pedido ficam travados.
- O botão de simulação de pagamento só existe no `npm run dev` (`import.meta.env.DEV`) e nunca entra no build publicado.

---

## Estrutura

```
supabase/          SQL: schema, seed e simulador (dev/)
docs/              Guia em PDF/HTML e kit de fotos pendentes
src/
├─ main.tsx        Escolhe cardápio ou painel (/admin, carregado sob demanda)
├─ lib/            Cliente Supabase e formatação (idioma, R$, imagens)
├─ hooks/          useMenu: busca e monta a árvore do cardápio
├─ components/     Telas do cardápio (Menu, Tabs, MenuItem, Modal, Skeleton…)
├─ cart/           Carrinho (Context + localStorage)
├─ checkout/       Carrinho → dados → pagamento → acompanhamento
├─ admin/          Painel: login, gestão de cardápio, upload de fotos
│  └─ orders/      Pedidos ao vivo (Realtime), alerta sonoro, cupom 80mm
└─ locales/        Textos da interface em PT/EN/ES
```

---

## Antes de abrir para hóspedes

- [ ] Rodar [`supabase/dev/remove_payment_simulator.sql`](supabase/dev/remove_payment_simulator.sql)
- [ ] Integrar gateway de pagamento real (confirmação via webhook em Edge Function)
- [ ] Agente de impressão automática na EPSON TM-T20X-II (hoje: impressão pelo painel)
- [ ] Revisar quais itens aceitam faturar no quarto (`allow_room_charge`)
- [ ] Fotos dos 58 pratos pendentes — ver [`docs/fotos-pendentes.md`](docs/fotos-pendentes.md)
- [ ] Apagar pedidos de teste (`payment_provider_id like 'SIMULADO-%'`)
- [ ] Política de privacidade (LGPD)
