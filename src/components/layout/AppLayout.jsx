import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'

function useEsMovil() {
  const [esMovil, setEsMovil] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const fn = () => setEsMovil(window.innerWidth <= 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return esMovil
}

export default function AppLayout({ children }) {
  const esMovil = useEsMovil()
  const [abierto, setAbierto] = useState(false)
  const [seccionAdmin, setSeccionAdmin] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F1EFE8' }}>

      {esMovil && abierto && (
        <div
          onClick={() => setAbierto(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
          }}
        />
      )}

      {(!esMovil || abierto) && (
        <div style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          zIndex: 50,
        }}>
          <Sidebar
            seccionAdmin={seccionAdmin}
            toggleAdmin={setSeccionAdmin}
            onCerrar={() => setAbierto(false)}
            onNavegar={() => setAbierto(false)}
          />
        </div>
      )}

      {esMovil && (
        <button
          onClick={() => setAbierto(v => !v)}
          style={{
            position: 'fixed', top: '12px', left: '12px',
            zIndex: 60,
            width: '40px', height: '40px',
            borderRadius: '10px',
            background: '#0F6E56',
            border: 'none', cursor: 'pointer',
            display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">