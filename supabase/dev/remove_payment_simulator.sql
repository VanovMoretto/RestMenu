-- Remove o simulador de pagamento. Rode ANTES de abrir o app para hóspedes reais.
drop function if exists public.dev_simulate_payment(uuid);

-- Opcional: ver (e, se quiser, apagar) os pedidos de teste pagos pelo simulador
-- select order_number, room_number, guest_name, total_amount, created_at
-- from public.orders where payment_provider_id like 'SIMULADO-%';
