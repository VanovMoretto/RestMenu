import { prices } from './priceList';
import carpaccioImg from '../assets/carpaccio.png';
import bruschettaImg from '../assets/burschetta.png'
import mignonImg from '../assets/mignon.png'
import salmonImg from '../assets/salmon.png'
import gateauImg from '../assets/gateau.png'

export const categories = [
  { id: 'entrada', label: 'Entrada' },
  { id: 'principal', label: 'Principal' },
  { id: 'sobremesa', label: 'Sobremesa' },
  { id: 'bebida', label: 'Bebida' },
  { id: 'vinho', label: 'Vinho' },
];

export const menuItems = {
  entrada: [
    { id: 1, name: 'Carpaccio di Manzo', price: prices.entrada_carpaccio, description: 'Lâminas de filé mignon, rúcula, alcaparras e lascas de parmesão.', image: carpaccioImg },
    { id: 2, name: 'Bruschetta Tradicional', price: prices.entrada_bruschetta, description: 'Pão italiano tostado, tomates frescos e manjericão.', image: bruschettaImg },
  ],
  principal: [
    { id: 10, name: 'Filé Mignon ao Poivre', price: prices.principal_file, description: 'Medalhão de filé com molho de pimentas verdes, aspargos e batatas.', image: mignonImg },
    { id: 11, name: 'Salmão Grelhado', price: prices.principal_salmao, description: 'Com crosta de ervas e legumes.', image: salmonImg },
  ],
  sobremesa: [
    { id: 20, name: 'Petit Gâteau', price: prices.sobremesa_petit, description: 'Com sorvete de creme.', image: gateauImg },
  ],
  bebida: [
    { section: 'Bebidas Frias' },
    { id: 'b1', name: 'Suco Fresco de Laranja', price: prices.suco_laranja, description: 'Natural.' },
    { id: 'b2', name: 'Suco de Uva Integral', price: prices.suco_uva },
    { id: 'b3', name: 'Refrigerantes', price: prices.refrigerante, description: 'Lata 355ml. Coca (normal e zero), Guaraná (normal e zero), Schweppes Citrus, Sprite e Fanta Laranja.' },
    { id: 'b4', name: 'Água Mineral', price: prices.agua, description: 'Pet 500ml. Com e sem gás.' },
    { id: 'b5', name: 'Energético Baly', price: prices.energetico, description: 'Tradicional - lata 250ml.' },

    { section: 'Bebidas Quentes' },
    { id: 'b6', name: 'Café (Bule)', price: prices.cafe_bule, description: 'Serve 2 xícaras.' },
    { id: 'b7', name: 'Leite Quente (Bule)', price: prices.leite_bule, description: 'Serve 2 xícaras.' },
    { id: 'b8', name: 'Chocolate Quente', price: prices.chocolate_quente, description: 'Bule - Serve 2 xícaras.' },
    { id: 'b9', name: 'Chá (Bule)', price: prices.cha_bule, description: 'Serve 2 xícaras.' },
    { id: 'b10', name: 'Café Nespresso', price: prices.nespresso, description: 'Curtinho.' },

    { section: 'Cervejas' },
    { id: 'c1', name: 'Cervejas Long Neck', price: prices.cerveja_longneck, description: 'Fat Bull, Heineken (normal e zero), Budweiser, Corona e Stella.' },

    { section: 'Drinks & Destilados' },
    { id: 'd1', name: 'Aperol Spritz', price: prices.aperol, description: 'Prosecco brut, aperol e água com gás.' },
    { id: 'd2', name: 'Pisco Sour', price: prices.pisco },
    { id: 'd3', name: 'Limoncello Spritz', price: prices.limoncello, description: 'Prosecco brut, limoncello e club soda.' },
    { id: 'd4', name: 'Caipirinha de Limão', price: prices.caipirinha, description: 'Com cachaça prata da Weber Haus.' },
    { id: 'd5', name: 'Caipiroska de Limão', price: prices.caipiroska, description: 'Com vodka Smirnoff.' },
    { id: 'd6', name: 'Caipiroska Importada', price: prices.caipiroska_importada, description: 'Com vodka Absolut.' },
    { id: 'd7', name: 'Saquerinha de Morango', price: prices.saquerinha },
    { id: 'd8', name: 'Carajillo', price: prices.carajillo, description: 'Licor 43 e café Nespresso.' },
    { id: 'd9', name: 'Cuba Libre', price: prices.cuba_libre, description: 'Rum Bacardi e Coca-Cola.' },
    { id: 'd10', name: 'Fernet Cola', price: prices.fernet_cola },
    { id: 'd11', name: 'Gin Tônica', price: prices.gin_tonica, description: 'Rocks.' },
    { id: 'd12', name: 'Negroni', price: prices.negroni },
  ],
  vinho: [
    { section: 'Vinhos em Taça' },
    { id: 't1', name: 'Taça de Salton Classic', price: prices.taca_salton, description: 'Merlot | Cabernet Sauvignon - Serra Gaúcha.', servingType: 'glass' },
    { id: 't2', name: 'Taça de Almadén', price: prices.taca_almaden, description: 'Gewurztraminer | Chardonnay - Campanha Gaúcha.', servingType: 'glass' },
    { id: 't3', name: 'Taça Espumante Garibaldi', price: prices.taca_garibaldi, description: 'Prosecco Brut | Rosé | Moscatel - Serra Gaúcha.', servingType: 'glass' },
    { id: 't4', name: 'Taça Espumante Miolo', price: prices.taca_miolo, description: 'Brut | Moscatel - Bahia.', servingType: 'glass' },
    { id: 't5', name: 'Taça Garibaldi Vero Rosé', price: prices.taca_garibaldi_rose, servingType: 'glass' },

    { section: 'Vinhos Tintos' },
    
    { subsection: 'Cabernet Sauvignon' },
    { id: 'v1', name: 'Casa Silva Gran Terroir', price: prices.v_casa_silva_gran, description: 'Harmonização: Este maravilhoso Cabernet Sauvignon é um companheiro perfeito para carnes, filés, bife Ancho e costela.', servingType: 'bottle' },
    { id: 'v2', name: 'Casa Silva Terroir de Família', price: prices.v_casa_silva_res, servingType: 'bottle' },
    { id: 'v3', name: 'Casa Valduga Raízes Terroir', price: prices.v_valduga_raizes, servingType: 'bottle' },
    { id: 'v4', name: 'Luna Benegas', price: prices.v_luna_benegas, servingType: 'bottle' },
    { id: 'v5', name: 'Casa Silva Colección', price: prices.v_casa_silva_col, servingType: 'bottle' },
    { id: 'v6', name: 'Picarón', price: prices.v_picaron, servingType: 'bottle' },
    { id: 'v7', name: 'Salton Classic', price: prices.v_salton_classic, servingType: 'bottle' },

    { subsection: 'Merlot' },
    { id: 'v8', name: 'Garbo Inquieto', price: prices.v_garbo, servingType: 'bottle' },
    { id: 'v9', name: 'Salvattore', price: prices.v_salvattore, servingType: 'bottle' },

    { subsection: 'Tannat' },
    { id: 'v10', name: 'Ysern Reserva', price: prices.v_ysern, description: 'Cerro Chapeu - Uruguai.', servingType: 'bottle' },

    { subsection: 'Carménère' },
    { id: 'v11', name: 'Casa Silva Gran Terroir', price: prices.v_casa_silva_carmenere_gran, servingType: 'bottle' },
    { id: 'v12', name: 'Casa Silva Colección', price: prices.v_casa_silva_carmenere_col, servingType: 'bottle' },
    { id: 'v13', name: 'Faro', price: prices.v_faro, servingType: 'bottle' },

    { subsection: 'Malbec' },
    { id: 'v14', name: 'Punto Final Gran Reserva', price: prices.v_punto_final_gran, servingType: 'bottle' },
    { id: 'v15', name: 'Fabian', price: prices.v_fabian, servingType: 'bottle' },
    { id: 'v16', name: 'Casa Valduga Leopoldina', price: prices.v_leopoldina, servingType: 'bottle' },
    { id: 'v17', name: 'Punto Final Reserva', price: prices.v_punto_final_res, servingType: 'bottle' },
    { id: 'v18', name: 'Família Bebber', price: prices.v_bebber, servingType: 'bottle' },
    { id: 'v19', name: 'Malma Esencia Family Wines', price: prices.v_malma, servingType: 'bottle' },

    { subsection: 'Tempranillo & Syrah' },
    { id: 'v20', name: 'Fortius Roble', price: prices.v_fortius, description: 'Spain.', servingType: 'bottle' },
    { id: 'v21', name: 'Condesa de Leganza', price: prices.v_condesa, description: 'Spain.', servingType: 'bottle' },
    { id: 'v22', name: 'Luis Argenta LA Joven Shiraz', price: prices.v_luis_argenta, servingType: 'bottle' },
    { id: 'v23', name: 'Arcano Syrah', price: prices.v_arcano_syrah, servingType: 'bottle' },

    { section: 'Vinhos Rosé' },
    { id: 'v24', name: 'Arcano Rosé', price: prices.v_arcano_rose, servingType: 'bottle' },
    { id: 'v25', name: 'Família Bebber Rosé', price: prices.v_bebber_rose, servingType: 'bottle' },
    { id: 'v26', name: 'Punto Final Reserva Rosé', price: prices.v_punto_final_rose, description: 'Malbec Rosé.', servingType: 'bottle' },

    { section: 'Vinhos Brancos' },
    { id: 'v27', name: 'Arte Viva Riesling', price: prices.v_arte_viva, servingType: 'bottle' },
    { id: 'v28', name: 'Caetano Vicentino Chardonnay', price: prices.v_caetano, servingType: 'bottle' },
    { id: 'v29', name: 'Garbo Duo Chardonnay', price: prices.v_garbo_duo, servingType: 'bottle' },
    { id: 'v30', name: 'Família Bebber Sauvignon Blanc', price: prices.v_bebber_sauvignon, servingType: 'bottle' },
    { id: 'v31', name: 'Malma Reserve Sauvignon Blanc', price: prices.v_malma_sauvignon, description: 'Argentina.', servingType: 'bottle' },
    { id: 'v32', name: 'Valmarino', price: prices.v_valmarino, description: 'Chardonnay Rosé & Cabernet Franc.', servingType: 'bottle' },
    { id: 'v33', name: 'Casa Valduga Chardonnay', price: prices.v_valduga_chard, servingType: 'bottle' },
    { id: 'v34', name: 'Casa Silva Reserve Sauvignon Blanc', price: prices.v_casa_silva_sauv, description: 'Chile.', servingType: 'bottle' },
    { id: 'v35', name: 'Casa Silva Colección Chardonnay', price: prices.v_casa_silva_chard, description: 'Chile.', servingType: 'bottle' },
    { id: 'v36', name: 'Família Bebber Chardonnay', price: prices.v_bebber_chard, servingType: 'bottle' },
    { id: 'v37', name: 'Faro Chardonnay', price: prices.v_faro_chard, description: 'Chile.', servingType: 'bottle' },
    { id: 'v38', name: 'Almadén', price: prices.v_almaden, description: 'Gewurztraminer | Chardonnay - Campanha Gaúcha.', servingType: 'bottle' },

    { section: 'Espumantes' },
    { subsection: 'Demi Sec' },
    { id: 'e1', name: 'Chandon Reserve Demi Sec', price: prices.e_chandon_demi, servingType: 'bottle' },

    { subsection: 'Brut' },
    { id: 'e2', name: 'Buffon Extra Brut', price: prices.e_buffon, description: 'Harmonização: Aperitivos, Tábuas de Frios, Canapés. Produção limitada em 600 garrafas!', servingType: 'bottle' },
    { id: 'e3', name: 'Pedrucci Reserva Brut', price: prices.e_pedrucci, description: 'Harmonização: Peixes e Frutos do Mar. Charcutaria e Queijos.', servingType: 'bottle' },
    { id: 'e4', name: 'Pericó Brut Juliette', price: prices.e_perico, description: 'O Espumante catarinense Juliette Brut Branco da vinícola Pericó é composto pelas uvas Cabernet, Chardonnay e Merlot.', servingType: 'bottle' },
    { id: 'e5', name: 'Chandon Reserve Brut', price: prices.e_chandon_brut, description: 'Serra Gaúcha. Harmonização: Peixes e Frutos do Mar.', servingType: 'bottle' },
    { id: 'e6', name: 'Fabian Brut', price: prices.e_fabian, description: 'Serra Gaúcha. Acompanha queijos, massas, aperitivos.', servingType: 'bottle' },
    { id: 'e7', name: 'Ponto Nero Brut', price: prices.e_ponto_nero, description: 'Ideal para harmonizar com frutos do mar e carnes brancas.', servingType: 'bottle' },
    { id: 'e8', name: 'Hórus Brut', price: prices.e_horus, description: 'Aroma: Intenso, elegante e persistente, com notas florais e de frutas cítricas.', servingType: 'bottle' },
    { id: 'e9', name: 'Garibaldi Prosecco Brut', price: prices.e_garibaldi, description: 'Combina com canapés, saladas, sopas cremosas.', servingType: 'bottle' },

    { subsection: 'Rosé' },
    { id: 'e10', name: 'Pedrucci Rosé', price: prices.e_pedrucci_rose, servingType: 'bottle' },
    { id: 'e11', name: 'Fabian Rosé', price: prices.e_fabian_rose, servingType: 'bottle' },
    { id: 'e12', name: 'Ponto Nero Brut Rosé', price: prices.e_ponto_nero_rose, servingType: 'bottle' },
    { id: 'e13', name: 'Garibaldi Vero Brut Rosé', price: prices.e_garibaldi_rose, servingType: 'bottle' },

    { subsection: 'Moscatel' },
    { id: 'e14', name: 'Ponto Nero Moscatel', price: prices.e_ponto_nero_mosc, servingType: 'bottle' },
    { id: 'e15', name: 'Miolo Moscatel', price: prices.e_miolo_mosc, servingType: 'bottle' },
    { id: 'e16', name: 'Garibaldi Moscatel', price: prices.e_garibaldi_mosc, servingType: 'bottle' },
  ]
};