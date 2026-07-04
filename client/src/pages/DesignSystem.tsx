import { Badge } from '../components/Badge'

// Guía de estilo interna — QA visual de tokens y componentes.
// Solo visible para el rol admin (Owner).

const PALETA = [
  { token: 'brand-900', hex: '#12306F', uso: 'Sidebar, hover primario' },
  { token: 'brand-800', hex: '#1A3F8F', uso: 'Botón primario, enlaces' },
  { token: 'brand-500', hex: '#4A86D8', uso: 'Focus, links secundarios' },
  { token: 'sky-200', hex: '#BCDCF4', uso: 'Bordes sobre celeste, avatar' },
  { token: 'sky-100', hex: '#D6EAF9', uso: 'Fondo login (marca)' },
  { token: 'sky-50', hex: '#EAF4FC', uso: 'Fondo de la aplicación' },
  { token: 'ink-900', hex: '#1C2B4A', uso: 'Texto principal' },
  { token: 'ink-500', hex: '#5A6B8C', uso: 'Texto secundario, labels' },
  { token: 'ink-300', hex: '#93A5C4', uso: 'Placeholders, metadatos' },
  { token: 'line-100', hex: '#DEE9F5', uso: 'Bordes y divisores' },
  { token: 'accent-500', hex: '#F08A24', uso: 'CTA, badge contador' },
  { token: 'success-600', hex: '#2E9E5B', uso: 'Aprobado / Entregado' },
  { token: 'warning-600', hex: '#B57917', uso: 'Pendiente / En reparto' },
  { token: 'danger-500', hex: '#D9534F', uso: 'Rechazado / errores' },
]

const TIPOS = [
  { token: 'H1', sample: 'Título de página', css: "700 26px 'Baloo 2'", spec: 'Baloo 2 · 700 · 26/32' },
  { token: 'H2', sample: 'Título de sección', css: "700 20px 'Baloo 2'", spec: 'Baloo 2 · 700 · 20/26' },
  { token: 'H3', sample: 'Título de tarjeta', css: "700 16px 'Baloo 2'", spec: 'Baloo 2 · 700 · 16/22' },
  { token: 'Body', sample: 'Texto de interfaz y descripciones largas.', css: "600 14px 'Nunito Sans'", spec: 'Nunito Sans · 600 · 14/21' },
  { token: 'Label', sample: 'ETIQUETA DE CAMPO', css: "700 12px 'Nunito Sans'", spec: 'Nunito Sans · 700 · 12 · +0.6px · caps' },
  { token: 'Caption', sample: 'Metadatos y fechas', css: "600 12px 'Nunito Sans'", spec: 'Nunito Sans · 600 · 12/16' },
]

const ESPACIOS = [
  { token: 'space-4', w: 4, uso: 'Micro separaciones' },
  { token: 'space-8', w: 8, uso: 'Gap de iconos' },
  { token: 'space-12', w: 12, uso: 'Gap interno de tarjetas' },
  { token: 'space-16', w: 16, uso: 'Gap de grillas' },
  { token: 'space-24', w: 24, uso: 'Padding de tarjetas' },
  { token: 'space-32', w: 32, uso: 'Separación de bloques' },
  { token: 'space-48', w: 48, uso: 'Márgenes de página' },
]

const NOMBRES = [
  { code: 'btn-primary / btn-secondary / btn-cta', desc: 'Botones de acción' },
  { code: 'input-text', desc: 'Campos de formulario' },
  { code: 'card-kpi', desc: 'Indicadores del dashboard' },
  { code: 'table-data', desc: 'Tablas de registros' },
  { code: 'badge-status', desc: 'Estados de envío/cotización' },
  { code: 'sidebar-nav / sidebar-nav-item', desc: 'Navegación lateral colapsable' },
  { code: 'header-admin', desc: 'Barra superior de la app' },
  { code: 'stepper-quote', desc: 'Indicador de pasos de cotización' },
  { code: 'service-selector', desc: 'Tarjetas radio de servicio' },
  { code: 'table-pricing', desc: 'Desglose de precios' },
  { code: 'kanban-board / kanban-card', desc: 'Tablero de aprobaciones' },
  { code: 'timeline-shipment', desc: 'Cronología vertical de estados' },
  { code: 'toast-feedback', desc: 'Confirmaciones flotantes' },
  { code: 'mascota-frenchie', desc: 'Mascota animada del login' },
]

