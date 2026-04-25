{/* Pendientes de aprobación */}
{pendientes.length > 0 && (
  <div style={{ background: '#FAECE7', border: '1px solid #F0C5B4', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px' }}>
    <div style={{ fontSize: '13px', fontWeight: '600', color: '#712B13', marginBottom: '10px' }}>
      🕐 {pendientes.length} cantante{pendientes.length !== 1 ? 's' : ''} pendiente{pendientes.length !== 1 ? 's' : ''} de aprobación
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {pendientes.map(u => (
        <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', background: '#FFFFFF', borderRadius: '8px', padding: '10px 12px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#1A1A18' }}>{u.nombre}</div>
            <div style={{ fontSize: '11px', color: '#888780', textTransform: 'capitalize' }}>{u.voz || '—'} · {u.mail || ''}</div>
          </div>
          <button onClick={async () => {
            await supabase.from('perfiles').update({ estado: 'activo' }).eq('id', u.id)
            setMensaje(`${u.nombre} aprobado/a.`)
            setTimeout(() => setMensaje(''), 3000)
            cargar()
          }}
            style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '8px', border: 'none', background: '#0F6E56', color: '#FFFFFF', cursor: 'pointer', fontWeight: '500', flexShrink: 0 }}>
            Aprobar
          </button>
        </div>
      ))}
    </div>
  </div>
)}`