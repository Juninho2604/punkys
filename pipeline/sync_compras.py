# -*- coding: utf-8 -*-
"""
Puente de datos → Intranet Punky · COMPRAS por documento (Fase 6)

Sube las facturas de compra registradas en Profit (una fila por documento,
con fecha, proveedor y monto USD). Alimenta la página "Compras & Por Pagar"
de la intranet (solo admin): compras por mes, top proveedores, últimas compras.

Fuente esperada: compras-data.json generado por los extractores de la PC.
Acepta claves cortas (f, doc, p, cat, u) o largas (fecha, documento,
proveedor, categoria, montoUsd). ⚠️ Si el extractor de compras aún no existe,
crearlo igual que el de ventas (mismo patrón Excel → JSON).

Uso (PC de la oficina, tras los extractores):
    py sync_compras.py

Variables: PUNKY_API_URL, PUNKY_SYNC_TOKEN.
Solo librería estándar.
"""
import json, os, sys, urllib.request, urllib.error

API_URL = os.environ.get("PUNKY_API_URL", "http://80.241.212.7:8080").rstrip("/")
TOKEN = os.environ.get("PUNKY_SYNC_TOKEN", "")
SRC = r"G:\Mi unidad\AI OPTIMIZACIONES\Intranet\Inventario\compras-data.json"


def campo(r, *claves, default=""):
    for k in claves:
        if k in r and r[k] is not None:
            return r[k]
    return default


def main():
    if not TOKEN:
        print("ERROR: define PUNKY_SYNC_TOKEN")
        sys.exit(1)
    with open(SRC, encoding="utf-8") as f:
        data = json.load(f)
    rows = data.get("rows", data if isinstance(data, list) else [])

    compras, omitidas = [], 0
    for r in rows:
        fecha = str(campo(r, "f", "fecha"))[:10]
        proveedor = str(campo(r, "p", "proveedor")).strip()
        monto = campo(r, "u", "montoUsd", "monto", default=None)
        if len(fecha) != 10 or not proveedor or monto is None:
            omitidas += 1
            continue
        compras.append({
            "fecha": fecha,
            "documento": str(campo(r, "doc", "documento"))[:60],
            "proveedor": proveedor[:300],
            "categoria": str(campo(r, "cat", "categoria"))[:120],
            "montoUsd": round(float(monto), 2),
        })

    if not compras:
        print("ERROR: no hay compras válidas (¿compras-data.json vacío o sin fecha/proveedor/monto?)")
        sys.exit(1)
    if omitidas:
        print(f"AVISO: {omitidas} filas omitidas (sin fecha, proveedor o monto)")

    payload = {"fuente": "PC oficina · compras-data.json", "compras": compras}
    req = urllib.request.Request(
        API_URL + "/api/sync/compras",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "Authorization": "Bearer " + TOKEN},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as res:
            out = json.loads(res.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print("ERROR HTTP", e.code, e.read().decode("utf-8", "replace"))
        sys.exit(1)
    fechas = sorted(c["fecha"] for c in compras)
    print(f"Sync Compras -> OK: {out.get('recibidos')} documentos | {fechas[0]}..{fechas[-1]}")


if __name__ == "__main__":
    main()
