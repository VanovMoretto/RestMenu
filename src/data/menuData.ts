import { prices } from './priceList';
import carpaccioImg from '../assets/carpaccio.png';

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
    { id: 2, name: 'Bruschetta Tradicional', price: prices.entrada_bruschetta, description: 'Pão italiano tostado, tomates frescos e manjericão.' },
  ],
  principal: [
    { id: 10, name: 'Filé Mignon ao Poivre', price: prices.principal_file, description: 'Medalhão de filé com molho de pimentas verdes e risoto.' },
    { id: 11, name: 'Salmão Grelhado', price: prices.principal_salmao, description: 'Com crosta de ervas e legumes.' },
  ],
  sobremesa: [
    { id: 20, name: 'Petit Gâteau', price: prices.sobremesa_petit, description: 'Com sorvete de creme.' },
  ],
  bebida: [
    { section: 'Bebidas Frias' },
    { id: 'b1', name: 'Suco Fresco de Laranja', price: prices.suco_laranja },
    { id: 'b2', name: 'Suco de Uva Integral', price: prices.suco_uva },
    { id: 'b3', name: 'Refrigerantes (Lata)', price: prices.refrigerante, description: 'Coca, Guaraná, Sprite, Fanta.' },
    { id: 'b4', name: 'Água Mineral', price: prices.agua },
    { id: 'b5', name: 'Energético Baly', price: prices.energetico },

    { section: 'Bebidas Quentes' },
    { id: 'b6', name: 'Café (Bule)', price: prices.cafe_bule },
    { id: 'b7', name: 'Leite Quente (Bule)', price: prices.leite_bule },
    { id: 'b8', name: 'Chocolate Quente', price: prices.chocolate_quente },
    { id: 'b9', name: 'Nespresso', price: prices.nespresso },

    { section: 'Cervejas' },
    { id: 'b10', name: 'Long Neck', price: prices.cerveja_longneck, description: 'Heineken, Budweiser, Corona, Stella, Fat Bull.' },

    { section: 'Drinks & Destilados' },
    { id: 'd1', name: 'Aperol Spritz', price: prices.aperol },
    { id: 'd2', name: 'Caipirinha', price: prices.caipirinha },
    { id: 'd3', name: 'Gin Tônica', price: prices.gin_tonica },
    { id: 'd4', name: 'Negroni', price: prices.negroni },
    { id: 'd5', name: 'Carajillo', price: prices.carajillo },
  ],
  vinho: [
    { section: 'Vinhos Tintos - Cabernet Sauvignon' },
    { id: 'v1', name: 'Casa Silva Gran Terroir', price: prices.v_casa_silva_gran },
    { id: 'v2', name: 'Casa Valduga Raízes', price: prices.v_casa_valduga },
    { id: 'v3', name: 'Salton Classic', price: prices.v_salton },
    { id: 'v4', name: 'Taça Salton Classic', price: prices.v_taca_salton },

    { section: 'Vinhos Tintos - Merlot' },
    { id: 'v5', name: 'Garbo Inquieto', price: prices.v_garbo },
    { id: 'v6', name: 'Salvattore', price: prices.v_salvattore },

    { section: 'Vinhos Tintos - Malbec' },
    { id: 'v7', name: 'Punto Final Gran Reserva', price: prices.v_punto_final_gran },
    { id: 'v8', name: 'Casa Valduga Leopoldina', price: prices.v_leopoldina },
    { id: 'v9', name: 'Malma Esencia', price: prices.v_malma },

    { section: 'Vinhos Tintos - Outras Uvas' },
    { id: 'v10', name: 'Ysern Reserva Tannat', price: prices.v_ysern },
    { id: 'v11', name: 'Arcano Syrah', price: prices.v_arcano_syrah },

    { section: 'Vinhos Rosé' },
    { id: 'v12', name: 'Arcano Rosé', price: prices.v_arcano_rose },
    { id: 'v13', name: 'Família Bebber Rosé', price: prices.v_bebber_rose },

    { section: 'Vinhos Brancos' },
    { id: 'v14', name: 'Arte Viva Riesling', price: prices.v_arte_viva },
    { id: 'v15', name: 'Casa Valduga Chardonnay', price: prices.v_valduga_chard },
    { id: 'v16', name: 'Almadén', price: prices.v_almaden },
    { id: 'v17', name: 'Taça Almadén', price: prices.v_taca_almaden },

    { section: 'Espumantes' },
    { id: 'e1', name: 'Chandon Reserve Brut', price: prices.e_chandon_brut },
    { id: 'e2', name: 'Taça Garibaldi', price: prices.e_taca_garibaldi },
    { id: 'e3', name: 'Ponto Nero Brut', price: prices.e_ponto_nero },
    { id: 'e4', name: 'Garibaldi Moscatel', price: prices.e_garibaldi },
  ]
};