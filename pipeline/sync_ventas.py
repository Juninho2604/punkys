# -*- coding: utf-8 -*-
"""
Puente de datos → Intranet Punky · VENTAS agregadas (Fase 4)

Toma ventas-data.json (formato interned de los extractores) y sube al
intranet un resumen por mes × vendedor × categoría (monto USD, unidades y
margen USD). El margen solo lo verá el admin en la intranet.

Uso (PC de la oficina, tras el extractor de ventas):
    py sync_ventas.py

Variables: PUNKY_API_URL, PUNKY_SYNC_TOKEN.
Solo librería estándar.
"""
import json, os, sys, urllib.request, urllib.error
from collections import defaultdict

API_URL = os.environ.get("PUNKY_API_URL", "http://80.241.212.7").rstrip("/")
TOKEN = os.environ.get("PUNKY_SYNC_TOKEN", "")
SRC = r"G:\Mi unidad\AI OPTIMIZACIONES\Intranet\Inventario\ventas-data.json"

def main():
    if not TOKEN:
        print("ERROR: define PUNKY_SYNC_TOKEN")
        sys.exit(1)
    with open(SRC, encoding="utf-8") as f:
        data = json.load(f)
    rows = data.get("rows", data if isinstance(data, list) else [])

    # Agregación por (mes, vendedor, categoria)
    agg = defaultdict(lambda: {"unidades": 0.0, "montoUsd": 0.0, "margenUsd": 0.0, "conMargen": False})
    for r in rows:
        f = str(r.get("f", ""))
        if len(f) < 7:
            continue
        mes = f[:7]  # YYYY-MM
        key = (mes, str(r.get("v", "") or ""), str(r.get("cat", "otros") or "otros"))
        a = agg[key]
        a["unidades"] += float(r.get("und", 0) or 0)
        a["montoUsd"] += float(r.get("u", 0) or 0)
        if "m" in r and r["m"] is not None:
            a["margenUsd"] += float(r["m"])
            a["conMargen"] = True

    ventas = []
    for (mes, v, cat), a in agg.items():
        ventas.append({
            "mes": mes,
            "vendedor": v,
            "categoria": cat,
            "unidades": round(a["unidades"], 2),
            "montoUsd": round(a["montoUsd"], 2),
            # margen solo si hubo costo en al menos una fila del grupo
            "margenUsd": round(a["margenUsd"], 2) if a["conMargen"] else None,
        })

    if not ventas:
        print("ERROR: no se agregó ninguna venta (¿ventas-data.json vacío?)")
        sys.exit(1)

    payload = {"fuente": "PC oficina · ventas-data.json", "ventas": ventas}
    req = urllib.request.Request(
        API_URL + "/api/sync/ventas",
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
    meses = sorted({v["mes"] for v in ventas})
    print(f"Sync Ventas -> OK: {out.get('recibidos')} filas agregadas | meses: {meses[0]}..{meses[-1]}")

if __name__ == "__main__":
    main()
