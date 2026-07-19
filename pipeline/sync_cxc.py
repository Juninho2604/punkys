# -*- coding: utf-8 -*-
"""
Puente de datos → Intranet Punky · CUENTAS POR COBRAR (Fase 4)

Sube el snapshot de CxC que generan los extractores existentes
(cxc-data.json) a la intranet, para que CxC vea el saldo del cliente al
aprobar una cotización.

Uso (PC de la oficina, tras el extractor de CxC):
    py sync_cxc.py

Variables: PUNKY_API_URL, PUNKY_SYNC_TOKEN (ver docs/puente-datos.md).
Solo librería estándar.
"""
import json, os, sys, urllib.request, urllib.error

API_URL = os.environ.get("PUNKY_API_URL", "http://80.241.212.7:8080").rstrip("/")
TOKEN = os.environ.get("PUNKY_SYNC_TOKEN", "")
SRC = r"G:\Mi unidad\AI OPTIMIZACIONES\Intranet\Inventario\cxc-data.json"

def main():
    if not TOKEN:
        print("ERROR: define PUNKY_SYNC_TOKEN")
        sys.exit(1)
    with open(SRC, encoding="utf-8") as f:
        data = json.load(f)

    cuentas = []
    for d in data.get("docs", []):
        cuentas.append({
            "cliente": d.get("c", ""),
            "vendedor": d.get("v", ""),
            "documento": d.get("doc", ""),
            "tipoDoc": d.get("td", ""),
            "fechaEmision": d.get("emis", ""),
            "fechaVenc": d.get("venc", ""),
            "total": float(d.get("total", 0) or 0),
            "saldo": float(d.get("saldo", 0) or 0),
            "diasVencido": int(d.get("dias", 0) or 0),
            "moneda": "USD",  # la CxC de Profit está en USD (regla del negocio)
        })

    payload = {"fuente": f"PC oficina · cxc {data.get('actualizado','?')}", "cuentas": cuentas}
    req = urllib.request.Request(
        API_URL + "/api/sync/cxc",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "Authorization": "Bearer " + TOKEN},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as res:
            out = json.loads(res.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print("ERROR HTTP", e.code, e.read().decode("utf-8", "replace"))
        sys.exit(1)
    print(f"Sync CxC -> OK: {out.get('recibidos')} documentos")

if __name__ == "__main__":
    main()
