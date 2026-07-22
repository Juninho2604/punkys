import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

// Botón "Instalar app" (PWA). Aparece cuando el navegador ofrece instalar
// (Android/Chrome). En iPhone no hay evento: se muestra una ayuda para
// "Compartir → Agregar a inicio".
interface BIPEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: string }>
}

export function InstallApp() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null)
  const [instalado, setInstalado] = useState(false)
  const [ayudaIOS, setAyudaIOS] = useState(false)

  useEffect(() => {
    const yaApp = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone
    if (yaApp) { setInstalado(true); return }
    const onPrompt = (e: Event) => { e.preventDefault(); setDeferred(e as BIPEvent) }
    const onInstalled = () => setInstalado(true)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (instalado) return null

  const esIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
  if (!deferred && !esIOS) return null // el navegador aún no ofrece instalar

  const instalar = async () => {
    if (deferred) { await deferred.prompt(); setDeferred(null) }
    else setAyudaIOS(true)
  }

  return (
    <>
      <button className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={instalar}>
        <Download size={15} strokeWidth={2.4} /> Instalar app
      </button>
      {ayudaIOS && (
        <div className="modal-backdrop" onClick={() => setAyudaIOS(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380 }}>
            <h3>Instalar en iPhone</h3>
            <p className="cell-sub" style={{ lineHeight: 1.6 }}>
              1. Toca el botón <b>Compartir</b> (el cuadrito con la flecha ↑) abajo en Safari.<br />
              2. Baja y toca <b>«Agregar a inicio»</b>.<br />
              3. Confirma <b>Agregar</b>. Quedará como una app en tu pantalla.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => setAyudaIOS(false)}>Entendido</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
