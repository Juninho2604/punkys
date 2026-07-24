// Snapshot (solo lectura) de la operación del cliente tomado de sus Sheets.
// Se genera leyendo "Pedidos Punky" + "Punky - Configuración". Re-generarlo y
// recargarlo trae el delta (el cargador es idempotente). NO se escribe a sus
// Sheets nunca. Este archivo se rellena con la data real; el cargador vive en
// integrations/sheets/importarSnapshot.ts.

export interface OpPedido {
  numero: string
  fecha_pedido?: string | null
  fecha_despacho?: string | null
  cliente?: string | null
  cod_cliente?: string | null
  rif?: string | null
  vendedor?: string | null
  observaciones?: string | null
  cond_pago?: string | null
  productos?: string | null
  monto_usd?: number | null
  almacen?: string | null
  lista_precios?: string | null
  estado?: string | null
  nro_nota?: string | null
  nro_factura?: string | null
  fecha_recibido?: string | null
  fecha_cxc?: string | null
  fecha_aprobado_cxc?: string | null
  fecha_logistica?: string | null
  fecha_entregado?: string | null
  fecha_en_ruta?: string | null
  origen?: string | null
  renglones?: { cantidad: number | null; descripcion: string }[]
}

export interface SnapshotOperacion {
  generado: string
  pedidos: OpPedido[]
  estados: Record<string, unknown>[]
  logistica: Record<string, unknown>[]
  fletes: Record<string, unknown>[]
  contactos: Record<string, unknown>[]
  notif_grupos: Record<string, unknown>[]
  notif_tipos: Record<string, unknown>[]
  productos: Record<string, unknown>[]
  almacenes: Record<string, unknown>[]
  categorias: Record<string, unknown>[]
}

