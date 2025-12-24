import { prices } from './priceList';

// --- TIPOS ---
export interface Dish {
  id: string | number;
  name: string;
  price: string;
  description?: string;
  image?: string;
  servingType?: 'bottle' | 'glass';
}

export interface SectionHeader {
  section: string;
}

export interface SubSectionHeader {
  subsection: string;
}

export type MenuItemType = Dish | SectionHeader | SubSectionHeader;

// --- DADOS COM CHAVES DE TRADUÇÃO ---

export const categories = [
  { id: 'entrada', label: 'categories.entrada' },
  { id: 'principal', label: 'categories.principal' },
  { id: 'lanches', label: 'categories.lanches' },
  { id: 'sobremesa', label: 'categories.sobremesa' },
  { id: 'bebida', label: 'categories.bebida' },
  { id: 'vinho', label: 'categories.vinho' },
];

export const menuItems: Record<string, MenuItemType[]> = {
  entrada: [
    { section: 'sections.couvert' },
    { id: 'c1', name: 'items.c1.name', description: 'items.c1.desc', price: prices.couvert_dadinhos, image: 'entradas/dadinhos.png' },
    { id: 'c2', name: 'items.c2.name', description: 'items.c2.desc', price: prices.couvert_croquetas, image: 'entradas/croquetas.png' },
    { id: 'c3', name: 'items.c3.name', description: 'items.c3.desc', price: prices.couvert_polenta, image: 'entradas/polenta.png' },
    { id: 'c4', name: 'items.c4.name', description: 'items.c4.desc', price: prices.couvert_batatinha, image: 'entradas/batatinha.png' },
    { id: 'c5', name: 'items.c5.name', description: 'items.c5.desc', price: prices.couvert_iscas_frango, image: 'entradas/iscas_frango.png' },
    { id: 'c6', name: 'items.c6.name', description: 'items.c6.desc', price: prices.couvert_iscas_mignon, image: 'entradas/iscas_mignon.png' },
    { id: 'c7', name: 'items.c7.name', description: 'items.c7.desc', price: prices.couvert_queijos, image: 'entradas/tabua_frios.png' },
    { id: 'c8', name: 'items.c8.name', description: 'items.c8.desc', price: prices.couvert_brie_folhado, image: 'entradas/brie_folhado.png' },
    { id: 'c9', name: 'items.c9.name', description: 'items.c9.desc', price: prices.couvert_burrata, image: 'entradas/burrata.png' },

    { section: 'sections.saladas' },
    { id: 's1', name: 'items.s1.name', description: 'items.s1.desc', price: prices.salada_mix_sem_brie, image: 'entradas/salada.png' },
    { id: 's2', name: 'items.s2.name', description: 'items.s2.desc', price: prices.salada_mix_com_brie, image: 'entradas/salada_brie.png' },

    { section: 'sections.sopas' },
    { id: 'sp1', name: 'items.sp1.name', description: 'items.sp1.desc', price: prices.sopa_canja, image: 'entradas/canja.png' },
    { id: 'sp2', name: 'items.sp2.name', description: 'items.sp2.desc', price: prices.sopa_capeletti, image: 'entradas/capeletti.png' },
    { id: 'sp3', name: 'items.sp3.name', description: 'items.sp3.desc', price: prices.sopa_creme_ervilha, image: 'entradas/creme_ervilha.png' },
    { id: 'sp4', name: 'items.sp4.name', description: 'items.sp4.desc', price: prices.sopa_creme_moranga, image: 'entradas/creme_moranga.png' },
    { id: 'sp5', name: 'items.sp5.name', description: 'items.sp5.desc', price: prices.sopa_creme_aipim, image: 'entradas/creme_aipim.png' },
  ],

  principal: [
    { section: 'sections.carnes' },
    { id: 'cn1', name: 'items.cn1.name', description: 'items.cn1.desc', price: prices.carne_ancho_massa, image: 'principais/ancho_massa.png' },
    { id: 'cn2', name: 'items.cn2.name', description: 'items.cn2.desc', price: prices.carne_costela_12h, image: 'principais/costela.png' },
    { id: 'cn3', name: 'items.cn3.name', description: 'items.cn3.desc', price: prices.carne_ancho_legumes, image: 'principais/ancho_legumes.png' },
    { id: 'cn4', name: 'items.cn4.name', description: 'items.cn4.desc', price: prices.carne_tornedor_manteiga, image: 'principais/tornedor.png' },
    { id: 'cn5', name: 'items.cn5.name', description: 'items.cn5.desc', price: prices.carne_parmegiana, image: 'principais/parmegiana.png' },
    { id: 'cn6', name: 'items.cn6.name', description: 'items.cn6.desc', price: prices.carne_risoto_iscas, image: 'principais/risoto_iscas.png' },
    { id: 'cn7', name: 'items.cn7.name', description: 'items.cn7.desc', price: prices.carne_escondidinho, image: 'principais/escondidinho.png' },
    { id: 'cn8', name: 'items.cn8.name', description: 'items.cn8.desc', price: prices.carne_estrogonofe, image: 'principais/estrogonofe.png' },
    { id: 'cn9', name: 'items.cn9.name', description: 'items.cn9.desc', price: prices.carne_nhoque_iscas, image: 'principais/nhoque_iscas.png' },
    { id: 'cn10', name: 'items.cn10.name', description: 'items.cn10.desc', price: prices.carne_tornedor_roti, image: 'principais/tornedor_roti.png' },
    { id: 'cn11', name: 'items.cn11.name', description: 'items.cn11.desc', price: prices.carne_alaminuta, image: 'principais/alaminuta.png' },

    { section: 'sections.peixes' },
    { id: 'px1', name: 'items.px1.name', description: 'items.px1.desc', price: prices.peixe_polvo, image: 'principais/polvo.png' },
    { id: 'px2', name: 'items.px2.name', description: 'items.px2.desc', price: prices.peixe_salmao_grelhado, image: 'principais/salmao.png' },
    { id: 'px3', name: 'items.px3.name', description: 'items.px3.desc', price: prices.peixe_salmao_panko, image: 'principais/salmao_panko.png' },
    { id: 'px4', name: 'items.px4.name', description: 'items.px4.desc', price: prices.peixe_truta, image: 'principais/truta.png' },

    { section: 'sections.aves' },
    { id: 'av1', name: 'items.av1.name', description: 'items.av1.desc', price: prices.ave_frango_grelhado, image: 'principais/frango_grelhado.png' },
    { id: 'av2', name: 'items.av2.name', description: 'items.av2.desc', price: prices.ave_parmegiana, image: 'principais/frango_parmegiana.png' },
    { id: 'av3', name: 'items.av3.name', description: 'items.av3.desc', price: prices.ave_panko, image: 'principais/frango_panko.png' },
    { id: 'av4', name: 'items.av4.name', description: 'items.av4.desc', price: prices.ave_estrogonofe, image: 'principais/estrogonofe_frango.png' },
    { id: 'av5', name: 'items.av5.name', description: 'items.av5.desc', price: prices.ave_alaminuta, image: 'principais/alaminuta_frango.png' },

    { section: 'sections.massas' },
    { id: 'ms1', name: 'items.ms1.name', description: 'items.ms1.desc', price: prices.massa_espaguete, image: 'principais/espaguete.png' },
    { id: 'ms2', name: 'items.ms2.name', description: 'items.ms2.desc', price: prices.massa_nhoque_baroa, image: 'principais/nhoque.png' },
    { id: 'ms3', name: 'items.ms3.name', description: 'items.ms3.desc', price: prices.risoto_brie_aspargos, image: 'principais/risoto_aspargos.png' },
    { id: 'ms4', name: 'items.ms4.name', description: 'items.ms4.desc', price: prices.risoto_brie_formaggio, image: 'principais/risoto_formaggio.png' },
  ],

  lanches: [
    { section: 'sections.burgers' },
    { id: 'ln1', name: 'items.ln1.name', description: 'items.ln1.desc', price: prices.lanche_burger_chef_fritas, image: 'lanches/burger-chef-fritas.png' },
    { id: 'ln2', name: 'items.ln2.name', description: 'items.ln2.desc', price: prices.lanche_burger_chef, image: 'lanches/burger-chef.png' },
    { id: 'ln3', name: 'items.ln3.name', description: 'items.ln3.desc', price: prices.lanche_club_sandwich, image: 'lanches/club_sandwich.png' },
    { id: 'ln4', name: 'items.ln4.name', description: 'items.ln4.desc', price: prices.lanche_sanduiche_integral, image: 'lanches/sanduiche_integral.png' },
    { id: 'ln5', name: 'items.ln5.name', description: 'items.ln5.desc', price: prices.lanche_misto_completo_fritas, image: 'lanches/misto_completo.png' },
    { id: 'ln6', name: 'items.ln6.name', description: 'items.ln6.desc', price: prices.lanche_misto_simples, image: 'lanches/misto_simples.png' },

    { section: 'sections.omeletes' },
    { id: 'om1', name: 'items.om1.name', description: 'items.om1.desc', price: prices.lanche_omelete_brie, image: 'lanches/omelete_brie.png' },
    { id: 'om2', name: 'items.om2.name', description: 'items.om2.desc', price: prices.lanche_omelete_mussarela, image: 'lanches/omelete_mussarela.png' },
    { id: 'om3', name: 'items.om3.name', description: 'items.om3.desc', price: prices.lanche_tapilete, image: 'lanches/tapilete.png' },
    { id: 'om4', name: 'items.om4.name', description: 'items.om4.desc', price: prices.lanche_tapioca_mussarela, image: 'lanches/tapioca_salgada.png' },
    { id: 'om5', name: 'items.om5.name', description: 'items.om5.desc', price: prices.lanche_tapioca_doce, image: 'lanches/tapioca_doce.png' },

    { section: 'sections.pizzas' },
    { id: 'pz1', name: 'items.pz1.name', description: 'items.pz1.desc', price: prices.pizza_mussarela, image: 'lanches/pizza_mussarela.png' },
    { id: 'pz2', name: 'items.pz2.name', description: 'items.pz2.desc', price: prices.pizza_calabresa, image: 'lanches/pizza_calabresa.png' },
    { id: 'pz3', name: 'items.pz3.name', description: 'items.pz3.desc', price: prices.pizza_marguerita, image: 'lanches/pizza_marguerita.png' },

    { section: 'sections.extras' },
    { id: 'ex1', name: 'items.ex1.name', description: 'items.ex1.desc', price: prices.lanche_fritas, image: 'lanches/porcao_fritas.png' },
    { id: 'ex2', name: 'items.ex2.name', description: 'items.ex2.desc', price: prices.lanche_chocolate_quente, image: 'lanches/chocolate_quente_lanche.png' },
  ],

  sobremesa: [
    { section: 'sections.sobremesas' },
    { id: 'sb1', name: 'items.sb1.name', description: 'items.sb1.desc', price: prices.sobremesa_salada_frutas, image: 'pratos/salada_frutas.png' },
    { id: 'sb2', name: 'items.sb2.name', description: 'items.sb2.desc', price: prices.sobremesa_gelato_iogurte, image: 'pratos/gelato_iogurte.png' },
    { id: 'sb3', name: 'items.sb3.name', description: 'items.sb3.desc', price: prices.sobremesa_gelato_pistache, image: 'pratos/gelato_pistache.png' },
    { id: 'sb4', name: 'items.sb4.name', description: 'items.sb4.desc', price: prices.sobremesa_petit_gateau, image: 'pratos/petit_gateau.png' },
    { id: 'sb5', name: 'items.sb5.name', description: 'items.sb5.desc', price: prices.sobremesa_trio, image: 'pratos/trio_doces.png' },
  ],

  bebida: [
    { section: 'sections.bebidas_frias' },
    { id: 'b1', name: 'items.b1.name', description: 'items.b1.desc', price: prices.suco_laranja },
    { id: 'b2', name: 'items.b2.name', description: 'items.b2.desc', price: prices.suco_uva },
    { id: 'b3', name: 'items.b3.name', description: 'items.b3.desc', price: prices.refrigerante },
    { id: 'b4', name: 'items.b4.name', description: 'items.b4.desc', price: prices.agua },
    { id: 'b5', name: 'items.b5.name', description: 'items.b5.desc', price: prices.energetico },

    { section: 'sections.bebidas_quentes' },
    { id: 'b6', name: 'items.b6.name', description: 'items.b6.desc', price: prices.cafe_bule },
    { id: 'b7', name: 'items.b7.name', description: 'items.b7.desc', price: prices.leite_bule },
    { id: 'b8', name: 'items.b8.name', description: 'items.b8.desc', price: prices.chocolate_quente },
    { id: 'b9', name: 'items.b9.name', description: 'items.b9.desc', price: prices.cha_bule },
    { id: 'b10', name: 'items.b10.name', description: 'items.b10.desc', price: prices.nespresso },

    { section: 'sections.cervejas' },
    { id: 'c1', name: 'items.c1_beer.name', description: 'items.c1_beer.desc', price: prices.cerveja_longneck },

    { section: 'sections.drinks' },
    { id: 'd1', name: 'items.d1.name', description: 'items.d1.desc', price: prices.aperol },
    { id: 'd2', name: 'items.d2.name', description: 'items.d2.desc', price: prices.pisco },
    { id: 'd3', name: 'items.d3.name', description: 'items.d3.desc', price: prices.limoncello },
    { id: 'd4', name: 'items.d4.name', description: 'items.d4.desc', price: prices.caipirinha },
    { id: 'd5', name: 'items.d5.name', description: 'items.d5.desc', price: prices.caipiroska },
    { id: 'd6', name: 'items.d6.name', description: 'items.d6.desc', price: prices.caipiroska_importada },
    { id: 'd7', name: 'items.d7.name', description: 'items.d7.desc', price: prices.saquerinha },
    { id: 'd8', name: 'items.d8.name', description: 'items.d8.desc', price: prices.carajillo },
    { id: 'd9', name: 'items.d9.name', description: 'items.d9.desc', price: prices.cuba_libre },
    { id: 'd10', name: 'items.d10.name', description: 'items.d10.desc', price: prices.fernet_cola },
    { id: 'd11', name: 'items.d11.name', description: 'items.d11.desc', price: prices.gin_tonica },
    { id: 'd12', name: 'items.d12.name', description: 'items.d12.desc', price: prices.negroni },
  ],

  vinho: [
    { section: 'sections.vinhos_taca' },
    { id: 't1', name: 'items.t1.name', description: 'items.t1.desc', price: prices.taca_salton, servingType: 'glass' },
    { id: 't2', name: 'items.t2.name', description: 'items.t2.desc', price: prices.taca_almaden, servingType: 'glass' },
    { id: 't3', name: 'items.t3.name', description: 'items.t3.desc', price: prices.taca_garibaldi, servingType: 'glass' },
    { id: 't4', name: 'items.t4.name', description: 'items.t4.desc', price: prices.taca_miolo, servingType: 'glass' },
    { id: 't5', name: 'items.t5.name', description: 'items.t5.desc', price: prices.taca_garibaldi_rose, servingType: 'glass' },

    { section: 'sections.vinhos_tintos' },
    
    { subsection: 'subsections.cabernet' },
    { id: 'v1', name: 'items.v1.name', description: 'items.v1.desc', price: prices.v_casa_silva_gran, servingType: 'bottle' },
    { id: 'v2', name: 'items.v2.name', description: 'items.v2.desc', price: prices.v_casa_silva_res, servingType: 'bottle' },
    { id: 'v3', name: 'items.v3.name', description: 'items.v3.desc', price: prices.v_valduga_raizes, servingType: 'bottle' },
    { id: 'v4', name: 'items.v4.name', description: 'items.v4.desc', price: prices.v_luna_benegas, servingType: 'bottle' },
    { id: 'v5', name: 'items.v5.name', description: 'items.v5.desc', price: prices.v_casa_silva_col, servingType: 'bottle' },
    { id: 'v6', name: 'items.v6.name', description: 'items.v6.desc', price: prices.v_picaron, servingType: 'bottle' },
    { id: 'v7', name: 'items.v7.name', description: 'items.v7.desc', price: prices.v_salton_classic, servingType: 'bottle' },

    { subsection: 'subsections.merlot' },
    { id: 'v8', name: 'items.v8.name', description: 'items.v8.desc', price: prices.v_garbo, servingType: 'bottle' },
    { id: 'v9', name: 'items.v9.name', description: 'items.v9.desc', price: prices.v_salvattore, servingType: 'bottle' },

    { subsection: 'subsections.tannat' },
    { id: 'v10', name: 'items.v10.name', description: 'items.v10.desc', price: prices.v_ysern, servingType: 'bottle' },

    { subsection: 'subsections.carmenere' },
    { id: 'v11', name: 'items.v11.name', description: 'items.v11.desc', price: prices.v_casa_silva_carmenere_gran, servingType: 'bottle' },
    { id: 'v12', name: 'items.v12.name', description: 'items.v12.desc', price: prices.v_casa_silva_carmenere_col, servingType: 'bottle' },
    { id: 'v13', name: 'items.v13.name', description: 'items.v13.desc', price: prices.v_faro, servingType: 'bottle' },

    { subsection: 'subsections.malbec' },
    { id: 'v14', name: 'items.v14.name', description: 'items.v14.desc', price: prices.v_punto_final_gran, servingType: 'bottle' },
    { id: 'v15', name: 'items.v15.name', description: 'items.v15.desc', price: prices.v_fabian, servingType: 'bottle' },
    { id: 'v16', name: 'items.v16.name', description: 'items.v16.desc', price: prices.v_leopoldina, servingType: 'bottle' },
    { id: 'v17', name: 'items.v17.name', description: 'items.v17.desc', price: prices.v_punto_final_res, servingType: 'bottle' },
    { id: 'v18', name: 'items.v18.name', description: 'items.v18.desc', price: prices.v_bebber, servingType: 'bottle' },
    { id: 'v19', name: 'items.v19.name', description: 'items.v19.desc', price: prices.v_malma, servingType: 'bottle' },

    { subsection: 'subsections.tempranillo' },
    { id: 'v20', name: 'items.v20.name', description: 'items.v20.desc', price: prices.v_fortius, servingType: 'bottle' },
    { id: 'v21', name: 'items.v21.name', description: 'items.v21.desc', price: prices.v_condesa, servingType: 'bottle' },
    { id: 'v22', name: 'items.v22.name', description: 'items.v22.desc', price: prices.v_luis_argenta, servingType: 'bottle' },
    { id: 'v23', name: 'items.v23.name', description: 'items.v23.desc', price: prices.v_arcano_syrah, servingType: 'bottle' },

    { section: 'sections.vinhos_rose' },
    { id: 'v24', name: 'items.v24.name', description: 'items.v24.desc', price: prices.v_arcano_rose, servingType: 'bottle' },
    { id: 'v25', name: 'items.v25.name', description: 'items.v25.desc', price: prices.v_bebber_rose, servingType: 'bottle' },
    { id: 'v26', name: 'items.v26.name', description: 'items.v26.desc', price: prices.v_punto_final_rose, servingType: 'bottle' },

    { section: 'sections.vinhos_brancos' },
    { id: 'v27', name: 'items.v27.name', description: 'items.v27.desc', price: prices.v_arte_viva, servingType: 'bottle' },
    { id: 'v28', name: 'items.v28.name', description: 'items.v28.desc', price: prices.v_caetano, servingType: 'bottle' },
    { id: 'v29', name: 'items.v29.name', description: 'items.v29.desc', price: prices.v_garbo_duo, servingType: 'bottle' },
    { id: 'v30', name: 'items.v30.name', description: 'items.v30.desc', price: prices.v_bebber_sauvignon, servingType: 'bottle' },
    { id: 'v31', name: 'items.v31.name', description: 'items.v31.desc', price: prices.v_malma_sauvignon, servingType: 'bottle' },
    { id: 'v32', name: 'items.v32.name', description: 'items.v32.desc', price: prices.v_valmarino, servingType: 'bottle' },
    { id: 'v33', name: 'items.v33.name', description: 'items.v33.desc', price: prices.v_valduga_chard, servingType: 'bottle' },
    { id: 'v34', name: 'items.v34.name', description: 'items.v34.desc', price: prices.v_casa_silva_sauv, servingType: 'bottle' },
    { id: 'v35', name: 'items.v35.name', description: 'items.v35.desc', price: prices.v_casa_silva_chard, servingType: 'bottle' },
    { id: 'v36', name: 'items.v36.name', description: 'items.v36.desc', price: prices.v_bebber_chard, servingType: 'bottle' },
    { id: 'v37', name: 'items.v37.name', description: 'items.v37.desc', price: prices.v_faro_chard, servingType: 'bottle' },
    { id: 'v38', name: 'items.v38.name', description: 'items.v38.desc', price: prices.v_almaden, servingType: 'bottle' },

    { section: 'sections.espumantes' },
    { subsection: 'subsections.demisec' },
    { id: 'e1', name: 'items.e1.name', description: 'items.e1.desc', price: prices.e_chandon_demi, servingType: 'bottle' },

    { subsection: 'subsections.brut' },
    { id: 'e2', name: 'items.e2.name', description: 'items.e2.desc', price: prices.e_buffon, servingType: 'bottle' },
    { id: 'e3', name: 'items.e3.name', description: 'items.e3.desc', price: prices.e_pedrucci, servingType: 'bottle' },
    { id: 'e4', name: 'items.e4.name', description: 'items.e4.desc', price: prices.e_perico, servingType: 'bottle' },
    { id: 'e5', name: 'items.e5.name', description: 'items.e5.desc', price: prices.e_chandon_brut, servingType: 'bottle' },
    { id: 'e6', name: 'items.e6.name', description: 'items.e6.desc', price: prices.e_fabian, servingType: 'bottle' },
    { id: 'e7', name: 'items.e7.name', description: 'items.e7.desc', price: prices.e_ponto_nero, servingType: 'bottle' },
    { id: 'e8', name: 'items.e8.name', description: 'items.e8.desc', price: prices.e_horus, servingType: 'bottle' },
    { id: 'e9', name: 'items.e9.name', description: 'items.e9.desc', price: prices.e_garibaldi, servingType: 'bottle' },

    { subsection: 'subsections.rose' },
    { id: 'e10', name: 'items.e10.name', description: 'items.e10.desc', price: prices.e_pedrucci_rose, servingType: 'bottle' },
    { id: 'e11', name: 'items.e11.name', description: 'items.e11.desc', price: prices.e_fabian_rose, servingType: 'bottle' },
    { id: 'e12', name: 'items.e12.name', description: 'items.e12.desc', price: prices.e_ponto_nero_rose, servingType: 'bottle' },
    { id: 'e13', name: 'items.e13.name', description: 'items.e13.desc', price: prices.e_garibaldi_rose, servingType: 'bottle' },

    { subsection: 'subsections.moscatel' },
    { id: 'e14', name: 'items.e14.name', description: 'items.e14.desc', price: prices.e_ponto_nero_mosc, servingType: 'bottle' },
    { id: 'e15', name: 'items.e15.name', description: 'items.e15.desc', price: prices.e_miolo_mosc, servingType: 'bottle' },
    { id: 'e16', name: 'items.e16.name', description: 'items.e16.desc', price: prices.e_garibaldi_mosc, servingType: 'bottle' },
  ]
};