-- =============================================================================
-- Irius Gastronomia — seed do cardápio
-- GERADO AUTOMATICAMENTE a partir de src/data/menuData.ts, priceList.ts e
-- src/locales/*.json. Rode no SQL Editor DEPOIS do schema.sql.
--
-- 6 abas, 21 seções, 10 subseções, 143 itens.
--
-- - IDs não são fixados: cada linha acha o pai pelo slug. As sequences andam
--   sozinhas, então não precisa de setval.
-- - Pode rodar de novo sem duplicar: "on conflict (slug) do nothing" nunca
--   sobrescreve o que o admin já mudou no painel (preço, foto, disponibilidade).
-- - allow_room_charge fica false em tudo (padrão do schema = pré-pago).
-- - image_url = caminho atual do menuData.ts, relativo e SEM barra inicial
--   (ex.: lanches/burger-chef.webp). O Vite usa base '/RestMenu/', então o
--   navegador resolve para /RestMenu/lanches/... como hoje. Ao subir fotos
--   pelo painel, o campo passa a ter a URL completa do bucket menu-images.
-- =============================================================================

begin;

-- 1. Abas do menu (parent_id null)
insert into public.categories (parent_id, slug, name, translations, sort_order)
values
  (null, 'entrada', 'Entradas', '{"en":{"name":"Starters"},"es":{"name":"Entradas"}}'::jsonb, 10),
  (null, 'principal', 'Principais', '{"en":{"name":"Main Courses"},"es":{"name":"Platos Principales"}}'::jsonb, 20),
  (null, 'lanches', 'Lanches', '{"en":{"name":"Snacks"},"es":{"name":"Bocadillos"}}'::jsonb, 30),
  (null, 'sobremesa', 'Sobremesas', '{"en":{"name":"Desserts"},"es":{"name":"Postres"}}'::jsonb, 40),
  (null, 'bebida', 'Bebidas', '{"en":{"name":"Drinks"},"es":{"name":"Bebidas"}}'::jsonb, 50),
  (null, 'vinho', 'Vinhos', '{"en":{"name":"Wines"},"es":{"name":"Vinos"}}'::jsonb, 60)
on conflict (slug) do nothing;

-- 2. Seções (filhas das abas)
insert into public.categories (parent_id, slug, name, translations, sort_order)
select p.id, v.slug, v.name, v.translations::jsonb, v.sort_order
from (values
  ('entrada', 'couvert', 'Couvert & Petiscos', '{"en":{"name":"Couvert & Appetizers"},"es":{"name":"Couvert y Aperitivos"}}', 10),
  ('entrada', 'saladas', 'Saladas', '{"en":{"name":"Salads"},"es":{"name":"Ensaladas"}}', 20),
  ('entrada', 'sopas', 'Sopas & Cremes', '{"en":{"name":"Soups & Creams"},"es":{"name":"Sopas y Cremas"}}', 30),
  ('principal', 'carnes', 'Carnes Vermelhas', '{"en":{"name":"Red Meats"},"es":{"name":"Carnes Rojas"}}', 10),
  ('principal', 'peixes', 'Peixes & Frutos do Mar', '{"en":{"name":"Fish & Seafood"},"es":{"name":"Pescados y Mariscos"}}', 20),
  ('principal', 'aves', 'Aves', '{"en":{"name":"Poultry"},"es":{"name":"Aves"}}', 30),
  ('principal', 'massas', 'Massas & Risotos', '{"en":{"name":"Pasta & Risottos"},"es":{"name":"Pastas y Risottos"}}', 40),
  ('lanches', 'burgers', 'Hambúrgueres & Sanduíches', '{"en":{"name":"Burgers & Sandwiches"},"es":{"name":"Hamburguesas y Sándwiches"}}', 10),
  ('lanches', 'omeletes', 'Omeletes & Tapiocas', '{"en":{"name":"Omelettes & Tapiocas"},"es":{"name":"Omelets y Tapiocas"}}', 20),
  ('lanches', 'pizzas', 'Pizzas (Média)', '{"en":{"name":"Pizzas (Medium)"},"es":{"name":"Pizzas (Mediana)"}}', 30),
  ('lanches', 'extras', 'Extras', '{"en":{"name":"Extras"},"es":{"name":"Extras"}}', 40),
  ('sobremesa', 'sobremesas', 'Sobremesas', '{"en":{"name":"Desserts"}}', 10),
  ('bebida', 'bebidas_frias', 'Bebidas Frias', '{"en":{"name":"Cold Drinks"},"es":{"name":"Bebidas Frías"}}', 10),
  ('bebida', 'bebidas_quentes', 'Bebidas Quentes', '{"en":{"name":"Hot Drinks"},"es":{"name":"Bebidas Calientes"}}', 20),
  ('bebida', 'cervejas', 'Cervejas', '{"en":{"name":"Beers"},"es":{"name":"Cervezas"}}', 30),
  ('bebida', 'drinks', 'Drinks & Destilados', '{"en":{"name":"Cocktails & Spirits"},"es":{"name":"Cócteles y Destilados"}}', 40),
  ('vinho', 'vinhos_taca', 'Vinhos em Taça', '{"en":{"name":"Wine by the Glass"},"es":{"name":"Vinos por Copa"}}', 10),
  ('vinho', 'vinhos_tintos', 'Vinhos Tintos', '{"en":{"name":"Red Wines"},"es":{"name":"Vinos Tintos"}}', 20),
  ('vinho', 'vinhos_rose', 'Vinhos Rosé', '{"en":{"name":"Rosé Wines"},"es":{"name":"Vinos Rosados"}}', 30),
  ('vinho', 'vinhos_brancos', 'Vinhos Brancos', '{"en":{"name":"White Wines"},"es":{"name":"Vinos Blancos"}}', 40),
  ('vinho', 'espumantes', 'Espumantes', '{"en":{"name":"Sparkling Wines"},"es":{"name":"Vinos Espumosos"}}', 50)
) as v (parent_slug, slug, name, translations, sort_order)
join public.categories p on p.slug = v.parent_slug
on conflict (slug) do nothing;

-- 3. Subseções (filhas das seções)
insert into public.categories (parent_id, slug, name, translations, sort_order)
select p.id, v.slug, v.name, v.translations::jsonb, v.sort_order
from (values
  ('vinhos_tintos', 'cabernet', 'Cabernet Sauvignon', '{"en":{"name":"Cabernet Sauvignon"},"es":{"name":"Cabernet Sauvignon"}}', 10),
  ('vinhos_tintos', 'merlot', 'Merlot', '{"en":{"name":"Merlot"},"es":{"name":"Merlot"}}', 20),
  ('vinhos_tintos', 'tannat', 'Tannat', '{"en":{"name":"Tannat"},"es":{"name":"Tannat"}}', 30),
  ('vinhos_tintos', 'carmenere', 'Carménère', '{"en":{"name":"Carménère"},"es":{"name":"Carménère"}}', 40),
  ('vinhos_tintos', 'malbec', 'Malbec', '{"en":{"name":"Malbec"},"es":{"name":"Malbec"}}', 50),
  ('vinhos_tintos', 'tempranillo', 'Tempranillo & Syrah', '{"en":{"name":"Tempranillo & Syrah"},"es":{"name":"Tempranillo & Syrah"}}', 60),
  ('espumantes', 'demisec', 'Demi Sec', '{"en":{"name":"Demi Sec"},"es":{"name":"Demi Sec"}}', 10),
  ('espumantes', 'brut', 'Brut', '{"en":{"name":"Brut"},"es":{"name":"Brut"}}', 20),
  ('espumantes', 'rose', 'Rosé', '{"en":{"name":"Rosé"},"es":{"name":"Rosé"}}', 30),
  ('espumantes', 'moscatel', 'Moscatel', '{"en":{"name":"Moscatel"},"es":{"name":"Moscatel"}}', 40)
) as v (parent_slug, slug, name, translations, sort_order)
join public.categories p on p.slug = v.parent_slug
on conflict (slug) do nothing;

-- 4. Itens
insert into public.menu_items (
  category_id, slug, name, description, translations, price,
  image_url, serving_type, show_picture_icon, sort_order
)
select
  c.id, v.slug, v.name, v.description, v.translations::jsonb, v.price::numeric(10, 2),
  v.image_url, v.serving_type, v.show_picture_icon, v.sort_order
from (values
  ('couvert', 'c1', 'Dadinhos de Coalho', '8 unidades, com melado.', '{"en":{"name":"Curd Cheese Dice","description":"8 units, with molasses."},"es":{"name":"Dados de Queso Coalho","description":"8 unidades, con melaza."}}', 24.00, 'entradas/dadinhos.png', null, false, 10),
  ('couvert', 'c2', 'Mini Croquetas de Costela', '8 unidades. Servido com maionese de leite e pesto.', '{"en":{"name":"Mini Rib Croquettes","description":"8 units. Served with milk mayonnaise and pesto."},"es":{"name":"Mini Croquetas de Costilla","description":"8 unidades. Servidas con mayonesa de leche y pesto."}}', 48.00, 'entradas/croquetas.png', null, false, 20),
  ('couvert', 'c3', 'Polentinha Frita', 'Coberta com parmesão ralado. Acompanha caponata.', '{"en":{"name":"Fried Polenta","description":"Covered with grated parmesan. Served with caponata."},"es":{"name":"Polenta Frita","description":"Cubierta con parmesano rallado. Acompaña caponata."}}', 48.00, 'entradas/polenta.png', null, false, 30),
  ('couvert', 'c4', 'Batatinha Frita', 'Coberta com parmesão ralado. Acompanha molho dijon.', '{"en":{"name":"Fried Potato Cubes","description":"Covered with grated parmesan. Served with dijon sauce."},"es":{"name":"Papas Fritas en Cubos","description":"Cubiertas con parmesano rallado. Acompaña salsa dijon."}}', 48.00, 'entradas/batatinha.png', null, false, 40),
  ('couvert', 'c5', 'Iscas de Frango ao Panko', 'Com maionese de limão e mostarda com mel trufado.', '{"en":{"name":"Panko Chicken Strips","description":"With lemon mayonnaise and truffle honey mustard."},"es":{"name":"Tiras de Pollo al Panko","description":"Con mayonesa de limón y mostaza con miel trufada."}}', 58.00, 'entradas/iscas_frango.png', null, false, 50),
  ('couvert', 'c6', 'Iscas de Filet Mignon à Milanesa', 'Porção grande (travessa).', '{"en":{"name":"Breaded Filet Mignon Strips","description":"Large portion."},"es":{"name":"Tiras de Filete Mignon Empanizadas","description":"Porción grande."}}', 98.00, 'entradas/iscas_mignon.png', null, false, 60),
  ('couvert', 'c7', 'Seleção de Queijos & Frios', 'Servido na pedra de ardósia com tâmaras, uvas e nuts.', '{"en":{"name":"Selection of Cheeses & Cold Cuts","description":"Served on slate with dates, grapes and nuts."},"es":{"name":"Selección de Quesos y Fiambres","description":"Servida en pizarra con dátiles, uvas y nueces."}}', 98.00, 'entradas/tabua_frios.png', null, false, 70),
  ('couvert', 'c8', 'Brie Folhado', 'Assado com mel trufado e nuts. Acompanha chips e torradas.', '{"en":{"name":"Puff Pastry Brie","description":"Baked with truffle honey and nuts. Served with chips and toast."},"es":{"name":"Brie en Hojaldre","description":"Horneado con miel trufada y nueces. Acompaña chips y tostadas."}}', 74.00, 'entradas/brie_folhado.png', null, false, 80),
  ('couvert', 'c9', 'Burrata', 'Ao molho de tomate fresco, pesto e brotos. Com chips e torradas.', '{"en":{"name":"Burrata","description":"With fresh tomato sauce, pesto and sprouts. Served with chips and toast."},"es":{"name":"Burrata","description":"Con salsa de tomate fresco, pesto y brotes. Con chips y tostadas."}}', 74.00, 'entradas/burrata.png', null, false, 90),
  ('saladas', 's1', 'Mix de Folhas (Sem Brie)', 'Com nuts e legumes confitados em oliva (palmito, ervilhas, grão de bico).', '{"en":{"name":"Mix of Leaves (No Brie)","description":"With nuts and vegetables confit in olive oil (hearts of palm, peas, chickpeas)."},"es":{"name":"Mix de Hojas (Sin Brie)","description":"Con nueces y verduras confitadas en oliva (palmito, guisantes, garbanzos)."}}', 68.00, 'entradas/salada.png', null, false, 10),
  ('saladas', 's2', 'Mix de Folhas (Com Brie)', 'Com queijo brie, nuts e legumes confitados.', '{"en":{"name":"Mix of Leaves (With Brie)","description":"With brie cheese, nuts and vegetables confit."},"es":{"name":"Mix de Hojas (Con Brie)","description":"Con queso brie, nueces y verduras confitadas."}}', 82.00, 'entradas/salada_brie.png', null, false, 20),
  ('sopas', 'sp1', 'Canja de Frango', 'Acompanha torradinhas com ervas finas.', '{"en":{"name":"Chicken Soup","description":"Served with fine herb toast."},"es":{"name":"Sopa de Pollo (Canja)","description":"Acompaña tostaditas con finas hierbas."}}', 46.00, 'entradas/canja.png', null, false, 10),
  ('sopas', 'sp2', 'Sopa de Capeletti', 'Acompanha bacon assado, torradinhas e queijo.', '{"en":{"name":"Capeletti Soup","description":"Served with baked bacon, toast and cheese."},"es":{"name":"Sopa de Capeletti","description":"Acompaña tocino asado, tostaditas y queso."}}', 46.00, 'entradas/capeletti.png', null, false, 20),
  ('sopas', 'sp3', 'Creme de Ervilha', 'Acompanha bacon assado, torradinhas e queijo.', '{"en":{"name":"Pea Cream","description":"Served with baked bacon, toast and cheese."},"es":{"name":"Crema de Guisantes","description":"Acompaña tocino asado, tostaditas y queso."}}', 46.00, 'entradas/creme_ervilha.png', null, false, 30),
  ('sopas', 'sp4', 'Creme de Moranga', 'Acompanha bacon assado, torradinhas e queijo.', '{"en":{"name":"Pumpkin Cream","description":"Served with baked bacon, toast and cheese."},"es":{"name":"Crema de Calabaza","description":"Acompaña tocino asado, tostaditas y queso."}}', 46.00, 'entradas/creme_moranga.png', null, false, 40),
  ('sopas', 'sp5', 'Creme de Aipim com Frango', 'Acompanha bacon assado, torradinhas e queijo.', '{"en":{"name":"Cassava Cream with Chicken","description":"Served with baked bacon, toast and cheese."},"es":{"name":"Crema de Yuca con Pollo","description":"Acompaña tocino asado, tostaditas y queso."}}', 46.00, 'entradas/creme_aipim.png', null, false, 50),
  ('carnes', 'cn1', 'Bife Ancho com Massa', 'Grelhado na manteiga. Com massa, legumes, aligot e purê de baroa.', '{"en":{"name":"Ancho Steak with Pasta","description":"Grilled in butter. With pasta, vegetables, aligot and baroa puree."},"es":{"name":"Bife Ancho con Pasta","description":"A la plancha en mantequilla. Con pasta, verduras, aligot y puré de mandioquinha."}}', 92.00, 'principais/ancho_massa.png', null, false, 10),
  ('carnes', 'cn2', 'Costela 12h', 'Assada lentamente. Com massa, crispy de couve, chimchurri, farofa, legumes confitados, aligot de aipim e purê de baroa.

Escolha a massa de acompanhamento:
• Nhoque de Baroa ao molho de queijos com gran formaggio
• Sorrentino de espinafre com brie
• Espaguete ao molho de:
   - De Nata com Gruyere e Parmesão
   - De Queijos
   - Ao Funghi', '{"en":{"name":"12-Hour Ribs","description":"Slow-roasted. Served with pasta, crispy kale, chimichurri, farofa, confit vegetables, cassava aligot, and arracacha puree.\n\nChoose your pasta side:\n• Arracacha Gnocchi in cheese sauce with Gran Formaggio\n• Spinach Sorrentino with Brie\n• Spaghetti with sauce:\n   - Cream with Gruyère and Parmesan\n   - Cheese\n   - Funghi (Mushroom)"},"es":{"name":"Costilla 12h","description":"Asada lentamente. Con pasta, crocante de kale, chimichurri, farofa, verduras confitadas, aligot de yuca y puré de arracacha.\n\nElija la pasta de acompañamiento:\n• Ñoquis de Arracacha en salsa de quesos con Gran Formaggio\n• Sorrentinos de espinaca con Brie\n• Espagueti con salsa de:\n   - Nata con Gruyere y Parmesano\n   - Quesos\n   - Funghi (Hongos)"}}', 92.00, 'principais/costela12.webp', null, true, 20),
  ('carnes', 'cn3', 'Bife Ancho (Sem Massa)', 'Na manteiga ou molho mostarda. Servido com legumes variados.', '{"en":{"name":"Ancho Steak (No Pasta)","description":"Butter or mustard sauce. Served with mixed vegetables."},"es":{"name":"Bife Ancho (Sin Pasta)","description":"Mantequilla o salsa de mostaza. Servido con verduras variadas."}}', 84.00, 'principais/ancho_legumes.png', null, false, 30),
  ('carnes', 'cn4', 'Tornedor de Mignon', 'Na manteiga ou molho mostarda. Acompanha arroz branco.', '{"en":{"name":"Mignon Tournedos","description":"Butter or mustard sauce. Served with white rice."},"es":{"name":"Tournedos de Mignon","description":"Mantequilla o salsa de mostaza. Acompaña arroz blanco."}}', 84.00, 'principais/tornedor.png', null, false, 40),
  ('carnes', 'cn5', 'Filet à Parmegiana', 'Com bacon, ovo frito, arroz e fritas.', '{"en":{"name":"Parmigiana Filet","description":"With bacon, fried egg, rice and fries."},"es":{"name":"Filete a la Parmesana","description":"Con tocino, huevo frito, arroz y papas fritas."}}', 84.00, 'principais/parmegiana.png', null, false, 50),
  ('carnes', 'cn6', 'Risoto de Brie com Iscas de Angus', 'Iscas flambadas no conhaque. Risoto com gran formaggio.', '{"en":{"name":"Brie Risotto with Angus Strips","description":"Cognac flambéed strips. Risotto with gran formaggio."},"es":{"name":"Risotto de Brie con Tiras de Angus","description":"Tiras flambeadas al coñac. Risotto con gran formaggio."}}', 68.00, 'principais/risoto_iscas.png', null, false, 60),
  ('carnes', 'cn7', 'Escondidinho de Charque', 'Com arroz branco, crispy de couve e legumes.', '{"en":{"name":"Jerky Beef Shepherd''s Pie","description":"With white rice, kale crisp and vegetables."},"es":{"name":"Escondidinho de Charque","description":"Pastel de yuca con carne seca. Con arroz blanco y crispy de col."}}', 78.00, 'principais/escondidinho.png', null, false, 70),
  ('carnes', 'cn8', 'Estrogonofe de Angus', 'Com crispy de couve, chips/fritas e arroz com nuts.', '{"en":{"name":"Angus Stroganoff","description":"With kale crisp, chips/fries and rice with nuts."},"es":{"name":"Strogonoff de Angus","description":"Con crispy de col, chips/papas fritas y arroz con nueces."}}', 68.00, 'principais/estrogonofe.png', null, false, 80),
  ('carnes', 'cn9', 'Nhoque com Iscas de Angus', 'Molho de queijos com cogumelos e iscas flambadas.', '{"en":{"name":"Gnocchi with Angus Strips","description":"Cheese sauce with mushrooms and flambéed strips."},"es":{"name":"Ñoquis con Tiras de Angus","description":"Salsa de quesos con champiñones y tiras flambeadas."}}', 68.00, 'principais/nhoque_iscas.png', null, false, 90),
  ('carnes', 'cn10', 'Tornedor ao Molho Roti', 'Com cogumelos e risoto de grana padano com brie.', '{"en":{"name":"Tournedos with Roti Sauce","description":"With mushrooms and grana padano risotto with brie."},"es":{"name":"Tournedos a la Salsa Roti","description":"Con champiñones y risotto de grana padano con brie."}}', 84.00, 'principais/tornedor_roti.png', null, false, 100),
  ('carnes', 'cn11', 'À la Minuta de Mignon', 'Ovo frito, arroz branco e fritas. (Feijão opcional).', '{"en":{"name":"Filet Mignon À La Minuta","description":"Fried egg, white rice and fries. (Beans optional)."},"es":{"name":"Filete Mignon A la Minuta","description":"Huevo frito, arroz blanco y papas fritas. (Frijoles opcional)."}}', 84.00, 'principais/alaminuta.png', null, false, 110),
  ('peixes', 'px1', 'Polvo Grelhado', 'Com oliva, páprica e molho tarê. Crispy de couve.', '{"en":{"name":"Grilled Octopus","description":"With olive oil, paprika and tare sauce. Kale crisp."},"es":{"name":"Pulpo a la Plancha","description":"Con oliva, pimentón y salsa tarê. Crispy de col."}}', 84.00, 'principais/polvo.png', null, false, 10),
  ('peixes', 'px2', 'Salmão Grelhado', 'Molho de maracujá ou espumante (opcional).', '{"en":{"name":"Grilled Salmon","description":"Passion fruit or sparkling wine sauce (optional)."},"es":{"name":"Salmón a la Plancha","description":"Salsa de maracuyá o espumoso (opcional)."}}', 84.00, 'principais/salmao.png', null, false, 20),
  ('peixes', 'px3', 'Salmão ou Truta ao Panko', 'Com risoto de siciliano, camarão e brie.', '{"en":{"name":"Panko Salmon or Trout","description":"With Sicilian lemon, shrimp and brie risotto."},"es":{"name":"Salmón o Trucha al Panko","description":"Con risotto de limón siciliano, camarones y brie."}}', 84.00, 'principais/salmao_panko.png', null, false, 30),
  ('peixes', 'px4', 'Truta à Belle Meunière', 'Na manteiga com alcaparras, amêndoas e champignons.', '{"en":{"name":"Trout à Belle Meunière","description":"In butter with capers, almonds and mushrooms."},"es":{"name":"Trucha a la Belle Meunière","description":"En mantequilla con alcaparras, almendras y champiñones."}}', 84.00, 'principais/truta.png', null, false, 40),
  ('aves', 'av1', 'Filé de Frango Grelhado', 'Com legumes confitados, purê e espaguete.', '{"en":{"name":"Grilled Chicken Fillet","description":"With vegetables confit, puree and spaghetti."},"es":{"name":"Filete de Pollo a la Plancha","description":"Con verduras confitadas, puré y espagueti."}}', 68.00, 'principais/frango_grelhado.png', null, false, 10),
  ('aves', 'av2', 'Frango à Parmegiana', 'Com bacon, ovo frito, arroz e fritas.', '{"en":{"name":"Parmigiana Chicken","description":"With bacon, fried egg, rice and fries."},"es":{"name":"Pollo a la Parmesana","description":"Con tocino, huevo frito, arroz y papas fritas."}}', 68.00, 'principais/frango_parmegiana.png', null, false, 20),
  ('aves', 'av3', 'Filé de Frango ao Panko', 'Recheado com queijos. Acompanha legumes e espaguete.', '{"en":{"name":"Panko Chicken Fillet","description":"Stuffed with cheese. Served with vegetables and spaghetti."},"es":{"name":"Filete de Pollo al Panko","description":"Relleno de quesos. Acompaña verduras y espagueti."}}', 68.00, 'principais/frango_panko.png', null, false, 30),
  ('aves', 'av4', 'Estrogonofe de Frango', 'Com crispy de couve, chips/fritas e arroz.', '{"en":{"name":"Chicken Stroganoff","description":"With kale crisp, chips/fries and rice."},"es":{"name":"Strogonoff de Pollo","description":"Con crispy de col, chips/papas fritas y arroz."}}', 68.00, 'principais/estrogonofe_frango.png', null, false, 40),
  ('aves', 'av5', 'À la Minuta de Frango', 'Ovo frito, arroz branco e fritas.', '{"en":{"name":"Chicken À La Minuta","description":"Fried egg, white rice and fries."},"es":{"name":"Pollo A la Minuta","description":"Huevo frito, arroz blanco y papas fritas."}}', 68.00, 'principais/alaminuta_frango.png', null, false, 50),
  ('massas', 'ms1', 'Espaguete', 'Molho Bolonhesa ou Queijos com Gran Formaggio.', '{"en":{"name":"Spaghetti","description":"Bolognese or Cheese Sauce with Gran Formaggio."},"es":{"name":"Espagueti","description":"Salsa Boloñesa o Quesos con Gran Formaggio."}}', 62.00, 'principais/espaguete.png', null, false, 10),
  ('massas', 'ms2', 'Nhoque de Baroa', 'Ao molho de queijos com Gran Formaggio.', '{"en":{"name":"Baroa Potato Gnocchi","description":"Cheese sauce with Gran Formaggio."},"es":{"name":"Ñoquis de Mandioquinha","description":"A la salsa de quesos con Gran Formaggio."}}', 68.00, 'principais/nhoque.png', null, false, 20),
  ('massas', 'ms3', 'Risoto de Brie com Aspargos', 'Arroz arbóreo cremoso.', '{"en":{"name":"Brie Risotto with Asparagus","description":"Creamy arborio rice."},"es":{"name":"Risotto de Brie con Espárragos","description":"Arroz arbóreo cremoso."}}', 68.00, 'principais/risoto_aspargos.png', null, false, 30),
  ('massas', 'ms4', 'Risoto de Brie com Formaggio', 'Arroz arbóreo cremoso.', '{"en":{"name":"Brie Risotto with Formaggio","description":"Creamy arborio rice."},"es":{"name":"Risotto de Brie con Formaggio","description":"Arroz arbóreo cremoso."}}', 68.00, 'principais/risoto_formaggio.png', null, false, 40),
  ('burgers', 'ln1', 'Hambúrguer do Chef (Com Fritas)', 'Pão brioche, burger, mussarela, tomate, picles, bacon ruppenthal, ovo e molho especial. Acompanhado de fritas McCain Sure Crisp.', '{"en":{"name":"Chef''s Burger (With Fries)","description":"Brioche bun, burger patty, mozzarella, tomato, pickles, Ruppenthal bacon, egg, and special sauce. Served with McCain Sure Crisp fries."},"es":{"name":"Hamburguesa del Chef (Con Papas)","description":"Pan brioche, hamburguesa, queso mozzarella, tomate, pepinillos, tocino Ruppenthal, huevo y salsa especial. Acompañada de papas fritas McCain Sure Crisp."}}', 68.00, 'lanches/burger-chef-fritas.webp', null, true, 10),
  ('burgers', 'ln2', 'Hambúrguer do Chef (Sem Fritas)', 'Pão brioche, burger, mussarela, tomate, picles, bacon ruppenthal, ovo e molho especial.', '{"en":{"name":"Chef''s Burger (No Fries)","description":"Brioche bun, burger patty, mozzarella, tomato, pickles, Ruppenthal bacon, egg, and special sauce."},"es":{"name":"Hamburguesa del Chef (Sin Papas)","description":"Pan brioche, hamburguesa, queso mozzarella, tomate, pepinillos, tocino Ruppenthal, huevo y salsa especial."}}', 54.00, 'lanches/burger-chef.webp', null, true, 20),
  ('burgers', 'ln3', 'Club Sandwich', 'Quente ou Frio. Pão de forma, maionese, alface, tomate, frango, bacon, ovo.', '{"en":{"name":"Club Sandwich","description":"Hot or Cold. Sliced bread, mayo, lettuce, tomato, chicken, bacon, egg."},"es":{"name":"Club Sandwich","description":"Caliente o Frío. Pan de molde, mayonesa, lechuga, tomate, pollo, tocino, huevo."}}', 42.00, 'lanches/club_sandwich.png', null, false, 30),
  ('burgers', 'ln4', 'Sanduíche Integral', 'Molho iogurte, ricota, peito de peru, pepino.', '{"en":{"name":"Whole Grain Sandwich","description":"Yogurt sauce, ricotta, turkey breast, cucumber."},"es":{"name":"Sándwich Integral","description":"Salsa de yogur, ricotta, pechuga de pavo, pepino."}}', 42.00, 'lanches/sanduiche_integral.png', null, false, 40),
  ('burgers', 'ln5', 'Misto Quente Completo (Com Fritas)', 'Mussarela, blanquet, ovo, tomate, alface.', '{"en":{"name":"Complete Toasted Sandwich (With Fries)","description":"Mozzarella, turkey blanquet, egg, tomato, lettuce."},"es":{"name":"Sándwich Mixto Completo (Con Papas)","description":"Mozzarella, pechuga de pavo, huevo, tomate, lechuga."}}', 48.00, 'lanches/misto_completo.png', null, false, 50),
  ('burgers', 'ln6', 'Misto Quente Simples', 'Pão, mussarela e blanquet de peru.', '{"en":{"name":"Simple Toasted Sandwich","description":"Bread, mozzarella and turkey blanquet."},"es":{"name":"Sándwich Mixto Simple","description":"Pan, mozzarella y pechuga de pavo."}}', 32.00, 'lanches/misto_simples.png', null, false, 60),
  ('omeletes', 'om1', 'Omelete de Brie', 'Com folhas jovens, oliva e nuts. Acompanha torradas.', '{"en":{"name":"Brie Omelet","description":"With young leaves, olive and nuts. Served with toast."},"es":{"name":"Omelet de Brie","description":"Con hojas verdes, oliva y nueces. Acompaña tostadas."}}', 54.00, 'lanches/omelete_brie.png', null, false, 10),
  ('omeletes', 'om2', 'Omelete de Mussarela', 'Com blanquet de peru e folhas jovens. Acompanha torradas.', '{"en":{"name":"Mozzarella Omelet","description":"With turkey blanquet and young leaves. Served with toast."},"es":{"name":"Omelet de Mozzarella","description":"Con pechuga de pavo y hojas verdes. Acompaña tostadas."}}', 48.00, 'lanches/omelete_mussarela.png', null, false, 20),
  ('omeletes', 'om3', 'Tapilete', 'Omelete de tapioca com mussarela, blanquet e folhas.', '{"en":{"name":"Tapilete","description":"Tapioca omelet with mozzarella, blanquet and leaves."},"es":{"name":"Tapilete","description":"Omelet de tapioca con mozzarella, pavo y hojas."}}', 48.00, 'lanches/tapilete.png', null, false, 30),
  ('omeletes', 'om4', 'Tapioca de Mussarela', 'Com blanquet de peru.', '{"en":{"name":"Mozzarella Tapioca","description":"With turkey blanquet."},"es":{"name":"Tapioca de Mozzarella","description":"Con pechuga de pavo."}}', 38.00, 'lanches/tapioca_salgada.png', null, false, 40),
  ('omeletes', 'om5', 'Tapioca Doce', 'Chocolate branco com nozes e amêndoas.', '{"en":{"name":"Sweet Tapioca","description":"White chocolate with walnuts and almonds."},"es":{"name":"Tapioca Dulce","description":"Chocolate blanco con nueces y almendras."}}', 44.00, 'lanches/tapioca_doce.png', null, false, 50),
  ('pizzas', 'pz1', 'Pizza Mussarela', null, '{"en":{"name":"Mozzarella Pizza"},"es":{"name":"Pizza Mozzarella"}}', 58.00, 'lanches/pizza_mussarela.png', null, false, 10),
  ('pizzas', 'pz2', 'Pizza Calabresa', null, '{"en":{"name":"Calabresa Pizza"},"es":{"name":"Pizza Calabresa"}}', 58.00, 'lanches/pizza_calabresa.png', null, false, 20),
  ('pizzas', 'pz3', 'Pizza Marguerita', null, '{"en":{"name":"Margherita Pizza"},"es":{"name":"Pizza Margarita"}}', 58.00, 'lanches/pizza_marguerita.png', null, false, 30),
  ('extras', 'ex1', 'Porção de Batatas Fritas', 'Prato raso.', '{"en":{"name":"Portion of French Fries","description":"Shallow plate."},"es":{"name":"Porción de Papas Fritas","description":"Plato llano."}}', 48.00, 'lanches/porcao_fritas.png', null, false, 10),
  ('extras', 'ex2', 'Chocolate Quente com Torradas', 'Bule (2 xícaras).', '{"en":{"name":"Hot Chocolate with Toast","description":"Pot (2 cups)."},"es":{"name":"Chocolate Caliente con Tostadas","description":"Tetera (2 tazas)."}}', 30.00, 'lanches/chocolate_quente_lanche.png', null, false, 20),
  ('sobremesas', 'sb1', 'Salada de Frutas', null, '{"en":{"name":"Fruit Salad"},"es":{"name":"Ensalada de Frutas"}}', 35.00, 'pratos/salada_frutas.png', null, false, 10),
  ('sobremesas', 'sb2', 'Gelato de Iogurte', 'Com coulis de frutas vermelhas e crumble.', '{"en":{"name":"Yogurt Gelato","description":"With red berry coulis and crumble."},"es":{"name":"Gelato de Yogur","description":"Con coulis de frutos rojos y crumble."}}', 35.00, 'pratos/gelato_iogurte.png', null, false, 20),
  ('sobremesas', 'sb3', 'Gelato de Pistache', 'Com pistache fresco e tuile.', '{"en":{"name":"Pistachio Gelato","description":"With fresh pistachio and tuile."},"es":{"name":"Gelato de Pistacho","description":"Con pistacho fresco y tuile."}}', 35.00, 'pratos/gelato_pistache.png', null, false, 30),
  ('sobremesas', 'sb4', 'Petit Gâteau', 'Chocolate, Doce de Leite ou Siciliano. Com gelato.', '{"en":{"name":"Petit Gâteau","description":"Chocolate, Dulce de Leche or Sicilian Lemon. With gelato."},"es":{"name":"Petit Gâteau","description":"Chocolate, Dulce de Leche o Limón Siciliano. Con gelato."}}', 40.00, 'pratos/petit_gateau.png', null, false, 40),
  ('sobremesas', 'sb5', 'Trio de Petit Doces', 'Mini crème brûlée, gelato de pistache e +1.', '{"en":{"name":"Trio of Petit Sweets","description":"Mini crème brûlée, pistachio gelato and +1."},"es":{"name":"Trío de Petit Dulces","description":"Mini crème brûlée, gelato de pistacho y +1."}}', 40.00, 'pratos/trio_doces.png', null, false, 50),
  ('bebidas_frias', 'b1', 'Suco Fresco de Laranja', 'Natural.', '{"en":{"name":"Fresh Orange Juice","description":"Natural."},"es":{"name":"Jugo Fresco de Naranja","description":"Natural."}}', 15.00, null, null, false, 10),
  ('bebidas_frias', 'b2', 'Suco de Uva Integral', null, '{"en":{"name":"Whole Grape Juice"},"es":{"name":"Jugo de Uva Integral"}}', 15.00, null, null, false, 20),
  ('bebidas_frias', 'b3', 'Refrigerantes', 'Lata 355ml. Coca, Guaraná, Sprite, Fanta.', '{"en":{"name":"Sodas","description":"Can 355ml. Coke, Guaraná, Sprite, Fanta."},"es":{"name":"Refrescos","description":"Lata 355ml. Coca, Guaraná, Sprite, Fanta."}}', 8.00, null, null, false, 30),
  ('bebidas_frias', 'b4', 'Água Mineral', 'Pet 500ml. Com e sem gás.', '{"en":{"name":"Mineral Water","description":"Pet 500ml. Sparkling or Still."},"es":{"name":"Agua Mineral","description":"Pet 500ml. Con y sin gas."}}', 6.00, null, null, false, 40),
  ('bebidas_frias', 'b5', 'Energético Baly', 'Tradicional - lata 250ml.', '{"en":{"name":"Energy Drink Baly","description":"Traditional - can 250ml."},"es":{"name":"Energético Baly","description":"Tradicional - lata 250ml."}}', 10.00, null, null, false, 50),
  ('bebidas_quentes', 'b6', 'Café (Bule)', 'Serve 2 xícaras. Coffee pot.', '{"en":{"name":"Coffee (Pot)","description":"Serves 2 cups."},"es":{"name":"Café (Tetera)","description":"Sirve 2 tazas."}}', 24.00, null, null, false, 10),
  ('bebidas_quentes', 'b7', 'Leite Quente (Bule)', 'Serve 2 xícaras. Milk pot.', '{"en":{"name":"Hot Milk (Pot)","description":"Serves 2 cups."},"es":{"name":"Leche Caliente (Tetera)","description":"Sirve 2 tazas."}}', 24.00, null, null, false, 20),
  ('bebidas_quentes', 'b8', 'Chocolate Quente', 'Bule - Serve 2 xícaras. Hot chocolate.', '{"en":{"name":"Hot Chocolate","description":"Pot - Serves 2 cups."},"es":{"name":"Chocolate Caliente","description":"Tetera - Sirve 2 tazas."}}', 30.00, null, null, false, 30),
  ('bebidas_quentes', 'b9', 'Chá (Bule)', 'Serve 2 xícaras. Tea pot.', '{"en":{"name":"Tea (Pot)","description":"Serves 2 cups."},"es":{"name":"Té (Tetera)","description":"Sirve 2 tazas."}}', 24.00, null, null, false, 40),
  ('bebidas_quentes', 'b10', 'Café Nespresso', 'Curtinho.', '{"en":{"name":"Nespresso Coffee","description":"Short."},"es":{"name":"Café Nespresso","description":"Corto."}}', 10.00, null, null, false, 50),
  ('cervejas', 'c1_beer', 'Cervejas Long Neck', 'Fat Bull, Heineken, Budweiser, Corona e Stella.', '{"en":{"name":"Long Neck Beers","description":"Fat Bull, Heineken, Budweiser, Corona and Stella."},"es":{"name":"Cervezas Long Neck","description":"Fat Bull, Heineken, Budweiser, Corona y Stella."}}', 15.00, null, null, false, 10),
  ('drinks', 'd1', 'Aperol Spritz', 'Prosecco brut, aperol e água com gás.', '{"en":{"name":"Aperol Spritz","description":"Prosecco brut, aperol and sparkling water."},"es":{"name":"Aperol Spritz","description":"Prosecco brut, aperol y agua con gas."}}', 35.00, null, null, false, 10),
  ('drinks', 'd2', 'Pisco Sour', null, '{"en":{"name":"Pisco Sour"},"es":{"name":"Pisco Sour"}}', 40.00, null, null, false, 20),
  ('drinks', 'd3', 'Limoncello Spritz', 'Prosecco brut, limoncello e club soda.', '{"en":{"name":"Limoncello Spritz","description":"Prosecco brut, limoncello and club soda."},"es":{"name":"Limoncello Spritz","description":"Prosecco brut, limoncello y club soda."}}', 40.00, null, null, false, 30),
  ('drinks', 'd4', 'Caipirinha de Limão', 'Com cachaça prata da Weber Haus.', '{"en":{"name":"Lemon Caipirinha","description":"With Weber Haus silver cachaça."},"es":{"name":"Caipirinha de Limón","description":"Con cachaça plata de Weber Haus."}}', 35.00, null, null, false, 40),
  ('drinks', 'd5', 'Caipiroska de Limão', 'Com vodka Smirnoff.', '{"en":{"name":"Lemon Caipiroska","description":"With Smirnoff vodka."},"es":{"name":"Caipiroska de Limón","description":"Con vodka Smirnoff."}}', 35.00, null, null, false, 50),
  ('drinks', 'd6', 'Caipiroska Importada', 'Com vodka Absolut.', '{"en":{"name":"Imported Caipiroska","description":"With Absolut vodka."},"es":{"name":"Caipiroska Importada","description":"Con vodka Absolut."}}', 40.00, null, null, false, 60),
  ('drinks', 'd7', 'Saquerinha de Morango', null, '{"en":{"name":"Strawberry Sake Caipirinha"},"es":{"name":"Saquerinha de Fresa"}}', 40.00, null, null, false, 70),
  ('drinks', 'd8', 'Carajillo', 'Licor 43 e café Nespresso.', '{"en":{"name":"Carajillo","description":"Licor 43 and Nespresso coffee."},"es":{"name":"Carajillo","description":"Licor 43 y café Nespresso."}}', 35.00, null, null, false, 80),
  ('drinks', 'd9', 'Cuba Libre', 'Rum Bacardi e Coca-Cola.', '{"en":{"name":"Cuba Libre","description":"Bacardi Rum and Coke."},"es":{"name":"Cuba Libre","description":"Ron Bacardi y Coca-Cola."}}', 30.00, null, null, false, 90),
  ('drinks', 'd10', 'Fernet Cola', null, '{"en":{"name":"Fernet Cola"},"es":{"name":"Fernet Cola"}}', 35.00, null, null, false, 100),
  ('drinks', 'd11', 'Gin Tônica', 'Rocks.', '{"en":{"name":"Gin & Tonic","description":"Rocks."},"es":{"name":"Gin Tonic","description":"Rocks."}}', 25.00, null, null, false, 110),
  ('drinks', 'd12', 'Negroni', null, '{"en":{"name":"Negroni"},"es":{"name":"Negroni"}}', 35.00, null, null, false, 120),
  ('vinhos_taca', 't1', 'Taça de Salton Classic', 'Merlot | Cabernet Sauvignon - Serra Gaúcha.', '{"en":{"name":"Glass of Salton Classic","description":"Merlot | Cabernet Sauvignon - Serra Gaúcha."},"es":{"name":"Copa de Salton Classic","description":"Merlot | Cabernet Sauvignon - Serra Gaúcha."}}', 28.00, null, 'glass', false, 10),
  ('vinhos_taca', 't2', 'Taça de Almadén', 'Gewurztraminer | Chardonnay - Campanha Gaúcha.', '{"en":{"name":"Glass of Almadén","description":"Gewurztraminer | Chardonnay - Campanha Gaúcha."},"es":{"name":"Copa de Almadén","description":"Gewurztraminer | Chardonnay - Campanha Gaúcha."}}', 28.00, null, 'glass', false, 20),
  ('vinhos_taca', 't3', 'Taça Espumante Garibaldi', 'Prosecco Brut | Rosé | Moscatel - Serra Gaúcha.', '{"en":{"name":"Glass of Garibaldi Sparkling","description":"Prosecco Brut | Rosé | Moscatel - Serra Gaúcha."},"es":{"name":"Copa de Espumoso Garibaldi","description":"Prosecco Brut | Rosé | Moscatel - Serra Gaúcha."}}', 26.00, null, 'glass', false, 30),
  ('vinhos_taca', 't4', 'Taça Espumante Miolo', 'Brut | Moscatel - Bahia.', '{"en":{"name":"Glass of Miolo Sparkling","description":"Brut | Moscatel - Bahia."},"es":{"name":"Copa de Espumoso Miolo","description":"Brut | Moscatel - Bahia."}}', 26.00, null, 'glass', false, 40),
  ('vinhos_taca', 't5', 'Taça Garibaldi Vero Rosé', null, '{"en":{"name":"Glass of Garibaldi Vero Rosé"},"es":{"name":"Copa Garibaldi Vero Rosé"}}', 26.00, null, 'glass', false, 50),
  ('cabernet', 'v1', 'Casa Silva Gran Terroir', 'Harmonização: Perfeito para carnes, filés e costela.', '{"en":{"name":"Casa Silva Gran Terroir","description":"Pairing: Perfect for meats, filets and ribs."},"es":{"name":"Casa Silva Gran Terroir","description":"Armonización: Perfecto para carnes, filetes y costilla."}}', 225.00, null, 'bottle', false, 10),
  ('cabernet', 'v2', 'Casa Silva Terroir de Família', null, '{"en":{"name":"Casa Silva Terroir de Família"},"es":{"name":"Casa Silva Terroir de Família"}}', 180.00, null, 'bottle', false, 20),
  ('cabernet', 'v3', 'Casa Valduga Raízes Terroir', null, '{"en":{"name":"Casa Valduga Raízes Terroir"},"es":{"name":"Casa Valduga Raízes Terroir"}}', 180.00, null, 'bottle', false, 30),
  ('cabernet', 'v4', 'Luna Benegas', null, '{"en":{"name":"Luna Benegas"},"es":{"name":"Luna Benegas"}}', 180.00, null, 'bottle', false, 40),
  ('cabernet', 'v5', 'Casa Silva Colección', null, '{"en":{"name":"Casa Silva Colección"},"es":{"name":"Casa Silva Colección"}}', 125.00, null, 'bottle', false, 50),
  ('cabernet', 'v6', 'Picarón', null, '{"en":{"name":"Picarón"},"es":{"name":"Picarón"}}', 105.00, null, 'bottle', false, 60),
  ('cabernet', 'v7', 'Salton Classic', null, '{"en":{"name":"Salton Classic"},"es":{"name":"Salton Classic"}}', 85.00, null, 'bottle', false, 70),
  ('merlot', 'v8', 'Garbo Inquieto', null, '{"en":{"name":"Garbo Inquieto"},"es":{"name":"Garbo Inquieto"}}', 215.00, null, 'bottle', false, 10),
  ('merlot', 'v9', 'Salvattore', null, '{"en":{"name":"Salvattore"},"es":{"name":"Salvattore"}}', 140.00, null, 'bottle', false, 20),
  ('tannat', 'v10', 'Ysern Reserva', 'Cerro Chapeu - Uruguai.', '{"en":{"name":"Ysern Reserva","description":"Cerro Chapeu - Uruguay."},"es":{"name":"Ysern Reserva","description":"Cerro Chapeu - Uruguay."}}', 155.00, null, 'bottle', false, 10),
  ('carmenere', 'v11', 'Casa Silva Gran Terroir', null, '{"en":{"name":"Casa Silva Gran Terroir"},"es":{"name":"Casa Silva Gran Terroir"}}', 225.00, null, 'bottle', false, 10),
  ('carmenere', 'v12', 'Casa Silva Colección', null, '{"en":{"name":"Casa Silva Colección"},"es":{"name":"Casa Silva Colección"}}', 130.00, null, 'bottle', false, 20),
  ('carmenere', 'v13', 'Faro', null, '{"en":{"name":"Faro"},"es":{"name":"Faro"}}', 120.00, null, 'bottle', false, 30),
  ('malbec', 'v14', 'Punto Final Gran Reserva', null, '{"en":{"name":"Punto Final Gran Reserva"},"es":{"name":"Punto Final Gran Reserva"}}', 240.00, null, 'bottle', false, 10),
  ('malbec', 'v15', 'Fabian', null, '{"en":{"name":"Fabian"},"es":{"name":"Fabian"}}', 215.00, null, 'bottle', false, 20),
  ('malbec', 'v16', 'Casa Valduga Leopoldina', null, '{"en":{"name":"Casa Valduga Leopoldina"},"es":{"name":"Casa Valduga Leopoldina"}}', 195.00, null, 'bottle', false, 30),
  ('malbec', 'v17', 'Punto Final Reserva', null, '{"en":{"name":"Punto Final Reserva"},"es":{"name":"Punto Final Reserva"}}', 170.00, null, 'bottle', false, 40),
  ('malbec', 'v18', 'Família Bebber', null, '{"en":{"name":"Família Bebber"},"es":{"name":"Família Bebber"}}', 160.00, null, 'bottle', false, 50),
  ('malbec', 'v19', 'Malma Esencia Family Wines', null, '{"en":{"name":"Malma Esencia Family Wines"},"es":{"name":"Malma Esencia Family Wines"}}', 145.00, null, 'bottle', false, 60),
  ('tempranillo', 'v20', 'Fortius Roble', 'Spain.', '{"en":{"name":"Fortius Roble","description":"Spain."},"es":{"name":"Fortius Roble","description":"España."}}', 170.00, null, 'bottle', false, 10),
  ('tempranillo', 'v21', 'Condesa de Leganza', 'Spain.', '{"en":{"name":"Condesa de Leganza","description":"Spain."},"es":{"name":"Condesa de Leganza","description":"España."}}', 145.00, null, 'bottle', false, 20),
  ('tempranillo', 'v22', 'Luis Argenta LA Joven Shiraz', null, '{"en":{"name":"Luis Argenta LA Joven Shiraz"},"es":{"name":"Luis Argenta LA Joven Shiraz"}}', 245.00, null, 'bottle', false, 30),
  ('tempranillo', 'v23', 'Arcano Syrah', null, '{"en":{"name":"Arcano Syrah"},"es":{"name":"Arcano Syrah"}}', 235.00, null, 'bottle', false, 40),
  ('vinhos_rose', 'v24', 'Arcano Rosé', null, '{"en":{"name":"Arcano Rosé"},"es":{"name":"Arcano Rosé"}}', 215.00, null, 'bottle', false, 10),
  ('vinhos_rose', 'v25', 'Família Bebber Rosé', null, '{"en":{"name":"Família Bebber Rosé"},"es":{"name":"Família Bebber Rosé"}}', 180.00, null, 'bottle', false, 20),
  ('vinhos_rose', 'v26', 'Punto Final Reserva Rosé', 'Malbec Rosé.', '{"en":{"name":"Punto Final Reserva Rosé","description":"Malbec Rosé."},"es":{"name":"Punto Final Reserva Rosé","description":"Malbec Rosé."}}', 150.00, null, 'bottle', false, 30),
  ('vinhos_brancos', 'v27', 'Arte Viva Riesling', null, '{"en":{"name":"Arte Viva Riesling"},"es":{"name":"Arte Viva Riesling"}}', 180.00, null, 'bottle', false, 10),
  ('vinhos_brancos', 'v28', 'Caetano Vicentino Chardonnay', null, '{"en":{"name":"Caetano Vicentino Chardonnay"},"es":{"name":"Caetano Vicentino Chardonnay"}}', 180.00, null, 'bottle', false, 20),
  ('vinhos_brancos', 'v29', 'Garbo Duo Chardonnay', null, '{"en":{"name":"Garbo Duo Chardonnay"},"es":{"name":"Garbo Duo Chardonnay"}}', 180.00, null, 'bottle', false, 30),
  ('vinhos_brancos', 'v30', 'Família Bebber Sauvignon Blanc', null, '{"en":{"name":"Família Bebber Sauvignon Blanc"},"es":{"name":"Família Bebber Sauvignon Blanc"}}', 180.00, null, 'bottle', false, 40),
  ('vinhos_brancos', 'v31', 'Malma Reserve Sauvignon Blanc', 'Argentina.', '{"en":{"name":"Malma Reserve Sauvignon Blanc","description":"Argentina."},"es":{"name":"Malma Reserve Sauvignon Blanc","description":"Argentina."}}', 180.00, null, 'bottle', false, 50),
  ('vinhos_brancos', 'v32', 'Valmarino', 'Chardonnay Rosé & Cabernet Franc.', '{"en":{"name":"Valmarino","description":"Chardonnay Rosé & Cabernet Franc."},"es":{"name":"Valmarino","description":"Chardonnay Rosé & Cabernet Franc."}}', 180.00, null, 'bottle', false, 60),
  ('vinhos_brancos', 'v33', 'Casa Valduga Chardonnay', null, '{"en":{"name":"Casa Valduga Chardonnay"},"es":{"name":"Casa Valduga Chardonnay"}}', 160.00, null, 'bottle', false, 70),
  ('vinhos_brancos', 'v34', 'Casa Silva Reserve Sauvignon Blanc', 'Chile.', '{"en":{"name":"Casa Silva Reserve Sauvignon Blanc","description":"Chile."},"es":{"name":"Casa Silva Reserve Sauvignon Blanc","description":"Chile."}}', 160.00, null, 'bottle', false, 80),
  ('vinhos_brancos', 'v35', 'Casa Silva Colección Chardonnay', 'Chile.', '{"en":{"name":"Casa Silva Colección Chardonnay","description":"Chile."},"es":{"name":"Casa Silva Colección Chardonnay","description":"Chile."}}', 130.00, null, 'bottle', false, 90),
  ('vinhos_brancos', 'v36', 'Família Bebber Chardonnay', null, '{"en":{"name":"Família Bebber Chardonnay"},"es":{"name":"Família Bebber Chardonnay"}}', 130.00, null, 'bottle', false, 100),
  ('vinhos_brancos', 'v37', 'Faro Chardonnay', 'Chile.', '{"en":{"name":"Faro Chardonnay","description":"Chile."},"es":{"name":"Faro Chardonnay","description":"Chile."}}', 120.00, null, 'bottle', false, 110),
  ('vinhos_brancos', 'v38', 'Almadén', 'Gewurztraminer | Chardonnay - Campanha Gaúcha.', '{"en":{"name":"Almadén","description":"Gewurztraminer | Chardonnay - Campanha Gaúcha."},"es":{"name":"Almadén","description":"Gewurztraminer | Chardonnay - Campanha Gaúcha."}}', 85.00, null, 'bottle', false, 120),
  ('demisec', 'e1', 'Chandon Reserve Demi Sec', null, '{"en":{"name":"Chandon Reserve Demi Sec"},"es":{"name":"Chandon Reserve Demi Sec"}}', 160.00, null, 'bottle', false, 10),
  ('brut', 'e2', 'Buffon Extra Brut', 'Harmonização: Aperitivos e Queijos. Produção limitada!', '{"en":{"name":"Buffon Extra Brut","description":"Pairing: Appetizers and Cheeses. Limited production!"},"es":{"name":"Buffon Extra Brut","description":"Armonización: Aperitivos y Quesos. ¡Producción limitada!"}}', 225.00, null, 'bottle', false, 10),
  ('brut', 'e3', 'Pedrucci Reserva Brut', 'Harmonização: Peixes e Frutos do Mar.', '{"en":{"name":"Pedrucci Reserva Brut","description":"Pairing: Fish and Seafood."},"es":{"name":"Pedrucci Reserva Brut","description":"Armonización: Pescados y Mariscos."}}', 215.00, null, 'bottle', false, 20),
  ('brut', 'e4', 'Pericó Brut Juliette', 'Composto pelas uvas Cabernet, Chardonnay e Merlot.', '{"en":{"name":"Pericó Brut Juliette","description":"Composed of Cabernet, Chardonnay and Merlot grapes."},"es":{"name":"Pericó Brut Juliette","description":"Compuesto por uvas Cabernet, Chardonnay y Merlot."}}', 190.00, null, 'bottle', false, 30),
  ('brut', 'e5', 'Chandon Reserve Brut', 'Serra Gaúcha. Harmonização: Peixes e Frutos do Mar.', '{"en":{"name":"Chandon Reserve Brut","description":"Serra Gaúcha. Pairing: Fish and Seafood."},"es":{"name":"Chandon Reserve Brut","description":"Serra Gaúcha. Armonización: Pescados y Mariscos."}}', 160.00, null, 'bottle', false, 40),
  ('brut', 'e6', 'Fabian Brut', 'Serra Gaúcha. Acompanha queijos e massas.', '{"en":{"name":"Fabian Brut","description":"Serra Gaúcha. Goes well with cheeses and pasta."},"es":{"name":"Fabian Brut","description":"Serra Gaúcha. Combina con quesos y pastas."}}', 160.00, null, 'bottle', false, 50),
  ('brut', 'e7', 'Ponto Nero Brut', 'Ideal para harmonizar com frutos do mar.', '{"en":{"name":"Ponto Nero Brut","description":"Ideal for pairing with seafood."},"es":{"name":"Ponto Nero Brut","description":"Ideal para armonizar con mariscos."}}', 130.00, null, 'bottle', false, 60),
  ('brut', 'e8', 'Hórus Brut', 'Aroma intenso com notas florais.', '{"en":{"name":"Hórus Brut","description":"Intense aroma with floral notes."},"es":{"name":"Hórus Brut","description":"Aroma intenso con notas florales."}}', 130.00, null, 'bottle', false, 70),
  ('brut', 'e9', 'Garibaldi Prosecco Brut', 'Combina com canapés e saladas.', '{"en":{"name":"Garibaldi Prosecco Brut","description":"Combines with canapés and salads."},"es":{"name":"Garibaldi Prosecco Brut","description":"Combina con canapés y ensaladas."}}', 95.00, null, 'bottle', false, 80),
  ('rose', 'e10', 'Pedrucci Rosé', null, '{"en":{"name":"Pedrucci Rosé"},"es":{"name":"Pedrucci Rosé"}}', 160.00, null, 'bottle', false, 10),
  ('rose', 'e11', 'Fabian Rosé', null, '{"en":{"name":"Fabian Rosé"},"es":{"name":"Fabian Rosé"}}', 160.00, null, 'bottle', false, 20),
  ('rose', 'e12', 'Ponto Nero Brut Rosé', null, '{"en":{"name":"Ponto Nero Brut Rosé"},"es":{"name":"Ponto Nero Brut Rosé"}}', 130.00, null, 'bottle', false, 30),
  ('rose', 'e13', 'Garibaldi Vero Brut Rosé', null, '{"en":{"name":"Garibaldi Vero Brut Rosé"},"es":{"name":"Garibaldi Vero Brut Rosé"}}', 95.00, null, 'bottle', false, 40),
  ('moscatel', 'e14', 'Ponto Nero Moscatel', null, '{"en":{"name":"Ponto Nero Moscatel"},"es":{"name":"Ponto Nero Moscatel"}}', 130.00, null, 'bottle', false, 10),
  ('moscatel', 'e15', 'Miolo Moscatel', null, '{"en":{"name":"Miolo Moscatel"},"es":{"name":"Miolo Moscatel"}}', 110.00, null, 'bottle', false, 20),
  ('moscatel', 'e16', 'Garibaldi Moscatel', null, '{"en":{"name":"Garibaldi Moscatel"},"es":{"name":"Garibaldi Moscatel"}}', 95.00, null, 'bottle', false, 30)
) as v (category_slug, slug, name, description, translations, price, image_url, serving_type, show_picture_icon, sort_order)
join public.categories c on c.slug = v.category_slug
on conflict (slug) do nothing;

-- 5. Conferência: se faltar qualquer linha, desfaz tudo.
do $$
declare
  v_categories int;
  v_items      int;
begin
  select count(*) into v_categories from public.categories where slug in ('entrada', 'principal', 'lanches', 'sobremesa', 'bebida', 'vinho', 'couvert', 'saladas', 'sopas', 'carnes', 'peixes', 'aves', 'massas', 'burgers', 'omeletes', 'pizzas', 'extras', 'sobremesas', 'bebidas_frias', 'bebidas_quentes', 'cervejas', 'drinks', 'vinhos_taca', 'vinhos_tintos', 'vinhos_rose', 'vinhos_brancos', 'espumantes', 'cabernet', 'merlot', 'tannat', 'carmenere', 'malbec', 'tempranillo', 'demisec', 'brut', 'rose', 'moscatel');
  select count(*) into v_items from public.menu_items where slug in ('c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 's1', 's2', 'sp1', 'sp2', 'sp3', 'sp4', 'sp5', 'cn1', 'cn2', 'cn3', 'cn4', 'cn5', 'cn6', 'cn7', 'cn8', 'cn9', 'cn10', 'cn11', 'px1', 'px2', 'px3', 'px4', 'av1', 'av2', 'av3', 'av4', 'av5', 'ms1', 'ms2', 'ms3', 'ms4', 'ln1', 'ln2', 'ln3', 'ln4', 'ln5', 'ln6', 'om1', 'om2', 'om3', 'om4', 'om5', 'pz1', 'pz2', 'pz3', 'ex1', 'ex2', 'sb1', 'sb2', 'sb3', 'sb4', 'sb5', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10', 'c1_beer', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10', 'd11', 'd12', 't1', 't2', 't3', 't4', 't5', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10', 'v11', 'v12', 'v13', 'v14', 'v15', 'v16', 'v17', 'v18', 'v19', 'v20', 'v21', 'v22', 'v23', 'v24', 'v25', 'v26', 'v27', 'v28', 'v29', 'v30', 'v31', 'v32', 'v33', 'v34', 'v35', 'v36', 'v37', 'v38', 'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10', 'e11', 'e12', 'e13', 'e14', 'e15', 'e16');
  if v_categories <> 37 or v_items <> 143 then
    raise exception 'Seed incompleto: % de 37 categorias, % de 143 itens', v_categories, v_items;
  end if;
end;
$$;

commit;
