-- =============================================================================
-- ⚠️  SÓ PARA TESTES — SIMULADOR DE GATEWAY DE PAGAMENTO
-- =============================================================================
-- Cria a RPC dev_simulate_payment, que marca um pedido PIX/cartão como pago
-- SEM dinheiro nenhum ter entrado. É o que o botão
-- "🛠️ DEV: Simular Pagamento Aprovado" do app chama.
--
-- Qualquer pessoa que crie um pedido consegue chamar esta função para o próprio
-- pedido — ou seja, em produção ela permitiria comer de graça.
--
-- ANTES DE IR PARA PRODUÇÃO (ou ao integrar o gateway de verdade):
--   1. rode supabase/dev/remove_payment_simulator.sql
--   2. tire VITE_PAYMENT_SIMULATOR=true do .env do build publicado
-- =============================================================================

create or replace function public.dev_simulate_payment(p_order_id uuid)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_order public.orders%rowtype;
begin
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then
    raise exception 'Pedido não encontrado.' using errcode = 'P0002';
  end if;
  if v_order.payment_method not in ('pix', 'credit_card') then
    raise exception 'Só pedidos PIX ou cartão passam pelo gateway.' using errcode = '22023';
  end if;
  if v_order.payment_status <> 'pending' then
    raise exception 'Este pedido não está aguardando pagamento.' using errcode = '22023';
  end if;

  -- O prefixo SIMULADO- deixa esses pedidos fáceis de achar e apagar depois
  update public.orders
     set payment_status      = 'paid',
         payment_provider_id = 'SIMULADO-' || gen_random_uuid()
   where id = p_order_id;

  return jsonb_build_object('order_number', v_order.order_number, 'payment_status', 'paid');
end;
$$;

revoke all on function public.dev_simulate_payment(uuid) from public;
grant execute on function public.dev_simulate_payment(uuid) to anon, authenticated;
