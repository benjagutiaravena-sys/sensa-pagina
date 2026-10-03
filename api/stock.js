// SENSA · /api/stock
// Lee el stock desde una hoja publicada como CSV (Google Sheets → Archivo → Compartir → Publicar en la web → CSV)
// y devuelve SOLO producto, color y estado (ok / low / out). Nunca expone cantidades exactas ni otras columnas.
//
// Variable de entorno requerida: STOCK_CSV_URL (link del CSV publicado). No va en el código ni en GitHub.
//
// Formato esperado de la hoja (la primera fila son los títulos; el orden de las columnas da igual):
//   Producto | Color | Stock
// Si "Producto" está vacío en una fila, hereda el de la fila de arriba. Si "Color" está vacío, es stock del producto.

var LOW_MAX = 3; // 1..3 unidades = "¡Últimas unidades!"; 0 = agotado

// Títulos de columna que se reconocen (sin tildes, en minúsculas).
var COLS = {
  product: ['producto', 'productos', 'nombre', 'item', 'articulo'],
  color: ['color', 'colores'],
  stock: ['stock', 'cantidad', 'disponible', 'disponibles', 'unidades', 'inventario']
};

// Último stock válido (se conserva mientras la función sigue "caliente").
var lastGood = null;

function simple(s) {
  return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
}

// CSV mínimo (comillas, comas y saltos de línea dentro de comillas).
function parseCSV(text) {
  var rows = [], row = [], cell = '', q = false, i, ch;
  text = text.replace(/^﻿/, '');
  for (i = 0; i < text.length; i++) {
    ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',' || ch === ';') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += ch;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function stateOf(n) { return n <= 0 ? 'out' : n <= LOW_MAX ? 'low' : 'ok'; }

// Convierte el CSV en { items: [{product, color, state}], totals: [{product, state}] }. Lanza error si el formato no sirve.
function build(csv) {
  var rows = parseCSV(csv).filter(function (r) { return r.some(function (c) { return String(c).trim() !== ''; }); });
  if (rows.length < 2) throw new Error('csv vacío');
  var head = rows[0].map(simple);
  function col(names) { for (var i = 0; i < head.length; i++) if (names.indexOf(head[i]) !== -1) return i; return -1; }
  var iP = col(COLS.product), iC = col(COLS.color), iS = col(COLS.stock);
  if (iP === -1 || iS === -1) throw new Error('faltan columnas Producto/Stock');

  var byKey = {}, byProduct = {}, lastProduct = '';
  rows.slice(1).forEach(function (r) {
    var product = simple(r[iP]) || lastProduct;
    if (!product) return;
    lastProduct = product;
    var n = parseInt(String(r[iS] == null ? '' : r[iS]).replace(/[^\d-]/g, ''), 10);
    if (isNaN(n)) return; // fila sin cantidad (títulos, notas, totales)
    var color = iC === -1 ? '' : simple(r[iC]);
    var key = product + '|' + color;
    byKey[key] = (byKey[key] || 0) + n;
    byProduct[product] = (byProduct[product] || 0) + n;
  });

  var items = Object.keys(byKey).map(function (k) {
    var parts = k.split('|');
    return { product: parts[0], color: parts[1], state: stateOf(byKey[k]) };
  });
  if (!items.length) throw new Error('sin filas válidas');
  var totals = Object.keys(byProduct).map(function (p) { return { product: p, state: stateOf(byProduct[p]) }; });
  return { items: items, totals: totals };
}

module.exports = async function handler(req, res) {
  var url = process.env.STOCK_CSV_URL;
  var body;
  try {
    if (!url) throw new Error('STOCK_CSV_URL no está configurada');
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 8000);
    var r;
    try { r = await fetch(url, { signal: ctrl.signal, redirect: 'follow' }); } finally { clearTimeout(timer); }
    if (!r.ok) throw new Error('HTTP ' + r.status);
    var text = await r.text();
    if (/^\s*</.test(text)) throw new Error('llegó HTML, no CSV (¿la hoja está publicada?)');
    var data = build(text);
    lastGood = { status: 'ok', updated: new Date().toISOString(), items: data.items, totals: data.totals };
    body = lastGood;
  } catch (e) {
    // Sin romper la página: último stock válido, o "unknown" (la página muestra todo normal).
    body = lastGood
      ? { status: 'stale', updated: lastGood.updated, items: lastGood.items, totals: lastGood.totals }
      : { status: 'unknown', items: [], totals: [] };
  }
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', body.status === 'unknown' ? 's-maxage=15, stale-while-revalidate=60' : 's-maxage=60, stale-while-revalidate=300');
  res.end(JSON.stringify(body));
};

module.exports._build = build; // para pruebas
