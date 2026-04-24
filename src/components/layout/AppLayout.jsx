import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'

export default function AppLayout({ children }) {
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    const el = document.getElementById('sidebar-wrapper')
    if (!el) return
    if (abierto) {
      el.style.transform = 'translateX(0)'
    } else {
      el.style.transform = ''
    }
  }, [abierto])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F1EFE8' }}>

      {abierto && (
        <div
          onClick={() => setAbierto(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
          }}
        />
      )}

      <div
        id="sidebar-wrapper"
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          zIndex: 50,
          transition: 'transform 0.25s ease',
        }}
      >
        <Sidebar
          seccionAdmin={false}
          toggleAdmin={() => {}}
          onCerrar={() => setAbierto(false)}
        />
      </div>

      <button
        onClick={() => setAbierto(v => !v)}
        style={{
          position: 'fixed', top: '12px', left: '12px',
          zIndex: 60,
          width: '40px', height: '40px',
          borderRadius: '10px',
          background: '#0F6E56',
          border: 'none', cursor: 'pointer',
          display: 'none',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
        id="hamburger-btn"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          {abierto
            ? <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            : <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          }
        </svg>
      </button>

      <main
        style={{
          minHeight: '100vh',
        }}
        id="main-content"
      >
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          #sidebar-wrapper {
            transform: translateX(-100%) !important;
          }
          #hamburger-btn {
            display: flex !important;
          }
          #main-content {
            margin-left: 0 !important;
            padding: 60px 16px 24px !important;
            width: 100vw !important;
          }
        }
        @media (min-width: 769px) {
          #sidebar-wrapper {
            transform: translateX(0) !important;
          }
          #hamburger-btn {
            display: none !important;
          }
          #main-content {
            margin-left: 210px !important;
            padding: 28px 32px !important;
            max-width: 900px !important;
          }
        }
      `}</style>
    </div>
  )
}