export const snapshotOperacion: SnapshotOperacion = {
  "generado": "2026-07-23",
  "productos": [],
  "almacenes": [],
  "categorias": [],
  "pedidos": [
    {
      "numero": "1025",
      "fecha_pedido": "2026-06-30",
      "fecha_despacho": "2026-07-09",
      "cliente": "L M S INVERSIONES Y AGROPECUARIA EL GABAN 2021, C.A.",
      "cod_cliente": "97",
      "rif": "J501341508",
      "vendedor": "Kenibel Escalona",
      "observaciones": "incluir 03 und happy 2kg",
      "cond_pago": "Contado",
      "productos": "2 x Happy to Sea 6kg | 2 x Eager to Meat 2kg | 1 x Grow Little One 2kg | 10 x Almohaditas de Salmon Gatos 60g | 1 x Eager to Meat 6kg",
      "monto_usd": 209.1,
      "almacen": "35",
      "lista_precios": "LISTA EFECTIVO V",
      "estado": "Recibido",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-01",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": null,
      "fecha_entregado": null,
      "fecha_en_ruta": null,
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 2,
          "descripcion": "Happy to Sea 6kg"
        },
        {
          "cantidad": 2,
          "descripcion": "Eager to Meat 2kg"
        },
        {
          "cantidad": 1,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 1,
          "descripcion": "Eager to Meat 6kg"
        }
      ]
    },
    {
      "numero": "1035",
      "fecha_pedido": "2026-07-01",
      "fecha_despacho": "2026-07-10",
      "cliente": "CLINICA VETERINARIA ANIMALVET, C.A.",
      "cod_cliente": "259",
      "rif": "J507077942",
      "vendedor": "Kenibel Escalona",
      "observaciones": "incluye 03 und de Happy to sea de 2kg",
      "cond_pago": "Contado",
      "productos": "12 x Palitos Dentales 110g | 24 x Lamichi Salmon 4x15g",
      "monto_usd": 130,
      "almacen": null,
      "lista_precios": "LISTA BOLIVARES V",
      "estado": "Recibido",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-01",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": null,
      "fecha_entregado": null,
      "fecha_en_ruta": null,
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        }
      ]
    },
    {
      "numero": "1104",
      "fecha_pedido": "2026-07-09",
      "fecha_despacho": "2026-07-11",
      "cliente": "CAFIMES C.A",
      "cod_cliente": "265",
      "rif": "J402248091",
      "vendedor": "Kenibel Escalona",
      "observaciones": null,
      "cond_pago": "Credito 15 Dias",
      "productos": "6 x Palitos Dentales 110g | 10 x Almohaditas de Salmon Gatos 60g | 12 x Lamichi Pollo 4x15g | 24 x Lamichi Salmon 4x15g",
      "monto_usd": 108.9,
      "almacen": "35",
      "lista_precios": "LISTA EFECTIVO V",
      "estado": "Recibido",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-09",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": null,
      "fecha_entregado": null,
      "fecha_en_ruta": null,
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 6,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        }
      ]
    },
    {
      "numero": "1105",
      "fecha_pedido": "2026-07-09",
      "fecha_despacho": "2026-07-11",
      "cliente": "URBAN ANIMALS, C.A",
      "cod_cliente": "156",
      "rif": "J503764570",
      "vendedor": "Kenibel Escalona",
      "observaciones": null,
      "cond_pago": "Credito 15 Dias",
      "productos": "2 x Eager to Meat 6kg",
      "monto_usd": 91,
      "almacen": "35",
      "lista_precios": "LISTA EFECTIVO V",
      "estado": "Recibido",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-09",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": null,
      "fecha_entregado": null,
      "fecha_en_ruta": null,
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 2,
          "descripcion": "Eager to Meat 6kg"
        }
      ]
    },
    {
      "numero": "1137",
      "fecha_pedido": "2026-07-14",
      "fecha_despacho": "2026-07-16",
      "cliente": "CACERES RAMOS REBECA MERCEDES",
      "cod_cliente": "203",
      "rif": "V076606311",
      "vendedor": "Kenibel Escalona",
      "observaciones": "incluye 04 und happy 2kg / 02 und happy 6kg / 12 und michi",
      "cond_pago": "Credito 7 Dias",
      "productos": "12 x Lamichi Pollo 4x15g | 10 x Salmoncitos Perros 60g | 6 x Palitos Dentales 110g",
      "monto_usd": 62.1,
      "almacen": "35",
      "lista_precios": "LISTA EFECTIVO V",
      "estado": "Recibido",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-14",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": null,
      "fecha_entregado": null,
      "fecha_en_ruta": null,
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 6,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "1139",
      "fecha_pedido": "2026-07-15",
      "fecha_despacho": "2026-07-17",
      "cliente": "BARBUDOGS PET SHOP, C.A",
      "cod_cliente": "179",
      "rif": "J504739685",
      "vendedor": "Kenibel Escalona",
      "observaciones": "incluye 04 happy 2kg / 04 eager 2kg",
      "cond_pago": "Credito 15 Dias",
      "productos": "4 x Grow Little One 2kg",
      "monto_usd": 70.8,
      "almacen": "35",
      "lista_precios": "LISTA EFECTIVO V",
      "estado": "Recibido",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-15",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": null,
      "fecha_entregado": null,
      "fecha_en_ruta": null,
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 4,
          "descripcion": "Grow Little One 2kg"
        }
      ]
    },
    {
      "numero": "1162",
      "fecha_pedido": "2026-07-20",
      "fecha_despacho": "2026-07-22",
      "cliente": "DAYANA DEL VALLE SUKAR CHAKKAL",
      "cod_cliente": "202",
      "rif": "V30800854",
      "vendedor": "Kenibel Escalona",
      "observaciones": "incluye 04 happy 2kg / 08 eager 2kg",
      "cond_pago": "Credito 10 Dias",
      "productos": "6 x Palitos Dentales 110g | 2 x Grow Little One 2kg",
      "monto_usd": 54.6,
      "almacen": "35",
      "lista_precios": "LISTA EFECTIVO V",
      "estado": "Recibido",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-20",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": null,
      "fecha_entregado": null,
      "fecha_en_ruta": null,
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 6,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 2,
          "descripcion": "Grow Little One 2kg"
        }
      ]
    },
    {
      "numero": "1176",
      "fecha_pedido": "2026-07-22",
      "fecha_despacho": "2026-07-24",
      "cliente": "CIUDAD DE LAS MASCOTAS, C.A.",
      "cod_cliente": "103",
      "rif": "J502572406",
      "vendedor": "Kenibel Escalona",
      "observaciones": "incluye 5 und Happy 2kg / 3 und eager 2kg",
      "cond_pago": "Credito 15 Dias",
      "productos": "1 x Grow Little One 6kg",
      "monto_usd": 45.5,
      "almacen": "35",
      "lista_precios": "LISTA EFECTIVO V",
      "estado": "Recibido",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-22",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": null,
      "fecha_entregado": null,
      "fecha_en_ruta": null,
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 1,
          "descripcion": "Grow Little One 6kg"
        }
      ]
    },
    {
      "numero": "1001",
      "fecha_pedido": "2026-06-22",
      "fecha_despacho": "2026-06-24",
      "cliente": "PET HOME PETARE, C.A.",
      "cod_cliente": "34",
      "rif": "J503727489",
      "vendedor": "Ivan Desantiago",
      "observaciones": null,
      "cond_pago": "Credito 10 Dias",
      "productos": "2 x Eager to Meat 11,4kg | 2 x Eager to Meat 6kg | 2 x Grow Little One 6kg | 4 x Happy to Sea 11,4kg",
      "monto_usd": 890,
      "almacen": "2",
      "lista_precios": "LISTA VIP BOLIVARES V",
      "estado": "CXC",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-06-22",
      "fecha_cxc": "2026-07-16",
      "fecha_aprobado_cxc": "2026-07-16",
      "fecha_logistica": null,
      "fecha_entregado": null,
      "fecha_en_ruta": null,
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 2,
          "descripcion": "Eager to Meat 11,4kg"
        },
        {
          "cantidad": 2,
          "descripcion": "Eager to Meat 6kg"
        },
        {
          "cantidad": 2,
          "descripcion": "Grow Little One 6kg"
        },
        {
          "cantidad": 4,
          "descripcion": "Happy to Sea 11,4kg"
        }
      ]
    },
    {
      "numero": "M-001",
      "fecha_pedido": "2026-07-20",
      "fecha_despacho": "2026-07-27",
      "cliente": "LIDERA",
      "cod_cliente": null,
      "rif": null,
      "vendedor": "Andreas",
      "observaciones": "NOTA - ANTICIPAR DESPACHO HACIA BOLIVAR - MITAD NOTA MITA FACTURA",
      "cond_pago": "21 dias",
      "productos": "50 x Almohaditas de Salmon Gatos 60g | 120 x Lamichi Pollo 4x15g | 120 x Lamichi Salmon 4x15g | 60 x Palitos Dentales 110g | 35 x Salmoncitos Perros 60g | 120 x Lamichi Atun 4x15g | 120 x Lamichi Pato 4x15g",
      "monto_usd": 1500,
      "almacen": null,
      "lista_precios": "LISTA BOLIVARES",
      "estado": "CXC",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-20",
      "fecha_cxc": "2026-07-23",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": null,
      "fecha_entregado": null,
      "fecha_en_ruta": null,
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 50,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 120,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 120,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 60,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 35,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 120,
          "descripcion": "Lamichi Atun 4x15g"
        },
        {
          "cantidad": 120,
          "descripcion": "Lamichi Pato 4x15g"
        }
      ]
    },
    {
      "numero": "1180",
      "fecha_pedido": "2026-07-22",
      "fecha_despacho": "2026-07-27",
      "cliente": "HIPERMERCADO PARAMO, C.A.",
      "cod_cliente": "139",
      "rif": "J503848049",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 21 Dias",
      "productos": "24 x Lamichi Pollo 4x15g | 60 x Lamichi Salmon 4x15g | 54 x Palitos Dentales 110g | 30 x Salmoncitos Perros 60g | 37 x Bolsas de disposicion (5 Rollos)",
      "monto_usd": 719.79,
      "almacen": "2",
      "lista_precios": null,
      "estado": "CXC",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-22",
      "fecha_cxc": "2026-07-23",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": null,
      "fecha_entregado": null,
      "fecha_en_ruta": null,
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 60,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 54,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 30,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 37,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        }
      ]
    },
    {
      "numero": "M-003",
      "fecha_pedido": "2026-07-27",
      "fecha_despacho": "2026-07-27",
      "cliente": "LIDERA",
      "cod_cliente": null,
      "rif": null,
      "vendedor": null,
      "observaciones": null,
      "cond_pago": "Credito 21 Dias",
      "productos": "50 x Almohaditas de Salmon Gatos 60g | 120 x Lamichi Pollo 4x15g | 120 x Lamichi Salmon 4x15g | 60 x Palitos Dentales 110g | 35 x Salmoncitos Perros 60g | 120 x Lamichi Atun 4x15g | 120 x Lamichi Pato 4x15g",
      "monto_usd": 1740.5,
      "almacen": "2",
      "lista_precios": null,
      "estado": "CXC",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-23",
      "fecha_cxc": "2026-07-23",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": null,
      "fecha_entregado": null,
      "fecha_en_ruta": null,
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 50,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 120,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 120,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 60,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 35,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 120,
          "descripcion": "Lamichi Atun 4x15g"
        },
        {
          "cantidad": 120,
          "descripcion": "Lamichi Pato 4x15g"
        }
      ]
    },
    {
      "numero": "1186",
      "fecha_pedido": "2026-07-22",
      "fecha_despacho": "2026-07-23",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "cod_cliente": "381",
      "rif": "J401583806",
      "vendedor": "Bryant Mennechey",
      "observaciones": "EL RECREO",
      "cond_pago": "Credito 45 Dias",
      "productos": "10 x Lamichi Salmon 4x15g | 36 x Lamichi Pollo 4x15g | 20 x Almohaditas de Salmon Gatos 60g | 12 x Palitos Dentales 110g | 10 x Salmoncitos Perros 60g",
      "monto_usd": 351.13,
      "almacen": null,
      "lista_precios": null,
      "estado": "Logística",
      "nro_nota": null,
      "nro_factura": "2856",
      "fecha_recibido": "2026-07-22",
      "fecha_cxc": "2026-07-23",
      "fecha_aprobado_cxc": "2026-07-23",
      "fecha_logistica": "2026-07-23",
      "fecha_entregado": null,
      "fecha_en_ruta": null,
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 10,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 36,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "1185",
      "fecha_pedido": "2026-07-22",
      "fecha_despacho": "2026-07-23",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "cod_cliente": "381",
      "rif": "J401583806",
      "vendedor": "Bryant Mennechey",
      "observaciones": "LOS CAMPITOS - LA CASTELLANA",
      "cond_pago": "Credito 45 Dias",
      "productos": "48 x Lamichi Salmon 4x15g | 36 x Lamichi Pollo 4x15g | 5 x Dispensador x 1 rollo Azul | 30 x Bolsas de disposicion (5 Rollos) | 50 x Almohaditas de Salmon Gatos 60g | 24 x Palitos Dentales 110g | 40 x Salmoncitos Perros 60g",
      "monto_usd": 687.89,
      "almacen": null,
      "lista_precios": null,
      "estado": "Logística",
      "nro_nota": null,
      "nro_factura": "2855",
      "fecha_recibido": "2026-07-22",
      "fecha_cxc": "2026-07-23",
      "fecha_aprobado_cxc": "2026-07-23",
      "fecha_logistica": "2026-07-23",
      "fecha_entregado": null,
      "fecha_en_ruta": null,
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 48,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 36,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 5,
          "descripcion": "Dispensador x 1 rollo Azul"
        },
        {
          "cantidad": 30,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 50,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 24,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 40,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "1182",
      "fecha_pedido": "2026-07-22",
      "fecha_despacho": "2026-07-23",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "cod_cliente": "381",
      "rif": "J401583806",
      "vendedor": "Bryant Mennechey",
      "observaciones": "LA CANDELARIA",
      "cond_pago": "Credito 45 Dias",
      "productos": "10 x Bolsas de disposicion (5 Rollos) | 48 x Lamichi Pollo 4x15g | 60 x Lamichi Salmon 4x15g | 20 x Almohaditas de Salmon Gatos 60g | 20 x Salmoncitos Perros 60g",
      "monto_usd": 433.12,
      "almacen": null,
      "lista_precios": null,
      "estado": "Logística",
      "nro_nota": null,
      "nro_factura": "2857",
      "fecha_recibido": "2026-07-22",
      "fecha_cxc": "2026-07-23",
      "fecha_aprobado_cxc": "2026-07-23",
      "fecha_logistica": "2026-07-23",
      "fecha_entregado": null,
      "fecha_en_ruta": null,
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 10,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 48,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 60,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "1161",
      "fecha_pedido": "2026-07-20",
      "fecha_despacho": "2026-07-23",
      "cliente": "INVERSIONES COLD 2024, C.A.",
      "cod_cliente": "177",
      "rif": "J505366220",
      "vendedor": "Bryant Mennechey",
      "observaciones": "Tienda nueva, coordinar despacho con bryant",
      "cond_pago": "Credito 15 Dias",
      "productos": "10 x Almohaditas de Salmon Gatos 60g | 20 x Salmoncitos Perros 60g | 24 x Lamichi Pollo 4x15g | 24 x Palitos Dentales 110g | 5 x Dispensador x 1 rollo Azul | 5 x Dispensador x 1 rollo Baby Blue | 16 x Bolsas de disposicion (5 Rollos) | 24 x Lamichi Salmon 4x15g",
      "monto_usd": 454.84,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Logística",
      "nro_nota": null,
      "nro_factura": "2844",
      "fecha_recibido": "2026-07-20",
      "fecha_cxc": "2026-07-21",
      "fecha_aprobado_cxc": "2026-07-21",
      "fecha_logistica": "2026-07-22",
      "fecha_entregado": null,
      "fecha_en_ruta": null,
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 5,
          "descripcion": "Dispensador x 1 rollo Azul"
        },
        {
          "cantidad": 5,
          "descripcion": "Dispensador x 1 rollo Baby Blue"
        },
        {
          "cantidad": 16,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        }
      ]
    },
    {
      "numero": "M-004",
      "fecha_pedido": "2026-07-23",
      "fecha_despacho": "2026-07-27",
      "cliente": "CENTRAL MADEIRENSE",
      "cod_cliente": null,
      "rif": null,
      "vendedor": null,
      "observaciones": "T00601",
      "cond_pago": null,
      "productos": "CONSIGNACION -",
      "monto_usd": 0.1,
      "almacen": null,
      "lista_precios": null,
      "estado": "Logística",
      "nro_nota": null,
      "nro_factura": "T0061",
      "fecha_recibido": "2026-07-23",
      "fecha_cxc": "2026-07-23",
      "fecha_aprobado_cxc": "2026-07-23",
      "fecha_logistica": "2026-07-23",
      "fecha_entregado": null,
      "fecha_en_ruta": null,
      "origen": "activo",
      "renglones": [
        {
          "cantidad": null,
          "descripcion": "CONSIGNACION -"
        }
      ]
    },
    {
      "numero": "1188",
      "fecha_pedido": "2026-07-23",
      "fecha_despacho": "2026-07-27",
      "cliente": "COMERCIAL J.A.T.U 69-70, C.A.",
      "cod_cliente": "345",
      "rif": "J315140829",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "1 x Grow Little One 6kg | 20 x Almohaditas de Salmon Gatos 60g | 12 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g",
      "monto_usd": 179.4,
      "almacen": null,
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Logística",
      "nro_nota": "2845",
      "nro_factura": null,
      "fecha_recibido": "2026-07-23",
      "fecha_cxc": "2026-07-23",
      "fecha_aprobado_cxc": "2026-07-23",
      "fecha_logistica": "2026-07-23",
      "fecha_entregado": null,
      "fecha_en_ruta": null,
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 1,
          "descripcion": "Grow Little One 6kg"
        },
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "1184",
      "fecha_pedido": "2026-07-22",
      "fecha_despacho": "2026-07-27",
      "cliente": "INVERSIONES PORTU-MASCOTAS, C.A.",
      "cod_cliente": "192",
      "rif": "J298096306",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "20 x Almohaditas de Salmon Gatos 60g | 24 x Lamichi Pollo 4x15g | 24 x Lamichi Salmon 4x15g",
      "monto_usd": 176.8,
      "almacen": null,
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Logística",
      "nro_nota": "2844",
      "nro_factura": null,
      "fecha_recibido": "2026-07-22",
      "fecha_cxc": "2026-07-23",
      "fecha_aprobado_cxc": "2026-07-23",
      "fecha_logistica": "2026-07-23",
      "fecha_entregado": null,
      "fecha_en_ruta": null,
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        }
      ]
    },
    {
      "numero": "1187",
      "fecha_pedido": "2026-07-22",
      "fecha_despacho": "2026-07-30",
      "cliente": "CONSIENTE A TU MASCOTA, C.A",
      "cod_cliente": "402",
      "rif": "J508416740",
      "vendedor": "CARACAS  MCBO",
      "observaciones": null,
      "cond_pago": "PREPAGADO",
      "productos": "7 x Grow Little One 2kg | 2 x Grow Little One 6kg | 3 x Eager to Meat 6kg | 2 x Eager to Meat 11,4kg",
      "monto_usd": 819.54,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Logística",
      "nro_nota": null,
      "nro_factura": "2851",
      "fecha_recibido": "2026-07-22",
      "fecha_cxc": "2026-07-22",
      "fecha_aprobado_cxc": "2026-07-22",
      "fecha_logistica": "2026-07-22",
      "fecha_entregado": null,
      "fecha_en_ruta": null,
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 7,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 2,
          "descripcion": "Grow Little One 6kg"
        },
        {
          "cantidad": 3,
          "descripcion": "Eager to Meat 6kg"
        },
        {
          "cantidad": 2,
          "descripcion": "Eager to Meat 11,4kg"
        }
      ]
    },
    {
      "numero": "1136",
      "fecha_pedido": "2026-07-14",
      "fecha_despacho": "2026-07-23",
      "cliente": "PETSITE STORE, C.A.",
      "cod_cliente": "307",
      "rif": "J507711544",
      "vendedor": "Kenibel Escalona",
      "observaciones": null,
      "cond_pago": "Credito 12 Dias",
      "productos": "4 x Grow Little One 2kg | 24 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g | 12 x Palitos Dentales 110g",
      "monto_usd": 208.1,
      "almacen": null,
      "lista_precios": "LISTA EFECTIVO V",
      "estado": "En Ruta",
      "nro_nota": null,
      "nro_factura": "2839",
      "fecha_recibido": "2026-07-14",
      "fecha_cxc": "2026-07-21",
      "fecha_aprobado_cxc": "2026-07-21",
      "fecha_logistica": "2026-07-21",
      "fecha_entregado": null,
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 4,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "1145",
      "fecha_pedido": "2026-07-16",
      "fecha_despacho": "2026-07-23",
      "cliente": "PETS MALL, C.A.",
      "cod_cliente": "81",
      "rif": "J295551509",
      "vendedor": "Kenibel Escalona",
      "observaciones": null,
      "cond_pago": "Credito 15 Dias",
      "productos": "24 x Grow Little One 2kg | 4 x Grow Little One 6kg | 1 x Eager to Meat 11,4kg",
      "monto_usd": 682.8,
      "almacen": null,
      "lista_precios": "LISTA EFECTIVO V",
      "estado": "En Ruta",
      "nro_nota": "2834",
      "nro_factura": null,
      "fecha_recibido": "2026-07-16",
      "fecha_cxc": "2026-07-21",
      "fecha_aprobado_cxc": "2026-07-21",
      "fecha_logistica": "2026-07-21",
      "fecha_entregado": null,
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 24,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 4,
          "descripcion": "Grow Little One 6kg"
        },
        {
          "cantidad": 1,
          "descripcion": "Eager to Meat 11,4kg"
        }
      ]
    },
    {
      "numero": "1128",
      "fecha_pedido": "2026-07-13",
      "fecha_despacho": "2026-07-23",
      "cliente": "CENTRO VETERINARIO LOS COLORADOS, C.A.",
      "cod_cliente": "80",
      "rif": "J075594037",
      "vendedor": "Kenibel Escalona",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "2 x Dispensador x 1 rollo Azul | 3 x Dispensador x 1 rollo Baby Blue | 2 x Eager to Meat 6kg | 12 x Lamichi Salmon 4x15g",
      "monto_usd": 208.97,
      "almacen": null,
      "lista_precios": "LISTA VIP BOLIVARES V",
      "estado": "En Ruta",
      "nro_nota": null,
      "nro_factura": "2840",
      "fecha_recibido": "2026-07-13",
      "fecha_cxc": "2026-07-21",
      "fecha_aprobado_cxc": "2026-07-21",
      "fecha_logistica": "2026-07-21",
      "fecha_entregado": null,
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 2,
          "descripcion": "Dispensador x 1 rollo Azul"
        },
        {
          "cantidad": 3,
          "descripcion": "Dispensador x 1 rollo Baby Blue"
        },
        {
          "cantidad": 2,
          "descripcion": "Eager to Meat 6kg"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        }
      ]
    },
    {
      "numero": "1118",
      "fecha_pedido": "2026-07-11",
      "fecha_despacho": "2026-07-23",
      "cliente": "CIUDAD DE LAS MASCOTAS, C.A.",
      "cod_cliente": "103",
      "rif": "J502572406",
      "vendedor": "Kenibel Escalona",
      "observaciones": null,
      "cond_pago": "Credito 12 Dias",
      "productos": "3 x Grow Little One 2kg | 1 x Grow Little One 6kg | 1 x Eager to Meat 6kg",
      "monto_usd": 144.1,
      "almacen": null,
      "lista_precios": "LISTA EFECTIVO V",
      "estado": "En Ruta",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-11",
      "fecha_cxc": "2026-07-21",
      "fecha_aprobado_cxc": "2026-07-21",
      "fecha_logistica": "2026-07-21",
      "fecha_entregado": null,
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 3,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 1,
          "descripcion": "Grow Little One 6kg"
        },
        {
          "cantidad": 1,
          "descripcion": "Eager to Meat 6kg"
        }
      ]
    },
    {
      "numero": "1135",
      "fecha_pedido": "2026-07-14",
      "fecha_despacho": "2026-07-23",
      "cliente": "CIUDAD DE LAS MASCOTAS, C.A.",
      "cod_cliente": "103",
      "rif": "J502572406",
      "vendedor": "Kenibel Escalona",
      "observaciones": null,
      "cond_pago": "Credito 15 Dias",
      "productos": "1 x Grow Little One 6kg | 6 x Palitos Dentales 110g",
      "monto_usd": 64.7,
      "almacen": null,
      "lista_precios": "LISTA EFECTIVO V",
      "estado": "En Ruta",
      "nro_nota": "2835",
      "nro_factura": null,
      "fecha_recibido": "2026-07-14",
      "fecha_cxc": "2026-07-21",
      "fecha_aprobado_cxc": "2026-07-21",
      "fecha_logistica": "2026-07-21",
      "fecha_entregado": null,
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 1,
          "descripcion": "Grow Little One 6kg"
        },
        {
          "cantidad": 6,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "1126",
      "fecha_pedido": "2026-07-13",
      "fecha_despacho": "2026-07-23",
      "cliente": "PETSPLUS 2023, C.A",
      "cod_cliente": "105",
      "rif": "J503210982",
      "vendedor": "Kenibel Escalona",
      "observaciones": "Pedido se complementa con el anterior, En el sistema hay 2 pedidos corresponden a la misma factura 2838",
      "cond_pago": "Credito 7 Dias",
      "productos": "6 x Eager to Meat 6kg",
      "monto_usd": 316.68,
      "almacen": null,
      "lista_precios": null,
      "estado": "En Ruta",
      "nro_nota": null,
      "nro_factura": "2838",
      "fecha_recibido": "2026-07-13",
      "fecha_cxc": "2026-07-21",
      "fecha_aprobado_cxc": "2026-07-21",
      "fecha_logistica": "2026-07-21",
      "fecha_entregado": null,
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 6,
          "descripcion": "Eager to Meat 6kg"
        }
      ]
    },
    {
      "numero": "1034",
      "fecha_pedido": "2026-07-01",
      "fecha_despacho": "2026-07-23",
      "cliente": "PETSPLUS 2023, C.A",
      "cod_cliente": "105",
      "rif": "J503210982",
      "vendedor": "Kenibel Escalona",
      "observaciones": "En el sistema hay 2 pedidos corresponden a la misma factura 2838",
      "cond_pago": "Credito 7 Dias",
      "productos": "6 x Grow Little One 2kg",
      "monto_usd": 118.32,
      "almacen": null,
      "lista_precios": null,
      "estado": "En Ruta",
      "nro_nota": null,
      "nro_factura": "2838",
      "fecha_recibido": "2026-07-09",
      "fecha_cxc": "2026-07-21",
      "fecha_aprobado_cxc": "2026-07-21",
      "fecha_logistica": "2026-07-21",
      "fecha_entregado": null,
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 6,
          "descripcion": "Grow Little One 2kg"
        }
      ]
    },
    {
      "numero": "1066",
      "fecha_pedido": "2026-07-03",
      "fecha_despacho": "2026-07-23",
      "cliente": "PETS MALL EXPRESS, C.A.",
      "cod_cliente": "96",
      "rif": "J501030618",
      "vendedor": "Kenibel Escalona",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "1 x Grow Little One 6kg | 6 x Bolsas de disposicion (5 Rollos)",
      "monto_usd": 101.78,
      "almacen": null,
      "lista_precios": "LISTA BOLIVARES V",
      "estado": "En Ruta",
      "nro_nota": null,
      "nro_factura": "2836",
      "fecha_recibido": "2026-07-03",
      "fecha_cxc": "2026-07-21",
      "fecha_aprobado_cxc": "2026-07-21",
      "fecha_logistica": "2026-07-21",
      "fecha_entregado": null,
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 1,
          "descripcion": "Grow Little One 6kg"
        },
        {
          "cantidad": 6,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        }
      ]
    },
    {
      "numero": "1147",
      "fecha_pedido": "2026-07-16",
      "fecha_despacho": "2026-07-23",
      "cliente": "PETS MALL EXPRESS, C.A.",
      "cod_cliente": "96",
      "rif": "J501030618",
      "vendedor": "Kenibel Escalona",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "12 x Palitos Dentales 110g | 10 x Almohaditas de Salmon Gatos 60g",
      "monto_usd": 76.28,
      "almacen": null,
      "lista_precios": "LISTA BOLIVARES V",
      "estado": "En Ruta",
      "nro_nota": "2836",
      "nro_factura": null,
      "fecha_recibido": "2026-07-16",
      "fecha_cxc": "2026-07-21",
      "fecha_aprobado_cxc": "2026-07-21",
      "fecha_logistica": "2026-07-21",
      "fecha_entregado": null,
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        }
      ]
    },
    {
      "numero": "1163",
      "fecha_pedido": "2026-07-21",
      "fecha_despacho": "2026-07-23",
      "cliente": "MAXI MERCADO PARAPARAL, C.A",
      "cod_cliente": "389",
      "rif": "J506693712",
      "vendedor": "Kenibel Escalona",
      "observaciones": "incluir 24 und Michi Salmon / 48 und michi atun / 48 und",
      "cond_pago": "Credito 21 Dias",
      "productos": "60 x Lamichi Pollo 4x15g",
      "monto_usd": 212.37,
      "almacen": null,
      "lista_precios": null,
      "estado": "En Ruta",
      "nro_nota": null,
      "nro_factura": "2842",
      "fecha_recibido": "2026-07-21",
      "fecha_cxc": "2026-07-21",
      "fecha_aprobado_cxc": "2026-07-21",
      "fecha_logistica": "2026-07-22",
      "fecha_entregado": null,
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 60,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "1165",
      "fecha_pedido": "2026-07-21",
      "fecha_despacho": "2026-07-23",
      "cliente": "MAXI MERCADO PARAPARAL, C.A",
      "cod_cliente": "389",
      "rif": "J506693712",
      "vendedor": "Kenibel Escalona",
      "observaciones": "pedido complemento",
      "cond_pago": "Credito 21 Dias",
      "productos": "20 x Almohaditas de Salmon Gatos 60g | 6 x Palitos Dentales 110g | 20 x Salmoncitos Perros 60g",
      "monto_usd": 172.84,
      "almacen": null,
      "lista_precios": null,
      "estado": "En Ruta",
      "nro_nota": null,
      "nro_factura": "2842",
      "fecha_recibido": "2026-07-21",
      "fecha_cxc": "2026-07-21",
      "fecha_aprobado_cxc": "2026-07-21",
      "fecha_logistica": "2026-07-22",
      "fecha_entregado": null,
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 6,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "5799",
      "fecha_pedido": "2026-07-13",
      "fecha_despacho": null,
      "cliente": "PETS PLANET  VAL#ENCIA SOLO FACTURA",
      "cod_cliente": null,
      "rif": null,
      "vendedor": "Kenibel Escalona",
      "observaciones": null,
      "cond_pago": null,
      "productos": null,
      "monto_usd": null,
      "almacen": null,
      "lista_precios": null,
      "estado": "En Ruta",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-13",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-13",
      "fecha_entregado": null,
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": []
    },
    {
      "numero": "2813",
      "fecha_pedido": "2026-07-16",
      "fecha_despacho": null,
      "cliente": "PETSPLANET VALENCIA  - CONSIGNACION",
      "cod_cliente": null,
      "rif": null,
      "vendedor": null,
      "observaciones": null,
      "cond_pago": null,
      "productos": null,
      "monto_usd": null,
      "almacen": null,
      "lista_precios": null,
      "estado": "En Ruta",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-16",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-16",
      "fecha_entregado": null,
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": []
    },
    {
      "numero": "1151",
      "fecha_pedido": "2026-07-16",
      "fecha_despacho": "2026-07-17",
      "cliente": "POSITIVO PETS SHOP, C.A",
      "cod_cliente": "297",
      "rif": "J506657341",
      "vendedor": "Brayan Carpio",
      "observaciones": "el cliente notifica que si le puede llegar este pedido",
      "cond_pago": "Credito 7 Dias",
      "productos": "24 x Lamichi Salmon 4x15g | 24 x Lamichi Pollo 4x15g | 3 x Tocineticas Perros 600g | 20 x Almohaditas de Salmon Gatos 60g | 12 x Palitos Dentales 110g | 10 x Salmoncitos Perros 60g",
      "monto_usd": 292.23,
      "almacen": null,
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2826",
      "nro_factura": null,
      "fecha_recibido": "2026-07-16",
      "fecha_cxc": "2026-07-16",
      "fecha_aprobado_cxc": "2026-07-17",
      "fecha_logistica": "2026-07-17",
      "fecha_entregado": "2026-07-20",
      "fecha_en_ruta": "2026-07-20",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 3,
          "descripcion": "Tocineticas Perros 600g"
        },
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "1155",
      "fecha_pedido": "2026-07-17",
      "fecha_despacho": "2026-07-20",
      "cliente": "INVERSIONES COMIDASCOTAS D&A 2025, C.A",
      "cod_cliente": "348",
      "rif": "J503090626",
      "vendedor": "Ivan Desantiago",
      "observaciones": "pedido para despachar en avicola petare",
      "cond_pago": "Credito 15 Dias",
      "productos": "4 x Tocineticas Perros 600g | 24 x Palitos Dentales 110g | 72 x Lamichi Salmon 4x15g | 72 x Lamichi Pollo 4x15g",
      "monto_usd": 401.6,
      "almacen": null,
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2832",
      "nro_factura": null,
      "fecha_recibido": "2026-07-17",
      "fecha_cxc": "2026-07-17",
      "fecha_aprobado_cxc": "2026-07-17",
      "fecha_logistica": "2026-07-20",
      "fecha_entregado": "2026-07-21",
      "fecha_en_ruta": "2026-07-21",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 4,
          "descripcion": "Tocineticas Perros 600g"
        },
        {
          "cantidad": 24,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 72,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 72,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "1159",
      "fecha_pedido": "2026-07-18",
      "fecha_despacho": "2026-07-20",
      "cliente": "TOP ANIMAL, C.A.",
      "cod_cliente": "146",
      "rif": "J400913900",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Contado",
      "productos": "6 x Bolsas de disposicion (5 Rollos) | 3 x Dispensador x 1 rollo Azul | 3 x Dispensador x 1 rollo Baby Blue | 24 x Lamichi Salmon 4x15g",
      "monto_usd": 125.14,
      "almacen": null,
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2828",
      "fecha_recibido": "2026-07-18",
      "fecha_cxc": "2026-07-20",
      "fecha_aprobado_cxc": "2026-07-20",
      "fecha_logistica": "2026-07-20",
      "fecha_entregado": "2026-07-21",
      "fecha_en_ruta": "2026-07-21",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 6,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 3,
          "descripcion": "Dispensador x 1 rollo Azul"
        },
        {
          "cantidad": 3,
          "descripcion": "Dispensador x 1 rollo Baby Blue"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        }
      ]
    },
    {
      "numero": "1158",
      "fecha_pedido": "2026-07-17",
      "fecha_despacho": "2026-07-20",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "cod_cliente": "381",
      "rif": "J401583806",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 45 Dias",
      "productos": "10 x Bolsas de disposicion (5 Rollos) | 5 x Dispensador x 1 rollo Azul | 24 x Lamichi Salmon 4x15g | 20 x Almohaditas de Salmon Gatos 60g | 12 x Palitos Dentales 110g | 10 x Salmoncitos Perros 60g",
      "monto_usd": 276.44,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2827",
      "fecha_recibido": "2026-07-17",
      "fecha_cxc": "2026-07-17",
      "fecha_aprobado_cxc": "2026-07-17",
      "fecha_logistica": "2026-07-20",
      "fecha_entregado": "2026-07-21",
      "fecha_en_ruta": "2026-07-21",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 10,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 5,
          "descripcion": "Dispensador x 1 rollo Azul"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "1152",
      "fecha_pedido": "2026-07-17",
      "fecha_despacho": "2026-07-20",
      "cliente": "INVERSIONES CHAMTOR SEGUNDA, C.A",
      "cod_cliente": "151",
      "rif": "J315275090",
      "vendedor": "CARACAS  MCBO",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "30 x Almohaditas de Salmon Gatos 60g | 36 x Lamichi Pollo 4x15g | 36 x Lamichi Salmon 4x15g",
      "monto_usd": 307.63,
      "almacen": null,
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2818",
      "fecha_recibido": "2026-07-17",
      "fecha_cxc": "2026-07-17",
      "fecha_aprobado_cxc": "2026-07-17",
      "fecha_logistica": "2026-07-17",
      "fecha_entregado": "2026-07-20",
      "fecha_en_ruta": "2026-07-20",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 30,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 36,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 36,
          "descripcion": "Lamichi Salmon 4x15g"
        }
      ]
    },
    {
      "numero": "1153",
      "fecha_pedido": "2026-07-17",
      "fecha_despacho": "2026-07-20",
      "cliente": "AVICOLA EL REY LEON 2025., C.A.",
      "cod_cliente": "68",
      "rif": "J503399791",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "3 x Eager to Meat 6kg | 10 x Almohaditas de Salmon Gatos 60g | 5 x Tocineticas Perros 600g",
      "monto_usd": 286.25,
      "almacen": null,
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2830",
      "nro_factura": null,
      "fecha_recibido": "2026-07-17",
      "fecha_cxc": "2026-07-17",
      "fecha_aprobado_cxc": "2026-07-17",
      "fecha_logistica": "2026-07-17",
      "fecha_entregado": "2026-07-20",
      "fecha_en_ruta": "2026-07-20",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 3,
          "descripcion": "Eager to Meat 6kg"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 5,
          "descripcion": "Tocineticas Perros 600g"
        }
      ]
    },
    {
      "numero": "1157",
      "fecha_pedido": "2026-07-17",
      "fecha_despacho": "2026-07-20",
      "cliente": "HIPERMERCADO PETARE, C.A",
      "cod_cliente": "302",
      "rif": "J502908633",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 21 Dias",
      "productos": "30 x Almohaditas de Salmon Gatos 60g | 36 x Lamichi Pollo 4x15g | 36 x Lamichi Salmon 4x15g | 30 x Salmoncitos Perros 60g | 10 x Palitos Dentales 110g",
      "monto_usd": 447.6,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": "2831",
      "nro_factura": null,
      "fecha_recibido": "2026-07-17",
      "fecha_cxc": "2026-07-17",
      "fecha_aprobado_cxc": "2026-07-17",
      "fecha_logistica": "2026-07-17",
      "fecha_entregado": "2026-07-20",
      "fecha_en_ruta": "2026-07-20",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 30,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 36,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 36,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 30,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 10,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "1154",
      "fecha_pedido": "2026-07-17",
      "fecha_despacho": "2026-07-20",
      "cliente": "BODEGON URBINA 21, C.A",
      "cod_cliente": "58",
      "rif": "J411897370",
      "vendedor": "Brayan Carpio",
      "observaciones": "aprovechara el 10%",
      "cond_pago": "Contado",
      "productos": "20 x Almohaditas de Salmon Gatos 60g | 6 x Tocineticas Perros 600g | 12 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g",
      "monto_usd": 192.7,
      "almacen": null,
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2829",
      "nro_factura": null,
      "fecha_recibido": "2026-07-17",
      "fecha_cxc": "2026-07-17",
      "fecha_aprobado_cxc": "2026-07-17",
      "fecha_logistica": "2026-07-17",
      "fecha_entregado": "2026-07-20",
      "fecha_en_ruta": "2026-07-20",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 6,
          "descripcion": "Tocineticas Perros 600g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "1170",
      "fecha_pedido": "2026-07-21",
      "fecha_despacho": "2026-07-22",
      "cliente": "EMPRENDIMNIENTO BRAYAN PARADA",
      "cod_cliente": "199",
      "rif": "J506572656",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Contado",
      "productos": "36 x Lamichi Salmon 4x15g | 36 x Lamichi Pollo 4x15g | 3 x Grow Little One 2kg | 20 x Almohaditas de Salmon Gatos 60g",
      "monto_usd": 362.73,
      "almacen": null,
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2850",
      "fecha_recibido": "2026-07-21",
      "fecha_cxc": "2026-07-21",
      "fecha_aprobado_cxc": "2026-07-21",
      "fecha_logistica": "2026-07-22",
      "fecha_entregado": "2026-07-23",
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 36,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 36,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 3,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        }
      ]
    },
    {
      "numero": "1169",
      "fecha_pedido": "2026-07-21",
      "fecha_despacho": "2026-07-22",
      "cliente": "AGROPET CCS, C.A.",
      "cod_cliente": "73",
      "rif": "J504902543",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "3 x Eager to Meat 6kg",
      "monto_usd": 195,
      "almacen": null,
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2841",
      "nro_factura": null,
      "fecha_recibido": "2026-07-21",
      "fecha_cxc": "2026-07-21",
      "fecha_aprobado_cxc": "2026-07-21",
      "fecha_logistica": "2026-07-22",
      "fecha_entregado": "2026-07-23",
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 3,
          "descripcion": "Eager to Meat 6kg"
        }
      ]
    },
    {
      "numero": "1166",
      "fecha_pedido": "2026-07-21",
      "fecha_despacho": "2026-07-22",
      "cliente": "INVERSIONES COLD 2024, C.A.",
      "cod_cliente": "177",
      "rif": "J505366220",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 15 Dias",
      "productos": "20 x Dispensador x 1 rollo Azul | 20 x Dispensador x 1 rollo Baby Blue | 15 x Bolsas de disposicion (5 Rollos) | 30 x Almohaditas de Salmon Gatos 60g | 48 x Lamichi Salmon 4x15g | 48 x Lamichi Pollo 4x15g | 54 x Palitos Dentales 110g | 30 x Salmoncitos Perros 60g",
      "monto_usd": 968.02,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2843",
      "fecha_recibido": "2026-07-21",
      "fecha_cxc": "2026-07-21",
      "fecha_aprobado_cxc": "2026-07-21",
      "fecha_logistica": "2026-07-22",
      "fecha_entregado": "2026-07-23",
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 20,
          "descripcion": "Dispensador x 1 rollo Azul"
        },
        {
          "cantidad": 20,
          "descripcion": "Dispensador x 1 rollo Baby Blue"
        },
        {
          "cantidad": 15,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 30,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 48,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 48,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 54,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 30,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "1173",
      "fecha_pedido": "2026-07-21",
      "fecha_despacho": "2026-07-22",
      "cliente": "CORPORACION CHALLENGER 360, C.A.",
      "cod_cliente": "200",
      "rif": "J505212907",
      "vendedor": "CARACAS  MCBO",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "2 x Grow Little One 2kg | 12 x Almohaditas de Salmon Gatos 60g | 12 x Lamichi Pollo 4x15g",
      "monto_usd": 129.22,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2848",
      "fecha_recibido": "2026-07-21",
      "fecha_cxc": "2026-07-21",
      "fecha_aprobado_cxc": "2026-07-21",
      "fecha_logistica": "2026-07-22",
      "fecha_entregado": "2026-07-23",
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 2,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 12,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "1167",
      "fecha_pedido": "2026-07-21",
      "fecha_despacho": "2026-07-22",
      "cliente": "INVERSIONES COLD 2024, C.A.",
      "cod_cliente": "177",
      "rif": "J505366220",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 15 Dias",
      "productos": "108 x Palitos Dentales 110g",
      "monto_usd": 479.82,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2847",
      "fecha_recibido": "2026-07-21",
      "fecha_cxc": "2026-07-21",
      "fecha_aprobado_cxc": "2026-07-21",
      "fecha_logistica": "2026-07-22",
      "fecha_entregado": "2026-07-23",
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 108,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "1160",
      "fecha_pedido": "2026-07-20",
      "fecha_despacho": "2026-07-22",
      "cliente": "AGROPECUARIA DISTRIBUIDORA EL TALISMAN, C.A.",
      "cod_cliente": "196",
      "rif": "J404127593",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Contado",
      "productos": "13 x Bolsas de disposicion (5 Rollos) | 18 x Palitos Dentales 110g",
      "monto_usd": 124.69,
      "almacen": null,
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2833",
      "nro_factura": null,
      "fecha_recibido": "2026-07-20",
      "fecha_cxc": "2026-07-20",
      "fecha_aprobado_cxc": "2026-07-20",
      "fecha_logistica": "2026-07-21",
      "fecha_entregado": "2026-07-21",
      "fecha_en_ruta": "2026-07-21",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 13,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 18,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "1174",
      "fecha_pedido": "2026-07-22",
      "fecha_despacho": "2026-07-23",
      "cliente": "DISTRIBUIDORA PONTON & ABREU, C.A.",
      "cod_cliente": "52",
      "rif": "J314829980",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "1 x Tocineticas Perros 600g | 12 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g | 10 x Salmoncitos Perros 60g",
      "monto_usd": 101.45,
      "almacen": null,
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2842",
      "nro_factura": null,
      "fecha_recibido": "2026-07-22",
      "fecha_cxc": "2026-07-22",
      "fecha_aprobado_cxc": "2026-07-22",
      "fecha_logistica": "2026-07-22",
      "fecha_entregado": "2026-07-23",
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 1,
          "descripcion": "Tocineticas Perros 600g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "1189",
      "fecha_pedido": "2026-07-23",
      "fecha_despacho": "2026-07-23",
      "cliente": "POSITIVO PETS SHOP, C.A",
      "cod_cliente": "297",
      "rif": "J506657341",
      "vendedor": "Brayan Carpio",
      "observaciones": "este pedido lo llevo yo si yei no puede entregarlo hoy",
      "cond_pago": "Credito 7 Dias",
      "productos": "20 x Salmoncitos Perros 60g | 2 x Tocineticas Perros 600g | 10 x Almohaditas de Salmon Gatos 60g",
      "monto_usd": 104.1,
      "almacen": null,
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2846",
      "nro_factura": null,
      "fecha_recibido": "2026-07-23",
      "fecha_cxc": "2026-07-23",
      "fecha_aprobado_cxc": "2026-07-23",
      "fecha_logistica": "2026-07-23",
      "fecha_entregado": "2026-07-23",
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 2,
          "descripcion": "Tocineticas Perros 600g"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        }
      ]
    },
    {
      "numero": "1168",
      "fecha_pedido": "2026-07-21",
      "fecha_despacho": "2026-07-23",
      "cliente": "AHM 33 CORPORACION C.A.",
      "cod_cliente": "71",
      "rif": "J503991704",
      "vendedor": "Ivan Desantiago",
      "observaciones": "contado",
      "cond_pago": "Contado",
      "productos": "3 x Grow Little One 2kg | 1 x Eager to Meat 6kg | 10 x Almohaditas de Salmon Gatos 60g | 12 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g | 12 x Palitos Dentales 110g | 10 x Salmoncitos Perros 60g | 2 x Tocineticas Perros 600g",
      "monto_usd": 329.28,
      "almacen": null,
      "lista_precios": "LISTA BOLIVARES V",
      "estado": "Entregado",
      "nro_nota": "2840",
      "nro_factura": null,
      "fecha_recibido": "2026-07-21",
      "fecha_cxc": "2026-07-21",
      "fecha_aprobado_cxc": "2026-07-21",
      "fecha_logistica": "2026-07-22",
      "fecha_entregado": "2026-07-23",
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 3,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 1,
          "descripcion": "Eager to Meat 6kg"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 2,
          "descripcion": "Tocineticas Perros 600g"
        }
      ]
    },
    {
      "numero": "1183",
      "fecha_pedido": "2026-07-22",
      "fecha_despacho": "2026-07-23",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "cod_cliente": "381",
      "rif": "J401583806",
      "vendedor": "Bryant Mennechey",
      "observaciones": "EL HATILLO",
      "cond_pago": "Credito 45 Dias",
      "productos": "36 x Lamichi Pollo 4x15g | 20 x Almohaditas de Salmon Gatos 60g | 12 x Palitos Dentales 110g | 10 x Salmoncitos Perros 60g | 5 x Dispensador x 1 rollo Azul",
      "monto_usd": 243.22,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2853",
      "fecha_recibido": "2026-07-22",
      "fecha_cxc": "2026-07-23",
      "fecha_aprobado_cxc": "2026-07-23",
      "fecha_logistica": "2026-07-23",
      "fecha_entregado": "2026-07-23",
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 36,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 5,
          "descripcion": "Dispensador x 1 rollo Azul"
        }
      ]
    },
    {
      "numero": "1181",
      "fecha_pedido": "2026-07-22",
      "fecha_despacho": "2026-07-23",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "cod_cliente": "381",
      "rif": "J401583806",
      "vendedor": "Bryant Mennechey",
      "observaciones": "LOMAS DEL SOL - EL HATILLO",
      "cond_pago": "Credito 45 Dias",
      "productos": "40 x Bolsas de disposicion (5 Rollos) | 5 x Dispensador x 1 rollo Azul | 24 x Lamichi Pollo 4x15g | 60 x Lamichi Salmon 4x15g | 50 x Almohaditas de Salmon Gatos 60g | 72 x Palitos Dentales 110g | 80 x Salmoncitos Perros 60g",
      "monto_usd": 1014.25,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2852",
      "fecha_recibido": "2026-07-22",
      "fecha_cxc": "2026-07-23",
      "fecha_aprobado_cxc": "2026-07-23",
      "fecha_logistica": "2026-07-23",
      "fecha_entregado": "2026-07-23",
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 40,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 5,
          "descripcion": "Dispensador x 1 rollo Azul"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 60,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 50,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 72,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 80,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "M-002",
      "fecha_pedido": "2026-07-22",
      "fecha_despacho": "2026-07-23",
      "cliente": "GAMA",
      "cod_cliente": null,
      "rif": null,
      "vendedor": null,
      "observaciones": "N FACTURA 2837",
      "cond_pago": null,
      "productos": null,
      "monto_usd": 1049.49,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2837",
      "fecha_recibido": "2026-07-22",
      "fecha_cxc": "2026-07-22",
      "fecha_aprobado_cxc": "2026-07-22",
      "fecha_logistica": "2026-07-22",
      "fecha_entregado": "2026-07-23",
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": []
    },
    {
      "numero": "1171",
      "fecha_pedido": "2026-07-21",
      "fecha_despacho": "2026-07-23",
      "cliente": "PRO SERVICE INC, C.A.",
      "cod_cliente": "184",
      "rif": "J506303175",
      "vendedor": "CARACAS  MCBO",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "24 x Palitos Dentales 110g | 24 x Almohaditas de Salmon Gatos 60g | 12 x Lamichi Pollo 4x15g | 24 x Lamichi Salmon 4x15g",
      "monto_usd": 185.83,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2849",
      "fecha_recibido": "2026-07-21",
      "fecha_cxc": "2026-07-21",
      "fecha_aprobado_cxc": "2026-07-21",
      "fecha_logistica": "2026-07-22",
      "fecha_entregado": "2026-07-23",
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 24,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 24,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        }
      ]
    },
    {
      "numero": "1172",
      "fecha_pedido": "2026-07-21",
      "fecha_despacho": "2026-07-23",
      "cliente": "MASTERS DOG S AV. RoMULO GALLEGOS, C.A",
      "cod_cliente": "335",
      "rif": "J507130894",
      "vendedor": "Ivan Desantiago",
      "observaciones": null,
      "cond_pago": "Contado",
      "productos": "100 x Almohaditas de Salmon Gatos 60g | 10 x Tocineticas Perros 600g",
      "monto_usd": 363.4,
      "almacen": null,
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2839",
      "nro_factura": null,
      "fecha_recibido": "2026-07-21",
      "fecha_cxc": "2026-07-22",
      "fecha_aprobado_cxc": "2026-07-22",
      "fecha_logistica": "2026-07-22",
      "fecha_entregado": "2026-07-23",
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 100,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 10,
          "descripcion": "Tocineticas Perros 600g"
        }
      ]
    },
    {
      "numero": "1156",
      "fecha_pedido": "2026-07-17",
      "fecha_despacho": "2026-07-23",
      "cliente": "REINO DE MASCOTAS C.A.",
      "cod_cliente": "167",
      "rif": "J297364501",
      "vendedor": "Brayan Carpio",
      "observaciones": "No despachar antes de las 9am, pedido para el 23/07/2026",
      "cond_pago": "Credito 7 Dias",
      "productos": "4 x Grow Little One 2kg | 12 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g",
      "monto_usd": 160.4,
      "almacen": null,
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2828",
      "nro_factura": null,
      "fecha_recibido": "2026-07-17",
      "fecha_cxc": "2026-07-17",
      "fecha_aprobado_cxc": "2026-07-17",
      "fecha_logistica": "2026-07-17",
      "fecha_entregado": "2026-07-23",
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 4,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "1175",
      "fecha_pedido": "2026-07-22",
      "fecha_despacho": "2026-07-27",
      "cliente": "UNIMASCOTAS DEL PARAISO, C.A.",
      "cod_cliente": "49",
      "rif": "J311209778",
      "vendedor": "Ivan Desantiago",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "3 x Eager to Meat 6kg | 3 x Grow Little One 6kg | 12 x Bolsas de disposicion (5 Rollos) | 20 x Almohaditas de Salmon Gatos 60g | 12 x Palitos Dentales 110g | 20 x Salmoncitos Perros 60g | 3 x Tocineticas Perros 600g",
      "monto_usd": 446.28,
      "almacen": null,
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2843",
      "nro_factura": null,
      "fecha_recibido": "2026-07-22",
      "fecha_cxc": "2026-07-22",
      "fecha_aprobado_cxc": "2026-07-22",
      "fecha_logistica": "2026-07-22",
      "fecha_entregado": "2026-07-23",
      "fecha_en_ruta": "2026-07-23",
      "origen": "activo",
      "renglones": [
        {
          "cantidad": 3,
          "descripcion": "Eager to Meat 6kg"
        },
        {
          "cantidad": 3,
          "descripcion": "Grow Little One 6kg"
        },
        {
          "cantidad": 12,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 3,
          "descripcion": "Tocineticas Perros 600g"
        }
      ]
    },
    {
      "numero": "2824",
      "fecha_pedido": "2026-07-20",
      "fecha_despacho": null,
      "cliente": "CENTRAL MADEIRENSE",
      "cod_cliente": null,
      "rif": null,
      "vendedor": null,
      "observaciones": null,
      "cond_pago": null,
      "productos": null,
      "monto_usd": null,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-20",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-20",
      "fecha_entregado": "2026-07-20",
      "fecha_en_ruta": "2026-07-20",
      "origen": "activo",
      "renglones": []
    },
    {
      "numero": "999",
      "fecha_pedido": "2026-06-20",
      "fecha_despacho": "2026-06-22",
      "cliente": "AGRO AVICOLA EL BARBECHO C.A",
      "cod_cliente": "280",
      "rif": "J312487666",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Contado",
      "productos": "24 x Lamichi Salmon 4x15g | 24 x Lamichi Pollo 4x15g | 4 x Tocineticas Perros 600g | 10 x Almohaditas de Salmon Gatos 60g",
      "monto_usd": 203,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2720",
      "nro_factura": ",",
      "fecha_recibido": "2026-06-20",
      "fecha_cxc": "2026-06-22",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": null,
      "fecha_entregado": "2026-06-23",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 4,
          "descripcion": "Tocineticas Perros 600g"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        }
      ]
    },
    {
      "numero": "1000",
      "fecha_pedido": "2026-06-20",
      "fecha_despacho": "2026-06-23",
      "cliente": "AVICOLA DORTA, C.A",
      "cod_cliente": "317",
      "rif": "J300330010",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Contado",
      "productos": "24 x Palitos Dentales 110g",
      "monto_usd": 100.56,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2719",
      "nro_factura": ",",
      "fecha_recibido": "2026-06-20",
      "fecha_cxc": "2026-06-22",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": null,
      "fecha_entregado": "2026-06-23",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 24,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "1002",
      "fecha_pedido": "2026-06-22",
      "fecha_despacho": "2026-06-24",
      "cliente": "AVICOLA PETARE, C.A.",
      "cod_cliente": "42",
      "rif": "J000685770",
      "vendedor": "Ivan Desantiago",
      "observaciones": null,
      "cond_pago": "Credito 15 Dias",
      "productos": "7 x Grow Little One 2kg | 30 x Almohaditas de Salmon Gatos 60g | 48 x Lamichi Salmon 4x15g | 24 x Lamichi Pollo 4x15g | 34 x Palitos Dentales 110g",
      "monto_usd": 431.6,
      "almacen": "2",
      "lista_precios": "LISTA EFECTIVO O",
      "estado": "Entregado",
      "nro_nota": "2721",
      "nro_factura": ",",
      "fecha_recibido": "2026-06-22",
      "fecha_cxc": "2026-06-22",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": null,
      "fecha_entregado": "2026-06-23",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 7,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 30,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 48,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 34,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "1006",
      "fecha_pedido": "2026-06-22",
      "fecha_despacho": "2026-06-24",
      "cliente": "UNIMASCOTAS LOS PALOS GRANDES C.A.",
      "cod_cliente": "29",
      "rif": "J501929882",
      "vendedor": "Ivan Desantiago",
      "observaciones": null,
      "cond_pago": "Credito 10 Dias",
      "productos": "72 x Bolsas de disposicion (5 Rollos)",
      "monto_usd": 208.8,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": "2723",
      "nro_factura": ",",
      "fecha_recibido": "2026-06-22",
      "fecha_cxc": "2026-06-23",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-06-23",
      "fecha_entregado": "2026-06-23",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 72,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        }
      ]
    },
    {
      "numero": "1003",
      "fecha_pedido": "2026-06-22",
      "fecha_despacho": "2026-06-23",
      "cliente": "MUNDO DE LA FAUNA 2005,C.A",
      "cod_cliente": "240",
      "rif": "J313298344",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "10 x Almohaditas de Salmon Gatos 60g | 24 x Lamichi Pollo 4x15g | 12 x Lamichi Salmon 4x15g | 6 x Palitos Dentales 110g",
      "monto_usd": 167.9,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-06-22",
      "fecha_cxc": "2026-06-22",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-06-23",
      "fecha_entregado": "2026-06-23",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 6,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "1005",
      "fecha_pedido": "2026-06-22",
      "fecha_despacho": "2026-06-24",
      "cliente": "AGRO-FINCA DON FERNANDO C.A.",
      "cod_cliente": "31",
      "rif": "J502132490",
      "vendedor": "Ivan Desantiago",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "40 x Almohaditas de Salmon Gatos 60g | 48 x Lamichi Salmon 4x15g | 48 x Lamichi Pollo 4x15g",
      "monto_usd": 353.6,
      "almacen": "2",
      "lista_precios": "LISTA VIP BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2722",
      "nro_factura": ",",
      "fecha_recibido": "2026-06-22",
      "fecha_cxc": "2026-06-23",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-06-23",
      "fecha_entregado": "2026-06-30",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 40,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 48,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 48,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "FACT",
      "fecha_pedido": "2026-06-23",
      "fecha_despacho": "2026-06-23",
      "cliente": "EXCELSIOR GAMA SUPERMERCADOS, C.A",
      "cod_cliente": "137",
      "rif": "J301420608",
      "vendedor": "Supermercados",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "Palitos Dentales, Salmoncitos, Almohaditas, Lamichi Salmon, Lamichi Pollo, Bolsas x 5, Dispensador",
      "monto_usd": 836.83,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-06-23",
      "fecha_cxc": "2026-06-23",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-06-23",
      "fecha_entregado": "2026-06-30",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": null,
          "descripcion": "5, Dispensador"
        }
      ]
    },
    {
      "numero": "1023",
      "fecha_pedido": "2026-06-30",
      "fecha_despacho": "2026-07-02",
      "cliente": "AUTOMERCADO SANTA ROSA DE LIMA, C.A.",
      "cod_cliente": "323",
      "rif": "J002099712",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 21 Dias",
      "productos": "24 x Palitos Dentales 110g",
      "monto_usd": 125.28,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-06-30",
      "fecha_cxc": "2026-06-30",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-06-30",
      "fecha_entregado": "2026-07-01",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 24,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "1021",
      "fecha_pedido": "2026-06-30",
      "fecha_despacho": "2026-07-02",
      "cliente": "UNIMASCOTAS CHACAO, C.A.",
      "cod_cliente": "333",
      "rif": "J507668860",
      "vendedor": "Ivan Desantiago",
      "observaciones": null,
      "cond_pago": "Credito 15 Dias",
      "productos": "3 x Grow Little One 6kg | 3 x Tocineticas Perros 600g",
      "monto_usd": 170.19,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2736",
      "nro_factura": null,
      "fecha_recibido": "2026-06-30",
      "fecha_cxc": "2026-06-30",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-06-30",
      "fecha_entregado": "2026-07-01",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 3,
          "descripcion": "Grow Little One 6kg"
        },
        {
          "cantidad": 3,
          "descripcion": "Tocineticas Perros 600g"
        }
      ]
    },
    {
      "numero": "1029",
      "fecha_pedido": "2026-06-30",
      "fecha_despacho": "2026-07-02",
      "cliente": "AUTOMERCADO LA MURALLA C.A.",
      "cod_cliente": "136",
      "rif": "J003720224",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 3 Dias",
      "productos": "100 x Almohaditas de Salmon Gatos 60g | 60 x Lamichi Pollo 4x15g | 180 x Lamichi Salmon 4x15g | 72 x Bolsas de disposicion (5 Rollos) | 54 x Palitos Dentales 110g",
      "monto_usd": 1727.94,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2753",
      "fecha_recibido": "2026-06-30",
      "fecha_cxc": "2026-06-30",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-01",
      "fecha_entregado": "2026-07-01",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 100,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 60,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 180,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 72,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 54,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "1019",
      "fecha_pedido": "2026-06-29",
      "fecha_despacho": "2026-07-01",
      "cliente": "CONSINTIENDO A TU MASCOTA 2007, C.A.",
      "cod_cliente": "376",
      "rif": "J294908829",
      "vendedor": "Ivan Desantiago",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "6 x Eager to Meat 11,4kg | 36 x Lamichi Salmon 4x15g | 36 x Lamichi Pollo 4x15g",
      "monto_usd": 817.2,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2734",
      "nro_factura": null,
      "fecha_recibido": "2026-06-29",
      "fecha_cxc": "2026-06-30",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-06-30",
      "fecha_entregado": "2026-07-01",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 6,
          "descripcion": "Eager to Meat 11,4kg"
        },
        {
          "cantidad": 36,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 36,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "1020",
      "fecha_pedido": "2026-06-30",
      "fecha_despacho": "2026-06-30",
      "cliente": "POSITIVO PETS SHOP, C.A",
      "cod_cliente": "297",
      "rif": "J506657341",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "24 x Lamichi Salmon 4x15g | 24 x Lamichi Pollo 4x15g | 10 x Salmoncitos Perros 60g | 3 x Tocineticas Perros 600g",
      "monto_usd": 189.95,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2733",
      "nro_factura": null,
      "fecha_recibido": "2026-06-30",
      "fecha_cxc": "2026-06-30",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-06-30",
      "fecha_entregado": "2026-07-01",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 3,
          "descripcion": "Tocineticas Perros 600g"
        }
      ]
    },
    {
      "numero": "1010",
      "fecha_pedido": "2026-06-23",
      "fecha_despacho": "2026-06-29",
      "cliente": "EMPRENDIMIENTO JOSEARIANGEL NAVARRO",
      "cod_cliente": "370",
      "rif": "J507663930",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "18 x Palitos Dentales 110g | 10 x Almohaditas de Salmon Gatos 60g",
      "monto_usd": 101.42,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2728",
      "nro_factura": null,
      "fecha_recibido": "2026-06-23",
      "fecha_cxc": "2026-06-23",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-06-30",
      "fecha_entregado": "2026-07-01",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 18,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        }
      ]
    },
    {
      "numero": "998",
      "fecha_pedido": "2026-06-19",
      "fecha_despacho": "2026-06-25",
      "cliente": "PET FOOD M.&AMP; H. 2024,C.A.",
      "cod_cliente": "25",
      "rif": "J500880405",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Contado",
      "productos": "24 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g | 6 x Palitos Dentales 110g",
      "monto_usd": 118.74,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2718",
      "nro_factura": ",",
      "fecha_recibido": "2026-06-19",
      "fecha_cxc": "2026-06-19",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": null,
      "fecha_entregado": "2026-07-01",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 6,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "1009",
      "fecha_pedido": "2026-06-23",
      "fecha_despacho": "2026-06-25",
      "cliente": "EMPRENDIMNIENTO BRAYAN PARADA",
      "cod_cliente": "199",
      "rif": "J506572656",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "3 x Grow Little One 2kg | 2 x Grow Little One 6kg",
      "monto_usd": 203.5,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2729",
      "nro_factura": ",",
      "fecha_recibido": "2026-06-23",
      "fecha_cxc": "2026-06-23",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-06-30",
      "fecha_entregado": "2026-07-01",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 3,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 2,
          "descripcion": "Grow Little One 6kg"
        }
      ]
    },
    {
      "numero": "1007",
      "fecha_pedido": "2026-06-23",
      "fecha_despacho": "2026-06-25",
      "cliente": "EL PARAISO DE LAS MASCOTAS 20, C.A.",
      "cod_cliente": "61",
      "rif": "J500813589",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Contado",
      "productos": "3 x Eager to Meat 2kg | 12 x Palitos Dentales 110g | 20 x Salmoncitos Perros 60g",
      "monto_usd": 175.78,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2727",
      "nro_factura": ",",
      "fecha_recibido": "2026-06-23",
      "fecha_cxc": "2026-06-23",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-06-30",
      "fecha_entregado": "2026-07-01",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 3,
          "descripcion": "Eager to Meat 2kg"
        },
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "1004",
      "fecha_pedido": "2026-06-22",
      "fecha_despacho": "2026-06-24",
      "cliente": "AUTOMERCADO SANTA ROSA DE LIMA, C.A.",
      "cod_cliente": "323",
      "rif": "J002099712",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 21 Dias",
      "productos": "20 x Salmoncitos Perros 60g | 24 x Lamichi Salmon 4x15g",
      "monto_usd": 155.67,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-06-22",
      "fecha_cxc": "2026-06-22",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-06-23",
      "fecha_entregado": "2026-07-01",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        }
      ]
    },
    {
      "numero": "997",
      "fecha_pedido": "2026-06-19",
      "fecha_despacho": "2026-06-22",
      "cliente": "TIENDA DE ANIMALES PATA-PATA, C.A.",
      "cod_cliente": "47",
      "rif": "J309726277",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Contado",
      "productos": "12 x Palitos Dentales 110g | 24 x Lamichi Pollo 4x15g",
      "monto_usd": 130.71,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": ",",
      "nro_factura": "2724",
      "fecha_recibido": "2026-06-19",
      "fecha_cxc": "2026-06-19",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-01",
      "fecha_entregado": "2026-07-01",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "1022",
      "fecha_pedido": "2026-06-30",
      "fecha_despacho": "2026-07-02",
      "cliente": "COMERCIALIZADORA NUTRIPET C.A.",
      "cod_cliente": "327",
      "rif": "J506486547",
      "vendedor": "Ivan Desantiago",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "10 x Salmoncitos Perros 60g | 2 x Tocineticas Perros 600g | 20 x Almohaditas de Salmon Gatos 60g",
      "monto_usd": 104.1,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2732",
      "nro_factura": null,
      "fecha_recibido": "2026-06-30",
      "fecha_cxc": "2026-06-30",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-06-30",
      "fecha_entregado": "2026-07-02",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 2,
          "descripcion": "Tocineticas Perros 600g"
        },
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        }
      ]
    },
    {
      "numero": "1030",
      "fecha_pedido": "2026-06-30",
      "fecha_despacho": "2026-07-02",
      "cliente": "FRUTERIA LOS POMELOS C.A",
      "cod_cliente": "337",
      "rif": "J307053720",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 21 Dias",
      "productos": "24 x Lamichi Pollo 4x15g | 24 x Lamichi Salmon 4x15g | 10 x Almohaditas de Salmon Gatos 60g",
      "monto_usd": 205.2,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2755",
      "fecha_recibido": "2026-06-30",
      "fecha_cxc": "2026-07-01",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-01",
      "fecha_entregado": "2026-07-02",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        }
      ]
    },
    {
      "numero": "1018",
      "fecha_pedido": "2026-06-29",
      "fecha_despacho": "2026-07-01",
      "cliente": "TIENDAS PETSMANIA, C.A.",
      "cod_cliente": "338",
      "rif": "J507749657",
      "vendedor": "Ivan Desantiago",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "2 x Grow Little One 2kg | 2 x Eager to Meat 6kg | 12 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g",
      "monto_usd": 241.4,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2735",
      "nro_factura": null,
      "fecha_recibido": "2026-06-29",
      "fecha_cxc": "2026-06-30",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-06-30",
      "fecha_entregado": "2026-07-02",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 2,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 2,
          "descripcion": "Eager to Meat 6kg"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "1028",
      "fecha_pedido": "2026-06-30",
      "fecha_despacho": "2026-07-01",
      "cliente": "COMERCIAL J.A.T.U 69-70, C.A.",
      "cod_cliente": "345",
      "rif": "J315140829",
      "vendedor": "Brayan Carpio",
      "observaciones": "si podia llegar hoy mucho mejor pero no pasa nada que",
      "cond_pago": "Credito 7 Dias",
      "productos": "1 x Grow Little One 6kg | 24 x Lamichi Salmon 4x15g | 24 x Lamichi Pollo 4x15g | 10 x Almohaditas de Salmon Gatos 60g | 10 x Salmoncitos Perros 60g | 2 x Grow Little One 2kg",
      "monto_usd": 290.8,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2742",
      "nro_factura": null,
      "fecha_recibido": "2026-06-30",
      "fecha_cxc": "2026-06-30",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-01",
      "fecha_entregado": "2026-07-02",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 1,
          "descripcion": "Grow Little One 6kg"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 2,
          "descripcion": "Grow Little One 2kg"
        }
      ]
    },
    {
      "numero": "1008",
      "fecha_pedido": "2026-06-23",
      "fecha_despacho": "2026-06-25",
      "cliente": "MOLINERO PETS, C.A.",
      "cod_cliente": "354",
      "rif": "J507811832",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "30 x Almohaditas de Salmon Gatos 60g | 10 x Salmoncitos Perros 60g | 1 x Tocineticas Perros 600g",
      "monto_usd": 117.05,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2741",
      "nro_factura": null,
      "fecha_recibido": "2026-06-23",
      "fecha_cxc": "2026-06-23",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-01",
      "fecha_entregado": "2026-07-02",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 30,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 1,
          "descripcion": "Tocineticas Perros 600g"
        }
      ]
    },
    {
      "numero": "T572",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": null,
      "cliente": "GAMA EXPRESS LA URBINA",
      "cod_cliente": null,
      "rif": null,
      "vendedor": null,
      "observaciones": null,
      "cond_pago": null,
      "productos": null,
      "monto_usd": null,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-02",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": []
    },
    {
      "numero": "T571",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": null,
      "cliente": "GAMA SUCURSAL SANTA EDUVIGIS",
      "cod_cliente": null,
      "rif": null,
      "vendedor": null,
      "observaciones": null,
      "cond_pago": null,
      "productos": null,
      "monto_usd": null,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-02",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": []
    },
    {
      "numero": "T575",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": null,
      "cliente": "GAMA SUCURSAL LOS PALOS GRANDES",
      "cod_cliente": null,
      "rif": null,
      "vendedor": null,
      "observaciones": null,
      "cond_pago": null,
      "productos": null,
      "monto_usd": null,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-02",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": []
    },
    {
      "numero": "T577",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": null,
      "cliente": "GAMA EXPRESS LOS PALOS GRANDES",
      "cod_cliente": null,
      "rif": null,
      "vendedor": null,
      "observaciones": null,
      "cond_pago": null,
      "productos": null,
      "monto_usd": null,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-02",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": []
    },
    {
      "numero": "1051",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": "2026-07-09",
      "cliente": "DISTRIBUIDORA AGROPECUARIA JE, C.A.",
      "cod_cliente": "187",
      "rif": "J298454725",
      "vendedor": "Kenibel Escalona",
      "observaciones": null,
      "cond_pago": "Credito 15 Dias",
      "productos": "8 x Grow Little One 2kg | 3 x Eager to Meat 6kg",
      "monto_usd": 278.1,
      "almacen": "35",
      "lista_precios": "LISTA EFECTIVO V",
      "estado": "Entregado",
      "nro_nota": "2748",
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": "2026-07-02",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-02",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 8,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 3,
          "descripcion": "Eager to Meat 6kg"
        }
      ]
    },
    {
      "numero": "1056",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": "2026-07-04",
      "cliente": "ONEMARKET.VE1630,C.A.",
      "cod_cliente": "65",
      "rif": "J502218327",
      "vendedor": "Ivan Desantiago",
      "observaciones": null,
      "cond_pago": "Contado",
      "productos": "12 x Lamichi Salmon 4x15g",
      "monto_usd": 31.2,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2755",
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": "2026-07-03",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-03",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        }
      ]
    },
    {
      "numero": "1052",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": "2026-07-04",
      "cliente": "SUPERMERCADO AGROPECUARIO HERMANOS BOLIVAR,C.A",
      "cod_cliente": "82",
      "rif": "J298160586",
      "vendedor": "Kenibel Escalona",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "20 x Almohaditas de Salmon Gatos 60g | 24 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g | 12 x Palitos Dentales 110g | 20 x Salmoncitos Perros 60g | 3 x Bolsas de disposicion (5 Rollos)",
      "monto_usd": 259.25,
      "almacen": "35",
      "lista_precios": "LISTA BOLIVARES V",
      "estado": "Entregado",
      "nro_nota": "2747",
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": "2026-07-02",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-02",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 3,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        }
      ]
    },
    {
      "numero": "1038",
      "fecha_pedido": "2026-07-01",
      "fecha_despacho": "2026-07-03",
      "cliente": "MI NEGOCIO SUPERMERCADOS, C.A.",
      "cod_cliente": "318",
      "rif": "J008690480",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 21 Dias",
      "productos": "20 x Bolsas de disposicion (5 Rollos) | 30 x Almohaditas de Salmon Gatos 60g | 36 x Lamichi Pollo 4x15g | 36 x Lamichi Salmon 4x15g | 25 x Palitos Dentales 110g | 30 x Salmoncitos Perros 60g",
      "monto_usd": 655.8,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2762",
      "fecha_recibido": "2026-07-01",
      "fecha_cxc": "2026-07-02",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-02",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 20,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 30,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 36,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 36,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 25,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 30,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "1041",
      "fecha_pedido": "2026-07-01",
      "fecha_despacho": "2026-07-03",
      "cliente": "HIPERMERCADO PARAMO, C.A.",
      "cod_cliente": "139",
      "rif": "J503848049",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 21 Dias",
      "productos": "15 x Bolsas de disposicion (5 Rollos) | 50 x Almohaditas de Salmon Gatos 60g | 60 x Lamichi Pollo 4x15g | 60 x Lamichi Salmon 4x15g | 32 x Palitos Dentales 110g | 50 x Salmoncitos Perros 60g",
      "monto_usd": 852.6,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2765",
      "fecha_recibido": "2026-07-01",
      "fecha_cxc": "2026-07-01",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-02",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 15,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 50,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 60,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 60,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 32,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 50,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "1058",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": "2026-07-03",
      "cliente": "PATA PATA ANIMAL MARKET., C.A.",
      "cod_cliente": "74",
      "rif": "J504989533",
      "vendedor": "Brayan Carpio",
      "observaciones": "por fa que llegue mañana muchas gracias",
      "cond_pago": "Credito 7 Dias",
      "productos": "12 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g | 6 x Palitos Dentales 110g | 5 x Bolsas de disposicion (5 Rollos)",
      "monto_usd": 106.49,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2754",
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": "2026-07-03",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-03",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 6,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 5,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        }
      ]
    },
    {
      "numero": "1033",
      "fecha_pedido": "2026-07-01",
      "fecha_despacho": "2026-07-03",
      "cliente": "MAXI MERCADO PARAPARAL, C.A",
      "cod_cliente": "389",
      "rif": "J506693712",
      "vendedor": "Kenibel Escalona",
      "observaciones": null,
      "cond_pago": "Credito 21 Dias",
      "productos": "48 x Lamichi Salmon 4x15g | 18 x Palitos Dentales 110g | 2 x Dispensador x 1 rollo Rosa | 4 x Dispensador x 1 rollo Baby Blue | 30 x Salmoncitos Perros 60g",
      "monto_usd": 402.75,
      "almacen": "35",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2754",
      "fecha_recibido": "2026-07-01",
      "fecha_cxc": "2026-07-01",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-01",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 48,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 18,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 2,
          "descripcion": "Dispensador x 1 rollo Rosa"
        },
        {
          "cantidad": 4,
          "descripcion": "Dispensador x 1 rollo Baby Blue"
        },
        {
          "cantidad": 30,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "1036",
      "fecha_pedido": "2026-07-01",
      "fecha_despacho": "2026-07-03",
      "cliente": "PETS PLANET VALENCIA, C.A",
      "cod_cliente": "91",
      "rif": "J500325029",
      "vendedor": "Kenibel Escalona",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "30 x Almohaditas de Salmon Gatos 60g | 48 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g | 18 x Palitos Dentales 110g | 10 x Salmoncitos Perros 60g",
      "monto_usd": 251.02,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2757",
      "fecha_recibido": "2026-07-01",
      "fecha_cxc": "2026-07-01",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-01",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 30,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 48,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 18,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "1037",
      "fecha_pedido": "2026-07-01",
      "fecha_despacho": "2026-07-03",
      "cliente": "PETS MALL, C.A.",
      "cod_cliente": "81",
      "rif": "J295551509",
      "vendedor": "Kenibel Escalona",
      "observaciones": "incluír 24 und happy 2kg / 04 und happy 6kg / 01 und happy",
      "cond_pago": "Credito 15 Dias",
      "productos": "1 x Eager to Meat 11,4kg | 4 x Eager to Meat 6kg | 4 x Grow Little One 6kg | 20 x Almohaditas de Salmon Gatos 60g | 12 x Palitos Dentales 110g | 20 x Salmoncitos Perros 60g | 6 x Bolsas de disposicion (5 Rollos) | 3 x Dispensador x 1 rollo Azul | 3 x Dispensador x 1 rollo Baby Blue",
      "monto_usd": 591.2,
      "almacen": "35",
      "lista_precios": "LISTA EFECTIVO V",
      "estado": "Entregado",
      "nro_nota": "2746",
      "nro_factura": null,
      "fecha_recibido": "2026-07-01",
      "fecha_cxc": "2026-07-02",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-02",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 1,
          "descripcion": "Eager to Meat 11,4kg"
        },
        {
          "cantidad": 4,
          "descripcion": "Eager to Meat 6kg"
        },
        {
          "cantidad": 4,
          "descripcion": "Grow Little One 6kg"
        },
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 6,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 3,
          "descripcion": "Dispensador x 1 rollo Azul"
        },
        {
          "cantidad": 3,
          "descripcion": "Dispensador x 1 rollo Baby Blue"
        }
      ]
    },
    {
      "numero": "1042",
      "fecha_pedido": "2026-07-01",
      "fecha_despacho": "2026-07-03",
      "cliente": "UNIMASCOTAS LOS PALOS GRANDES C.A.",
      "cod_cliente": "29",
      "rif": "J501929882",
      "vendedor": "Ivan Desantiago",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "7 x Grow Little One 2kg | 4 x Eager to Meat 6kg | 4 x Eager to Meat 11,4kg",
      "monto_usd": 585.49,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": "2749",
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": "2026-07-02",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-02",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 7,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 4,
          "descripcion": "Eager to Meat 6kg"
        },
        {
          "cantidad": 4,
          "descripcion": "Eager to Meat 11,4kg"
        }
      ]
    },
    {
      "numero": "1039D",
      "fecha_pedido": "2026-07-01",
      "fecha_despacho": "2026-07-02",
      "cliente": "PLAN SUAREZ - URBINA",
      "cod_cliente": null,
      "rif": null,
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Contado",
      "productos": null,
      "monto_usd": 474.5,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2758",
      "fecha_recibido": "2026-07-01",
      "fecha_cxc": "2026-07-01",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-02",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": []
    },
    {
      "numero": "1032",
      "fecha_pedido": "2026-07-01",
      "fecha_despacho": "2026-07-02",
      "cliente": "MICHELANGELO AGNELLO GIARRATANA",
      "cod_cliente": "113",
      "rif": "V096436919",
      "vendedor": "Kenibel Escalona",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "3 x Grow 2kg //  5 x Eager 6kg",
      "monto_usd": 280.6,
      "almacen": "35",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": "2738",
      "nro_factura": null,
      "fecha_recibido": "2026-07-01",
      "fecha_cxc": "2026-07-01",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-01",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 3,
          "descripcion": "Grow 2kg //  5 x Eager 6kg"
        }
      ]
    },
    {
      "numero": "1024",
      "fecha_pedido": "2026-06-30",
      "fecha_despacho": "2026-07-02",
      "cliente": "UNIMASCOTAS DEL PARAISO, C.A.",
      "cod_cliente": "49",
      "rif": "J311209778",
      "vendedor": "Ivan Desantiago",
      "observaciones": null,
      "cond_pago": "Credito 10 Dias",
      "productos": "3 x Grow Little One 6kg | 3 x Eager to Meat 6kg | 20 x Almohaditas de Salmon Gatos 60g | 24 x Lamichi Salmon 4x15g | 24 x Lamichi Pollo 4x15g",
      "monto_usd": 394.68,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": "2739",
      "nro_factura": null,
      "fecha_recibido": "2026-06-30",
      "fecha_cxc": "2026-06-30",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-01",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 3,
          "descripcion": "Grow Little One 6kg"
        },
        {
          "cantidad": 3,
          "descripcion": "Eager to Meat 6kg"
        },
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "1039b",
      "fecha_pedido": "2026-07-01",
      "fecha_despacho": "2026-07-02",
      "cliente": "PLAN SUAREZ - CAURIMARE",
      "cod_cliente": null,
      "rif": null,
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Contado",
      "productos": null,
      "monto_usd": 474.5,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2759",
      "fecha_recibido": "2026-07-01",
      "fecha_cxc": "2026-07-01",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-02",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": []
    },
    {
      "numero": "1039a",
      "fecha_pedido": "2026-07-01",
      "fecha_despacho": "2026-07-02",
      "cliente": "PLAN SUAREZ - TRINIDAD",
      "cod_cliente": null,
      "rif": null,
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Contado",
      "productos": null,
      "monto_usd": 474.5,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2760",
      "fecha_recibido": "2026-07-01",
      "fecha_cxc": "2026-07-01",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-02",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": []
    },
    {
      "numero": "1039C",
      "fecha_pedido": "2026-07-01",
      "fecha_despacho": "2026-07-02",
      "cliente": "PLAN SUAREZ - SANTA MONICA",
      "cod_cliente": null,
      "rif": null,
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Contado",
      "productos": null,
      "monto_usd": 972.8,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2761",
      "fecha_recibido": "2026-07-01",
      "fecha_cxc": "2026-07-01",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-02",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": []
    },
    {
      "numero": "1017",
      "fecha_pedido": "2026-06-29",
      "fecha_despacho": "2026-07-01",
      "cliente": "PATITAS AGROMARKET, COMPANIA ANONIMA",
      "cod_cliente": "119",
      "rif": "J413013088",
      "vendedor": "CARACAS  MCBO",
      "observaciones": null,
      "cond_pago": "Credito 10 Dias",
      "productos": "7 x Grow Little One 2kg | 3 x Eager to Meat 6kg | 2 x Eager to Meat 11,4kg | 12 x Lamichi Salmon 4x15g | 6 x Bolsas de disposicion (5 Rollos) | 3 x Dispensador x 1 rollo Azul | 3 x Dispensador x 1 rollo Baby Blue",
      "monto_usd": 589.34,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES V",
      "estado": "Entregado",
      "nro_nota": "2724",
      "nro_factura": null,
      "fecha_recibido": "2026-06-29",
      "fecha_cxc": "2026-06-29",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-06-30",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 7,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 3,
          "descripcion": "Eager to Meat 6kg"
        },
        {
          "cantidad": 2,
          "descripcion": "Eager to Meat 11,4kg"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 6,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 3,
          "descripcion": "Dispensador x 1 rollo Azul"
        },
        {
          "cantidad": 3,
          "descripcion": "Dispensador x 1 rollo Baby Blue"
        }
      ]
    },
    {
      "numero": "1015",
      "fecha_pedido": "2026-06-29",
      "fecha_despacho": "2026-07-01",
      "cliente": "BIG DOG MCBO, C.A.",
      "cod_cliente": "122",
      "rif": "J501975280",
      "vendedor": "CARACAS  MCBO",
      "observaciones": null,
      "cond_pago": "PREPAGADO",
      "productos": "7 x Grow Little One 2kg | 3 x Grow Little One 6kg | 2 x Eager to Meat 2kg | 3 x Eager to Meat 6kg | 6 x Palitos Dentales 110g | 10 x Almohaditas de Salmon Gatos 60g | 12 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g | 5 x Bolsas de disposicion (5 Rollos) | 10 x Salmoncitos Perros 60g",
      "monto_usd": 551.8,
      "almacen": "2",
      "lista_precios": "LISTA EFECTIVO O",
      "estado": "Entregado",
      "nro_nota": "2725",
      "nro_factura": null,
      "fecha_recibido": "2026-06-29",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-06-30",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 7,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 3,
          "descripcion": "Grow Little One 6kg"
        },
        {
          "cantidad": 2,
          "descripcion": "Eager to Meat 2kg"
        },
        {
          "cantidad": 3,
          "descripcion": "Eager to Meat 6kg"
        },
        {
          "cantidad": 6,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 5,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "1016",
      "fecha_pedido": "2026-06-29",
      "fecha_despacho": "2026-07-01",
      "cliente": "MUNDO MASCOTAS, C.A.",
      "cod_cliente": "126",
      "rif": "J503338881",
      "vendedor": "CARACAS  MCBO",
      "observaciones": null,
      "cond_pago": "PREPAGADO",
      "productos": "1 x Grow Little One 2kg | 1 x Grow Little One 6kg | 3 x Eager to Meat 6kg | 5 x Eager to Meat 11,4kg",
      "monto_usd": 579.7,
      "almacen": "2",
      "lista_precios": "LISTA EFECTIVO O",
      "estado": "Entregado",
      "nro_nota": "2726",
      "nro_factura": null,
      "fecha_recibido": "2026-06-29",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-06-30",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 1,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 1,
          "descripcion": "Grow Little One 6kg"
        },
        {
          "cantidad": 3,
          "descripcion": "Eager to Meat 6kg"
        },
        {
          "cantidad": 5,
          "descripcion": "Eager to Meat 11,4kg"
        }
      ]
    },
    {
      "numero": "1031",
      "fecha_pedido": "2026-06-30",
      "fecha_despacho": "2026-07-01",
      "cliente": "AVICOLA HUELLAS Y BIGOTES C.A.",
      "cod_cliente": "276",
      "rif": "J508133820",
      "vendedor": "Brayan Carpio",
      "observaciones": "por fa este pedido que llegue mañana gracias ð«",
      "cond_pago": "Credito 7 Dias",
      "productos": "10 x Almohaditas de Salmon Gatos 60g | 24 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g",
      "monto_usd": 119.6,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2740",
      "nro_factura": null,
      "fecha_recibido": "2026-06-30",
      "fecha_cxc": "2026-07-01",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-01",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "1013",
      "fecha_pedido": "2026-06-25",
      "fecha_despacho": "2026-06-27",
      "cliente": "CENTRO VETERINARIO LOS COLORADOS, C.A.",
      "cod_cliente": "80",
      "rif": "J075594037",
      "vendedor": "Kenibel Escalona",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "12 x Bolsas de disposicion (5 Rollos) | 36 x Palitos Dentales 110g | 10 x Salmoncitos Perros 60g | 3 x Tocineticas Perros 600g",
      "monto_usd": 303.31,
      "almacen": "35",
      "lista_precios": "LISTA VIP BOLIVARES V",
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2749",
      "fecha_recibido": "2026-06-25",
      "fecha_cxc": "2026-06-30",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-06-30",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 12,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 36,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 3,
          "descripcion": "Tocineticas Perros 600g"
        }
      ]
    },
    {
      "numero": "1012",
      "fecha_pedido": "2026-06-24",
      "fecha_despacho": "2026-06-26",
      "cliente": "CENTRO CANINO EL OLIMPO DE LAS MASCOTAS, C.A",
      "cod_cliente": "262",
      "rif": "J505500341",
      "vendedor": "Kenibel Escalona",
      "observaciones": null,
      "cond_pago": "PREPAGADO",
      "productos": "20 x Almohaditas de Salmon Gatos 60g | 2 x Eager to Meat 2kg | 6 x Grow Little One 2kg",
      "monto_usd": 248,
      "almacen": "35",
      "lista_precios": "LISTA BOLIVARES V",
      "estado": "Entregado",
      "nro_nota": "2731",
      "nro_factura": null,
      "fecha_recibido": "2026-06-24",
      "fecha_cxc": "2026-06-30",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-06-30",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 2,
          "descripcion": "Eager to Meat 2kg"
        },
        {
          "cantidad": 6,
          "descripcion": "Grow Little One 2kg"
        }
      ]
    },
    {
      "numero": "1011",
      "fecha_pedido": "2026-06-23",
      "fecha_despacho": "2026-06-25",
      "cliente": "COMERCIALIZADORA RINCONCITO YC C.A.",
      "cod_cliente": "397",
      "rif": "J505148060",
      "vendedor": "Ivan Desantiago",
      "observaciones": null,
      "cond_pago": "Contado",
      "productos": "1 x Eager to Meat 6kg | 6 x Bolsas de disposicion (5 Rollos) | 3 x Dispensador x 1 rollo Azul | 3 x Dispensador x 1 rollo Baby Blue | 20 x Almohaditas de Salmon Gatos 60g | 24 x Lamichi Salmon 4x15g | 24 x Lamichi Pollo 4x15g | 6 x Palitos Dentales 110g | 20 x Salmoncitos Perros 60g | 1 x Tocineticas Perros 600g",
      "monto_usd": 377.47,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2743",
      "nro_factura": null,
      "fecha_recibido": "2026-06-23",
      "fecha_cxc": "2026-06-23",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-01",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 1,
          "descripcion": "Eager to Meat 6kg"
        },
        {
          "cantidad": 6,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 3,
          "descripcion": "Dispensador x 1 rollo Azul"
        },
        {
          "cantidad": 3,
          "descripcion": "Dispensador x 1 rollo Baby Blue"
        },
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 6,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 1,
          "descripcion": "Tocineticas Perros 600g"
        }
      ]
    },
    {
      "numero": "1014",
      "fecha_pedido": "2026-06-25",
      "fecha_despacho": "2026-06-25",
      "cliente": "LOCAL PETS, C.A",
      "cod_cliente": "248",
      "rif": "J507370569",
      "vendedor": "Kenibel Escalona",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "2 x Happy to Sea 11,4kg | 12 x Lamichi Salmon 4x15g | 10 x Almohaditas de Salmon Gatos 60g | 12 x Lamichi Pollo 4x15g | 10 x Salmoncitos Perros 60g | 12 x Palitos Dentales 110g",
      "monto_usd": 276.2,
      "almacen": "35",
      "lista_precios": "LISTA EFECTIVO V",
      "estado": "Entregado",
      "nro_nota": "2730",
      "nro_factura": null,
      "fecha_recibido": "2026-06-25",
      "fecha_cxc": "2026-06-30",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-06-30",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 2,
          "descripcion": "Happy to Sea 11,4kg"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "962",
      "fecha_pedido": "2026-06-15",
      "fecha_despacho": "2026-06-19",
      "cliente": "LUIS ALBERTO LOVERA VALECILLO",
      "cod_cliente": "368",
      "rif": "V063350873",
      "vendedor": "Brayan Carpio",
      "observaciones": "este pedido que no salga antes por favor",
      "cond_pago": "Contado",
      "productos": "12 x Lamichi Salmon 4x15g | 10 x Almohaditas de Salmon Gatos 60g | 12 x Lamichi Pollo 4x15g | 1 x Tocineticas Perros 600g",
      "monto_usd": 101.45,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-01",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-01",
      "fecha_entregado": "2026-07-03",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 1,
          "descripcion": "Tocineticas Perros 600g"
        }
      ]
    },
    {
      "numero": "T565",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": null,
      "cliente": "CENTRAL MADEIRENSE",
      "cod_cliente": null,
      "rif": null,
      "vendedor": null,
      "observaciones": null,
      "cond_pago": null,
      "productos": null,
      "monto_usd": null,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-06",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-02",
      "fecha_entregado": "2026-07-06",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": []
    },
    {
      "numero": "T574",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": null,
      "cliente": "GAMA EXPRESS SANTA MONICA",
      "cod_cliente": null,
      "rif": null,
      "vendedor": null,
      "observaciones": null,
      "cond_pago": null,
      "productos": null,
      "monto_usd": null,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-02",
      "fecha_entregado": "2026-07-06",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": []
    },
    {
      "numero": "T576",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": null,
      "cliente": "GAMA EXPRESS EL PARAISO",
      "cod_cliente": null,
      "rif": null,
      "vendedor": null,
      "observaciones": null,
      "cond_pago": null,
      "productos": null,
      "monto_usd": null,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-02",
      "fecha_entregado": "2026-07-06",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": []
    },
    {
      "numero": "T573",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": null,
      "cliente": "GAMA EXPRESS SANTA FE",
      "cod_cliente": null,
      "rif": null,
      "vendedor": null,
      "observaciones": null,
      "cond_pago": null,
      "productos": null,
      "monto_usd": null,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": null,
      "fecha_entregado": "2026-07-06",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": []
    },
    {
      "numero": "T578",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": null,
      "cliente": "GAMA SUCURSAL LA PANAMERICANA",
      "cod_cliente": null,
      "rif": null,
      "vendedor": null,
      "observaciones": null,
      "cond_pago": null,
      "productos": null,
      "monto_usd": null,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-02",
      "fecha_entregado": "2026-07-06",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": []
    },
    {
      "numero": "1044",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": "2026-07-13",
      "cliente": "INVERSIONES MM58 PETS, C.A.",
      "cod_cliente": "18",
      "rif": "J410693843",
      "vendedor": "CARACAS  MCBO",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "3 x Grow Little One 2kg | 3 x Grow Little One 6kg | 3 x Eager to Meat 6kg | 18 x Palitos Dentales 110g | 10 x Salmoncitos Perros 60g | 10 x Almohaditas de Salmon Gatos 60g | 12 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g",
      "monto_usd": 718.88,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": "2752",
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": "2026-07-02",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-03",
      "fecha_entregado": "2026-07-06",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 3,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 3,
          "descripcion": "Grow Little One 6kg"
        },
        {
          "cantidad": 3,
          "descripcion": "Eager to Meat 6kg"
        },
        {
          "cantidad": 18,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "1048",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": "2026-07-06",
      "cliente": "ARAMAX SHOP C.A.",
      "cod_cliente": "292",
      "rif": "J504843164",
      "vendedor": "CARACAS  MCBO",
      "observaciones": "EL HATILLO",
      "cond_pago": "Credito 7 Dias",
      "productos": "2 x Grow Little One 2kg | 3 x Grow Little One 6kg | 12 x Palitos Dentales 110g | 20 x Almohaditas de Salmon Gatos 60g | 12 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g | 6 x Bolsas de disposicion (5 Rollos)",
      "monto_usd": 480.96,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": "2760",
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": "2026-07-02",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-03",
      "fecha_entregado": "2026-07-06",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 2,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 3,
          "descripcion": "Grow Little One 6kg"
        },
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 6,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        }
      ]
    },
    {
      "numero": "1050",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": "2026-07-06",
      "cliente": "CORPORACION ARAS PET C.A.",
      "cod_cliente": "4",
      "rif": "J298785675",
      "vendedor": "CARACAS  MCBO",
      "observaciones": "BELLO MONTE",
      "cond_pago": "Credito 7 Dias",
      "productos": "4 x Grow Little One 6kg | 24 x Palitos Dentales 110g | 20 x Salmoncitos Perros 60g | 10 x Almohaditas de Salmon Gatos 60g | 48 x Lamichi Salmon 4x15g | 48 x Lamichi Pollo 4x15g | 6 x Bolsas de disposicion (5 Rollos)",
      "monto_usd": 798.66,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": "2762",
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": "2026-07-02",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-03",
      "fecha_entregado": "2026-07-06",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 4,
          "descripcion": "Grow Little One 6kg"
        },
        {
          "cantidad": 24,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 48,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 48,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 6,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        }
      ]
    },
    {
      "numero": "1040",
      "fecha_pedido": "2026-07-01",
      "fecha_despacho": "2026-07-03",
      "cliente": "HIPERMERCADO PARAMO, C.A.",
      "cod_cliente": "139",
      "rif": "J503848049",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 21 Dias",
      "productos": "32 x Bolsas de disposicion (5 Rollos) | 50 x Almohaditas de Salmon Gatos 60g | 60 x Lamichi Pollo 4x15g | 60 x Lamichi Salmon 4x15g | 54 x Palitos Dentales 110g | 50 x Salmoncitos Perros 60g",
      "monto_usd": 1015.32,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2764",
      "fecha_recibido": "2026-07-01",
      "fecha_cxc": "2026-07-01",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-02",
      "fecha_entregado": "2026-07-06",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 32,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 50,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 60,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 60,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 54,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 50,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "2775",
      "fecha_pedido": "2026-07-06",
      "fecha_despacho": null,
      "cliente": "CENTRAL MADEIRENSE",
      "cod_cliente": null,
      "rif": null,
      "vendedor": null,
      "observaciones": null,
      "cond_pago": null,
      "productos": null,
      "monto_usd": null,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-06",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-06",
      "fecha_entregado": "2026-07-07",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": []
    },
    {
      "numero": "2774",
      "fecha_pedido": "2026-07-07",
      "fecha_despacho": null,
      "cliente": "PLAN SUAREZ  - URBINA",
      "cod_cliente": null,
      "rif": null,
      "vendedor": null,
      "observaciones": null,
      "cond_pago": null,
      "productos": null,
      "monto_usd": null,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-07",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-07",
      "fecha_entregado": "2026-07-07",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": []
    },
    {
      "numero": "1068",
      "fecha_pedido": "2026-07-03",
      "fecha_despacho": "2026-07-08",
      "cliente": "INVERSIONES FANTASIA ANIMAL PET SHOP, C.A",
      "cod_cliente": "11",
      "rif": "J404113916",
      "vendedor": "Ivan Desantiago",
      "observaciones": "precio por bulto",
      "cond_pago": "Contado",
      "productos": "120 x Almohaditas de Salmon Gatos 60g | 120 x Salmoncitos Perros 60g",
      "monto_usd": 624,
      "almacen": "2",
      "lista_precios": "LISTA VIP BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2768",
      "nro_factura": null,
      "fecha_recibido": "2026-07-06",
      "fecha_cxc": "2026-07-06",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-06",
      "fecha_entregado": "2026-07-07",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 120,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 120,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "1073",
      "fecha_pedido": "2026-07-05",
      "fecha_despacho": "2026-07-08",
      "cliente": "INVERSIONES LA ESQUINA DEL DULCE, C.A.",
      "cod_cliente": "17",
      "rif": "J410215917",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Contado",
      "productos": "10 x Almohaditas de Salmon Gatos 60g | 12 x Palitos Dentales 110g | 4 x Bolsas de disposicion (5 Rollos) | 12 x Lamichi Salmon 4x15g",
      "monto_usd": 122.64,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2767",
      "nro_factura": null,
      "fecha_recibido": "2026-07-06",
      "fecha_cxc": "2026-07-06",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-06",
      "fecha_entregado": "2026-07-07",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 4,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        }
      ]
    },
    {
      "numero": "1069",
      "fecha_pedido": "2026-07-03",
      "fecha_despacho": "2026-07-08",
      "cliente": "HIPERMERCADO PETARE, C.A",
      "cod_cliente": "302",
      "rif": "J502908633",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 21 Dias",
      "productos": "60 x Lamichi Pollo 4x15g | 60 x Lamichi Salmon 4x15g",
      "monto_usd": 366,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": "2769",
      "nro_factura": null,
      "fecha_recibido": "2026-07-06",
      "fecha_cxc": "2026-07-06",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-06",
      "fecha_entregado": "2026-07-07",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 60,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 60,
          "descripcion": "Lamichi Salmon 4x15g"
        }
      ]
    },
    {
      "numero": "1059",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": "2026-07-07",
      "cliente": "AGROPECUARIA DISTRIBUIDORA EL TALISMAN, C.A.",
      "cod_cliente": "196",
      "rif": "J404127593",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "6 x Grow Little One 2kg | 3 x Eager to Meat 6kg | 3 x Eager to Meat 11,4kg",
      "monto_usd": 657,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2766",
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": "2026-07-03",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-06",
      "fecha_entregado": "2026-07-07",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 6,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 3,
          "descripcion": "Eager to Meat 6kg"
        },
        {
          "cantidad": 3,
          "descripcion": "Eager to Meat 11,4kg"
        }
      ]
    },
    {
      "numero": "1049",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": "2026-07-06",
      "cliente": "CORPORACION ARAS PET C.A.",
      "cod_cliente": "4",
      "rif": "J298785675",
      "vendedor": "CARACAS  MCBO",
      "observaciones": "LOS PALOS GRANDES",
      "cond_pago": "Credito 7 Dias",
      "productos": "4 x Grow Little One 2kg | 3 x Eager to Meat 6kg | 3 x Eager to Meat 11,4kg | 24 x Palitos Dentales 110g | 20 x Salmoncitos Perros 60g | 20 x Almohaditas de Salmon Gatos 60g | 48 x Lamichi Salmon 4x15g | 36 x Lamichi Pollo 4x15g | 6 x Bolsas de disposicion (5 Rollos)",
      "monto_usd": 181177,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": "2761",
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": "2026-07-02",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-03",
      "fecha_entregado": "2026-07-07",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 4,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 3,
          "descripcion": "Eager to Meat 6kg"
        },
        {
          "cantidad": 3,
          "descripcion": "Eager to Meat 11,4kg"
        },
        {
          "cantidad": 24,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 48,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 36,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 6,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        }
      ]
    },
    {
      "numero": "1046",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": "2026-07-06",
      "cliente": "MARAMAX PET C.A.",
      "cod_cliente": "210",
      "rif": "J506155206",
      "vendedor": "CARACAS  MCBO",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "8 x Grow Little One 2kg | 2 x Eager to Meat 6kg | 18 x Palitos Dentales 110g | 20 x Salmoncitos Perros 60g | 24 x Lamichi Salmon 4x15g | 6 x Bolsas de disposicion (5 Rollos)",
      "monto_usd": 611.74,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": "2757",
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": "2026-07-02",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-03",
      "fecha_entregado": "2026-07-07",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 8,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 2,
          "descripcion": "Eager to Meat 6kg"
        },
        {
          "cantidad": 18,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 6,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        }
      ]
    },
    {
      "numero": "1045",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": "2026-07-06",
      "cliente": "PETARAMA C.A.",
      "cod_cliente": "133",
      "rif": "J502670459",
      "vendedor": "CARACAS  MCBO",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "4 x Eager to Meat 6kg | 12 x Palitos Dentales 110g | 10 x Almohaditas de Salmon Gatos 60g | 12 x Bolsas de disposicion (5 Rollos)",
      "monto_usd": 378.84,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": "2753",
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": "2026-07-02",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-03",
      "fecha_entregado": "2026-07-07",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 4,
          "descripcion": "Eager to Meat 6kg"
        },
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        }
      ]
    },
    {
      "numero": "1043",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": "2026-07-06",
      "cliente": "INVERSIONES UNIKOPET C.A",
      "cod_cliente": "129",
      "rif": "J296412952",
      "vendedor": "CARACAS  MCBO",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "4 x Grow Little One 6kg | 5 x Eager to Meat 6kg | 18 x Palitos Dentales 110g | 10 x Salmoncitos Perros 60g | 10 x Almohaditas de Salmon Gatos 60g | 12 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g | 6 x Bolsas de disposicion (5 Rollos) | 1 x Dispensador x 1 rollo Azul | 1 x Dispensador x 1 rollo Baby Blue",
      "monto_usd": 875.5,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": "2751",
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": "2026-07-02",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-03",
      "fecha_entregado": "2026-07-07",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 4,
          "descripcion": "Grow Little One 6kg"
        },
        {
          "cantidad": 5,
          "descripcion": "Eager to Meat 6kg"
        },
        {
          "cantidad": 18,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 6,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 1,
          "descripcion": "Dispensador x 1 rollo Azul"
        },
        {
          "cantidad": 1,
          "descripcion": "Dispensador x 1 rollo Baby Blue"
        }
      ]
    },
    {
      "numero": "1064",
      "fecha_pedido": "2026-07-03",
      "fecha_despacho": "2026-07-06",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "cod_cliente": "381",
      "rif": "J401583806",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 45 Dias",
      "productos": "10 x Almohaditas de Salmon Gatos 60g | 24 x Lamichi Salmon 4x15g | 36 x Lamichi Pollo 4x15g | 5 x Dispensador x 1 rollo Azul | 12 x Palitos Dentales 110g",
      "monto_usd": 288.4,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2770",
      "fecha_recibido": "2026-07-03",
      "fecha_cxc": "2026-07-03",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-06",
      "fecha_entregado": "2026-07-07",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 36,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 5,
          "descripcion": "Dispensador x 1 rollo Azul"
        },
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "1062",
      "fecha_pedido": "2026-07-03",
      "fecha_despacho": "2026-07-06",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "cod_cliente": "381",
      "rif": "J401583806",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 45 Dias",
      "productos": "12 x Palitos Dentales 110g | 40 x Salmoncitos Perros 60g | 20 x Almohaditas de Salmon Gatos 60g | 48 x Lamichi Salmon 4x15g | 48 x Lamichi Pollo 4x15g",
      "monto_usd": 522.38,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2772",
      "fecha_recibido": "2026-07-03",
      "fecha_cxc": "2026-07-03",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-06",
      "fecha_entregado": "2026-07-07",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 40,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 48,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 48,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "1061",
      "fecha_pedido": "2026-07-03",
      "fecha_despacho": "2026-07-06",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "cod_cliente": "381",
      "rif": "J401583806",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 45 Dias",
      "productos": "60 x Palitos Dentales 110g | 60 x Salmoncitos Perros 60g | 60 x Almohaditas de Salmon Gatos 60g | 84 x Lamichi Salmon 4x15g | 60 x Lamichi Pollo 4x15g | 50 x Bolsas de disposicion (5 Rollos) | 5 x Dispensador x 1 rollo Azul | 5 x Dispensador x 1 rollo Baby Blue",
      "monto_usd": 1306.65,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2768",
      "fecha_recibido": "2026-07-03",
      "fecha_cxc": "2026-07-03",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-06",
      "fecha_entregado": "2026-07-07",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 60,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 60,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 60,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 84,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 60,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 50,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 5,
          "descripcion": "Dispensador x 1 rollo Azul"
        },
        {
          "cantidad": 5,
          "descripcion": "Dispensador x 1 rollo Baby Blue"
        }
      ]
    },
    {
      "numero": "1063",
      "fecha_pedido": "2026-07-03",
      "fecha_despacho": "2026-07-06",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "cod_cliente": "381",
      "rif": "J401583806",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 45 Dias",
      "productos": "12 x Palitos Dentales 110g | 20 x Salmoncitos Perros 60g | 20 x Almohaditas de Salmon Gatos 60g | 24 x Lamichi Salmon 4x15g | 24 x Lamichi Pollo 4x15g",
      "monto_usd": 373.98,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2771",
      "fecha_recibido": "2026-07-03",
      "fecha_cxc": "2026-07-03",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-06",
      "fecha_entregado": "2026-07-07",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "1057",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": "2026-07-04",
      "cliente": "AGROPECUARIA GUATIPEZ, C.A.",
      "cod_cliente": "347",
      "rif": "J314578782",
      "vendedor": "Ivan Desantiago",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "10 x Almohaditas de Salmon Gatos 60g | 12 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g | 12 x Palitos Dentales 110g | 10 x Salmoncitos Perros 60g | 1 x Tocineticas Perros 600g | 6 x Bolsas de disposicion (5 Rollos)",
      "monto_usd": 200.47,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2764",
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": "2026-07-03",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-06",
      "fecha_entregado": "2026-07-07",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 1,
          "descripcion": "Tocineticas Perros 600g"
        },
        {
          "cantidad": 6,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        }
      ]
    },
    {
      "numero": "1047",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": "2026-07-04",
      "cliente": "ARAMAX SHOP C.A.",
      "cod_cliente": "292",
      "rif": null,
      "vendedor": "CARACAS  MCBO",
      "observaciones": "SAMBIL CHACAO",
      "cond_pago": "Credito 7 Dias",
      "productos": "12 x Palitos Dentales 110g | 20 x Salmoncitos Perros 60g | 20 x Almohaditas de Salmon Gatos 60g | 12 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g",
      "monto_usd": 251.35,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": "2759",
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": "2026-07-02",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-03",
      "fecha_entregado": "2026-07-07",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "1055",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": "2026-07-04",
      "cliente": "4 PATITAS PETS SHOP, C.A.",
      "cod_cliente": "350",
      "rif": "J505259008",
      "vendedor": "Ivan Desantiago",
      "observaciones": null,
      "cond_pago": "Contado",
      "productos": "40 x Almohaditas de Salmon Gatos 60g | 48 x Lamichi Salmon 4x15g | 24 x Lamichi Pollo 4x15g | 20 x Salmoncitos Perros 60g | 4 x Tocineticas Perros 600g | 12 x Bolsas de disposicion (5 Rollos) | 3 x Dispensador x 1 rollo Azul | 3 x Dispensador x 1 rollo Baby Blue | 24 x Palitos Dentales 110g",
      "monto_usd": 564.18,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2756",
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": "2026-07-03",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-03",
      "fecha_entregado": "2026-07-07",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 40,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 48,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 4,
          "descripcion": "Tocineticas Perros 600g"
        },
        {
          "cantidad": 12,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 3,
          "descripcion": "Dispensador x 1 rollo Azul"
        },
        {
          "cantidad": 3,
          "descripcion": "Dispensador x 1 rollo Baby Blue"
        },
        {
          "cantidad": 24,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "2781",
      "fecha_pedido": "2026-07-07",
      "fecha_despacho": null,
      "cliente": "GAMA - SOLO FACTURA",
      "cod_cliente": null,
      "rif": null,
      "vendedor": null,
      "observaciones": null,
      "cond_pago": null,
      "productos": null,
      "monto_usd": null,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-07",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-07",
      "fecha_entregado": "2026-07-08",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": []
    },
    {
      "numero": "1079",
      "fecha_pedido": "2026-07-06",
      "fecha_despacho": "2026-07-08",
      "cliente": "AUTOMERCADO SANTA ROSA DE LIMA, C.A.",
      "cod_cliente": "323",
      "rif": "J002099712",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 21 Dias",
      "productos": "20 x Almohaditas de Salmon Gatos 60g | 24 x Lamichi Pollo 4x15g | 12 x Bolsas de disposicion (5 Rollos)",
      "monto_usd": 211.35,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2780",
      "fecha_recibido": "2026-07-06",
      "fecha_cxc": "2026-07-06",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-07",
      "fecha_entregado": "2026-07-08",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        }
      ]
    },
    {
      "numero": "1076",
      "fecha_pedido": "2026-07-06",
      "fecha_despacho": "2026-07-08",
      "cliente": "INVERSIONES MASCOTALANDIA II CA",
      "cod_cliente": "50",
      "rif": "J311674918",
      "vendedor": "Ivan Desantiago",
      "observaciones": "precio por bulto",
      "cond_pago": "Credito 21 Dias",
      "productos": "240 x Lamichi Pollo 4x15g",
      "monto_usd": 624,
      "almacen": "2",
      "lista_precios": "LISTA VIP BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2774",
      "nro_factura": null,
      "fecha_recibido": "2026-07-06",
      "fecha_cxc": "2026-07-06",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-07",
      "fecha_entregado": "2026-07-08",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 240,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "1075",
      "fecha_pedido": "2026-07-06",
      "fecha_despacho": "2026-07-08",
      "cliente": "EMPRENDIMIENTO EDUARDO MORILLO 4",
      "cod_cliente": "75",
      "rif": "J505067826",
      "vendedor": "Ivan Desantiago",
      "observaciones": null,
      "cond_pago": "Credito 15 Dias",
      "productos": "7 x Grow Little One 2kg | 12 x Palitos Dentales 110g | 1 x Tocineticas Perros 600g | 12 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g | 10 x Almohaditas de Salmon Gatos 60g",
      "monto_usd": 241.65,
      "almacen": "2",
      "lista_precios": "LISTA EFECTIVO O",
      "estado": "Entregado",
      "nro_nota": "2775",
      "nro_factura": null,
      "fecha_recibido": "2026-07-06",
      "fecha_cxc": "2026-07-06",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-07",
      "fecha_entregado": "2026-07-08",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 7,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 1,
          "descripcion": "Tocineticas Perros 600g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        }
      ]
    },
    {
      "numero": "1080",
      "fecha_pedido": "2026-07-07",
      "fecha_despacho": "2026-07-08",
      "cliente": "INVERSIONES PORTU-MASCOTAS, C.A.",
      "cod_cliente": "192",
      "rif": "J298096306",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "2 x Tocineticas Perros 600g | 6 x Palitos Dentales 110g | 24 x Lamichi Salmon 4x15g",
      "monto_usd": 113.64,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2776",
      "nro_factura": null,
      "fecha_recibido": "2026-07-07",
      "fecha_cxc": "2026-07-07",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-07",
      "fecha_entregado": "2026-07-08",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 2,
          "descripcion": "Tocineticas Perros 600g"
        },
        {
          "cantidad": 6,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        }
      ]
    },
    {
      "numero": "1074",
      "fecha_pedido": "2026-07-06",
      "fecha_despacho": "2026-07-08",
      "cliente": "MI NEGOCIO SUPERMERCADOS, C.A.",
      "cod_cliente": "318",
      "rif": "J008690480",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 21 Dias",
      "productos": "30 x Almohaditas de Salmon Gatos 60g | 24 x Lamichi Pollo 4x15g | 24 x Lamichi Salmon 4x15g | 20 x Salmoncitos Perros 60g | 10 x Bolsas de disposicion (5 Rollos)",
      "monto_usd": 373.47,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2782",
      "fecha_recibido": "2026-07-06",
      "fecha_cxc": "2026-07-06",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-07",
      "fecha_entregado": "2026-07-08",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 30,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 10,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        }
      ]
    },
    {
      "numero": "1054",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": "2026-07-07",
      "cliente": "INVERSIONES J.T.G 2005, C.A.",
      "cod_cliente": "352",
      "rif": "J407985590",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Contado",
      "productos": "6 x Tocineticas Perros 600g | 12 x Lamichi Salmon 4x15g",
      "monto_usd": 109.5,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2765",
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": "2026-07-02",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-03",
      "fecha_entregado": "2026-07-08",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 6,
          "descripcion": "Tocineticas Perros 600g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        }
      ]
    },
    {
      "numero": "1053",
      "fecha_pedido": "2026-07-02",
      "fecha_despacho": "2026-07-07",
      "cliente": "JHONDIBRAIN MANUEL TRUJILLO SANCHEZ",
      "cod_cliente": "351",
      "rif": "V280289767",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Contado",
      "productos": "2 x Tocineticas Perros 600g | 10 x Almohaditas de Salmon Gatos 60g | 10 x Salmoncitos Perros 60g | 12 x Lamichi Salmon 4x15g | 6 x Palitos Dentales 110g",
      "monto_usd": 134.44,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2763",
      "nro_factura": null,
      "fecha_recibido": "2026-07-02",
      "fecha_cxc": "2026-07-02",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-03",
      "fecha_entregado": "2026-07-08",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 2,
          "descripcion": "Tocineticas Perros 600g"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 6,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "1077",
      "fecha_pedido": "2026-07-06",
      "fecha_despacho": "2026-07-07",
      "cliente": "GRUPO MASCOTIK S FRJC, C.A.",
      "cod_cliente": "371",
      "rif": "J402663675",
      "vendedor": "Brayan Carpio",
      "observaciones": "lo puse por vene embarque por que por almecen noe deja",
      "cond_pago": "Credito 7 Dias",
      "productos": "30 x Almohaditas de Salmon Gatos 60g | 6 x Palitos Dentales 110g | 10 x Salmoncitos Perros 60g | 12 x Lamichi Pollo 4x15g | 12 x Lamichi Salmon 4x15g",
      "monto_usd": 191.54,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES V",
      "estado": "Entregado",
      "nro_nota": "2771",
      "nro_factura": null,
      "fecha_recibido": "2026-07-06",
      "fecha_cxc": "2026-07-06",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-07",
      "fecha_entregado": "2026-07-08",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 30,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 6,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        }
      ]
    },
    {
      "numero": "1060",
      "fecha_pedido": "2026-07-03",
      "fecha_despacho": "2026-07-06",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "cod_cliente": "381",
      "rif": "J401583806",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 45 Dias",
      "productos": "12 x Palitos Dentales 110g | 40 x Salmoncitos Perros 60g | 30 x Almohaditas de Salmon Gatos 60g | 48 x Lamichi Salmon 4x15g | 36 x Lamichi Pollo 4x15g",
      "monto_usd": 516.37,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2773",
      "fecha_recibido": "2026-07-03",
      "fecha_cxc": "2026-07-03",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-06",
      "fecha_entregado": "2026-07-08",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 40,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 30,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 48,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 36,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "*851",
      "fecha_pedido": "2026-07-07",
      "fecha_despacho": "2026-07-10",
      "cliente": "CENTRAL MADEIRENSE",
      "cod_cliente": null,
      "rif": null,
      "vendedor": null,
      "observaciones": null,
      "cond_pago": null,
      "productos": null,
      "monto_usd": null,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-07",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-07",
      "fecha_entregado": "2026-07-09",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": []
    },
    {
      "numero": "1094",
      "fecha_pedido": "2026-07-08",
      "fecha_despacho": "2026-07-10",
      "cliente": "ARAMAX SHOP C.A.",
      "cod_cliente": "292",
      "rif": "J504843164",
      "vendedor": "CARACAS  MCBO",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "10 x Almohaditas de Salmon Gatos 60g | 12 x Lamichi Pollo 4x15g | 6 x Palitos Dentales 110g",
      "monto_usd": 95.51,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": "2788",
      "nro_factura": null,
      "fecha_recibido": "2026-07-08",
      "fecha_cxc": "2026-07-08",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-08",
      "fecha_entregado": "2026-07-09",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 6,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "1084",
      "fecha_pedido": "2026-07-07",
      "fecha_despacho": "2026-07-09",
      "cliente": "PETS POINT, C.A.",
      "cod_cliente": "12",
      "rif": "J506999633",
      "vendedor": "Ivan Desantiago",
      "observaciones": null,
      "cond_pago": "Credito 10 Dias",
      "productos": "12 x Bolsas de disposicion (5 Rollos) | 24 x Lamichi Salmon 4x15g | 24 x Lamichi Pollo 4x15g",
      "monto_usd": 170.28,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2785",
      "fecha_recibido": "2026-07-07",
      "fecha_cxc": "2026-07-07",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-08",
      "fecha_entregado": "2026-07-09",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 12,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "1081",
      "fecha_pedido": "2026-07-07",
      "fecha_despacho": "2026-07-09",
      "cliente": "THE FAMILY PET SHOP 2003, C.A.",
      "cod_cliente": "57",
      "rif": "J410633808",
      "vendedor": "Brayan Carpio",
      "observaciones": "el paga a taza binance",
      "cond_pago": "Credito 15 Dias",
      "productos": "10 x Salmoncitos Perros 60g | 6 x Palitos Dentales 110g | 10 x Almohaditas de Salmon Gatos 60g | 12 x Lamichi Salmon 4x15g | 7 x Bolsas de disposicion (5 Rollos)",
      "monto_usd": 101.9,
      "almacen": "2",
      "lista_precios": "LISTA EFECTIVO O",
      "estado": "Entregado",
      "nro_nota": "2782",
      "nro_factura": null,
      "fecha_recibido": "2026-07-07",
      "fecha_cxc": "2026-07-07",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-08",
      "fecha_entregado": "2026-07-09",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 6,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 7,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        }
      ]
    },
    {
      "numero": "1067",
      "fecha_pedido": "2026-07-03",
      "fecha_despacho": "2026-07-09",
      "cliente": "INVERSIONES AVILA PETS COLOR, 2024 C.A.",
      "cod_cliente": "321",
      "rif": "J506366401",
      "vendedor": "Brayan Carpio",
      "observaciones": "el pagara de contado por el tema del 10 %",
      "cond_pago": "Contado",
      "productos": "4 x Grow Little One 2kg | 3 x Grow Little One 6kg | 3 x Eager to Meat 6kg | 3 x Eager to Meat 11,4kg | 20 x Almohaditas de Salmon Gatos 60g | 24 x Lamichi Salmon 4x15g | 24 x Lamichi Pollo 4x15g | 10 x Salmoncitos Perros 60g | 12 x Palitos Dentales 110g | 8 x Bolsas de disposicion (5 Rollos) | 10 x Dispensador x 1 rollo Azul | 10 x Dispensador x 1 rollo Baby Blue",
      "monto_usd": 1162.2,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2777",
      "nro_factura": null,
      "fecha_recibido": "2026-07-03",
      "fecha_cxc": "2026-07-07",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-07",
      "fecha_entregado": "2026-07-09",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 4,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 3,
          "descripcion": "Grow Little One 6kg"
        },
        {
          "cantidad": 3,
          "descripcion": "Eager to Meat 6kg"
        },
        {
          "cantidad": 3,
          "descripcion": "Eager to Meat 11,4kg"
        },
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 8,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 10,
          "descripcion": "Dispensador x 1 rollo Azul"
        },
        {
          "cantidad": 10,
          "descripcion": "Dispensador x 1 rollo Baby Blue"
        }
      ]
    },
    {
      "numero": "1083",
      "fecha_pedido": "2026-07-07",
      "fecha_despacho": "2026-07-09",
      "cliente": "AGRO-FINCA DON FERNANDO C.A.",
      "cod_cliente": "31",
      "rif": "J502132490",
      "vendedor": "Ivan Desantiago",
      "observaciones": "precio por bulto almohaditas de salmon/ michi",
      "cond_pago": "Contado",
      "productos": "14 x Grow Little One 2kg | 100 x Almohaditas de Salmon Gatos 60g | 120 x Lamichi Salmon 4x15g | 120 x Lamichi Pollo 4x15g",
      "monto_usd": 1227,
      "almacen": "2",
      "lista_precios": "LISTA VIP BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2778",
      "nro_factura": null,
      "fecha_recibido": "2026-07-07",
      "fecha_cxc": "2026-07-07",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-08",
      "fecha_entregado": "2026-07-09",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 14,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 100,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 120,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 120,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "1082",
      "fecha_pedido": "2026-07-07",
      "fecha_despacho": "2026-07-09",
      "cliente": "INVERSIONES HAPPY PETS 23, C.A",
      "cod_cliente": "72",
      "rif": "J504110434",
      "vendedor": "Brayan Carpio",
      "observaciones": "el paga por binance",
      "cond_pago": "Contado",
      "productos": "10 x Salmoncitos Perros 60g | 24 x Lamichi Pollo 4x15g | 12 x Palitos Dentales 110g | 6 x Bolsas de disposicion (5 Rollos)",
      "monto_usd": 122.1,
      "almacen": "2",
      "lista_precios": "LISTA EFECTIVO O",
      "estado": "Entregado",
      "nro_nota": "2781",
      "nro_factura": null,
      "fecha_recibido": "2026-07-07",
      "fecha_cxc": "2026-07-07",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-08",
      "fecha_entregado": "2026-07-09",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 6,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        }
      ]
    },
    {
      "numero": "1039",
      "fecha_pedido": "2026-07-01",
      "fecha_despacho": "2026-07-03",
      "cliente": "AUTOMERCADO AVILA, CA.",
      "cod_cliente": "382",
      "rif": "J505663682",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 21 Dias",
      "productos": "20 x Almohaditas de Salmon Gatos 60g | 24 x Lamichi Pollo 4x15g | 36 x Lamichi Salmon 4x15g | 15 x Palitos Dentales 110g | 20 x Salmoncitos Perros 60g | 14 x Bolsas de disposicion (5 Rollos)",
      "monto_usd": 428.5,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": "2786",
      "nro_factura": null,
      "fecha_recibido": "2026-07-01",
      "fecha_cxc": "2026-07-02",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-08",
      "fecha_entregado": "2026-07-09",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 36,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 15,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 14,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        }
      ]
    },
    {
      "numero": "1086",
      "fecha_pedido": "2026-07-07",
      "fecha_despacho": "2026-07-10",
      "cliente": "AGRO FUMILAGUNA 2018, C.A",
      "cod_cliente": "399",
      "rif": "J411569062",
      "vendedor": "Ivan Desantiago",
      "observaciones": "DESPACHAR CON OTRO CLIENTE NUEVO",
      "cond_pago": "Contado",
      "productos": "6 x Bolsas de disposicion (5 Rollos) | 2 x Dispensador x 1 rollo Azul | 2 x Dispensador x 1 rollo Baby Blue | 20 x Almohaditas de Salmon Gatos 60g | 24 x Lamichi Salmon 4x15g | 24 x Lamichi Pollo 4x15g | 6 x Palitos Dentales 110g | 10 x Salmoncitos Perros 60g | 2 x Tocineticas Perros 600g",
      "monto_usd": 291.94,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2787",
      "nro_factura": null,
      "fecha_recibido": "2026-07-07",
      "fecha_cxc": "2026-07-08",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-08",
      "fecha_entregado": "2026-07-10",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 6,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 2,
          "descripcion": "Dispensador x 1 rollo Azul"
        },
        {
          "cantidad": 2,
          "descripcion": "Dispensador x 1 rollo Baby Blue"
        },
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 6,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 2,
          "descripcion": "Tocineticas Perros 600g"
        }
      ]
    },
    {
      "numero": "1089",
      "fecha_pedido": "2026-07-07",
      "fecha_despacho": "2026-07-10",
      "cliente": "INVERSIONES LARA 2018 C.A.",
      "cod_cliente": "398",
      "rif": "J411353450",
      "vendedor": "Ivan Desantiago",
      "observaciones": "para despachar el viernes",
      "cond_pago": "Contado",
      "productos": "6 x Bolsas de disposicion (5 Rollos) | 50 x Almohaditas de Salmon Gatos 60g | 24 x Lamichi Salmon 4x15g | 24 x Lamichi Pollo 4x15g | 24 x Palitos Dentales 110g | 6 x Tocineticas Perros 600g | 20 x Salmoncitos Perros 60g",
      "monto_usd": 589.74,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2789",
      "fecha_recibido": "2026-07-07",
      "fecha_cxc": "2026-07-08",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-08",
      "fecha_entregado": "2026-07-10",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 6,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        },
        {
          "cantidad": 50,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 6,
          "descripcion": "Tocineticas Perros 600g"
        },
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "1098",
      "fecha_pedido": "2026-07-09",
      "fecha_despacho": "2026-07-10",
      "cliente": "MASTERS DOG S, C.A.",
      "cod_cliente": "63",
      "rif": "J501741190",
      "vendedor": "Ivan Desantiago",
      "observaciones": "precio por caja la michi",
      "cond_pago": "Contado",
      "productos": "7 x Grow Little One 2kg | 180 x Lamichi Salmon 4x15g | 60 x Lamichi Pollo 4x15g",
      "monto_usd": 795.5,
      "almacen": "2",
      "lista_precios": "LISTA VIP BOLIVARES V",
      "estado": "Entregado",
      "nro_nota": "2793",
      "nro_factura": null,
      "fecha_recibido": "2026-07-09",
      "fecha_cxc": "2026-07-09",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-09",
      "fecha_entregado": "2026-07-10",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 7,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 180,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 60,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "1097",
      "fecha_pedido": "2026-07-09",
      "fecha_despacho": "2026-07-10",
      "cliente": "COMERCIALIZADORA NUTRIPET C.A.",
      "cod_cliente": "327",
      "rif": "J506486547",
      "vendedor": "Ivan Desantiago",
      "observaciones": null,
      "cond_pago": "Contado",
      "productos": "24 x Palitos Dentales 110g | 30 x Salmoncitos Perros 60g | 3 x Tocineticas Perros 600g | 30 x Almohaditas de Salmon Gatos 60g | 24 x Lamichi Pollo 4x15g",
      "monto_usd": 358.11,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES V",
      "estado": "Entregado",
      "nro_nota": "2791",
      "nro_factura": null,
      "fecha_recibido": "2026-07-09",
      "fecha_cxc": "2026-07-09",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-09",
      "fecha_entregado": "2026-07-10",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 24,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 30,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 3,
          "descripcion": "Tocineticas Perros 600g"
        },
        {
          "cantidad": 30,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "1100",
      "fecha_pedido": "2026-07-09",
      "fecha_despacho": "2026-07-10",
      "cliente": "INVERSIONES LAS XXX 2016, C.A.",
      "cod_cliente": "322",
      "rif": "J407765370",
      "vendedor": "Brayan Carpio",
      "observaciones": "por fa este pedido que llegue mañana con el de avi mascotas",
      "cond_pago": "Contado",
      "productos": "72 x Lamichi Salmon 4x15g | 24 x Lamichi Pollo 4x15g | 4 x Tocineticas Perros 600g",
      "monto_usd": 239.4,
      "almacen": "2",
      "lista_precios": "LISTA EFECTIVO O",
      "estado": "Entregado",
      "nro_nota": "2794",
      "nro_factura": null,
      "fecha_recibido": "2026-07-09",
      "fecha_cxc": "2026-07-09",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-09",
      "fecha_entregado": "2026-07-10",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 72,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 4,
          "descripcion": "Tocineticas Perros 600g"
        }
      ]
    },
    {
      "numero": "1099",
      "fecha_pedido": "2026-07-09",
      "fecha_despacho": "2026-07-10",
      "cliente": "INVERSIONES AVIMASCOTA 2010 C.A",
      "cod_cliente": "239",
      "rif": "J298257881",
      "vendedor": "Brayan Carpio",
      "observaciones": "por favor este pedido que llegue mañana ya que el cliente",
      "cond_pago": "Contado",
      "productos": "12 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g | 30 x Almohaditas de Salmon Gatos 60g | 12 x Palitos Dentales 110g",
      "monto_usd": 190.68,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2792",
      "nro_factura": null,
      "fecha_recibido": "2026-07-09",
      "fecha_cxc": "2026-07-09",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-09",
      "fecha_entregado": "2026-07-10",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 30,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "1101",
      "fecha_pedido": "2026-07-09",
      "fecha_despacho": "2026-07-10",
      "cliente": "AVICOLA HUELLAS Y BIGOTES C.A.",
      "cod_cliente": "276",
      "rif": "J508133820",
      "vendedor": "Brayan Carpio",
      "observaciones": "por fa este pedido lo pueden dejar en la cede de propatia",
      "cond_pago": "Credito 7 Dias",
      "productos": "24 x Lamichi Salmon 4x15g | 24 x Lamichi Pollo 4x15g | 10 x Almohaditas de Salmon Gatos 60g",
      "monto_usd": 150.8,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2798",
      "nro_factura": null,
      "fecha_recibido": "2026-07-09",
      "fecha_cxc": "2026-07-09",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-09",
      "fecha_entregado": "2026-07-10",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        }
      ]
    },
    {
      "numero": "1102",
      "fecha_pedido": "2026-07-09",
      "fecha_despacho": "2026-07-10",
      "cliente": "INVERSIONES MADVEN 2015, C.A.",
      "cod_cliente": "377",
      "rif": "J405166282",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 21 Dias",
      "productos": "10 x Almohaditas de Salmon Gatos 60g | 15 x Palitos Dentales 110g | 30 x Salmoncitos Perros 60g",
      "monto_usd": 208.83,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2792",
      "fecha_recibido": "2026-07-09",
      "fecha_cxc": "2026-07-09",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-09",
      "fecha_entregado": "2026-07-10",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 15,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 30,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "1106",
      "fecha_pedido": "2026-07-09",
      "fecha_despacho": "2026-07-10",
      "cliente": "POSITIVO PETS SHOP, C.A",
      "cod_cliente": "297",
      "rif": "J506657341",
      "vendedor": "Brayan Carpio",
      "observaciones": "este pedido puede llegar mañana no hay problema o el lunes",
      "cond_pago": "Credito 7 Dias",
      "productos": "24 x Lamichi Salmon 4x15g | 24 x Lamichi Pollo 4x15g | 3 x Tocineticas Perros 600g | 20 x Almohaditas de Salmon Gatos 60g",
      "monto_usd": 215.95,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2799",
      "nro_factura": null,
      "fecha_recibido": "2026-07-09",
      "fecha_cxc": "2026-07-09",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-09",
      "fecha_entregado": "2026-07-10",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 3,
          "descripcion": "Tocineticas Perros 600g"
        },
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        }
      ]
    },
    {
      "numero": "1103",
      "fecha_pedido": "2026-07-09",
      "fecha_despacho": "2026-07-10",
      "cliente": "INVERSIONES COFFE MOL 2018, C.A",
      "cod_cliente": "227",
      "rif": "J412141473",
      "vendedor": "Brayan Carpio",
      "observaciones": "este pedido el cliente notifica que sinle llega mañana",
      "cond_pago": "Credito 7 Dias",
      "productos": "12 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g | 10 x Almohaditas de Salmon Gatos 60g | 6 x Palitos Dentales 110g",
      "monto_usd": 113.54,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2800",
      "nro_factura": null,
      "fecha_recibido": "2026-07-09",
      "fecha_cxc": "2026-07-09",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-09",
      "fecha_entregado": "2026-07-10",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 6,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "1085",
      "fecha_pedido": "2026-07-07",
      "fecha_despacho": "2026-07-09",
      "cliente": "EMPRENDIMNIENTO BRAYAN PARADA",
      "cod_cliente": "199",
      "rif": "J506572656",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Contado",
      "productos": "20 x Almohaditas de Salmon Gatos 60g | 24 x Lamichi Salmon 4x15g | 24 x Lamichi Pollo 4x15g | 6 x Palitos Dentales 110g",
      "monto_usd": 201.94,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2779",
      "nro_factura": null,
      "fecha_recibido": "2026-07-07",
      "fecha_cxc": "2026-07-07",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-08",
      "fecha_entregado": "2026-07-10",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 6,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "1095",
      "fecha_pedido": "2026-07-08",
      "fecha_despacho": "2026-07-09",
      "cliente": "ALI BABA Y SUS 40 MASCOTAS, C.A.",
      "cod_cliente": "76",
      "rif": "J505151690",
      "vendedor": "Brayan Carpio",
      "observaciones": "quiere aprovechar el 10%",
      "cond_pago": "Contado",
      "productos": "20 x Salmoncitos Perros 60g | 20 x Almohaditas de Salmon Gatos 60g | 12 x Lamichi Salmon 4x15g",
      "monto_usd": 135.2,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2789",
      "nro_factura": null,
      "fecha_recibido": "2026-07-08",
      "fecha_cxc": "2026-07-08",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-08",
      "fecha_entregado": "2026-07-10",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        }
      ]
    },
    {
      "numero": "1078",
      "fecha_pedido": "2026-07-06",
      "fecha_despacho": "2026-07-07",
      "cliente": "E&J MEDICINA VETERINARIA, C.A.",
      "cod_cliente": "64",
      "rif": "J501812675",
      "vendedor": "Ivan Desantiago",
      "observaciones": "lo llevo yo",
      "cond_pago": "Contado",
      "productos": "12 x Bolsas de disposicion (5 Rollos)",
      "monto_usd": 45.48,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2772",
      "nro_factura": null,
      "fecha_recibido": "2026-07-06",
      "fecha_cxc": "2026-07-06",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-07",
      "fecha_entregado": "2026-07-10",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 12,
          "descripcion": "Bolsas de disposicion (5 Rollos)"
        }
      ]
    },
    {
      "numero": "594",
      "fecha_pedido": "2026-07-08",
      "fecha_despacho": null,
      "cliente": "PETSPLANET VALENCIA  - CONSIGNACION",
      "cod_cliente": null,
      "rif": null,
      "vendedor": null,
      "observaciones": null,
      "cond_pago": null,
      "productos": null,
      "monto_usd": null,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-08",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-08",
      "fecha_entregado": "2026-07-13",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": []
    },
    {
      "numero": "1109",
      "fecha_pedido": "2026-07-10",
      "fecha_despacho": "2026-07-14",
      "cliente": "AGROPECUARIA DISTRIBUIDORA EL TALISMAN, C.A.",
      "cod_cliente": "196",
      "rif": "J404127593",
      "vendedor": "Brayan Carpio",
      "observaciones": null,
      "cond_pago": "Contado",
      "productos": "10 x Grow Little One 2kg",
      "monto_usd": 245,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2802",
      "nro_factura": null,
      "fecha_recibido": "2026-07-10",
      "fecha_cxc": "2026-07-10",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-10",
      "fecha_entregado": "2026-07-13",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 10,
          "descripcion": "Grow Little One 2kg"
        }
      ]
    },
    {
      "numero": "1112",
      "fecha_pedido": "2026-07-10",
      "fecha_despacho": "2026-07-13",
      "cliente": "INVERSIONES CHAMTOR SEGUNDA, C.A",
      "cod_cliente": "151",
      "rif": "J315275090",
      "vendedor": "CARACAS  MCBO",
      "observaciones": null,
      "cond_pago": "Credito 7 Dias",
      "productos": "15 x Palitos Dentales 110g | 24 x Lamichi Salmon 4x15g",
      "monto_usd": 145.29,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2796",
      "fecha_recibido": "2026-07-10",
      "fecha_cxc": "2026-07-10",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-10",
      "fecha_entregado": "2026-07-13",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 15,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        }
      ]
    },
    {
      "numero": "1119",
      "fecha_pedido": "2026-07-13",
      "fecha_despacho": "2026-07-13",
      "cliente": "EDGAR ALEXANDER ESPINOZA PERALES",
      "cod_cliente": "316",
      "rif": "V145860012",
      "vendedor": "Brayan Carpio",
      "observaciones": "este pedido me lo llevo yo",
      "cond_pago": "Contado",
      "productos": "20 x Almohaditas de Salmon Gatos 60g | 12 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g",
      "monto_usd": 114.4,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES V",
      "estado": "Entregado",
      "nro_nota": "2810",
      "nro_factura": null,
      "fecha_recibido": "2026-07-13",
      "fecha_cxc": "2026-07-13",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-13",
      "fecha_entregado": "2026-07-13",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        }
      ]
    },
    {
      "numero": "1107",
      "fecha_pedido": "2026-07-09",
      "fecha_despacho": "2026-07-10",
      "cliente": "DISTRIBUIDORA KOWU 01, C.A.",
      "cod_cliente": "340",
      "rif": "J505888781",
      "vendedor": "Brayan Carpio",
      "observaciones": "no hay problema si llega mañana o el lunes pero se podria a",
      "cond_pago": "Credito 7 Dias",
      "productos": "24 x Lamichi Salmon 4x15g | 24 x Lamichi Pollo 4x15g | 10 x Almohaditas de Salmon Gatos 60g | 10 x Salmoncitos Perros 60g | 1 x Tocineticas Perros 600g | 6 x Palitos Dentales 110g",
      "monto_usd": 214.99,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2801",
      "nro_factura": null,
      "fecha_recibido": "2026-07-09",
      "fecha_cxc": "2026-07-10",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-10",
      "fecha_entregado": "2026-07-13",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 24,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 1,
          "descripcion": "Tocineticas Perros 600g"
        },
        {
          "cantidad": 6,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "1093",
      "fecha_pedido": "2026-07-07",
      "fecha_despacho": "2026-07-09",
      "cliente": "CATANIA HIPERMERCADO, C.A.",
      "cod_cliente": "364",
      "rif": "J312768320",
      "vendedor": "Kenibel Escalona",
      "observaciones": "incluye 21 und tocineticas",
      "cond_pago": "Credito 21 Dias",
      "productos": "120 x Lamichi Pollo 4x15g | 20 x Almohaditas de Salmon Gatos 60g | 30 x Salmoncitos Perros 60g",
      "monto_usd": 601.46,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2788",
      "fecha_recibido": "2026-07-07",
      "fecha_cxc": "2026-07-08",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-08",
      "fecha_entregado": "2026-07-13",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 120,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 20,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 30,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "1092",
      "fecha_pedido": "2026-07-07",
      "fecha_despacho": "2026-07-09",
      "cliente": "CATANIA HIPERMERCADO, C.A.",
      "cod_cliente": "364",
      "rif": "J312768320",
      "vendedor": "Kenibel Escalona",
      "observaciones": "incluye 14 und de tocineticas",
      "cond_pago": "Credito 21 Dias",
      "productos": "10 x Almohaditas de Salmon Gatos 60g | 54 x Palitos Dentales 110g | 20 x Salmoncitos Perros 60g",
      "monto_usd": 388.02,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2786",
      "fecha_recibido": "2026-07-07",
      "fecha_cxc": "2026-07-08",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-08",
      "fecha_entregado": "2026-07-13",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 10,
          "descripcion": "Almohaditas de Salmon Gatos 60g"
        },
        {
          "cantidad": 54,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "1091",
      "fecha_pedido": "2026-07-07",
      "fecha_despacho": "2026-07-09",
      "cliente": "CATANIA HIPERMERCADO, C.A.",
      "cod_cliente": "364",
      "rif": "J312768320",
      "vendedor": "Kenibel Escalona",
      "observaciones": "incluye 21 und tocineticas",
      "cond_pago": "Credito 21 Dias",
      "productos": "120 x Lamichi Pollo 4x15g | 54 x Palitos Dentales 110g | 20 x Salmoncitos Perros 60g",
      "monto_usd": 777.2,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2787",
      "fecha_recibido": "2026-07-07",
      "fecha_cxc": "2026-07-08",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-08",
      "fecha_entregado": "2026-07-13",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 120,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 54,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "1090",
      "fecha_pedido": "2026-07-07",
      "fecha_despacho": "2026-07-09",
      "cliente": "UNIVERSO ANIMAL PET SHOP C.A.",
      "cod_cliente": "157",
      "rif": "J501575720",
      "vendedor": "Kenibel Escalona",
      "observaciones": "incluye 10 und happy 2kg / 02 und happy 6kg pollo",
      "cond_pago": "Credito 15 Dias",
      "productos": "10 x Grow Little One 2kg | 6 x Grow Little One 6kg",
      "monto_usd": 450,
      "almacen": "2",
      "lista_precios": "LISTA EFECTIVO V",
      "estado": "Entregado",
      "nro_nota": "2785",
      "nro_factura": null,
      "fecha_recibido": "2026-07-07",
      "fecha_cxc": "2026-07-08",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-08",
      "fecha_entregado": "2026-07-13",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 10,
          "descripcion": "Grow Little One 2kg"
        },
        {
          "cantidad": 6,
          "descripcion": "Grow Little One 6kg"
        }
      ]
    },
    {
      "numero": "1088",
      "fecha_pedido": "2026-07-07",
      "fecha_despacho": "2026-07-09",
      "cliente": "AGROHACIENDA, C.A.",
      "cod_cliente": "89",
      "rif": "J500199139",
      "vendedor": "Kenibel Escalona",
      "observaciones": "incluye 06 und eager 2kg / 12 und happy 2 kg / 06 und happy",
      "cond_pago": "Credito 7 Dias",
      "productos": "2 x Grow Little One 6kg | 20 x Salmoncitos Perros 60g | 6 x Palitos Dentales 110g",
      "monto_usd": 207.14,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES V",
      "estado": "Entregado",
      "nro_nota": "2783",
      "nro_factura": null,
      "fecha_recibido": "2026-07-07",
      "fecha_cxc": "2026-07-08",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-08",
      "fecha_entregado": "2026-07-13",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 2,
          "descripcion": "Grow Little One 6kg"
        },
        {
          "cantidad": 20,
          "descripcion": "Salmoncitos Perros 60g"
        },
        {
          "cantidad": 6,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "1087",
      "fecha_pedido": "2026-07-07",
      "fecha_despacho": "2026-07-09",
      "cliente": "DISTRIBUIDORA BELLPINO CENTRO, C.A.",
      "cod_cliente": "83",
      "rif": "J305084831",
      "vendedor": "Kenibel Escalona",
      "observaciones": null,
      "cond_pago": "Credito 10 Dias",
      "productos": "36 x Lamichi Salmon 4x15g | 36 x Lamichi Pollo 4x15g | 36 x Palitos Dentales 110g | 24 x Salmoncitos Perros 60g",
      "monto_usd": 400.44,
      "almacen": "2",
      "lista_precios": "LISTA VIP BOLIVARES V",
      "estado": "Entregado",
      "nro_nota": "2790",
      "nro_factura": null,
      "fecha_recibido": "2026-07-07",
      "fecha_cxc": "2026-07-08",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-08",
      "fecha_entregado": "2026-07-13",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 36,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 36,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 36,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 24,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    },
    {
      "numero": "2800",
      "fecha_pedido": "2026-07-13",
      "fecha_despacho": null,
      "cliente": "CENTRAL MADEIRENSE",
      "cod_cliente": null,
      "rif": null,
      "vendedor": null,
      "observaciones": null,
      "cond_pago": null,
      "productos": null,
      "monto_usd": null,
      "almacen": null,
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": null,
      "fecha_recibido": "2026-07-13",
      "fecha_cxc": null,
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-13",
      "fecha_entregado": "2026-07-14",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": []
    },
    {
      "numero": "1132",
      "fecha_pedido": "2026-07-14",
      "fecha_despacho": "2026-07-15",
      "cliente": "COMERCIAL OS-ZAM, C.A.",
      "cod_cliente": "45",
      "rif": "J297894080",
      "vendedor": "Brayan Carpio",
      "observaciones": "si se puede para hoy mismo no hay problema gracias",
      "cond_pago": "Contado",
      "productos": "24 x Lamichi Salmon 4x15g | 12 x Lamichi Pollo 4x15g | 6 x Palitos Dentales 110g",
      "monto_usd": 118.74,
      "almacen": "2",
      "lista_precios": "LISTA BOLIVARES O",
      "estado": "Entregado",
      "nro_nota": "2816",
      "nro_factura": null,
      "fecha_recibido": "2026-07-14",
      "fecha_cxc": "2026-07-14",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-14",
      "fecha_entregado": "2026-07-14",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 24,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 6,
          "descripcion": "Palitos Dentales 110g"
        }
      ]
    },
    {
      "numero": "1122",
      "fecha_pedido": "2026-07-13",
      "fecha_despacho": "2026-07-14",
      "cliente": "AUTOMERCADO SANTA PAULA, C.A.",
      "cod_cliente": "366",
      "rif": "J001543627",
      "vendedor": "Bryant Mennechey",
      "observaciones": null,
      "cond_pago": "Credito 21 Dias",
      "productos": "12 x Lamichi Pollo 4x15g | 12 x Lamichi Salmon 4x15g | 13 x Palitos Dentales 110g | 10 x Salmoncitos Perros 60g",
      "monto_usd": 188.15,
      "almacen": "2",
      "lista_precios": null,
      "estado": "Entregado",
      "nro_nota": null,
      "nro_factura": "2802",
      "fecha_recibido": "2026-07-13",
      "fecha_cxc": "2026-07-13",
      "fecha_aprobado_cxc": null,
      "fecha_logistica": "2026-07-13",
      "fecha_entregado": "2026-07-14",
      "fecha_en_ruta": null,
      "origen": "archivo",
      "renglones": [
        {
          "cantidad": 12,
          "descripcion": "Lamichi Pollo 4x15g"
        },
        {
          "cantidad": 12,
          "descripcion": "Lamichi Salmon 4x15g"
        },
        {
          "cantidad": 13,
          "descripcion": "Palitos Dentales 110g"
        },
        {
          "cantidad": 10,
          "descripcion": "Salmoncitos Perros 60g"
        }
      ]
    }
  ],
  "estados": [
    {
      "ts": "30/06/2026 13:11",
      "pedido_numero": "1024",
      "cliente": "UNIMASCOTAS DEL PARAISO, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "30/06/2026 13:11",
      "pedido_numero": "1028",
      "cliente": "COMERCIAL J.A.T.U 69-70, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "30/06/2026 13:15",
      "pedido_numero": "1029",
      "cliente": "AUTOMERCADO LA MURALLA C.A.",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "30/06/2026 19:14",
      "pedido_numero": "1031",
      "cliente": "AVICOLA HUELLAS Y BIGOTES C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 08:16",
      "pedido_numero": "1030",
      "cliente": "FRUTERIA LOS POMELOS C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 08:30",
      "pedido_numero": "1031",
      "cliente": "AVICOLA HUELLAS Y BIGOTES C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 08:31",
      "pedido_numero": "1032",
      "cliente": "MICHELANGELO AGNELLO GIARRATANA",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 08:32",
      "pedido_numero": "1032",
      "cliente": "MICHELANGELO AGNELLO GIARRATANA",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 08:59",
      "pedido_numero": "1033",
      "cliente": "MAXI MERCADO PARAPARAL, C.A",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 09:46",
      "pedido_numero": "1033",
      "cliente": "MAXI MERCADO PARAPARAL, C.A",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 10:04",
      "pedido_numero": "1035",
      "cliente": "CLINICA VETERINARIA ANIMALVET, C.A.",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 10:04",
      "pedido_numero": "1034",
      "cliente": "PETSPLUS 2023, C.A",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 10:09",
      "pedido_numero": "962",
      "cliente": "LUIS ALBERTO LOVERA VALECILLO",
      "vendedor": "Brayan Carpio",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 10:09",
      "pedido_numero": "962",
      "cliente": "LUIS ALBERTO LOVERA VALECILLO",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "Logística",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 13:54",
      "pedido_numero": "1036",
      "cliente": "PETS PLANET VALENCIA, C.A",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 14:07",
      "pedido_numero": "1036",
      "cliente": "PETS PLANET VALENCIA, C.A",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 14:44",
      "pedido_numero": "1037",
      "cliente": "PETS MALL, C.A.",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:14",
      "pedido_numero": "1038",
      "cliente": "MI NEGOCIO SUPERMERCADOS, C.A.",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:19",
      "pedido_numero": "1039",
      "cliente": "AUTOMERCADO AVILA, CA.",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:33",
      "pedido_numero": "1039a",
      "cliente": "PLAN SUAREZ - TRINIDAD",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:33",
      "pedido_numero": "1039b",
      "cliente": "PLAN SUAREZ - CAURIMARE",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "1/7/2026 15:34:57",
      "pedido_numero": "1039b",
      "cliente": "PLAN SUAREZ - CAURIMARE",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:34",
      "pedido_numero": "1039a",
      "cliente": "PLAN SUAREZ - TRINIDAD",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:34",
      "pedido_numero": "1039b",
      "cliente": "PLAN SUAREZ - URBINA",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:35",
      "pedido_numero": "1039b",
      "cliente": "PLAN SUAREZ - SANTA MONICA",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:35",
      "pedido_numero": "1039b",
      "cliente": "PLAN SUAREZ - URBINA",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "CXC",
      "estado_nuevo": "Facturación",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:35",
      "pedido_numero": "1039b",
      "cliente": "PLAN SUAREZ - SANTA MONICA",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "CXC",
      "estado_nuevo": "Facturación",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:37",
      "pedido_numero": "1039b",
      "cliente": "PLAN SUAREZ - URBINA",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Facturación",
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:37",
      "pedido_numero": "1039b",
      "cliente": "PLAN SUAREZ - SANTA MONICA",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Facturación",
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:37",
      "pedido_numero": "1039b",
      "cliente": "PLAN SUAREZ - URBINA",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:37",
      "pedido_numero": null,
      "cliente": null,
      "vendedor": null,
      "estado_anterior": null,
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:37",
      "pedido_numero": "1039b",
      "cliente": "PLAN SUAREZ - SANTA MONICA",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:38",
      "pedido_numero": "1039C",
      "cliente": "PLAN SUAREZ - SANTA MONICA",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "CXC",
      "estado_nuevo": "Facturación",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:38",
      "pedido_numero": "1039D",
      "cliente": "PLAN SUAREZ - URBINA",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "CXC",
      "estado_nuevo": "Facturación",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:39",
      "pedido_numero": "1040",
      "cliente": "HIPERMERCADO PARAMO, C.A.",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:40",
      "pedido_numero": "1030",
      "cliente": "FRUTERIA LOS POMELOS C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": null,
      "estado_nuevo": "Logística",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:40",
      "pedido_numero": "1030",
      "cliente": "FRUTERIA LOS POMELOS C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": null,
      "estado_nuevo": "Logística",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:43",
      "pedido_numero": "1041",
      "cliente": "HIPERMERCADO PARAMO, C.A.",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:44",
      "pedido_numero": "1025",
      "cliente": "L M S INVERSIONES Y AGROPECUARIA EL GABAN 2021, C.A.",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:46",
      "pedido_numero": "1040",
      "cliente": "HIPERMERCADO PARAMO, C.A.",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 15:46",
      "pedido_numero": "1041",
      "cliente": "HIPERMERCADO PARAMO, C.A.",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 16:09",
      "pedido_numero": "1042",
      "cliente": "UNIMASCOTAS LOS PALOS GRANDES C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "01/07/2026 18:26",
      "pedido_numero": "11111",
      "cliente": "PLAN SUAREZ - TRINIDAD",
      "vendedor": null,
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 08:12",
      "pedido_numero": "1037",
      "cliente": "PETS MALL, C.A.",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 08:12",
      "pedido_numero": "1038",
      "cliente": "MI NEGOCIO SUPERMERCADOS, C.A.",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 08:12",
      "pedido_numero": "1042",
      "cliente": "UNIMASCOTAS LOS PALOS GRANDES C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Recibido",
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 08:12",
      "pedido_numero": "1042",
      "cliente": "UNIMASCOTAS LOS PALOS GRANDES C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": null,
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 08:12",
      "pedido_numero": "1039",
      "cliente": "AUTOMERCADO AVILA, CA.",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 08:13",
      "pedido_numero": "1038",
      "cliente": "MI NEGOCIO SUPERMERCADOS, C.A.",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "CXC",
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 08:13",
      "pedido_numero": "1038",
      "cliente": "MI NEGOCIO SUPERMERCADOS, C.A.",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 08:19",
      "pedido_numero": "1043",
      "cliente": "INVERSIONES UNIKOPET C.A",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 08:24",
      "pedido_numero": "1044",
      "cliente": "INVERSIONES MM58 PETS, C.A.",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 08:29",
      "pedido_numero": "1045",
      "cliente": "PETARAMA C.A.",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 08:34",
      "pedido_numero": "1048",
      "cliente": "ARAMAX SHOP C.A.",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 08:34",
      "pedido_numero": "1047",
      "cliente": "ARAMAX SHOP C.A.",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 08:34",
      "pedido_numero": "1046",
      "cliente": "MARAMAX PET C.A.",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 08:39",
      "pedido_numero": "1050",
      "cliente": "CORPORACION ARAS PET C.A.",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 08:39",
      "pedido_numero": "1049",
      "cliente": "CORPORACION ARAS PET C.A.",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 09:00",
      "pedido_numero": "1049",
      "cliente": "CORPORACION ARAS PET C.A.",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 09:00",
      "pedido_numero": "1050",
      "cliente": "CORPORACION ARAS PET C.A.",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 09:00",
      "pedido_numero": "1046",
      "cliente": "MARAMAX PET C.A.",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 09:00",
      "pedido_numero": "1047",
      "cliente": "ARAMAX SHOP C.A.",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 09:00",
      "pedido_numero": "1048",
      "cliente": "ARAMAX SHOP C.A.",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 09:00",
      "pedido_numero": "1045",
      "cliente": "PETARAMA C.A.",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 09:01",
      "pedido_numero": "1044",
      "cliente": "INVERSIONES MM58 PETS, C.A.",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 09:01",
      "pedido_numero": "1043",
      "cliente": "INVERSIONES UNIKOPET C.A",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 09:29",
      "pedido_numero": "1051",
      "cliente": "DISTRIBUIDORA AGROPECUARIA JE, C.A.",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 09:39",
      "pedido_numero": "1052",
      "cliente": "SUPERMERCADO AGROPECUARIO HERMANOS BOLIVAR,C.A",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 09:47",
      "pedido_numero": "1051",
      "cliente": "DISTRIBUIDORA AGROPECUARIA JE, C.A.",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 09:47",
      "pedido_numero": "1051",
      "cliente": "DISTRIBUIDORA AGROPECUARIA JE, C.A.",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 09:48",
      "pedido_numero": "1052",
      "cliente": "SUPERMERCADO AGROPECUARIO HERMANOS BOLIVAR,C.A",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "CXC",
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 09:48",
      "pedido_numero": "1051",
      "cliente": "DISTRIBUIDORA AGROPECUARIA JE, C.A.",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": null,
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 09:48",
      "pedido_numero": "1052",
      "cliente": "SUPERMERCADO AGROPECUARIO HERMANOS BOLIVAR,C.A",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": null,
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 10:59",
      "pedido_numero": "1053",
      "cliente": "JHONDIBRAIN MANUEL TRUJILLO SANCHEZ",
      "vendedor": "Brayan Carpio",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 11:24",
      "pedido_numero": "1054",
      "cliente": "INVERSIONES J.T.G 2005, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:36",
      "pedido_numero": "T565",
      "cliente": "CENTRAL MADEIRENSE",
      "vendedor": null,
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:37",
      "pedido_numero": "T571",
      "cliente": "GAMA SUCURSAL SANTA EDUVIGIS",
      "vendedor": null,
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:37",
      "pedido_numero": "T572",
      "cliente": "GAMA EXPRESS LA URBINA",
      "vendedor": null,
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:37",
      "pedido_numero": "T573",
      "cliente": "GAMA EXPRESS SANTA FE",
      "vendedor": null,
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:37",
      "pedido_numero": "T574",
      "cliente": "GAMA EXPRESS SANTA MONICA",
      "vendedor": null,
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:37",
      "pedido_numero": "T575",
      "cliente": "GAMA SUCURSAL LOS PALOS GRANDES",
      "vendedor": null,
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:37",
      "pedido_numero": "T576",
      "cliente": "GAMA EXPRESS EL PARAISO",
      "vendedor": null,
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:37",
      "pedido_numero": "T577",
      "cliente": "GAMA EXPRESS LOS PALOS GRANDES",
      "vendedor": null,
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:37",
      "pedido_numero": "T578",
      "cliente": "GAMA SUCURSAL LA PANAMERICANA",
      "vendedor": null,
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:38",
      "pedido_numero": "T565",
      "cliente": "CENTRAL MADEIRENSE",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "Logística",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:38",
      "pedido_numero": "T571",
      "cliente": "GAMA SUCURSAL SANTA EDUVIGIS",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "Logística",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:38",
      "pedido_numero": "T572",
      "cliente": "GAMA EXPRESS LA URBINA",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "Logística",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:38",
      "pedido_numero": "T576",
      "cliente": "GAMA EXPRESS EL PARAISO",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "Recibido",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:38",
      "pedido_numero": "T577",
      "cliente": "GAMA EXPRESS LOS PALOS GRANDES",
      "vendedor": null,
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:38",
      "pedido_numero": "T574",
      "cliente": "GAMA EXPRESS SANTA MONICA",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "Logística",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:39",
      "pedido_numero": "T575",
      "cliente": "GAMA SUCURSAL LOS PALOS GRANDES",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "Logística",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:39",
      "pedido_numero": "T576",
      "cliente": "GAMA EXPRESS EL PARAISO",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "En Ruta",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:39",
      "pedido_numero": "T577",
      "cliente": "GAMA EXPRESS LOS PALOS GRANDES",
      "vendedor": null,
      "estado_anterior": "En Ruta",
      "estado_nuevo": "Recibido",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:39",
      "pedido_numero": "T577",
      "cliente": "GAMA EXPRESS LOS PALOS GRANDES",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "Recibido",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:39",
      "pedido_numero": "T578",
      "cliente": "GAMA SUCURSAL LA PANAMERICANA",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "Logística",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:39",
      "pedido_numero": "T576",
      "cliente": "GAMA EXPRESS EL PARAISO",
      "vendedor": null,
      "estado_anterior": "En Ruta",
      "estado_nuevo": "Logística",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:39",
      "pedido_numero": "T577",
      "cliente": "GAMA EXPRESS LOS PALOS GRANDES",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "Recibido",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 12:40",
      "pedido_numero": "T577",
      "cliente": "GAMA EXPRESS LOS PALOS GRANDES",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "Logística",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 14:07",
      "pedido_numero": "1053",
      "cliente": "JHONDIBRAIN MANUEL TRUJILLO SANCHEZ",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 14:08",
      "pedido_numero": "1053",
      "cliente": "JHONDIBRAIN MANUEL TRUJILLO SANCHEZ",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 14:08",
      "pedido_numero": "1054",
      "cliente": "INVERSIONES J.T.G 2005, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "CXC",
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 14:08",
      "pedido_numero": "1054",
      "cliente": "INVERSIONES J.T.G 2005, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 15:34",
      "pedido_numero": "1056",
      "cliente": "ONEMARKET.VE1630,C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 15:34",
      "pedido_numero": "1055",
      "cliente": "4 PATITAS PETS SHOP, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 15:39",
      "pedido_numero": "1057",
      "cliente": "AGROPECUARIA GUATIPEZ, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 17:24",
      "pedido_numero": "1058",
      "cliente": "PATA PATA ANIMAL MARKET., C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 18:09",
      "pedido_numero": "1027",
      "cliente": "MI NEGOCIO SUPERMERCADOS, C.A.",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "02/07/2026 19:39",
      "pedido_numero": "1059",
      "cliente": "AGROPECUARIA DISTRIBUIDORA EL TALISMAN, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 07:14",
      "pedido_numero": "1060",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 07:19",
      "pedido_numero": "1063",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 07:19",
      "pedido_numero": "1062",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 07:19",
      "pedido_numero": "1061",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 07:24",
      "pedido_numero": "1065",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 07:24",
      "pedido_numero": "1064",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 08:44",
      "pedido_numero": "1064",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 08:44",
      "pedido_numero": "1065",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": null,
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 08:44",
      "pedido_numero": "1061",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": null,
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 08:44",
      "pedido_numero": "1062",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 08:44",
      "pedido_numero": "1063",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "Recibido",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 08:44",
      "pedido_numero": "1063",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 08:44",
      "pedido_numero": "1060",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 08:45",
      "pedido_numero": "1059",
      "cliente": "AGROPECUARIA DISTRIBUIDORA EL TALISMAN, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 08:45",
      "pedido_numero": "1058",
      "cliente": "PATA PATA ANIMAL MARKET., C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 08:45",
      "pedido_numero": "1057",
      "cliente": "AGROPECUARIA GUATIPEZ, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 08:45",
      "pedido_numero": "1055",
      "cliente": "4 PATITAS PETS SHOP, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 08:45",
      "pedido_numero": "1056",
      "cliente": "ONEMARKET.VE1630,C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 13:39",
      "pedido_numero": "1066",
      "cliente": "PETS MALL EXPRESS, C.A.",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 13:55",
      "pedido_numero": null,
      "cliente": null,
      "vendedor": null,
      "estado_anterior": null,
      "estado_nuevo": null,
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 14:04",
      "pedido_numero": "1067",
      "cliente": "INVERSIONES AVILA PETS COLOR, 2024 C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 14:24",
      "pedido_numero": "1068",
      "cliente": "INVERSIONES FANTASIA ANIMAL PET SHOP, C.A",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "03/07/2026 15:04",
      "pedido_numero": "1069",
      "cliente": "HIPERMERCADO PETARE, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": null,
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 09:09",
      "pedido_numero": "1073",
      "cliente": "INVERSIONES LA ESQUINA DEL DULCE, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 09:11",
      "pedido_numero": "1068",
      "cliente": "INVERSIONES FANTASIA ANIMAL PET SHOP, C.A",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 09:46",
      "pedido_numero": "1069",
      "cliente": "HIPERMERCADO PETARE, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 09:47",
      "pedido_numero": "1069",
      "cliente": "HIPERMERCADO PETARE, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "CXC",
      "estado_nuevo": "Recibido",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 09:47",
      "pedido_numero": "1069",
      "cliente": "HIPERMERCADO PETARE, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 09:47",
      "pedido_numero": "1068",
      "cliente": "INVERSIONES FANTASIA ANIMAL PET SHOP, C.A",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "CXC",
      "estado_nuevo": "Recibido",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 09:47",
      "pedido_numero": "1069",
      "cliente": "HIPERMERCADO PETARE, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "CXC",
      "estado_nuevo": "Recibido",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 09:47",
      "pedido_numero": "1073",
      "cliente": "INVERSIONES LA ESQUINA DEL DULCE, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "CXC",
      "estado_nuevo": "Recibido",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 09:48",
      "pedido_numero": "1073",
      "cliente": "INVERSIONES LA ESQUINA DEL DULCE, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 09:48",
      "pedido_numero": "1068",
      "cliente": "INVERSIONES FANTASIA ANIMAL PET SHOP, C.A",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 09:48",
      "pedido_numero": "1069",
      "cliente": "HIPERMERCADO PETARE, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 10:39",
      "pedido_numero": "T565",
      "cliente": "CENTRAL MADEIRENSE",
      "vendedor": null,
      "estado_anterior": "Entregado",
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 10:39",
      "pedido_numero": "T565",
      "cliente": "CENTRAL MADEIRENSE",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "Entregado",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 10:39",
      "pedido_numero": "2775",
      "cliente": "CENTRAL MADEIRENSE",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "Logística",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 15:39",
      "pedido_numero": "2770",
      "cliente": "FARMATODO CENDIS",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "Logística",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 18:18",
      "pedido_numero": "1079",
      "cliente": "AUTOMERCADO SANTA ROSA DE LIMA, C.A.",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 18:18",
      "pedido_numero": "1079",
      "cliente": "AUTOMERCADO SANTA ROSA DE LIMA, C.A.",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "CXC",
      "estado_nuevo": "Recibido",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 18:18",
      "pedido_numero": "1079",
      "cliente": "AUTOMERCADO SANTA ROSA DE LIMA, C.A.",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 18:19",
      "pedido_numero": "1078",
      "cliente": "E&J MEDICINA VETERINARIA, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 18:20",
      "pedido_numero": "1077",
      "cliente": "GRUPO MASCOTIK S FRJC, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 18:22",
      "pedido_numero": "1076",
      "cliente": "INVERSIONES MASCOTALANDIA II CA",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 18:24",
      "pedido_numero": "1075",
      "cliente": "EMPRENDIMIENTO EDUARDO MORILLO 4",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "06/07/2026 18:26",
      "pedido_numero": "1074",
      "cliente": "MI NEGOCIO SUPERMERCADOS, C.A.",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "07/07/2026 09:53",
      "pedido_numero": "1080",
      "cliente": "INVERSIONES PORTU-MASCOTAS, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "07/07/2026 10:48",
      "pedido_numero": "1067",
      "cliente": "INVERSIONES AVILA PETS COLOR, 2024 C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "07/07/2026 14:23",
      "pedido_numero": "*851",
      "cliente": "CENTRAL MADEIRENSE",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "Logística",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "07/07/2026 15:13",
      "pedido_numero": "2781",
      "cliente": "GAMA - SOLO FACTURA",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "Logística",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "07/07/2026 15:21",
      "pedido_numero": "1081",
      "cliente": "THE FAMILY PET SHOP 2003, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "07/07/2026 15:22",
      "pedido_numero": "1082",
      "cliente": "INVERSIONES HAPPY PETS 23, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "07/07/2026 15:23",
      "pedido_numero": "1084",
      "cliente": "PETS POINT, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "07/07/2026 15:24",
      "pedido_numero": "1085",
      "cliente": "EMPRENDIMNIENTO BRAYAN PARADA",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "07/07/2026 15:27",
      "pedido_numero": "1083",
      "cliente": "AGRO-FINCA DON FERNANDO C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "07/07/2026 15:51",
      "pedido_numero": "2774",
      "cliente": "PLAN SUAREZ  - URBINA",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "Logística",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "08/07/2026 09:39",
      "pedido_numero": "1087",
      "cliente": "DISTRIBUIDORA BELLPINO CENTRO, C.A.",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "08/07/2026 09:40",
      "pedido_numero": "1088",
      "cliente": "AGROHACIENDA, C.A.",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "08/07/2026 09:42",
      "pedido_numero": "1089",
      "cliente": "INVERSIONES LARA 2018 C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "08/07/2026 09:42",
      "pedido_numero": "1086",
      "cliente": "AGRO FUMILAGUNA 2018, C.A",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "08/07/2026 09:44",
      "pedido_numero": "1090",
      "cliente": "UNIVERSO ANIMAL PET SHOP C.A.",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "08/07/2026 09:54",
      "pedido_numero": "1091",
      "cliente": "CATANIA HIPERMERCADO, C.A.",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "08/07/2026 09:54",
      "pedido_numero": "1092",
      "cliente": "CATANIA HIPERMERCADO, C.A.",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "08/07/2026 09:54",
      "pedido_numero": "1093",
      "cliente": "CATANIA HIPERMERCADO, C.A.",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "08/07/2026 09:55",
      "pedido_numero": "1094",
      "cliente": "ARAMAX SHOP C.A.",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "08/07/2026 12:29",
      "pedido_numero": "1096",
      "cliente": "AUTOMERCADO SUPER ECONOMICO 23 C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "08/07/2026 12:57",
      "pedido_numero": "594",
      "cliente": "PETSPLANET VALENCIA  - CONSIGNACION",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "Logística",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "08/07/2026 15:01",
      "pedido_numero": "1095",
      "cliente": "ALI BABA Y SUS 40 MASCOTAS, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 07:50",
      "pedido_numero": "1035",
      "cliente": "CLINICA VETERINARIA ANIMALVET, C.A.",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "✏️ Monto Total (USD): 112.68",
      "estado_nuevo": "130",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 07:50",
      "pedido_numero": "1035",
      "cliente": "CLINICA VETERINARIA ANIMALVET, C.A.",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "✏️ Almacén: 35",
      "estado_nuevo": "2",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 07:50",
      "pedido_numero": "1035",
      "cliente": "CLINICA VETERINARIA ANIMALVET, C.A.",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "✏️ Fecha Despacho: Wed Jul 01 2026 00:00:00 GMT-0400 (hora de Venezuela)",
      "estado_nuevo": "101/07/2026",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 07:51",
      "pedido_numero": "1035",
      "cliente": "CLINICA VETERINARIA ANIMALVET, C.A.",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "✏️ Almacén: 2",
      "estado_nuevo": null,
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 07:51",
      "pedido_numero": "1035",
      "cliente": "CLINICA VETERINARIA ANIMALVET, C.A.",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "✏️ Fecha Despacho: 101/07/2026",
      "estado_nuevo": "10/07/2026",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 07:51",
      "pedido_numero": "1034",
      "cliente": "PETSPLUS 2023, C.A",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 07:52",
      "pedido_numero": "1034",
      "cliente": "PETSPLUS 2023, C.A",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "CXC",
      "estado_nuevo": "Facturación",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 08:04",
      "pedido_numero": "1034",
      "cliente": "PETSPLUS 2023, C.A",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "Facturación",
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 11:57",
      "pedido_numero": "1100",
      "cliente": "INVERSIONES LAS XXX 2016, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 11:57",
      "pedido_numero": "1097",
      "cliente": "COMERCIALIZADORA NUTRIPET C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 11:57",
      "pedido_numero": "1098",
      "cliente": "MASTERS DOG S, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 11:57",
      "pedido_numero": "1099",
      "cliente": "INVERSIONES AVIMASCOTA 2010 C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 12:43",
      "pedido_numero": "2791",
      "cliente": "CORPORACION ARAS SOLO FACTURA",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "Logística",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 12:50",
      "pedido_numero": "1070",
      "cliente": "EMPRENDIMIENTO ANA CASTILLO 30",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 12:50",
      "pedido_numero": "1072",
      "cliente": "EMPRENDIMIENTO ANA CASTILLO 30",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 12:50",
      "pedido_numero": "1071",
      "cliente": "EMPRENDIMIENTO ANA CASTILLO 30",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 13:01",
      "pedido_numero": "1072",
      "cliente": "EMPRENDIMIENTO ANA CASTILLO 30",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "CXC",
      "estado_nuevo": "Logística",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 13:07",
      "pedido_numero": "1072",
      "cliente": "EMPRENDIMIENTO ANA CASTILLO 30",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "Logística",
      "estado_nuevo": "En Ruta",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 13:14",
      "pedido_numero": "1072",
      "cliente": "EMPRENDIMIENTO ANA CASTILLO 30",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "En Ruta",
      "estado_nuevo": "Recibido",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 13:14",
      "pedido_numero": "1072",
      "cliente": "EMPRENDIMIENTO ANA CASTILLO 30",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 13:21",
      "pedido_numero": "1101",
      "cliente": "AVICOLA HUELLAS Y BIGOTES C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 15:17",
      "pedido_numero": "1103",
      "cliente": "INVERSIONES COFFE MOL 2018, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 15:17",
      "pedido_numero": "1106",
      "cliente": "POSITIVO PETS SHOP, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "09/07/2026 15:17",
      "pedido_numero": "1102",
      "cliente": "INVERSIONES MADVEN 2015, C.A.",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "10/07/2026 08:38",
      "pedido_numero": "1107",
      "cliente": "DISTRIBUIDORA KOWU 01, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "10/07/2026 08:38",
      "pedido_numero": "1109",
      "cliente": "AGROPECUARIA DISTRIBUIDORA EL TALISMAN, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "10/07/2026 11:46",
      "pedido_numero": "1111",
      "cliente": "MUNDO MASCOTAS, C.A.",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "10/07/2026 11:46",
      "pedido_numero": "1108",
      "cliente": "ACUARIO ATLANTIC CENTER C.A.",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "10/07/2026 11:46",
      "pedido_numero": "1112",
      "cliente": "INVERSIONES CHAMTOR SEGUNDA, C.A",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "10/07/2026 12:12",
      "pedido_numero": "1113",
      "cliente": "NEY SPORT PUNTO FIJO, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "10/07/2026 12:12",
      "pedido_numero": "1114",
      "cliente": "MAX AGROALIMENTARIA 2012, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "10/07/2026 12:12",
      "pedido_numero": "1115",
      "cliente": "HUELLAS PET CENTER, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "10/07/2026 12:37",
      "pedido_numero": "1116",
      "cliente": "LA CUEVA DE TU MASCOTA 2009, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "10/07/2026 15:02",
      "pedido_numero": "1117",
      "cliente": "EMPRENDIMIENTO ANA CASTILLO 30",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "sistema"
    },
    {
      "ts": "13/07/2026 10:07",
      "pedido_numero": "1119",
      "cliente": "EDGAR ALEXANDER ESPINOZA PERALES",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "13/07/2026 11:31",
      "pedido_numero": "5799",
      "cliente": "PETS PLANET  VAL#ENCIA SOLO FACTURA",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "Recibido",
      "estado_nuevo": "Logística",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "13/07/2026 11:54",
      "pedido_numero": "2800",
      "cliente": "CENTRAL MADEIRENSE",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "Logística",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "13/07/2026 12:04",
      "pedido_numero": "1123",
      "cliente": "PROYECTO ANIMAL PLANET, C.A",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "13/07/2026 12:42",
      "pedido_numero": "1120",
      "cliente": "GRUPO ANANAS, C.A.",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "13/7/2026 12:42:40",
      "pedido_numero": "1122",
      "cliente": "AUTOMERCADO SANTA PAULA, C.A.",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "13/07/2026 12:42",
      "pedido_numero": "1121",
      "cliente": "MERCATO MARKET C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "13/07/2026 12:42",
      "pedido_numero": "1124",
      "cliente": "AGROPECUARIA RUIZ PINEDA C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "13/07/2026 14:40",
      "pedido_numero": "1125",
      "cliente": "PANCA GROUP, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Almacén: 2",
      "estado_nuevo": "2",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "13/07/2026 14:40",
      "pedido_numero": "1125",
      "cliente": "PANCA GROUP, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Fecha Despacho: Tue Jul 14 2026 00:00:00 GMT-0400 (hora de Venezuela)",
      "estado_nuevo": "15/07/2026",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "13/07/2026 14:40",
      "pedido_numero": "1125",
      "cliente": "PANCA GROUP, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Observaciones: este pedido se entrega en catia",
      "estado_nuevo": "este pedido se entrega en catia // es factura",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "13/07/2026 14:40",
      "pedido_numero": "1125",
      "cliente": "PANCA GROUP, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "13/07/2026 15:45",
      "pedido_numero": "1130",
      "cliente": "NINA MASCOTAS, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "13/07/2026 15:45",
      "pedido_numero": "1129",
      "cliente": "UNIMASCOTAS CHACAO, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "13/07/2026 15:45",
      "pedido_numero": "1127",
      "cliente": "GRUPO CONEXION NATURAL J.C, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "13/07/2026 16:37",
      "pedido_numero": "1131",
      "cliente": "INVERSIONES EL HOGAR DE LA MASCOT S 2011 C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "14/07/2026 09:52",
      "pedido_numero": "1132",
      "cliente": "COMERCIAL OS-ZAM, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "14/07/2026 13:01",
      "pedido_numero": "1133",
      "cliente": "AVICOLA PETARE, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "14/07/2026 13:01",
      "pedido_numero": "1134",
      "cliente": "AVICOLA ANIMALADA, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "14/07/2026 14:29",
      "pedido_numero": "2807",
      "cliente": "GAMA - SOLO FACTURA",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "Logística",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "15/07/2026 13:32",
      "pedido_numero": "1141",
      "cliente": "INVERSIONES COLD 2024, C.A.",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "15/07/2026 15:32",
      "pedido_numero": "1138",
      "cliente": "PET SHOP MUNDO ANIMAL 2.0, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "sistema"
    },
    {
      "ts": "15/07/2026 15:32",
      "pedido_numero": "1140",
      "cliente": "AVICUARIO LA GUINEA REAL C A",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "sistema"
    },
    {
      "ts": "15/07/2026 17:00",
      "pedido_numero": "1129",
      "cliente": "UNIMASCOTAS CHACAO, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "✏️ Almacén: 2",
      "estado_nuevo": "2",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "15/07/2026 17:00",
      "pedido_numero": "1129",
      "cliente": "UNIMASCOTAS CHACAO, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "✏️ Transporte: MOTORIZADO PUNKY",
      "estado_nuevo": "Motorizado Punky",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "15/07/2026 17:00",
      "pedido_numero": "1129",
      "cliente": "UNIMASCOTAS CHACAO, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "✏️ Tipo de Transporte: MOTO",
      "estado_nuevo": "Moto",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "15/07/2026 17:00",
      "pedido_numero": "1129",
      "cliente": "UNIMASCOTAS CHACAO, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "✏️ Fecha Compromiso Logística: Wed Jul 15 2026 00:00:00 GMT-0400 (hora de Venezuela)",
      "estado_nuevo": "15/07/2026",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "15/07/2026 17:00",
      "pedido_numero": "1129",
      "cliente": "UNIMASCOTAS CHACAO, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Logística",
      "estado_nuevo": "En Ruta",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "15/07/2026 17:01",
      "pedido_numero": "1133",
      "cliente": "AVICOLA PETARE, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "✏️ Almacén: 2",
      "estado_nuevo": "2",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "15/07/2026 17:01",
      "pedido_numero": "1133",
      "cliente": "AVICOLA PETARE, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "✏️ Transporte: —",
      "estado_nuevo": "Motorizado Punky",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "15/07/2026 17:01",
      "pedido_numero": "1133",
      "cliente": "AVICOLA PETARE, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "✏️ Tipo de Transporte: —",
      "estado_nuevo": "Moto",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "15/07/2026 17:01",
      "pedido_numero": "1133",
      "cliente": "AVICOLA PETARE, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "✏️ Ciudad Destino: —",
      "estado_nuevo": "CARACAS",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "15/07/2026 17:01",
      "pedido_numero": "1133",
      "cliente": "AVICOLA PETARE, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "✏️ Fecha Compromiso Logística: —",
      "estado_nuevo": "15/07/2026",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "15/07/2026 17:01",
      "pedido_numero": "1133",
      "cliente": "AVICOLA PETARE, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Logística",
      "estado_nuevo": "En Ruta",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "15/07/2026 17:01",
      "pedido_numero": "1133",
      "cliente": "AVICOLA PETARE, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "En Ruta",
      "estado_nuevo": "Entregado",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "15/07/2026 17:02",
      "pedido_numero": "1129",
      "cliente": "UNIMASCOTAS CHACAO, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "En Ruta",
      "estado_nuevo": "Entregado",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 07:40",
      "pedido_numero": "1096",
      "cliente": "AUTOMERCADO SUPER ECONOMICO 23 C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "✏️ Almacén: 2",
      "estado_nuevo": "2",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 07:40",
      "pedido_numero": "1096",
      "cliente": "AUTOMERCADO SUPER ECONOMICO 23 C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "✏️ Transporte: —",
      "estado_nuevo": "Motorizado Punky",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 07:40",
      "pedido_numero": "1096",
      "cliente": "AUTOMERCADO SUPER ECONOMICO 23 C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "✏️ Tipo de Transporte: —",
      "estado_nuevo": "Moto",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 07:40",
      "pedido_numero": "1096",
      "cliente": "AUTOMERCADO SUPER ECONOMICO 23 C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "✏️ Fecha Compromiso Logística: —",
      "estado_nuevo": "17/07/2026",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 08:25",
      "pedido_numero": "1142",
      "cliente": "INVERSIONES COLD 2024, C.A.",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 08:26",
      "pedido_numero": "1143",
      "cliente": "AGRO-FINCA DON FERNANDO C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 13:09",
      "pedido_numero": "1144",
      "cliente": "INVERSIONES NATHALIE M&A,C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 13:09",
      "pedido_numero": "1146",
      "cliente": "SHM FASHION PETS, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 13:09",
      "pedido_numero": "1149",
      "cliente": "PELUDOSPETS2024, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 13:09",
      "pedido_numero": "1148",
      "cliente": "ONEMARKET.VE1630,C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 15:36",
      "pedido_numero": "2813",
      "cliente": "PETSPLANET VALENCIA  - CONSIGNACION",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "Logística",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 16:54",
      "pedido_numero": "1148",
      "cliente": "ONEMARKET.VE1630,C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "CXC",
      "estado_nuevo": "Facturación",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 16:55",
      "pedido_numero": "1148",
      "cliente": "ONEMARKET.VE1630,C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "✏️ Nro. Nota: —",
      "estado_nuevo": "2823",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 16:55",
      "pedido_numero": "1148",
      "cliente": "ONEMARKET.VE1630,C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Facturación",
      "estado_nuevo": "Logística",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 16:55",
      "pedido_numero": "1146",
      "cliente": "SHM FASHION PETS, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Nro. Factura: —",
      "estado_nuevo": "2814",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 16:55",
      "pedido_numero": "1146",
      "cliente": "SHM FASHION PETS, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Facturación",
      "estado_nuevo": "Logística",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 16:56",
      "pedido_numero": "1149",
      "cliente": "PELUDOSPETS2024, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Nro. Nota: —",
      "estado_nuevo": "2825",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 16:56",
      "pedido_numero": "1149",
      "cliente": "PELUDOSPETS2024, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Facturación",
      "estado_nuevo": "Logística",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 17:01",
      "pedido_numero": "1001",
      "cliente": "PET HOME PETARE, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "CXC",
      "estado_nuevo": "Facturación",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 17:01",
      "pedido_numero": "1001",
      "cliente": "PET HOME PETARE, C.A.",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Facturación",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 17:15",
      "pedido_numero": "1150",
      "cliente": "PABLO JOSE TRUJILLO ALIENDRES",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Almacén: 2",
      "estado_nuevo": "2",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 17:15",
      "pedido_numero": "1150",
      "cliente": "PABLO JOSE TRUJILLO ALIENDRES",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Fecha Despacho: Mon Jul 20 2026 00:00:00 GMT-0400 (hora de Venezuela)",
      "estado_nuevo": "17/07/2026",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 17:15",
      "pedido_numero": "1150",
      "cliente": "PABLO JOSE TRUJILLO ALIENDRES",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 17:16",
      "pedido_numero": "1150",
      "cliente": "PABLO JOSE TRUJILLO ALIENDRES",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "CXC",
      "estado_nuevo": "Recibido",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 17:17",
      "pedido_numero": "1150",
      "cliente": "PABLO JOSE TRUJILLO ALIENDRES",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Almacén: 2",
      "estado_nuevo": "2",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 17:17",
      "pedido_numero": "1150",
      "cliente": "PABLO JOSE TRUJILLO ALIENDRES",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Fecha Despacho: Fri Jul 17 2026 00:00:00 GMT-0400 (hora de Venezuela)",
      "estado_nuevo": "17/07/2026",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 17:17",
      "pedido_numero": "1150",
      "cliente": "PABLO JOSE TRUJILLO ALIENDRES",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Observaciones: este cliente esta en catia",
      "estado_nuevo": "catia - LLAMAR A BRAYAN ANTES DE DESPACHAR",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 17:17",
      "pedido_numero": "1150",
      "cliente": "PABLO JOSE TRUJILLO ALIENDRES",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 17:17",
      "pedido_numero": "1151",
      "cliente": "POSITIVO PETS SHOP, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Almacén: 2",
      "estado_nuevo": null,
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 17:17",
      "pedido_numero": "1151",
      "cliente": "POSITIVO PETS SHOP, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Fecha Despacho: Mon Jul 20 2026 00:00:00 GMT-0400 (hora de Venezuela)",
      "estado_nuevo": "17/07/2026",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "16/07/2026 17:17",
      "pedido_numero": "1151",
      "cliente": "POSITIVO PETS SHOP, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "andreas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 09:28",
      "pedido_numero": "1152",
      "cliente": "INVERSIONES CHAMTOR SEGUNDA, C.A",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 09:29",
      "pedido_numero": "1151",
      "cliente": "POSITIVO PETS SHOP, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Nro. Nota: —",
      "estado_nuevo": "2826",
      "usuario": "punkypet.facturacion@gmail.com"
    },
    {
      "ts": "17/07/2026 09:29",
      "pedido_numero": "1151",
      "cliente": "POSITIVO PETS SHOP, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Facturación",
      "estado_nuevo": "Logística",
      "usuario": "punkypet.facturacion@gmail.com"
    },
    {
      "ts": "17/07/2026 09:29",
      "pedido_numero": "1152",
      "cliente": "INVERSIONES CHAMTOR SEGUNDA, C.A",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": "CXC",
      "estado_nuevo": "Facturación",
      "usuario": "punkypet.cobranza@gmail.com"
    },
    {
      "ts": "17/07/2026 09:29",
      "pedido_numero": "1150",
      "cliente": "PABLO JOSE TRUJILLO ALIENDRES",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Nro. Nota: —",
      "estado_nuevo": "2827",
      "usuario": "punkypet.facturacion@gmail.com"
    },
    {
      "ts": "17/07/2026 09:30",
      "pedido_numero": "1150",
      "cliente": "PABLO JOSE TRUJILLO ALIENDRES",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Facturación",
      "estado_nuevo": "Logística",
      "usuario": "punkypet.facturacion@gmail.com"
    },
    {
      "ts": "17/07/2026 09:30",
      "pedido_numero": "1152",
      "cliente": "INVERSIONES CHAMTOR SEGUNDA, C.A",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": "✏️ Nro. Factura: —",
      "estado_nuevo": "2818",
      "usuario": "punkypet.facturacion@gmail.com"
    },
    {
      "ts": "17/07/2026 09:30",
      "pedido_numero": "1152",
      "cliente": "INVERSIONES CHAMTOR SEGUNDA, C.A",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": "Facturación",
      "estado_nuevo": "Logística",
      "usuario": "punkypet.facturacion@gmail.com"
    },
    {
      "ts": "17/07/2026 12:28",
      "pedido_numero": "1155",
      "cliente": "INVERSIONES COMIDASCOTAS D&A 2025, C.A",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "✏️ Monto Total (USD): 409.80",
      "estado_nuevo": "401.60",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 12:28",
      "pedido_numero": "1155",
      "cliente": "INVERSIONES COMIDASCOTAS D&A 2025, C.A",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "✏️ Almacén: 2",
      "estado_nuevo": null,
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 12:28",
      "pedido_numero": "1155",
      "cliente": "INVERSIONES COMIDASCOTAS D&A 2025, C.A",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "✏️ Fecha Despacho: Sun Jul 19 2026 00:00:00 GMT-0400 (hora de Venezuela)",
      "estado_nuevo": "20/07/2026",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 12:28",
      "pedido_numero": "1155",
      "cliente": "INVERSIONES COMIDASCOTAS D&A 2025, C.A",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 12:33",
      "pedido_numero": "1156",
      "cliente": "REINO DE MASCOTAS C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Almacén: 2",
      "estado_nuevo": null,
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 12:33",
      "pedido_numero": "1156",
      "cliente": "REINO DE MASCOTAS C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Fecha Despacho: Thu Jul 23 2026 00:00:00 GMT-0400 (hora de Venezuela)",
      "estado_nuevo": "23/07/2026",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 12:33",
      "pedido_numero": "1156",
      "cliente": "REINO DE MASCOTAS C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Observaciones: por fa este pedido que no salga antes gracias abre a partir",
      "estado_nuevo": "No despachar antes de las 9am, pedido para el 23/07/2026",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 12:33",
      "pedido_numero": "1156",
      "cliente": "REINO DE MASCOTAS C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 12:40",
      "pedido_numero": "1154",
      "cliente": "BODEGON URBINA 21, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Almacén: 2",
      "estado_nuevo": null,
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 12:40",
      "pedido_numero": "1154",
      "cliente": "BODEGON URBINA 21, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Fecha Despacho: Mon Jul 20 2026 00:00:00 GMT-0400 (hora de Venezuela)",
      "estado_nuevo": "20/07/2026",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 12:40",
      "pedido_numero": "1154",
      "cliente": "BODEGON URBINA 21, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 14:19",
      "pedido_numero": "1157",
      "cliente": "HIPERMERCADO PETARE, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "✏️ Fecha Despacho: Sun Jul 19 2026 00:00:00 GMT-0400 (hora de Venezuela)",
      "estado_nuevo": "20/07/2026",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 14:19",
      "pedido_numero": "1157",
      "cliente": "HIPERMERCADO PETARE, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 14:20",
      "pedido_numero": "1153",
      "cliente": "AVICOLA EL REY LEON 2025., C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Almacén: 2",
      "estado_nuevo": null,
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 14:20",
      "pedido_numero": "1153",
      "cliente": "AVICOLA EL REY LEON 2025., C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Fecha Despacho: Mon Jul 20 2026 00:00:00 GMT-0400 (hora de Venezuela)",
      "estado_nuevo": "20/07/2026",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 14:20",
      "pedido_numero": "1153",
      "cliente": "AVICOLA EL REY LEON 2025., C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Observaciones: dure casi una hora hablando coon ella pero ya por fin vamos",
      "estado_nuevo": null,
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 14:20",
      "pedido_numero": "1153",
      "cliente": "AVICOLA EL REY LEON 2025., C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 14:47",
      "pedido_numero": "1153",
      "cliente": "AVICOLA EL REY LEON 2025., C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "CXC",
      "estado_nuevo": "Facturación",
      "usuario": "valentina@punkypartners.com"
    },
    {
      "ts": "17/07/2026 14:49",
      "pedido_numero": "1154",
      "cliente": "BODEGON URBINA 21, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "CXC",
      "estado_nuevo": "Facturación",
      "usuario": "valentina@punkypartners.com"
    },
    {
      "ts": "17/07/2026 14:53",
      "pedido_numero": "1157",
      "cliente": "HIPERMERCADO PETARE, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "CXC",
      "estado_nuevo": "Facturación",
      "usuario": "valentina@punkypartners.com"
    },
    {
      "ts": "17/07/2026 14:59",
      "pedido_numero": "2773",
      "cliente": "FARMATODO CENDIS",
      "vendedor": null,
      "estado_anterior": "En Ruta",
      "estado_nuevo": "Entregado",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "17/07/2026 15:05",
      "pedido_numero": "1117",
      "cliente": "EMPRENDIMIENTO ANA CASTILLO 30",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "En Ruta",
      "estado_nuevo": "Entregado",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "17/07/2026 15:06",
      "pedido_numero": "1111",
      "cliente": "MUNDO MASCOTAS, C.A.",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": "En Ruta",
      "estado_nuevo": "Entregado",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "17/07/2026 15:06",
      "pedido_numero": "1108",
      "cliente": "ACUARIO ATLANTIC CENTER C.A.",
      "vendedor": "CARACAS  MCBO",
      "estado_anterior": "En Ruta",
      "estado_nuevo": "Entregado",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "17/07/2026 15:07",
      "pedido_numero": "1072",
      "cliente": "EMPRENDIMIENTO ANA CASTILLO 30",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "En Ruta",
      "estado_nuevo": "Entregado",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "17/07/2026 15:07",
      "pedido_numero": "1071",
      "cliente": "EMPRENDIMIENTO ANA CASTILLO 30",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "En Ruta",
      "estado_nuevo": "Entregado",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "17/07/2026 15:08",
      "pedido_numero": "1070",
      "cliente": "EMPRENDIMIENTO ANA CASTILLO 30",
      "vendedor": "Kenibel Escalona",
      "estado_anterior": "En Ruta",
      "estado_nuevo": "Entregado",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "17/07/2026 15:20",
      "pedido_numero": "1157",
      "cliente": "HIPERMERCADO PETARE, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "✏️ Nro. Nota: —",
      "estado_nuevo": "2831",
      "usuario": "punkypet.facturacion@gmail.com"
    },
    {
      "ts": "17/07/2026 15:20",
      "pedido_numero": "1157",
      "cliente": "HIPERMERCADO PETARE, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Facturación",
      "estado_nuevo": "Logística",
      "usuario": "punkypet.facturacion@gmail.com"
    },
    {
      "ts": "17/07/2026 15:21",
      "pedido_numero": "1153",
      "cliente": "AVICOLA EL REY LEON 2025., C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Nro. Nota: —",
      "estado_nuevo": "2830",
      "usuario": "punkypet.facturacion@gmail.com"
    },
    {
      "ts": "17/07/2026 15:21",
      "pedido_numero": "1153",
      "cliente": "AVICOLA EL REY LEON 2025., C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Facturación",
      "estado_nuevo": "Logística",
      "usuario": "punkypet.facturacion@gmail.com"
    },
    {
      "ts": "17/07/2026 15:21",
      "pedido_numero": "1154",
      "cliente": "BODEGON URBINA 21, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Nro. Nota: —",
      "estado_nuevo": "2829",
      "usuario": "punkypet.facturacion@gmail.com"
    },
    {
      "ts": "17/07/2026 15:21",
      "pedido_numero": "1154",
      "cliente": "BODEGON URBINA 21, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Facturación",
      "estado_nuevo": "Logística",
      "usuario": "punkypet.facturacion@gmail.com"
    },
    {
      "ts": "17/07/2026 15:33",
      "pedido_numero": "1158",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "✏️ Fecha Despacho: Mon Jul 20 2026 00:00:00 GMT-0400 (hora de Venezuela)",
      "estado_nuevo": "20/07/2026",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 15:33",
      "pedido_numero": "1158",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 15:39",
      "pedido_numero": "1156",
      "cliente": "REINO DE MASCOTAS C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "CXC",
      "estado_nuevo": "Facturación",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 15:39",
      "pedido_numero": "1156",
      "cliente": "REINO DE MASCOTAS C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Nro. Nota: —",
      "estado_nuevo": "2828",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 15:39",
      "pedido_numero": "1156",
      "cliente": "REINO DE MASCOTAS C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Facturación",
      "estado_nuevo": "Logística",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "17/07/2026 15:44",
      "pedido_numero": "1150",
      "cliente": "PABLO JOSE TRUJILLO ALIENDRES",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "En Ruta",
      "estado_nuevo": "Entregado",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "17/07/2026 15:45",
      "pedido_numero": "1149",
      "cliente": "PELUDOSPETS2024, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "En Ruta",
      "estado_nuevo": "Entregado",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "17/07/2026 15:55",
      "pedido_numero": "1155",
      "cliente": "INVERSIONES COMIDASCOTAS D&A 2025, C.A",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "CXC",
      "estado_nuevo": "Facturación",
      "usuario": "valentina@punkypartners.com"
    },
    {
      "ts": "17/07/2026 16:19",
      "pedido_numero": "1149",
      "cliente": "PELUDOSPETS2024, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "En Ruta",
      "estado_nuevo": "Entregado",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "17/07/2026 16:19",
      "pedido_numero": "1150",
      "cliente": "PABLO JOSE TRUJILLO ALIENDRES",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "En Ruta",
      "estado_nuevo": "Entregado",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "17/07/2026 16:22",
      "pedido_numero": "1158",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "CXC",
      "estado_nuevo": "Facturación",
      "usuario": "valentina@punkypartners.com"
    },
    {
      "ts": "20/07/2026 08:58",
      "pedido_numero": "1159",
      "cliente": "TOP ANIMAL, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Almacén: 2",
      "estado_nuevo": null,
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "20/07/2026 08:58",
      "pedido_numero": "1159",
      "cliente": "TOP ANIMAL, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Fecha Despacho: Mon Jul 20 2026 00:00:00 GMT-0400 (hora de Venezuela)",
      "estado_nuevo": "20/07/2026",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "20/07/2026 08:58",
      "pedido_numero": "1159",
      "cliente": "TOP ANIMAL, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Recibido",
      "estado_nuevo": "CXC",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "20/07/2026 09:26",
      "pedido_numero": "1159",
      "cliente": "TOP ANIMAL, C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "CXC",
      "estado_nuevo": "Facturación",
      "usuario": "punkypet.cobranza@gmail.com"
    },
    {
      "ts": "20/07/2026 09:48",
      "pedido_numero": "1154",
      "cliente": "BODEGON URBINA 21, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Transporte: —",
      "estado_nuevo": "Motorizado Punky",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "20/07/2026 09:48",
      "pedido_numero": "1154",
      "cliente": "BODEGON URBINA 21, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Tipo de Transporte: —",
      "estado_nuevo": "Moto",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "20/07/2026 09:48",
      "pedido_numero": "1154",
      "cliente": "BODEGON URBINA 21, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Ciudad Destino: —",
      "estado_nuevo": "CARACAS",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "20/07/2026 09:48",
      "pedido_numero": "1154",
      "cliente": "BODEGON URBINA 21, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Ruta: —",
      "estado_nuevo": "PETARE",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "20/07/2026 09:48",
      "pedido_numero": "1154",
      "cliente": "BODEGON URBINA 21, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Fecha Compromiso Logística: —",
      "estado_nuevo": "20/07/2026",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "20/07/2026 09:48",
      "pedido_numero": "1154",
      "cliente": "BODEGON URBINA 21, C.A",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Logística",
      "estado_nuevo": "En Ruta",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "20/07/2026 09:50",
      "pedido_numero": "1157",
      "cliente": "HIPERMERCADO PETARE, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "✏️ Transporte: —",
      "estado_nuevo": "Motorizado Punky",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "20/07/2026 09:50",
      "pedido_numero": "1157",
      "cliente": "HIPERMERCADO PETARE, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "✏️ Tipo de Transporte: —",
      "estado_nuevo": "Moto",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "20/07/2026 09:50",
      "pedido_numero": "1157",
      "cliente": "HIPERMERCADO PETARE, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "✏️ Ciudad Destino: —",
      "estado_nuevo": "CARACAS",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "20/07/2026 09:50",
      "pedido_numero": "1157",
      "cliente": "HIPERMERCADO PETARE, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "✏️ Ruta: —",
      "estado_nuevo": "PETARE",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "20/07/2026 09:50",
      "pedido_numero": "1157",
      "cliente": "HIPERMERCADO PETARE, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "✏️ Fecha Compromiso Logística: —",
      "estado_nuevo": "20/07/2026",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "20/07/2026 09:50",
      "pedido_numero": "1157",
      "cliente": "HIPERMERCADO PETARE, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Logística",
      "estado_nuevo": "En Ruta",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "20/07/2026 10:18",
      "pedido_numero": "2824",
      "cliente": "CENTRAL MADEIRENSE",
      "vendedor": null,
      "estado_anterior": "Recibido",
      "estado_nuevo": "Logística",
      "usuario": "ventas@punkypartners.com"
    },
    {
      "ts": "20/07/2026 10:56",
      "pedido_numero": "1153",
      "cliente": "AVICOLA EL REY LEON 2025., C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Transporte: —",
      "estado_nuevo": "Motorizado Punky",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "20/07/2026 10:56",
      "pedido_numero": "1153",
      "cliente": "AVICOLA EL REY LEON 2025., C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Tipo de Transporte: —",
      "estado_nuevo": "Moto",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "20/07/2026 10:56",
      "pedido_numero": "1153",
      "cliente": "AVICOLA EL REY LEON 2025., C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Ciudad Destino: —",
      "estado_nuevo": "CARACAS",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "20/07/2026 10:56",
      "pedido_numero": "1153",
      "cliente": "AVICOLA EL REY LEON 2025., C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Ruta: —",
      "estado_nuevo": "PETARE",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "20/07/2026 10:56",
      "pedido_numero": "1153",
      "cliente": "AVICOLA EL REY LEON 2025., C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "✏️ Fecha Compromiso Logística: —",
      "estado_nuevo": "20/07/2026",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "20/07/2026 10:56",
      "pedido_numero": "1153",
      "cliente": "AVICOLA EL REY LEON 2025., C.A.",
      "vendedor": "Brayan Carpio",
      "estado_anterior": "Logística",
      "estado_nuevo": "En Ruta",
      "usuario": "punkypet.logistica@gmail.com"
    },
    {
      "ts": "20/07/2026 11:06",
      "pedido_numero": "1158",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "✏️ Nro. Factura: —",
      "estado_nuevo": "2827",
      "usuario": "punkypet.facturacion@gmail.com"
    },
    {
      "ts": "20/07/2026 11:06",
      "pedido_numero": "1158",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "estado_anterior": "Facturación",
      "estado_nuevo": "Logística",
      "usuario": "punkypet.facturacion@gmail.com"
    },
    {
      "ts": "20/07/2026 11:06",
      "pedido_numero": "1155",
      "cliente": "INVERSIONES COMIDASCOTAS D&A 2025, C.A",
      "vendedor": "Ivan Desantiago",
      "estado_anterior": "✏️ Nro. Nota: —",
      "estado_nuevo": "2832",
      "usuario": "punkypet.facturacion@gmail.com"
    }
  ],
  "logistica": [
    {
      "pedido_numero": "1151",
      "nro_factura": null,
      "estado_despacho": "Pendiente",
      "mes": "julio",
      "semana": "2026-S29",
      "cliente": "POSITIVO PETS SHOP, C.A",
      "vendedor": "Brayan Carpio",
      "almacen": "2",
      "destino": "EL CEMENTERIO",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-17",
      "compromiso_logistica": "2026-07-20",
      "fecha_pedido": "2026-07-16",
      "fecha_entregado": null,
      "dias_para_entregar": null,
      "devolucion": "TODO CONFORME",
      "transporte": "Motorizado Punky",
      "tipo_transporte": "Moto",
      "unidades_fable": 0,
      "unidades_pp": 22,
      "kilos": 12,
      "monto_fable": 0,
      "monto_pp": 292.23,
      "monto_total": 292.23,
      "observaciones": "el cliente notifica que si le puede llegar este pedido",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": "1152",
      "nro_factura": "2818",
      "estado_despacho": "Pendiente",
      "mes": "julio",
      "semana": "2026-S29",
      "cliente": "INVERSIONES CHAMTOR SEGUNDA, C.A",
      "vendedor": "CARACAS  MCBO",
      "almacen": "2",
      "destino": "LAS ACACIAS",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-20",
      "compromiso_logistica": "2026-07-20",
      "fecha_pedido": "2026-07-17",
      "fecha_entregado": null,
      "dias_para_entregar": null,
      "devolucion": "TODO CONFORME",
      "transporte": "Motorizado Punky",
      "tipo_transporte": "Moto",
      "unidades_fable": 0,
      "unidades_pp": 9,
      "kilos": 9,
      "monto_fable": 0,
      "monto_pp": 307.63,
      "monto_total": 307.63,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": "5799",
      "nro_factura": "2799",
      "estado_despacho": "Pendiente",
      "mes": "julio",
      "semana": "2026-S29",
      "cliente": "PETS PLANET  VALENCIA SOLO FACTURA",
      "vendedor": "Kenibel Escalona",
      "almacen": null,
      "destino": "VALENCIA",
      "ciudad_destino": "VALENCIA",
      "promesa_entrega": null,
      "compromiso_logistica": "2026-07-23",
      "fecha_pedido": "2026-07-13",
      "fecha_entregado": null,
      "dias_para_entregar": null,
      "devolucion": null,
      "transporte": null,
      "tipo_transporte": null,
      "unidades_fable": null,
      "unidades_pp": null,
      "kilos": null,
      "monto_fable": null,
      "monto_pp": null,
      "monto_total": null,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": "2813",
      "nro_factura": "2813",
      "estado_despacho": "Pendiente",
      "mes": "julio",
      "semana": "2026-S29",
      "cliente": "PETS PLANET VALENCIA  SOLO FACTURA",
      "vendedor": "Kenibel Escalona",
      "almacen": null,
      "destino": "VALENCIA",
      "ciudad_destino": "VALENCIA",
      "promesa_entrega": null,
      "compromiso_logistica": "2026-07-23",
      "fecha_pedido": "2026-07-16",
      "fecha_entregado": null,
      "dias_para_entregar": null,
      "devolucion": null,
      "transporte": null,
      "tipo_transporte": null,
      "unidades_fable": null,
      "unidades_pp": null,
      "kilos": null,
      "monto_fable": null,
      "monto_pp": null,
      "monto_total": null,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": null,
      "mes": null,
      "semana": null,
      "cliente": null,
      "vendedor": null,
      "almacen": null,
      "destino": null,
      "ciudad_destino": null,
      "promesa_entrega": null,
      "compromiso_logistica": null,
      "fecha_pedido": null,
      "fecha_entregado": null,
      "dias_para_entregar": null,
      "devolucion": null,
      "transporte": null,
      "tipo_transporte": null,
      "unidades_fable": null,
      "unidades_pp": null,
      "kilos": null,
      "monto_fable": null,
      "monto_pp": null,
      "monto_total": null,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": "1149",
      "nro_factura": null,
      "estado_despacho": "En Ruta",
      "mes": "julio",
      "semana": "2026-S29",
      "cliente": "PELUDOSPETS2024, C.A.",
      "vendedor": "Brayan Carpio",
      "almacen": "2",
      "destino": null,
      "ciudad_destino": null,
      "promesa_entrega": "2026-07-17",
      "compromiso_logistica": "2026-07-17",
      "fecha_pedido": "2026-07-16",
      "fecha_entregado": null,
      "dias_para_entregar": null,
      "devolucion": null,
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": null,
      "unidades_pp": null,
      "kilos": null,
      "monto_fable": null,
      "monto_pp": null,
      "monto_total": 100.57,
      "observaciones": "si lo pueden despachar manñana no habia problema tma si no",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": "1150",
      "nro_factura": null,
      "estado_despacho": "En Ruta",
      "mes": "julio",
      "semana": "2026-S29",
      "cliente": "PABLO JOSE TRUJILLO ALIENDRES",
      "vendedor": "Brayan Carpio",
      "almacen": "2",
      "destino": "CATIA",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-17",
      "compromiso_logistica": "2026-07-17",
      "fecha_pedido": "2026-07-16",
      "fecha_entregado": null,
      "dias_para_entregar": null,
      "devolucion": null,
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 11,
      "kilos": 6,
      "monto_fable": 0,
      "monto_pp": 152.59,
      "monto_total": 152.59,
      "observaciones": "catia - LLAMAR A BRAYAN ANTES DE DESPACHAR",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": null,
      "mes": null,
      "semana": null,
      "cliente": null,
      "vendedor": null,
      "almacen": null,
      "destino": null,
      "ciudad_destino": null,
      "promesa_entrega": null,
      "compromiso_logistica": null,
      "fecha_pedido": null,
      "fecha_entregado": null,
      "dias_para_entregar": null,
      "devolucion": null,
      "transporte": null,
      "tipo_transporte": null,
      "unidades_fable": null,
      "unidades_pp": null,
      "kilos": null,
      "monto_fable": null,
      "monto_pp": null,
      "monto_total": null,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "LUIS ALBERTO LOVERA VALECILLO",
      "vendedor": "Brayan Carpio",
      "almacen": "Monte",
      "destino": "CARICUAO",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-06-19",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-15",
      "fecha_entregado": "2026-07-02",
      "dias_para_entregar": "17",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 4,
      "kilos": 4,
      "monto_fable": 0,
      "monto_pp": 101.45,
      "monto_total": 101.45,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2724",
      "estado_despacho": "Despachado",
      "mes": "junio",
      "semana": "2026-S26",
      "cliente": "TIENDA DE ANIMALES PATA-PATA, C.A.",
      "vendedor": "Brayan Carpio",
      "almacen": "Monte",
      "destino": "SANTA MONICA",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-06-22",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-19",
      "fecha_entregado": "2026-06-22",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 3,
      "kilos": 3,
      "monto_fable": 0,
      "monto_pp": 130.71,
      "monto_total": 951900,
      "observaciones": "130.71",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "junio",
      "semana": "2026-S26",
      "cliente": "AVICOLA DORTA, C.A",
      "vendedor": "Brayan Carpio",
      "almacen": "Monte",
      "destino": "ANTIMANO",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-06-23",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-20",
      "fecha_entregado": "2026-06-23",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 24,
      "kilos": 6,
      "monto_fable": 0,
      "monto_pp": 100.56,
      "monto_total": 941900,
      "observaciones": "100.56",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "junio",
      "semana": "2026-S26",
      "cliente": "AGRO AVICOLA EL BARBECHO C.A",
      "vendedor": "Brayan Carpio",
      "almacen": "Monte",
      "destino": "LOS TEQUES",
      "ciudad_destino": "LOS TEQUES",
      "promesa_entrega": "2026-06-23",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-20",
      "fecha_entregado": "2026-06-23",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 9,
      "kilos": 9,
      "monto_fable": 0,
      "monto_pp": 203,
      "monto_total": 2171900,
      "observaciones": "203.00",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "junio",
      "semana": "2026-S26",
      "cliente": "UNIMASCOTAS LOS PALOS GRANDES C.A.",
      "vendedor": "Ivan Desantiago",
      "almacen": null,
      "destino": "LOS PALOS GRANDES",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-06-24",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-22",
      "fecha_entregado": "2026-06-23",
      "dias_para_entregar": "2",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 72,
      "kilos": 28,
      "monto_fable": 0,
      "monto_pp": 208.8,
      "monto_total": 2671900,
      "observaciones": "208.80",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "junio",
      "semana": "2026-S26",
      "cliente": "AVICOLA PETARE, C.A.",
      "vendedor": "Ivan Desantiago",
      "almacen": "Monte",
      "destino": "PETARE",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-06-24",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-22",
      "fecha_entregado": "2026-06-23",
      "dias_para_entregar": "2",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 7,
      "unidades_pp": 43,
      "kilos": 28,
      "monto_fable": 0,
      "monto_pp": 431.6,
      "monto_total": 631901,
      "observaciones": "431.60",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "junio",
      "semana": "2026-S27",
      "cliente": "AGRO-FINCA DON FERNANDO C.A.",
      "vendedor": "Ivan Desantiago",
      "almacen": "Monte",
      "destino": "EL HATILLO",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-06-24",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-22",
      "fecha_entregado": "2026-06-29",
      "dias_para_entregar": "8",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 12,
      "kilos": 12,
      "monto_fable": 0,
      "monto_pp": 353.6,
      "monto_total": 18121900,
      "observaciones": "353.60",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2739",
      "estado_despacho": "Despachado",
      "mes": "junio",
      "semana": "2026-S27",
      "cliente": "AUTOMERCADO SANTA ROSA DE LIMA, C.A.",
      "vendedor": "Bryant Mennechey",
      "almacen": "Monte",
      "destino": "SANTA ROSA DE LIMA",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-06-24",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-22",
      "fecha_entregado": "2026-06-30",
      "dias_para_entregar": "6",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 4,
      "kilos": 4,
      "monto_fable": 0,
      "monto_pp": 160.34,
      "monto_total": null,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "junio",
      "semana": "2026-S27",
      "cliente": "EMPRENDIMNIENTO BRAYAN PARADA",
      "vendedor": "Brayan Carpio",
      "almacen": "Monte",
      "destino": "ALTAGRACIA",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-06-25",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-23",
      "fecha_entregado": "2026-06-30",
      "dias_para_entregar": "7",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 5,
      "unidades_pp": 0,
      "kilos": 18,
      "monto_fable": 203.5,
      "monto_pp": 0,
      "monto_total": 2171900,
      "observaciones": "203.50",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "junio",
      "semana": "2026-S27",
      "cliente": "EL PARAISO DE LAS MASCOTAS 20, C.A.",
      "vendedor": "Brayan Carpio",
      "almacen": "Monte",
      "destino": "FUERZAS ARMADAS",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-06-25",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-23",
      "fecha_entregado": "2026-06-30",
      "dias_para_entregar": "7",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 3,
      "unidades_pp": 14,
      "kilos": 9,
      "monto_fable": 73.5,
      "monto_pp": 102.28,
      "monto_total": 2361900,
      "observaciones": "175.78",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "PET FOOD M.&AMP; H. 2024,C.A.",
      "vendedor": "Brayan Carpio",
      "almacen": "Monte",
      "destino": "BELLO CAMPO",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-06-25",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-19",
      "fecha_entregado": "2026-07-01",
      "dias_para_entregar": "12",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 36,
      "kilos": 4,
      "monto_fable": 0,
      "monto_pp": 118.74,
      "monto_total": 2741900,
      "observaciones": "118.74",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "CENTRO CANINO EL OLIMPO DE LAS MASCOTAS, C.A",
      "vendedor": "Kenibel Escalona",
      "almacen": "Embarques",
      "destino": "VALENCIA",
      "ciudad_destino": "VALENCIA",
      "promesa_entrega": "2026-06-26",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-24",
      "fecha_entregado": "2026-07-03",
      "dias_para_entregar": "9",
      "devolucion": "TODO CONFORME",
      "transporte": "SANETH",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 8,
      "unidades_pp": 2,
      "kilos": 18,
      "monto_fable": 196,
      "monto_pp": 52,
      "monto_total": 491900,
      "observaciones": "248.00",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2749",
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "CENTRO VETERINARIO LOS COLORADOS, C.A.",
      "vendedor": "Kenibel Escalona",
      "almacen": "Embarques",
      "destino": "VALENCIA",
      "ciudad_destino": "VALENCIA",
      "promesa_entrega": "2026-06-27",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-25",
      "fecha_entregado": "2026-07-03",
      "dias_para_entregar": "8",
      "devolucion": "TODO CONFORME",
      "transporte": "SANETH",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 0,
      "unidades_pp": 49,
      "kilos": 9,
      "monto_fable": 0,
      "monto_pp": 222.32,
      "monto_total": 981900,
      "observaciones": "303.31",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "junio",
      "semana": "2026-S27",
      "cliente": "EMPRENDIMIENTO JOSEARIANGEL NAVARRO",
      "vendedor": "Brayan Carpio",
      "almacen": "Monte",
      "destino": "ARTIGAS",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-06-29",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-23",
      "fecha_entregado": "2026-06-30",
      "dias_para_entregar": "7",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 19,
      "kilos": 4,
      "monto_fable": 0,
      "monto_pp": 101.42,
      "monto_total": 1041900,
      "observaciones": "101.42",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "POSITIVO PETS SHOP, C.A",
      "vendedor": "Brayan Carpio",
      "almacen": "Monte",
      "destino": "EL CEMENTERIO",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-06-30",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-30",
      "fecha_entregado": "2026-07-01",
      "dias_para_entregar": "1",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 8,
      "kilos": 8,
      "monto_fable": 0,
      "monto_pp": 189.95,
      "monto_total": 771900,
      "observaciones": "189.95",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "CONSINTIENDO A TU MASCOTA 2007, C.A.",
      "vendedor": "Ivan Desantiago",
      "almacen": "Monte",
      "destino": "EL VALLE",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-01",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-29",
      "fecha_entregado": "2026-07-01",
      "dias_para_entregar": "2",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 6,
      "unidades_pp": 6,
      "kilos": 72,
      "monto_fable": 630,
      "monto_pp": 187.2,
      "monto_total": 2731902,
      "observaciones": "817.20",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "COMERCIAL J.A.T.U 69-70, C.A.",
      "vendedor": "Brayan Carpio",
      "almacen": "2",
      "destino": "PROPATRIA",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-01",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-30",
      "fecha_entregado": "2026-07-01",
      "dias_para_entregar": "1",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 3,
      "unidades_pp": 6,
      "kilos": 16,
      "monto_fable": 114,
      "monto_pp": 176.8,
      "monto_total": 290.8,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "AVICOLA HUELLAS Y BIGOTES C.A.",
      "vendedor": "Brayan Carpio",
      "almacen": "2",
      "destino": "ANTIMANO",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-01",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-30",
      "fecha_entregado": "2026-07-02",
      "dias_para_entregar": "2",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 4,
      "kilos": 4,
      "monto_fable": 0,
      "monto_pp": 119.6,
      "monto_total": 119.6,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "MUNDO MASCOTAS, C.A.",
      "vendedor": "CARACAS  MCBO",
      "almacen": "Monte",
      "destino": "ZULIA",
      "ciudad_destino": "ZULIA",
      "promesa_entrega": "2026-07-01",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-29",
      "fecha_entregado": "2026-07-03",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "SANETH",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 10,
      "unidades_pp": 0,
      "kilos": 81,
      "monto_fable": 579.7,
      "monto_pp": 0,
      "monto_total": 181901,
      "observaciones": "579.70",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "PATITAS AGROMARKET, COMPANIA ANONIMA",
      "vendedor": "CARACAS  MCBO",
      "almacen": "Monte",
      "destino": "ZULIA",
      "ciudad_destino": "ZULIA",
      "promesa_entrega": "2026-07-01",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-29",
      "fecha_entregado": "2026-07-03",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "SANETH",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 12,
      "unidades_pp": 13,
      "kilos": 58,
      "monto_fable": 576.5,
      "monto_pp": 76.68,
      "monto_total": 14101901,
      "observaciones": "589.34",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "BIG DOG MCBO, C.A.",
      "vendedor": "CARACAS  MCBO",
      "almacen": "Monte",
      "destino": "ZULIA",
      "ciudad_destino": "ZULIA",
      "promesa_entrega": "2026-07-01",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-29",
      "fecha_entregado": "2026-07-03",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "SANETH",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 15,
      "unidades_pp": 15,
      "kilos": 54,
      "monto_fable": 432.3,
      "monto_pp": 119.5,
      "monto_total": 471901,
      "observaciones": "551.80",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2748",
      "estado_despacho": "Despachado",
      "mes": "junio",
      "semana": "2026-S27",
      "cliente": "AUTOMERCADO SANTA ROSA DE LIMA, C.A.",
      "vendedor": "Bryant Mennechey",
      "almacen": "Monte",
      "destino": "SANTA ROSA DE LIMA",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-02",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-30",
      "fecha_entregado": "2026-06-30",
      "dias_para_entregar": "0",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 24,
      "kilos": 6,
      "monto_fable": 0,
      "monto_pp": 108,
      "monto_total": 1741900,
      "observaciones": "125.28",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "UNIMASCOTAS CHACAO, C.A.",
      "vendedor": "Ivan Desantiago",
      "almacen": "Monte",
      "destino": "BELLO CAMPO",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-02",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-30",
      "fecha_entregado": "2026-07-01",
      "dias_para_entregar": "1",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 6,
      "unidades_pp": 3,
      "kilos": 27,
      "monto_fable": 182.01,
      "monto_pp": 39.15,
      "monto_total": 881900,
      "observaciones": "170.19",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2753",
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "AUTOMERCADO LA MURALLA C.A.",
      "vendedor": "Bryant Mennechey",
      "almacen": "Monte",
      "destino": "EL HATILLO",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-02",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-30",
      "fecha_entregado": "2026-07-01",
      "dias_para_entregar": "1",
      "devolucion": "TODO CONFORME",
      "transporte": "CAMIONETA PUNKY",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 0,
      "unidades_pp": 156,
      "kilos": 83,
      "monto_fable": 0,
      "monto_pp": 1568,
      "monto_total": 1727.94,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "TIENDAS PETSMANIA, C.A.",
      "vendedor": "Ivan Desantiago",
      "almacen": "Monte",
      "destino": "EL HATILLO",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-02",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-29",
      "fecha_entregado": "2026-07-02",
      "dias_para_entregar": "3",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 5,
      "unidades_pp": 2,
      "kilos": 29,
      "monto_fable": 284,
      "monto_pp": 62.4,
      "monto_total": 11121900,
      "observaciones": "241.40",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2755",
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "FRUTERIA LOS POMELOS C.A",
      "vendedor": "Bryant Mennechey",
      "almacen": "2",
      "destino": "EL HATILLO",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-02",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-30",
      "fecha_entregado": "2026-07-02",
      "dias_para_entregar": "2",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 5,
      "kilos": 5,
      "monto_fable": 0,
      "monto_pp": 205.2,
      "monto_total": 205.2,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "MOLINERO PETS, C.A.",
      "vendedor": "Brayan Carpio",
      "almacen": "Monte",
      "destino": "LA CANDELARIA",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-02",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-23",
      "fecha_entregado": "2026-07-02",
      "dias_para_entregar": "9",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 5,
      "kilos": 5,
      "monto_fable": 0,
      "monto_pp": 117.05,
      "monto_total": 117.05,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "COMERCIALIZADORA NUTRIPET C.A.",
      "vendedor": "Ivan Desantiago",
      "almacen": "Monte",
      "destino": "ALTAGRACIA",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-02",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-30",
      "fecha_entregado": "2026-07-01",
      "dias_para_entregar": "1",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 5,
      "kilos": 5,
      "monto_fable": 0,
      "monto_pp": 104.1,
      "monto_total": 104.1,
      "observaciones": "104.10",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2758",
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "PLAN SUAREZ - URBINA",
      "vendedor": "Bryant Mennechey",
      "almacen": "2",
      "destino": "LA URBINA",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-02",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-01",
      "fecha_entregado": "2026-07-03",
      "dias_para_entregar": "2",
      "devolucion": "DEVOLUCION PARCIAL",
      "transporte": "CAMIONETA PUNKY",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 0,
      "unidades_pp": 36,
      "kilos": 15,
      "monto_fable": 0,
      "monto_pp": 511.33,
      "monto_total": 474.5,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "UNIMASCOTAS DEL PARAISO, C.A.",
      "vendedor": "Ivan Desantiago",
      "almacen": "2",
      "destino": "EL PARAISO",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-02",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-30",
      "fecha_entregado": "2026-07-03",
      "dias_para_entregar": "3",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 6,
      "unidades_pp": 6,
      "kilos": 42,
      "monto_fable": 262.08,
      "monto_pp": 132.6,
      "monto_total": 394.68,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2759",
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "PLAN SUAREZ - CAURIMARE",
      "vendedor": "Bryant Mennechey",
      "almacen": null,
      "destino": "CAURIMARE",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-02",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-01",
      "fecha_entregado": "2026-07-02",
      "dias_para_entregar": "1",
      "devolucion": "TODO CONFORME",
      "transporte": "CAMIONETA PUNKY",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 0,
      "unidades_pp": 75,
      "kilos": 29,
      "monto_fable": 0,
      "monto_pp": 570.72,
      "monto_total": 474.5,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2760",
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "PLAN SUAREZ - TRINIDAD",
      "vendedor": "Bryant Mennechey",
      "almacen": "2",
      "destino": "LA TRINIDAD",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-02",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-01",
      "fecha_entregado": "2026-07-02",
      "dias_para_entregar": "1",
      "devolucion": "TODO CONFORME",
      "transporte": "CAMIONETA PUNKY",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 0,
      "unidades_pp": 45,
      "kilos": 24,
      "monto_fable": 0,
      "monto_pp": 549.67,
      "monto_total": 474.5,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "DRA VETERINARIO KAREN - MARACAY",
      "vendedor": "DONACION",
      "almacen": "Embarques",
      "destino": "MARACAY",
      "ciudad_destino": "MARACAY",
      "promesa_entrega": "2026-07-02",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-02",
      "fecha_entregado": "2026-07-03",
      "dias_para_entregar": "1",
      "devolucion": "TODO CONFORME",
      "transporte": "SANETH",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 0,
      "unidades_pp": 17,
      "kilos": 17,
      "monto_fable": 0,
      "monto_pp": 0,
      "monto_total": 0,
      "observaciones": "0",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2761",
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "PLAN SUAREZ - SANTA MONICA",
      "vendedor": "Bryant Mennechey",
      "almacen": "2",
      "destino": "SANTA MONICA",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-02",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-01",
      "fecha_entregado": "2026-07-03",
      "dias_para_entregar": "2",
      "devolucion": "TODO CONFORME",
      "transporte": "CAMIONETA PUNKY",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 0,
      "unidades_pp": 83,
      "kilos": 55,
      "monto_fable": 0,
      "monto_pp": 1128.45,
      "monto_total": 972.8,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2765",
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "HIPERMERCADO PARAMO, C.A. - PALO VERDE",
      "vendedor": "Bryant Mennechey",
      "almacen": "2",
      "destino": "PALO VERDE",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-03",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-01",
      "fecha_entregado": "2026-07-03",
      "dias_para_entregar": "2",
      "devolucion": "TODO CONFORME",
      "transporte": "CAMIONETA PUNKY",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 0,
      "unidades_pp": 67,
      "kilos": 43,
      "monto_fable": 0,
      "monto_pp": 852.09,
      "monto_total": 852.6,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2762",
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "MI NEGOCIO SUPERMERCADOS, C.A.",
      "vendedor": "Bryant Mennechey",
      "almacen": "2",
      "destino": "SAN LUIS",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-03",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-01",
      "fecha_entregado": "2026-07-03",
      "dias_para_entregar": "2",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 57,
      "kilos": 32,
      "monto_fable": 0,
      "monto_pp": 656.33,
      "monto_total": 655.8,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "PATA PATA ANIMAL MARKET., C.A.",
      "vendedor": "Brayan Carpio",
      "almacen": "2",
      "destino": "SABANA GRANDE",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-03",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-02",
      "fecha_entregado": "2026-07-03",
      "dias_para_entregar": "1",
      "devolucion": "TODO CONFORME",
      "transporte": "VENDEDOR",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 13,
      "kilos": 4,
      "monto_fable": 0,
      "monto_pp": 106.49,
      "monto_total": 106.49,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "COMERCIALIZADORA RINCONCITO YC C.A.",
      "vendedor": "Ivan Desantiago",
      "almacen": "Monte",
      "destino": "MACARACUAY",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-03",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-06-23",
      "fecha_entregado": "2026-07-03",
      "dias_para_entregar": "10",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 1,
      "unidades_pp": 27,
      "kilos": 19,
      "monto_fable": 65,
      "monto_pp": 312.47,
      "monto_total": 377.47,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "UNIMASCOTAS LOS PALOS GRANDES C.A.",
      "vendedor": "Ivan Desantiago",
      "almacen": "2",
      "destino": "LOS PALOS GRANDES",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-03",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-01",
      "fecha_entregado": "2026-07-03",
      "dias_para_entregar": "2",
      "devolucion": "TODO CONFORME",
      "transporte": "CAMIONETA PUNKY",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 15,
      "unidades_pp": 0,
      "kilos": 82,
      "monto_fable": 585.49,
      "monto_pp": 0,
      "monto_total": 585.49,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "LOCAL PETS, C.A",
      "vendedor": "Kenibel Escalona",
      "almacen": "Embarques",
      "destino": "VALENCIA",
      "ciudad_destino": "VALENCIA",
      "promesa_entrega": "2026-07-03",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-03",
      "fecha_entregado": "2026-07-03",
      "dias_para_entregar": "0",
      "devolucion": "TODO CONFORME",
      "transporte": "SANETH",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 2,
      "unidades_pp": 16,
      "kilos": 28,
      "monto_fable": 152,
      "monto_pp": 124.2,
      "monto_total": 276.2,
      "observaciones": "276.20",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2754",
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "MAXI MERCADO PARAPARAL, C.A",
      "vendedor": "Kenibel Escalona",
      "almacen": "35",
      "destino": "VALENCIA",
      "ciudad_destino": "VALENCIA",
      "promesa_entrega": "2026-07-03",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-01",
      "fecha_entregado": "2026-07-03",
      "dias_para_entregar": "2",
      "devolucion": "TODO CONFORME",
      "transporte": "SANETH",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 0,
      "unidades_pp": 31,
      "kilos": 11,
      "monto_fable": 0,
      "monto_pp": 402.75,
      "monto_total": 402.75,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "MICHELANGELO AGNELLO GIARRATANA",
      "vendedor": "Kenibel Escalona",
      "almacen": "Embarques",
      "destino": "VALENCIA",
      "ciudad_destino": "VALENCIA",
      "promesa_entrega": "2026-07-03",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-01",
      "fecha_entregado": "2026-07-03",
      "dias_para_entregar": "2",
      "devolucion": "TODO CONFORME",
      "transporte": "SANETH",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 8,
      "unidades_pp": 0,
      "kilos": 36,
      "monto_fable": 280.6,
      "monto_pp": 0,
      "monto_total": 280.6,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2757",
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "PETS PLANET VALENCIA, C.A",
      "vendedor": "Kenibel Escalona",
      "almacen": "2",
      "destino": "VALENCIA",
      "ciudad_destino": "VALENCIA",
      "promesa_entrega": "2026-07-03",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-01",
      "fecha_entregado": "2026-07-03",
      "dias_para_entregar": "2",
      "devolucion": "TODO CONFORME",
      "transporte": "SANETH",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 0,
      "unidades_pp": 27,
      "kilos": 11,
      "monto_fable": 0,
      "monto_pp": 251.02,
      "monto_total": 251.02,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "PETS MALL, C.A.",
      "vendedor": "Kenibel Escalona",
      "almacen": "35",
      "destino": "VALENCIA",
      "ciudad_destino": "VALENCIA",
      "promesa_entrega": "2026-07-03",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-01",
      "fecha_entregado": "2026-07-03",
      "dias_para_entregar": "2",
      "devolucion": "TODO CONFORME",
      "transporte": "SANETH",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": null,
      "unidades_pp": null,
      "kilos": null,
      "monto_fable": null,
      "monto_pp": null,
      "monto_total": 591.2,
      "observaciones": "incluír 24 und happy 2kg / 04 und happy 6kg / 01 und happy",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2764",
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "HIPERMERCADO PARAMO, C.A. - MANZANARES",
      "vendedor": "Bryant Mennechey",
      "almacen": "2",
      "destino": "MANZANARES",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-03",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-01",
      "fecha_entregado": "2026-07-06",
      "dias_para_entregar": "5",
      "devolucion": "TODO CONFORME",
      "transporte": "CAMIONETA PUNKY",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 0,
      "unidades_pp": 106,
      "kilos": 58,
      "monto_fable": 0,
      "monto_pp": 1014.25,
      "monto_total": 1014.81,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "ONEMARKET.VE1630,C.A.",
      "vendedor": "Ivan Desantiago",
      "almacen": "2",
      "destino": "LAS  ACACIAS",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-04",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-02",
      "fecha_entregado": "2026-07-03",
      "dias_para_entregar": "1",
      "devolucion": "TODO CONFORME",
      "transporte": "VENDEDOR",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 1,
      "kilos": 1,
      "monto_fable": 0,
      "monto_pp": 31.2,
      "monto_total": null,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S27",
      "cliente": "SUPERMERCADO AGROPECUARIO HERMANOS BOLIVAR,C.A",
      "vendedor": "Kenibel Escalona",
      "almacen": "35",
      "destino": "VALENCIA",
      "ciudad_destino": "VALENCIA",
      "promesa_entrega": "2026-07-04",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-02",
      "fecha_entregado": "2026-07-03",
      "dias_para_entregar": "1",
      "devolucion": "TODO CONFORME",
      "transporte": "SANETH",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": null,
      "unidades_pp": null,
      "kilos": null,
      "monto_fable": null,
      "monto_pp": null,
      "monto_total": 259.25,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "4 PATITAS PETS SHOP, C.A.",
      "vendedor": "Ivan Desantiago",
      "almacen": "2",
      "destino": "GUATIRE",
      "ciudad_destino": "GUATIRE",
      "promesa_entrega": "2026-07-04",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-02",
      "fecha_entregado": "2026-07-06",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 47,
      "kilos": 40,
      "monto_fable": 0,
      "monto_pp": 564.18,
      "monto_total": 564.18,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "ARAMAX SHOP C.A.",
      "vendedor": "CARACAS  MCBO",
      "almacen": "2",
      "destino": "CHACAO",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-04",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-02",
      "fecha_entregado": "2026-07-06",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 216.68,
      "kilos": 7,
      "monto_fable": 0,
      "monto_pp": 216.88,
      "monto_total": 216.88,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "AGROPECUARIA GUATIPEZ, C.A.",
      "vendedor": "Ivan Desantiago",
      "almacen": "2",
      "destino": "GUATIRE",
      "ciudad_destino": "GUATIRE",
      "promesa_entrega": "2026-07-04",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-02",
      "fecha_entregado": "2026-07-06",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 23,
      "kilos": 23,
      "monto_fable": 0,
      "monto_pp": 200.47,
      "monto_total": 200.47,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "CORPORACION ARAS PET C.A.",
      "vendedor": "CARACAS  MCBO",
      "almacen": "2",
      "destino": "BELLO MONTE",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-06",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-02",
      "fecha_entregado": "2026-07-06",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 4,
      "unidades_pp": 41,
      "kilos": 40,
      "monto_fable": 338.16,
      "monto_pp": 350.34,
      "monto_total": 688.5,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "ARAMAX SHOP C.A.",
      "vendedor": "CARACAS  MCBO",
      "almacen": "2",
      "destino": "EL HATILLO",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-06",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-02",
      "fecha_entregado": "2026-07-06",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "CAMIONETA PUNKY",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 5,
      "unidades_pp": 22,
      "kilos": 30,
      "monto_fable": 227.2,
      "monto_pp": 187.42,
      "monto_total": 414.62,
      "observaciones": "EL HATILLO",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "CORPORACION ARAS PET C.A.",
      "vendedor": "CARACAS  MCBO",
      "almacen": "2",
      "destino": "LOS PALOS GRANDES",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-06",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-02",
      "fecha_entregado": "2026-07-06",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "CAMIONETA PUNKY",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 12,
      "unidades_pp": 41,
      "kilos": 96,
      "monto_fable": 776.2,
      "monto_pp": 445.7,
      "monto_total": 1221.9,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "INVERSIONES UNIKOPET C.A",
      "vendedor": "CARACAS  MCBO",
      "almacen": "2",
      "destino": "LAS MERCEDES",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-06",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-02",
      "fecha_entregado": "2026-07-06",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "CAMIONETA PUNKY",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 9,
      "unidades_pp": 30,
      "kilos": 63,
      "monto_fable": 534.6,
      "monto_pp": 220.14,
      "monto_total": 754.74,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "MARAMAX PET C.A.",
      "vendedor": "CARACAS  MCBO",
      "almacen": "2",
      "destino": "LAS MERCEDES",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-06",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-02",
      "fecha_entregado": "2026-07-06",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "CAMIONETA PUNKY",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 10,
      "unidades_pp": 28,
      "kilos": 34,
      "monto_fable": 314.8,
      "monto_pp": 212.56,
      "monto_total": 527.36,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "PETARAMA C.A.",
      "vendedor": "CARACAS  MCBO",
      "almacen": "2",
      "destino": "SANTA MONICA",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-06",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-02",
      "fecha_entregado": "2026-07-06",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 4,
      "unidades_pp": 25,
      "kilos": 28,
      "monto_fable": 237.6,
      "monto_pp": 121.76,
      "monto_total": 359.36,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2772",
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "almacen": "2",
      "destino": "LA CANDELARIA",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-06",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-03",
      "fecha_entregado": "2026-07-07",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "CAMIONETA PUNKY",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 0,
      "unidades_pp": 26,
      "kilos": 15,
      "monto_fable": 0,
      "monto_pp": 463.68,
      "monto_total": 522.38,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2770",
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "almacen": "2",
      "destino": "EL HATILLO",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-06",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-03",
      "fecha_entregado": "2026-07-07",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "CAMIONETA PUNKY",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 0,
      "unidades_pp": 23,
      "kilos": 8,
      "monto_fable": 0,
      "monto_pp": 253.94,
      "monto_total": 288.4,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2768",
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "almacen": "2",
      "destino": "EL HATILLO",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-06",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-03",
      "fecha_entregado": "2026-07-07",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "CAMIONETA PUNKY",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 0,
      "unidades_pp": 148,
      "kilos": 70,
      "monto_fable": 0,
      "monto_pp": 1267,
      "monto_total": 1306.65,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2771",
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "almacen": "2",
      "destino": "EL RECREO",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-06",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-03",
      "fecha_entregado": "2026-07-07",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "CAMIONETA PUNKY",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 0,
      "unidades_pp": 20,
      "kilos": 10,
      "monto_fable": 0,
      "monto_pp": 281.46,
      "monto_total": 373.98,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2773",
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "INSIDE MARKET, SUPERMERCADO RIO, C.A",
      "vendedor": "Bryant Mennechey",
      "almacen": "2",
      "destino": "LA CASTELLANA",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-06",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-03",
      "fecha_entregado": "2026-07-07",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "CAMIONETA PUNKY",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 0,
      "unidades_pp": 26,
      "kilos": 16,
      "monto_fable": 0,
      "monto_pp": 458.32,
      "monto_total": 516.37,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "AGROPECUARIA DISTRIBUIDORA EL TALISMAN, C.A.",
      "vendedor": "Brayan Carpio",
      "almacen": "2",
      "destino": "ALTAGRACIA",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-07",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-02",
      "fecha_entregado": "2026-07-06",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 9,
      "unidades_pp": 0,
      "kilos": 48,
      "monto_fable": 503,
      "monto_pp": 0,
      "monto_total": 657,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2774",
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "PLAN SUAREZ  - URBINA",
      "vendedor": "Bryant Mennechey",
      "almacen": "2",
      "destino": "LA URBINA",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-07",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-07",
      "fecha_entregado": "2026-07-07",
      "dias_para_entregar": "0",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 5,
      "kilos": 5,
      "monto_fable": 0,
      "monto_pp": 150.8,
      "monto_total": null,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "INVERSIONES J.T.G 2005, C.A.",
      "vendedor": "Brayan Carpio",
      "almacen": "2",
      "destino": "CATIA",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-07",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-02",
      "fecha_entregado": "2026-07-07",
      "dias_para_entregar": "5",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 7,
      "kilos": 7,
      "monto_fable": 0,
      "monto_pp": 109.5,
      "monto_total": 109.5,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "JHONDIBRAIN MANUEL TRUJILLO SANCHEZ",
      "vendedor": "Brayan Carpio",
      "almacen": "2",
      "destino": "CATIA",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-07",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-02",
      "fecha_entregado": "2026-07-07",
      "dias_para_entregar": "5",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 11,
      "kilos": 6,
      "monto_fable": 0,
      "monto_pp": 134.44,
      "monto_total": 134.44,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "E&J MEDICINA VETERINARIA, C.A.",
      "vendedor": "Ivan Desantiago",
      "almacen": "2",
      "destino": "BELLO MONTE",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-07",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-06",
      "fecha_entregado": "2026-07-08",
      "dias_para_entregar": "2",
      "devolucion": "TODO CONFORME",
      "transporte": "VENDEDOR",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 12,
      "kilos": 2,
      "monto_fable": 0,
      "monto_pp": 45.48,
      "monto_total": 45.48,
      "observaciones": "ENTREGA EL VENDEDOR",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "INVERSIONES FANTASIA ANIMAL PET SHOP, C.A",
      "vendedor": "Ivan Desantiago",
      "almacen": "2",
      "destino": "CHACAO",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-08",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-03",
      "fecha_entregado": "2026-07-07",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 10,
      "kilos": 10,
      "monto_fable": 0,
      "monto_pp": 580.8,
      "monto_total": 624,
      "observaciones": "precio por bulto",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "INVERSIONES LA ESQUINA DEL DULCE, C.A.",
      "vendedor": "Brayan Carpio",
      "almacen": "2",
      "destino": "CHACAITO",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-08",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-05",
      "fecha_entregado": "2026-07-07",
      "dias_para_entregar": "2",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 18,
      "kilos": 5,
      "monto_fable": 0,
      "monto_pp": 122.64,
      "monto_total": 122.64,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "HIPERMERCADO PETARE, C.A",
      "vendedor": "Bryant Mennechey",
      "almacen": "2",
      "destino": "PETARE",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-08",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-03",
      "fecha_entregado": "2026-07-07",
      "dias_para_entregar": "4",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 10,
      "kilos": 10,
      "monto_fable": 0,
      "monto_pp": 366,
      "monto_total": 366,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2780",
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "AUTOMERCADO SANTA ROSA DE LIMA, C.A.",
      "vendedor": "Bryant Mennechey",
      "almacen": "2",
      "destino": "BARUTA",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-08",
      "compromiso_logistica": null,
      "fecha_pedido": "2026-07-06",
      "fecha_entregado": "2026-07-07",
      "dias_para_entregar": "1",
      "devolucion": "TODO CONFORME",
      "transporte": "CAMIONETA PUNKY",
      "tipo_transporte": "CAMIONETA",
      "unidades_fable": 0,
      "unidades_pp": 5,
      "kilos": 5,
      "monto_fable": 0,
      "monto_pp": 217.69,
      "monto_total": 211.35,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2781",
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "GAMA - SOLO FACTURA",
      "vendedor": null,
      "almacen": "2",
      "destino": "MACARACUAY",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": null,
      "compromiso_logistica": "2026-07-08",
      "fecha_pedido": "2026-07-07",
      "fecha_entregado": null,
      "dias_para_entregar": null,
      "devolucion": null,
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": null,
      "unidades_pp": null,
      "kilos": null,
      "monto_fable": null,
      "monto_pp": null,
      "monto_total": null,
      "observaciones": "ENTREGA DE FACTURA",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "EMPRENDIMIENTO EDUARDO MORILLO 4",
      "vendedor": "Ivan Desantiago",
      "almacen": "2",
      "destino": "SABANA GRANDE",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-08",
      "compromiso_logistica": "2026-07-08",
      "fecha_pedido": "2026-07-06",
      "fecha_entregado": "2026-07-08",
      "dias_para_entregar": "2",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 7,
      "unidades_pp": 16,
      "kilos": 20,
      "monto_fable": 0,
      "monto_pp": 241.65,
      "monto_total": 241.65,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "INVERSIONES PORTU-MASCOTAS, C.A.",
      "vendedor": "Brayan Carpio",
      "almacen": "2",
      "destino": "MARIPEREZ",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-08",
      "compromiso_logistica": "2026-07-08",
      "fecha_pedido": "2026-07-07",
      "fecha_entregado": "2026-07-08",
      "dias_para_entregar": "1",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 10,
      "kilos": 5,
      "monto_fable": 0,
      "monto_pp": 113.64,
      "monto_total": 113.64,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "INVERSIONES MASCOTALANDIA II CA",
      "vendedor": "Ivan Desantiago",
      "almacen": "2",
      "destino": "FUERZAS ARMADAS",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-08",
      "compromiso_logistica": "2026-07-08",
      "fecha_pedido": "2026-07-06",
      "fecha_entregado": "2026-07-08",
      "dias_para_entregar": "2",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 20,
      "kilos": 20,
      "monto_fable": 0,
      "monto_pp": 580.8,
      "monto_total": 624,
      "observaciones": "precio por bulto",
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": "2782",
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "MI NEGOCIO SUPERMERCADOS, C.A.",
      "vendedor": "Bryant Mennechey",
      "almacen": "2",
      "destino": "CHACAITO",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-08",
      "compromiso_logistica": "2026-07-08",
      "fecha_pedido": "2026-07-06",
      "fecha_entregado": "2026-07-08",
      "dias_para_entregar": "2",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 19,
      "kilos": 12,
      "monto_fable": 0,
      "monto_pp": 373.75,
      "monto_total": 373.47,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    },
    {
      "pedido_numero": null,
      "nro_factura": null,
      "estado_despacho": "Despachado",
      "mes": "julio",
      "semana": "2026-S28",
      "cliente": "GRUPO MASCOTIK S FRJC, C.A.",
      "vendedor": "Brayan Carpio",
      "almacen": "2",
      "destino": "CARICUAO",
      "ciudad_destino": "CARACAS",
      "promesa_entrega": "2026-07-07",
      "compromiso_logistica": "2026-07-08",
      "fecha_pedido": "2026-07-06",
      "fecha_entregado": "2026-07-08",
      "dias_para_entregar": "2",
      "devolucion": "TODO CONFORME",
      "transporte": "MOTORIZADO PUNKY",
      "tipo_transporte": "MOTO",
      "unidades_fable": 0,
      "unidades_pp": 11,
      "kilos": 9,
      "monto_fable": 0,
      "monto_pp": 191.54,
      "monto_total": null,
      "observaciones": null,
      "incidencia_detalle": null,
      "comentario_logistica": null,
      "ruta": null
    }
  ],
  "fletes": [
    {
      "semana": "2026-S29",
      "transportista": "SANETH",
      "costo_usd": 40,
      "notas": null
    },
    {
      "semana": "2026-S29",
      "transportista": "SANETH",
      "costo_usd": 40,
      "notas": null
    },
    {
      "semana": "2026-S29",
      "transportista": "CAMIONETA PUNKY",
      "costo_usd": 50,
      "notas": null
    },
    {
      "semana": "2026-S29",
      "transportista": "CAMIONETA PUNKY",
      "costo_usd": 50,
      "notas": null
    },
    {
      "semana": "2026-S29",
      "transportista": "CAMIONETA PUNKY",
      "costo_usd": 50,
      "notas": null
    },
    {
      "semana": "2026-S28",
      "transportista": "CAMIONETA PUNKY",
      "costo_usd": 150,
      "notas": null
    },
    {
      "semana": "2026-S28",
      "transportista": "MOTORIZADO PUNKY",
      "costo_usd": 126,
      "notas": null
    },
    {
      "semana": "2026-S28",
      "transportista": "LA CORDILLERA",
      "costo_usd": 100,
      "notas": null
    },
    {
      "semana": "2026-S28",
      "transportista": "A1PASOVZLA",
      "costo_usd": 35,
      "notas": null
    },
    {
      "semana": "2026-S28",
      "transportista": "SANETH",
      "costo_usd": 140,
      "notas": null
    },
    {
      "semana": "2026-S29",
      "transportista": "CAMIONETA PUNKY",
      "costo_usd": 50,
      "notas": null
    },
    {
      "semana": "2026-S29",
      "transportista": "CAMIONETA PUNKY",
      "costo_usd": 50,
      "notas": null
    },
    {
      "semana": "2026-S29",
      "transportista": "CAMIONETA PUNKY",
      "costo_usd": 50,
      "notas": null
    },
    {
      "semana": "2026-S29",
      "transportista": "CAMIONETA PUNKY",
      "costo_usd": 50,
      "notas": null
    },
    {
      "semana": "2026-S29",
      "transportista": "SANETH",
      "costo_usd": 40,
      "notas": null
    },
    {
      "semana": "2026-S27",
      "transportista": "SANETH",
      "costo_usd": 150,
      "notas": null
    },
    {
      "semana": "2026-S27",
      "transportista": "MOTORIZADO PUNKY",
      "costo_usd": 70,
      "notas": null
    },
    {
      "semana": "2026-S27",
      "transportista": "CAMIONETA PUNKY",
      "costo_usd": 100,
      "notas": null
    },
    {
      "semana": "2026-S27",
      "transportista": "A1PASOVZLA",
      "costo_usd": 17,
      "notas": null
    },
    {
      "semana": "2026-S27",
      "transportista": "MERCHANDISER",
      "costo_usd": 10,
      "notas": null
    },
    {
      "semana": "2026-S29",
      "transportista": "SANETH",
      "costo_usd": 40,
      "notas": null
    },
    {
      "semana": "2026-S29",
      "transportista": "MOTORIZADO PUNKY",
      "costo_usd": 85,
      "notas": null
    },
    {
      "semana": "2026-S29",
      "transportista": "LA CORDILLERA",
      "costo_usd": 100,
      "notas": null
    }
  ],
  "contactos": [
    {
      "nombre": "Kenibel Escalona",
      "correo": "punkypet.kenibel@gmail.com",
      "tipo": "vendedor"
    },
    {
      "nombre": "Bryant Mennechey",
      "correo": "mennecheybryant@gmail.com, supermercados@punkypartners.com",
      "tipo": "vendedor"
    },
    {
      "nombre": "Brayan Carpio",
      "correo": "punky.brayan@gmail.com",
      "tipo": "vendedor"
    },
    {
      "nombre": "Ivan Desantiago",
      "correo": "punkypet.ivan@gmail.com",
      "tipo": "vendedor"
    },
    {
      "nombre": "Caracas VIP",
      "correo": "punkypet.ivan@gmail.com",
      "tipo": "vendedor"
    },
    {
      "nombre": "Supermercados",
      "correo": "mennecheybryant@gmail.com, supermercados@punkypartners.com",
      "tipo": "vendedor"
    },
    {
      "nombre": "CARACAS MCBO",
      "correo": "ventas@punkypartners.com",
      "tipo": "vendedor"
    },
    {
      "nombre": "Supermercdos VIP",
      "correo": "supermercados@punkypartners.com",
      "tipo": "vendedor"
    },
    {
      "nombre": "Edgar Echezuria",
      "correo": "punkypet.merchandising.edgar@gmail.com",
      "tipo": "mercaderista"
    },
    {
      "nombre": "Cesar Zambrano",
      "correo": "punkypet.merchandising@gmail.com",
      "tipo": "mercaderista"
    }
  ],
  "notif_grupos": [
    {
      "grupo": "logistica",
      "correos": "andreas@punkypartners.com, punkypet.logistica@gmail.com, ventas@punkypartners.com"
    },
    {
      "grupo": "inventario_cc",
      "correos": "andreas@punkypartners.com, vet.punky@gmail.com, Iliana.punkypartners@gmail.com, mennecheybryant@gmail.com"
    },
    {
      "grupo": "ventas_cc",
      "correos": "ventas@punkypartners.com"
    }
  ],
  "notif_tipos": [
    {
      "clave": "reporte_diario",
      "nombre": "Reporte diario IA",
      "activo": true,
      "para": "andreas@punkypartners.com",
      "cc": "andreas@punkypartners.com",
      "destino": "A: andreas@"
    },
    {
      "clave": "resumen_inventario",
      "nombre": "Resumen inventario/visita (por envío)",
      "activo": true,
      "para": null,
      "cc": "inventario_cc",
      "destino": "A: el mercaderista que la envió (Config_Mercaderistas)  ·  CC: grupo inventario_cc"
    },
    {
      "clave": "stock_critico",
      "nombre": "Alertas de stock crítico (7am)",
      "activo": true,
      "para": "supermercados@punkypartners.com",
      "cc": "inventario_cc",
      "destino": "A: supermercados@  ·  CC: grupo inventario_cc"
    },
    {
      "clave": "oos",
      "nombre": "OOS inmediato (campo)",
      "activo": true,
      "para": "supermercados@punkypartners.com",
      "cc": "inventario_cc",
      "destino": "A: supermercados@  ·  CC: grupo inventario_cc"
    },
    {
      "clave": "reporte_ia",
      "nombre": "Reportes IA (ventas / cobranza / ficha)",
      "activo": true,
      "para": null,
      "cc": "andreas@punkypartners.com",
      "destino": "A: el vendedor que lo pidió  ·  CC: ventas@"
    },
    {
      "clave": "pedido_entregado",
      "nombre": "Pedido Entregado (al vendedor)",
      "activo": true,
      "para": null,
      "cc": "andreas@punkypartners.com",
      "destino": "A: el vendedor del pedido (Config_Vendedores)  ·  CC: grupo ventas_cc"
    },
    {
      "clave": "pedido_en_ruta",
      "nombre": "Pedido En Ruta (al vendedor)",
      "activo": true,
      "para": null,
      "cc": "andreas@punkypartners.com",
      "destino": "A: el vendedor del pedido (Config_Vendedores)  ·  CC: grupo ventas_cc"
    },
    {
      "clave": "despacho_hoy",
      "nombre": "Pedidos a despachar hoy (7am)",
      "activo": true,
      "para": null,
      "cc": "andreas@punkypartners.com",
      "destino": "A: cada vendedor con pedidos (Config_Vendedores)  +  grupo logistica"
    },
    {
      "clave": "cierre_dia",
      "nombre": "Cierre del día — no despachados (5:30pm)",
      "activo": true,
      "para": null,
      "cc": "andreas@punkypartners.com",
      "destino": "A: cada vendedor con pedidos (Config_Vendedores)  +  grupo logistica"
    },
    {
      "clave": "cambio_almacen",
      "nombre": "Cambio de almacén",
      "activo": true,
      "para": null,
      "cc": "andreas@punkypartners.com",
      "destino": "A: ventas@"
    },
    {
      "clave": "correccion_logistica",
      "nombre": "Corrección de logística (cada 8h)",
      "activo": true,
      "para": null,
      "cc": "andreas@punkypartners.com",
      "destino": "A: grupo logistica"
    },
    {
      "clave": "visita_asesor",
      "nombre": "Copia de su visita al asesor (con fotos)",
      "activo": true,
      "para": null,
      "cc": "ventas@punkypartners.com, andreas@punkypartners.com",
      "destino": "A: el asesor que la hizo (su correo en Config_Vendedores)"
    }
  ]
}
