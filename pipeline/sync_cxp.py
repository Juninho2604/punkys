# -*- coding: utf-8 -*-
"""
Puente de datos → Intranet Punky · CUENTAS POR PAGAR (Fase 6)

Sube el snapshot de deuda con proveedores (cxp-data.json) para la página
"Compras & Por Pagar" de la intranet (solo admin): cuánto se debe a cada
proveedor y cuánto está vencido.

Fuente esperada: cxp-data.json, mismo formato que cxc-data.json pero con
proveedores. Acepta claves cortas (p, doc, td, emis, venc, total, saldo,
dias) o largas. ⚠️ Si el extractor de CxP aún no existe, crearlo igual que
el de CxC (mismo patrón Excel → JSON).

Uso (PC de la oficina, tras los extractores):
    py sync_cxp.py

Variables: PUNKY_API_URL, PUNKY_SYNC_TOKEN.
Solo librería estándar.
"""
import json, os, sys, urllib.request, urllib.error

API_URL = os.environ.get("PUNKY_API_URL", "http://80.241.212.7:8080").rstrip("/")
TOKEN = os.environ.get("PUNKY_SYNC_TOKEN", "")
SRC = r"G:\Mi unidad\AI OPTIMIZACIONES\Intranet\Inventario\cxp-data.json"


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
    rows = data.get("docs", data.get("rows", data if isinstance(data, list) else []))

    cuentas, omitidas = [], 0
    for d in rows:
        proveedor = str(campo(d, "p", "proveedor")).strip()
        if not proveedor:
            omitidas += 1
            continue
        cuentas.append({
            "proveedor": proveedor[:300],
            "documento": str(campo(d, "doc", "documento"))[:60],
            "tipoDoc": str(campo(d, "td", "tipoDoc"))[:40],
            "fechaEmision": str(campo(d, "emis", "fechaEmision"))[:20],
            "fechaVenc": str(campo(d, "venc", "fechaVenc"))[:20],
            "total": float(campo(d, "total", default=0) or 0),
            "saldo": float(campo(d, "saldo", default=0) or 0),
            "diasVencido": int(campo(d, "dias", "diasVencido", default=0) or 0),
            "moneda": "USD",  # igual que la CxC: los saldos de Profit van en USD
        })

    if not cuentas:
        print("ERROR: no hay documentos de CxP válidos (¿cxp-data.json vacío o sin proveedor?)")
        sys.exit(1)
    if omitidas:
        print(f"AVISO: {omitidas} filas omitidas (sin proveedor)")

    payload = {"fuente": "PC oficina · cxp-data.json", "cuentas": cuentas}
    req = urllib.request.Request(
        API_URL + "/api/sync/cxp",
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
    print(f"Sync CxP -> OK: {out.get('recibidos')} documentos")


if __name__ == "__main__":
    main()
