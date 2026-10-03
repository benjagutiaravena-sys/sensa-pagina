// SENSA · mapeo entre los nombres de la hoja de stock y los productos/colores de la página.
// Archivo fácil de editar. Los nombres se comparan sin tildes, sin mayúsculas, sin espacios de más
// y sin la "s" del plural ("Cubos gel", "cubo gel" y "CUBO  GEL" son lo mismo).
//
// Por defecto la página ya cruza por el nombre exacto del producto ("Cubo Gel Liso") y del color ("Verde agua").
// Aquí solo agregas los nombres de la hoja que se escriben distinto.
window.SENSA_STOCK_MAP = {
  // nombre en la hoja  →  slug del producto
  products: {
    'cubo gel': 'cubo-gel',
    'cubos gel liso': 'cubo-gel',
    'gel liso': 'cubo-gel',
    'cubos gel con forma': 'cubo-gel-forma',
    'gel con forma': 'cubo-gel-forma',
    'cubos gel con cinta': 'cubo-gel-cinta',
    'gel con cinta': 'cubo-gel-cinta',
    'mantequilla': 'butter-squishy',
    'butter': 'butter-squishy',
    'fidget cube': 'cubo-antiestres-sensorial',
    'cubo antiestres': 'cubo-antiestres-sensorial',
    'dumpling glitter': 'dumplings-glitter',
    'dumpling mate': 'dumplings-mate'
  },
  // por producto: nombre del color en la hoja  →  id del color en products.js
  colors: {
    'cubo-gel-cinta': {
      'rosado claro': 'rosado-claro-transparente',
      'rosado transparente': 'rosado-claro-transparente'
    }
  }
};