export function DesignSystem() {
  return (
    <div className="fade-up" style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <h1 className="h1">Guía de estilo · Punky Logística</h1>
        <p className="subtitle">Tokens y componentes para QA visual. Nomenclatura mapeada 1:1 al código.</p>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ font: '700 18px var(--font-display)', color: 'var(--brand-900)', margin: '0 0 16px' }}>01 · Paleta cromática</h2>
        <div className="palette-grid">
          {PALETA.map((p) => (
            <div key={p.token} style={{ border: '1px solid var(--line-soft)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ height: 56, background: p.hex }} />
              <div style={{ padding: '10px 12px' }}>
                <div style={{ font: '800 12.5px var(--font-ui)', color: 'var(--ink-900)' }}>{p.token}</div>
                <div style={{ font: '700 12px ui-monospace,monospace', color: 'var(--ink-500)' }}>{p.hex}</div>
                <div className="caption" style={{ marginTop: 2 }}>{p.uso}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ font: '700 18px var(--font-display)', color: 'var(--brand-900)', margin: '0 0 6px' }}>02 · Tipografía</h2>
        <p style={{ font: '600 13px var(--font-ui)', color: 'var(--ink-500)', margin: '0 0 16px' }}>
          Display: <b>Baloo 2</b> (títulos, redondeada = ADN de marca) · Texto: <b>Nunito Sans</b> (UI y cuerpo).
        </p>
        {TIPOS.map((t) => (
          <div key={t.token} className="tipo-row">
            <span style={{ font: '800 11.5px var(--font-ui)', letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--ink-300)' }}>{t.token}</span>
            <span style={{ font: t.css, color: 'var(--ink-900)' }}>{t.sample}</span>
            <span className="tipo-spec" style={{ font: '700 12px ui-monospace,monospace', color: 'var(--ink-500)' }}>{t.spec}</span>
          </div>
        ))}
      </div>

      <div className="ds-2col">
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ font: '700 18px var(--font-display)', color: 'var(--brand-900)', margin: '0 0 16px' }}>03 · Espaciado (escala 4px)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ESPACIOS.map((e) => (
              <div key={e.token} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ font: '700 12px ui-monospace,monospace', color: 'var(--ink-500)', width: 88 }}>{e.token}</span>
                <div style={{ height: 14, width: e.w * 2.5, background: 'var(--brand-500)', borderRadius: 3 }} />
                <span className="caption">{e.uso}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--line-soft)', font: '600 12.5px/1.7 var(--font-ui)', color: 'var(--ink-500)' }}>
            Radios: <b style={{ color: 'var(--ink-900)' }}>radius-input 10px · radius-card 14px · radius-pill 999px</b>
            <br />
            Sombra: <b style={{ color: 'var(--ink-900)' }}>shadow-card</b>{' '}
            <span style={{ font: '700 11.5px ui-monospace,monospace' }}>0 2px 10px rgba(18,48,111,.06)</span>
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ font: '700 18px var(--font-display)', color: 'var(--brand-900)', margin: '0 0 16px' }}>04 · Botones</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Fila code="btn-primary">
              <button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13 }}>Normal</button>
              <button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13 }} disabled>Disabled</button>
            </Fila>
            <Fila code="btn-secondary">
              <button className="btn btn-secondary" style={{ padding: '10px 18px', fontSize: 13 }}>Normal</button>
            </Fila>
            <Fila code="btn-cta">
              <button className="btn btn-cta" style={{ padding: '10px 18px', fontSize: 13 }}>Generar Cotización</button>
            </Fila>
            <Fila code="soft">
              <button className="btn-approve-soft" style={{ flex: 'none', padding: '9px 16px' }}>✓ Aprobar</button>
              <button className="btn-reject-soft" style={{ flex: 'none', padding: '9px 16px' }}>✕ Rechazar</button>
            </Fila>
          </div>
          <h2 style={{ font: '700 18px var(--font-display)', color: 'var(--brand-900)', margin: '20px 0 12px' }}>05 · Inputs</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input className="input-text" placeholder="Placeholder" />
            <div>
              <input className="input-text error" defaultValue="J-123" readOnly />
              <div className="field-error" style={{ marginTop: 4 }}>RIF inválido. Formato: J-00000000-0</div>
            </div>
            <input className="input-text" defaultValue="CDN Boleíta — Caracas" disabled />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ font: '700 18px var(--font-display)', color: 'var(--brand-900)', margin: '0 0 16px' }}>06 · Badges de estado</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {['Aprobado', 'Pendiente', 'Rechazado', 'En tránsito', 'En reparto', 'Preparando', 'Entregado', 'Incidencia'].map((e) => (
            <Badge key={e} estado={e} lg />
          ))}
        </div>
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line-soft)' }}>
          <h2 style={{ font: '700 15px var(--font-display)', color: 'var(--brand-900)', margin: '0 0 10px' }}>Nomenclatura de componentes</h2>
          {NOMBRES.map((n) => (
            <div key={n.code} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '6px 0', borderTop: '1px solid #F3F6FA' }}>
              <span style={{ font: '700 12px ui-monospace,monospace', color: 'var(--brand-800)' }}>{n.code}</span>
              <span style={{ font: '600 12px var(--font-ui)', color: 'var(--ink-500)', textAlign: 'right' }}>{n.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Fila({ code, children }: { code: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <span style={{ font: '700 11.5px ui-monospace,monospace', color: 'var(--ink-500)', width: 110 }}>{code}</span>
      {children}
    </div>
  )
}
