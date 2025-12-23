// src/data/menuData.ts
export const categories = [
  { id: 'entrada', label: 'Entrada' },
  { id: 'principal', label: 'Principal' },
  { id: 'sobremesa', label: 'Sobremesa' },
  { id: 'bebida', label: 'Bebida' },
  { id: 'vinho', label: 'Vinho' },
];

export const menuItems = {
  entrada: [
    { id: 1, name: 'Bruschetta Tradicional', price: 'R$ 32,00', description: 'Pão italiano tostado, tomates frescos, manjericão e azeite de oliva extra virgem.' },
    { id: 3, name: 'Carpaccio di Manzo', price: 'R$ 48,00', description: 'Lâminas de filé mignon, rúcula, alcaparras e lascas de parmesão.' }
  ],
  principal: [
    { id: 2, name: 'Filé Mignon ao Poivre', price: 'R$ 89,00', description: 'Medalhão de filé com molho de pimentas verdes, acompanhado de risoto de parmesão.' }
  ],
  sobremesa: [],
  bebida: [],
  vinho: [],
};