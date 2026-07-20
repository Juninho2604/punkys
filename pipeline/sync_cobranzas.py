# -*- coding: utf-8 -*-
"""
Puente de datos → Intranet Punky · COBRANZAS por documento (Fase 5, comisiones)

Sube a la intranet los cobros registrados en Profit (una fila por documento
cobrado, con fecha y vendedor). Es la BASE de las comisiones: el módulo
Comisiones corta por quincenas (1–15 y 16–fin de mes) y aplica el % de cada
vendedor, que configura el admin en la intranet.

Fuente esperada: cobranzas-data.json generado por los extractores de la PC.
Acepta claves cortas (f, doc, c, v, u) o largas (fecha, documento, cliente,
vendedor, montoUsd). ⚠️ Si el extractor de cobranzas aún no existe, hay que
crearlo igual que el de ventas (mismo patrón Excel → JSON).

Uso (PC de la oficina, tras los extractores):
    py sync_cobranzas.py

Variables: PUNKY_API_URL, PUNKY_SYNC_TOKEN.
Solo librería estándar.
"""
import json, os, sys, urllib.request, urllib.error

API_URL = os.environ.get("PUNKY_API_URL", "http://80.241.212.7:8080").rstrip("/")
TOKEN = os.environ.get("PUNKY_SYNC_TOKEN", "")
SRC = r"G:\Mi unidad\AI OPTIMIZACIONES\Intranet\Inventario\cobranzas-data.json"


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

    cobranzas, omitidas = [], 0
    for r in rows:
        fecha = str(campo(r, "f", "fecha"))[:10]
        vendedor = str(campo(r, "v", "vendedor")).strip()
        monto = campo(r, "u", "montoUsd", "monto", default=None)
        # Sin fecha completa, sin vendedor o sin monto no hay comisión que calcular
        if len(fecha) != 10 or not vendedor or monto is None:
            omitidas += 1
            continue
        cobranzas.append({
            "fecha": fecha,
            "documento": str(campo(r, "doc", "documento"))[:60],
            "cliente": str(campo(r, "c", "cliente"))[:300],
            "vendedor": vendedor[:200],
            "montoUsd": round(float(monto), 2),
        })

    if not cobranzas:
        print("ERROR: no hay cobranzas válidas (¿cobranzas-data.json vacío o sin fecha/vendedor/monto?)")
        sys.exit(1)
    if omitidas:
        print(f"AVISO: {omitidas} filas omitidas (sin fecha, vendedor o monto)")

    payload = {"fuente": "PC oficina · cobranzas-data.json", "cobranzas": cobranzas}
    req = urllib.request.Request(
        API_URL + "/api/sync/cobranzas",
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
    fechas = sorted(c["fecha"] for c in cobranzas)
    print(f"Sync Cobranzas -> OK: {out.get('recibidos')} documentos | {fechas[0]}..{fechas[-1]}")


if __name__ == "__main__":
    main()
