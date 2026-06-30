import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qiyquvcelzitjkqoxpyx.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeXF1dmNlbHppdGprcW94cHl4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDcxODkwMiwiZXhwIjoyMDk2Mjk0OTAyfQ.wcqTZZ0leArPW8X2oPm8lgcBP08SHs85VfJnI5euQ2c'
const CORO_ID = '12483197-e0fe-4408-8acf-9b0021fb4f77'
const PASSWORD = 'CorumSB2026'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const cantantes = [
  { nombre: 'Arancedo, Cecilia',          voz: 'SOPRANO',   email: 'ceciliarancedo@gmail.com' },
  { nombre: 'Braca, Claudia',             voz: 'SOPRANO',   email: 'clacribra2000@gmail.com' },
  { nombre: 'Caballero, Alejandra',       voz: 'SOPRANO',   email: 'caballeroalea@gamil.com' },
  { nombre: 'Chapman, Cecilia',           voz: 'SOPRANO',   email: 'idaceciliachapman@gmail.com' },
  { nombre: 'Gallucci, Ana Paula',        voz: 'CONTRALTO', email: 'anitanape@gmail.com' },
  { nombre: 'García Figueroa, Mercedes', voz: 'SOPRANO',   email: 'spaventamercedes@gmail.com' },
  { nombre: 'García, Mariana',            voz: 'CONTRALTO', email: 'marianajorgelinagarcia@gmail.com' },
  { nombre: 'Gómez K, Claudia',          voz: 'CONTRALTO', email: 'claudiagomezkodela@gmail.com' },
  { nombre: 'Gómez, Diego',              voz: 'TENOR',     email: 'diegogomez1966@gmail.com' },
  { nombre: 'Gonzalez, Ma. Laura',        voz: 'CONTRALTO', email: 'malalag1962@gmail.com' },
  { nombre: 'Heduan, Virginia',           voz: 'SOPRANO',   email: 'virginiaheduan15@gmail.com' },
  { nombre: 'Kramer, Silvia',             voz: 'SOPRANO',   email: 'trixiriva@hotmail.com' },
  { nombre: 'Lerendegui, Fernando',       voz: 'TENOR',     email: 'ferler70@gmail.com' },
  { nombre: 'Lizer, Silvia',             voz: 'CONTRALTO', email: 'silvializer@gmail.com' },
  { nombre: 'López, Sara',               voz: 'SOPRANO',   email: 'saralopezmata@gmail.com' },
  { nombre: 'Macadam, Martín',           voz: 'BAJO',      email: 'martin.macadam@gmail.com' },
  { nombre: 'Maggi, Silvina',             voz: 'TENOR',     email: 'silvinamaggi@gmail.com' },
  { nombre: 'Mamede, Marixa',             voz: 'CONTRALTO', email: 'mmamede55@gmail.com' },
  { nombre: 'Mazzoli, Jorge',             voz: 'TENOR',     email: 'jcmmazzoli@gmail.com' },
  { nombre: 'Oxoby, Marthe',             voz: 'SOPRANO',   email: 'oxobymarthe03@gmail.com' },
  { nombre: 'Pérez Tain, Martina',       voz: 'SOPRANO',   email: 'mlpereztain@gmail.com' },
  { nombre: 'Portela, Mónica',           voz: 'SOPRANO',   email: 'monicabsarquis25@gmail.com' },
  { nombre: 'Potcova, Guille',            voz: 'TENOR',     email: 'guillepotcova@gmail.com' },
  { nombre: 'Primrose, Richard',          voz: 'BAJO',      email: 'richardprimrose@hotmail.com' },
  { nombre: 'Rebagliati, Claudia',        voz: 'CONTRALTO', email: 'claudia@escribaniarebagliati.com' },
  { nombre: 'Rigada, Amelia',             voz: 'CONTRALTO', email: 'amelia.rigada@gmail.com' },
  { nombre: 'Saban, Florencia',           voz: 'SOPRANO',   email: 'sabanflor@gmail.com' },
  { nombre: 'Sarquis, Miki',             voz: 'BAJO',      email: 'miguelsarquis15@gmail.com' },
  { nombre: 'Sawada, Victor',             voz: 'TENOR',     email: 'vicsw2025@gmail.com' },
  { nombre: 'Spaventa, Alejandra',        voz: 'CONTRALTO', email: 'alejaspa@gmail.com' },
  { nombre: 'Van Kooten, Ana',            voz: 'TENOR',     email: 'anaveronicapr@gmail.com' },
  { nombre: 'Vargas, Andrea',             voz: 'CONTRALTO', email: 'andreavarrod31@gmail.com' },
]

async function main() {
  let exitosos = 0
  let fallidos = []

  for (const c of cantantes) {
    // Los usuarios ya existen en Auth, buscarlos por email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    const user = users?.find(u => u.email === c.email)

    if (!user) {
      console.error(`❌ No encontrado en Auth [${c.nombre}]: ${c.email}`)
      fallidos.push(c.nombre)
      continue
    }

    const { error: perfilError } = await supabase
      .from('perfiles')
      .insert({
        id: user.id,
        coro_id: CORO_ID,
        nombre: c.nombre,
        voz: c.voz,
        rol: 'cantante',
        mail: c.email
      })

    if (perfilError) {
      console.error(`❌ Perfil error [${c.nombre}]: ${perfilError.message}`)
      fallidos.push(c.nombre)
      continue
    }

    console.log(`✅ ${c.nombre} (${c.voz})`)
    exitosos++
  }

  console.log(`\n--- Resultado ---`)
  console.log(`✅ Exitosos: ${exitosos}`)
  console.log(`❌ Fallidos: ${fallidos.length}`)
  if (fallidos.length > 0) console.log(fallidos.join('\n'))
}

main()
