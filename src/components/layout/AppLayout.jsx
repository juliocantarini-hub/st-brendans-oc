import { useState } from 'react'
import Sidebar from './Sidebar'

export default function AppLayout({ children }) {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F1EFE8' }}>

      {/* Overlay móvil */}
      {menuAbierto && (
        <div
          onClick={() => setMenuAbierto(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar — siempre montado, se muestra/oculta con CSS */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 50,
        transition: 'transform 0.25s ease',
        transform: menuAbierto ? 'translateX(0)' : undefined,
      }}
        id="sidebar-wrapper"
      >
        <Sidebar
          seccionAdmin={false}
          toggleAdmin={() => {}}
          onCerrar={() => setMenuAbierto(false)}
        />
      </div>

      {/* Botón hamburguesa */}
      <button
        onClick={() => setMenuAbierto(v => !v)}
        id="hamburger-btn"
        style={{
          position: 'fixed', top: '12px', left: '12px',
          zIndex: 60,
          width: '40px', height: '40px',
          borderRadius: '10px',
          background: '#0F6E56',
          border: 'none', cursor: 'pointer',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          {menuAbierto
            ? <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            : <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          }
        </svg>
      </button>

      {/* Contenido principal */}
      <main id="main-content">
        {children}
      </main>

      <style>{`
        /* MÓVIL */
        @media (max-width: 768px) {
          #sidebar-wrapper {
            transform: translateX(-100%);
          }
          #sidebar-wrapper.abierto {
            transform: translateX(0);
          }
          #hamburger-btn {
            display: flex;
          }
          #main-content {
            margin-left: 0;
            padding: 60px 16px 24px;
            width: 100%;
            min-height: 100vh;
          }
        }
        /* DESKTOP */
        @media (min-width: 769px) {
          #sidebar-wrapper {
            transform: translateX(0) !important;
          }
          #hamburger-btn {
            display: none;
          }
          #main-content {
            margin-left: 210px;
            padding: 28px 32px;
            flex: 1;
            min-height: 100vh;
            max-width: 900px;
          }
        }
      `}</style>
    </div>
  )
}