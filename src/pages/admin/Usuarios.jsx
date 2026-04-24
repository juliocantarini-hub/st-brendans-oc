import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'

const ROLES   = ['cantante', 'director', 'admin']
const VOCES   = ['soprano', 'contralto', 'tenor', 'bajo']
const ESTADOS = ['activo', 'pausa', 'inactivo']

const ROLE_STYLE = {
  cantante: { bg: '#E1F5EE', color: '#04342C' },
  director: { bg: '#FAECE7', color: '#712B13' },
  admin:    { bg: '#E6F1FB', color: '#042C53' },
}

function useEsMovil() {
  return window.innerWidth <= 768
}

export default function Usuarios() {
  const [usuarios, setUsuarios]     = useState([])
  const [cargando, setCargando]     = useState(true)
  const [busqueda, setBusqueda]     = useState('')
  const [editando, setEditando]     = useState(null)
  const [guardando, setGuardando]   = useState(false)
  const [mensaje, setMensaje]       = useState('')
  const [confirmEliminar, setConfirmEliminar] = useState(null)
  const [eliminando, setEliminando] = useState(false)
  const esMovil = useEsMovil()

  const cargar = useCallback(async () => {
    setCargando(true)
    const { data } = await supabase.from('perfiles').select('*').order('nombre')
    setUsuarios(data || [])
    setCargando(false)
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const filtrados = usuarios.filter(u =>
    !busqueda ||
    u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.voz?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.rol?.toLowerCase().includes(busqueda.toLowerCase())
  )

  async function guardarEdicion() {
    if (!editando) return
    setGuardando(true)
    await supabase.from('perfiles').update({
      rol: editando.rol, voz: editando.voz, estado: editando.estado,
    }).eq('id', editando.id)
    setGuardando(false)
    setEditando(null)
    setMensaje('Usuario actualizado.')
    setTimeout(() => setMensaje(''), 3000)
    cargar()
  }

  async function handleEliminar() {
    if (!confirmEliminar) return
    setEliminando(true)
    // Eliminar perfil (el usuario de auth se elimina en cascada)
    await supabase.from('perfiles').delete().eq('id', confirmEliminar.id)
    // Eliminar de auth (requiere permisos de admin)
    await supabase.auth.admin.deleteUser(confirmEliminar.id)
    setEliminando(false)
    setConfirmEliminar(null)
    setMensaje('Cantante eliminado.')
    setTimeout(() => setMensaje(''), 3000)
    cargar()
  }

  return (
    <div>
      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 'normal', color: '#1A1A18', margin: '0 0 2px' }}>Usuarios</h2>
          <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>
            {cargando ? 'Cargando...' : `${usuarios.length} cantante${usuarios.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        {mensaje && <div style={{ fontSize: '13px', color: '#04342C', background: '#E1F5EE', padding: '6px 12px', borderRadius: '8px' }}>{mensaje}</div>}
      </div>

      {/* Búsqueda */}
      <div style={{ position: 'relative', marginBottom: '16px', maxWidth: '320px' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#B4B2A9" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }}>
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar cantante..."
          style={{ width: '100%', height: '36px', border: '1px solid #D3D1C7', borderRadius: '8px', padding: '0 12px 0 32px', fontSize: '13px', outline: 'none', background: '#FFFFFF', boxSizing: 'border-box' }} />
      </div>

      {cargando && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1,2,3,4].map(i => <div key={i} style={{ height: '56px', background: '#F1EFE8', borderRadius: '10px', animation: 'pulse 1.5s ease-in-out infinite' }} />)}
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
        </div>
      )}

      {/* MÓVIL: tarjetas */}
      {!cargando && esMovil && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtrados.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px', color: '#888780', fontSize: '13px' }}>No hay usuarios que coincidan.</div>
          )}
          {filtrados.map(u => {
            const rs = ROLE_STYLE[u.rol] || ROLE_STYLE.cantante
            return (
              <div key={u.id} style={{ background: '#FFFFFF', border: '1px solid #E8E6DF', borderRadius: '12px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A18' }}>{u.nombre || '—'}</div>
                    <div style={{ fontSize: '12px', color: '#888780', marginTop: '2px', textTransform: 'capitalize' }}>
                      {u.voz || '—'} · <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: u.estado === 'activo' ? '#639922' : '#D3D1C7', display: 'inline-block' }} />
                        {u.estado}
                      </span>
                    </div>
                  </div>
                  <span style={{ background: rs.bg, color: rs.color, fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '10px', textTransform: 'capitalize' }}>
                    {u.rol}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setEditando({ ...u })}
                    style={{ padding: '5px 12px', fontSize: '12px', borderRadius: '6px', border: '1px solid #D3D1C7', background: 'none', cursor: 'pointer', color: '#0F6E56', fontWeight: '500' }}>
                    Editar
                  </button>
                  <button onClick={() => setConfirmEliminar(u)}
                    style={{ padding: '5px 8px', fontSize: '12px', borderRadius: '6px', border: '1px solid #F0C5B4', background: 'none', cursor: 'pointer', color: '#A32D2D' }}>
                    ✕
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* DESKTOP: tabla */}
      {!cargando && !esMovil && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E8E6DF', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 90px 80px 110px', padding: '10px 16px', background: '#F8F7F3', borderBottom: '1px solid #E8E6DF', fontSize: '11px', fontWeight: '600', color: '#888780', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            <span>Nombre</span><span>Voz</span><span>Rol</span><span>Estado</span><span style={{ textAlign: 'right' }}>Acciones</span>
          </div>
          {filtrados.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', color: '#888780', fontSize: '13px' }}>No hay usuarios que coincidan.</div>
          )}
          {filtrados.map((u, i) => {
            const rs = ROLE_STYLE[u.rol] || ROLE_STYLE.cantante
            return (
              <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 90px 80px 110px', padding: '12px 16px', alignItems: 'center', borderBottom: i < filtrados.length - 1 ? '1px solid #F1EFE8' : 'none' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#1A1A18' }}>{u.nombre || '—'}</div>
                  <div style={{ fontSize: '11px', color: '#888780', marginTop: '1px' }}>{u.telefono || ''}</div>
                </div>
                <span style={{ fontSize: '12px', color: '#5F5E5A', textTransform: 'capitalize' }}>{u.voz || '—'}</span>
                <span style={{ background: rs.bg, color: rs.color, fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '10px', textTransform: 'capitalize', display: 'inline-block' }}>{u.rol}</span>
                <span style={{ fontSize: '11px', color: u.estado === 'activo' ? '#27500A' : '#888780', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: u.estado === 'activo' ? '#639922' : '#D3D1C7', display: 'inline-block' }} />
                  {u.estado}
                </span>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setEditando({ ...u })}
                    style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #D3D1C7', background: 'none', cursor: 'pointer', color: '#0F6E56', fontWeight: '500' }}>
                    Editar
                  </button>
                  <button onClick={() => setConfirmEliminar(u)}
                    style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '6px', border: '1px solid #F0C5B4', background: 'none', cursor: 'pointer', color: '#A32D2D' }}>
                    ✕
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal editar */}
      {editando && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '28px', maxWidth: '400px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 'normal', margin: '0 0 4px' }}>Editar usuario</h3>
            <p style={{ fontSize: '13px', color: '#888780', margin: '0 0 20px' }}>{editando.nombre}</p>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Voz</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {VOCES.map(v => (
                  <button key={v} onClick={() => setEditando(e => ({ ...e, voz: v }))}
                    style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', border: `1.5px solid ${editando.voz === v ? '#1D9E75' : '#D3D1C7'}`, background: editando.voz === v ? '#E1F5EE' : '#FFFFFF', color: editando.voz === v ? '#04342C' : '#5F5E5A', textTransform: 'capitalize' }}>
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Rol</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {ROLES.map(r => {
                  const rs = ROLE_STYLE[r]
                  return (
                    <button key={r} onClick={() => setEditando(e => ({ ...e, rol: r }))}
                      style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', border: `1.5px solid ${editando.rol === r ? rs.color : '#D3D1C7'}`, background: editando.rol === r ? rs.bg : '#FFFFFF', color: editando.rol === r ? rs.color : '#5F5E5A', textTransform: 'capitalize' }}>
                      {r}
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Estado</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {ESTADOS.map(es => (
                  <button key={es} onClick={() => setEditando(e => ({ ...e, estado: es }))}
                    style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', border: `1.5px solid ${editando.estado === es ? '#0F6E56' : '#D3D1C7'}`, background: editando.estado === es ? '#E1F5EE' : '#FFFFFF', color: editando.estado === es ? '#04342C' : '#5F5E5A', textTransform: 'capitalize' }}>
                    {es}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setEditando(null)} style={{ flex: 1, height: '40px', borderRadius: '8px', border: '1px solid #D3D1C7', background: 'none', cursor: 'pointer', fontSize: '13px' }}>Cancelar</button>
              <button onClick={guardarEdicion} disabled={guardando} style={{ flex: 2, height: '40px', borderRadius: '8px', border: 'none', background: '#0F6E56', color: '#FFFFFF', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal eliminar */}
      {confirmEliminar && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '28px', maxWidth: '400px', width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FCEBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#A32D2D">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 'normal', margin: '0 0 8px' }}>Eliminar cantante</h3>
            <p style={{ fontSize: '14px', color: '#5F5E5A', lineHeight: '1.6', margin: '0 0 6px' }}>
              ¿Eliminás a <strong>{confirmEliminar.nombre}</strong> del coro?
            </p>
            <p style={{ fontSize: '12px', color: '#A32D2D', margin: '0 0 24px', background: '#FCEBEB', padding: '8px 10px', borderRadius: '8px' }}>
              Esta acción no se puede deshacer. Se eliminarán todos sus datos, asistencias y progreso de estudio.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setConfirmEliminar(null)} style={{ flex: 1, height: '40px', borderRadius: '8px', border: '1px solid #D3D1C7', background: 'none', cursor: 'pointer', fontSize: '13px' }}>
                Cancelar
              </button>
              <button onClick={handleEliminar} disabled={eliminando}
                style={{ flex: 2, height: '40px', borderRadius: '8px', border: 'none', background: eliminando ? '#F0C5B4' : '#A32D2D', color: '#FFFFFF', cursor: eliminando ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: '500' }}>
                {eliminando ? 'Eliminando...' : 'Sí, eliminar cantante'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '500', color: '#5F5E5A', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.4px' }