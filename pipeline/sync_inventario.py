# -*- coding: utf-8 -*-
"""
Puente de datos → Intranet Punky (Fase 1 del plan maestro)

Toma los JSON que YA generan los extractores existentes
(catalogo-activo.json + lista-precios-data.json) y sube el inventario
(productos + precios + stock por sede) a la intranet nueva.

Uso (en la PC de la oficina, después de los extractores):
    py sync_inventario.py

Configurable por variables de entorno o editando las constantes:
    PUNKY_API_URL    (ej: http://80.241.212.7:8080)
    PUNKY_SYNC_TOKEN (el mismo SYNC_TOKEN del .env del VPS)
    PUNKY_LISTA      (nombre de la lista de precios a usar; vacío = la primera)
    PUNKY_TASA       (multiplicador opcional de precio, ej. tasa Bs/USD; 1 = tal cual)

Solo usa la librería estándar (urllib), igual que los extractores: sin pip.
"""
import json, os, sys, urllib.request

# ── Configuración ────────────────────────────────────────────────────────────
API_URL = os.environ.get("PUNKY_API_URL", "http://80.241.212.7:8080").rstrip("/")
TOKEN = os.environ.get("PUNKY_SYNC_TOKEN", "")
LISTA = os.environ.get("PUNKY_LISTA", "")  # "" = primera lista disponible por producto
TASA = float(os.environ.get("PUNKY_TASA", "1"))

BASE = r"G:\Mi unidad\AI OPTIMIZACIONES\Intranet\Inventario"
CATALOGO = os.path.join(BASE, "catalogo-activo.json")
PRECIOS = os.path.join(BASE, "lista-precios-data.json")

# Mapeo almacén de Profit → sede de la intranet.
# ⚠️ CONFIRMAR con Punky: según los extractores, 002 = Bello Monte y
# 035 = Vene Embarques. Ajustar aquí si el mapeo real es distinto.
ALMACEN_SEDE = {
    "002": "Almacén Boleíta",
    "035": "Almacén Principal",
}

# ── Carga ────────────────────────────────────────────────────────────────────
def cargar(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)

def main():
    if not TOKEN:
        print("ERROR: define PUNKY_SYNC_TOKEN (el SYNC_TOKEN del .env del VPS)")
        sys.exit(1)

    cat = cargar(CATALOGO)      # {actualizado, almacenes, stock, det, cats, cod}
    lp = cargar(PRECIOS)        # {actualizado, listas, productos:[{codigo,nombre,moneda,precios}]}

    det = cat.get("det", {})    # {nombre_producto: {cod_almacen: stock}}
    cod_por_nombre = cat.get("cod", {})  # {nombre_producto: co_art}
    precios_por_codigo = {p["codigo"]: p for p in lp.get("productos", [])}

    productos, sin_codigo, sin_precio = [], [], []
    for nombre, stock_alma in det.items():
        codigo = (cod_por_nombre.get(nombre) or "").strip()
        if not codigo:
            sin_codigo.append(nombre)
            continue
        p = precios_por_codigo.get(codigo)
        if not p or not p.get("precios"):
            sin_precio.append(nombre)
            continue
        listas = p["precios"]
        if LISTA and LISTA in listas:
            precio = listas[LISTA]
        else:
            precio = listas[sorted(listas.keys())[0]]
        # Stock por sede (solo almacenes mapeados = vendibles)
        stock = {}
        for alma, qty in stock_alma.items():
            sede = ALMACEN_SEDE.get(str(alma))
            if sede:
                stock[sede] = stock.get(sede, 0) + int(qty)
        productos.append({
            "codigo": codigo,
            "nombre": nombre,
            "precio": round(float(precio) * TASA, 2),
            "moneda": p.get("moneda") or "USD",
            "stock": stock,
        })

    if not productos:
        print("ERROR: no se armó ningún producto (¿rutas correctas? ¿JSON vacíos?)")
        sys.exit(1)

    payload = {
        "fuente": f"PC oficina · catalogo {cat.get('actualizado','?')} · precios {lp.get('actualizado','?')}",
        "productos": productos,
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        API_URL + "/api/sync/productos",
        data=data,
        headers={"Content-Type": "application/json", "Authorization": "Bearer " + TOKEN},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as res:
            out = json.loads(res.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print("ERROR HTTP", e.code, e.read().decode("utf-8", "replace"))
        sys.exit(1)

    print(f"Sync intranet -> OK: {out.get('recibidos')} productos subidos, {out.get('desactivados')} desactivados")
    if sin_codigo:
        print(f"  aviso: {len(sin_codigo)} productos sin co_art (no subidos): {', '.join(sin_codigo[:5])}…")
    if sin_precio:
        print(f"  aviso: {len(sin_precio)} productos sin precio vigente (no subidos): {', '.join(sin_precio[:5])}…")

if __name__ == "__main__":
    main()
