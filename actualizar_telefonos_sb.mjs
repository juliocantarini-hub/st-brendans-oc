import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qiyquvcelzitjkqoxpyx.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpeXF1dmNlbHppdGprcW94cHl4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDcxODkwMiwiZXhwIjoyMDk2Mjk0OTAyfQ.wcqTZZ0leArPW8X2oPm8lgcBP08SHs85VfJnI5euQ2c'
const CORO_ID = '12483197-e0fe-4408-8acf-9b0021fb4f77'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const cantantes = [
  { email: 'ceciliarancedo@gmail.com',          telefono: '1127340091' },
  { email: 'clacribra2000@gmail.com',            telefono: '1150118540' },
  { email: 'caballeroalea@gamil.com',            telefono: '1145388933' },
  { email: 'idaceciliachapman@gmail.com',        telefono: '1160019862' },
  { email: 'anitanape@gmail.com',                telefono: '1123299759' },
  { email: 'spaventamercedes@gmail.com',         telefono: '1144034102' },
  { email: 'marianajorgelinagarcia@gmail.com',   telefono: '1144930748' },
  { email: 'claudiagomezkodela@gmail.com',       telefono: '1144199099' },
  { email: 'diegogomez1966@gmail.com',           telefono: '1132384829' },
  { email: 'malalag1962@gmail.com',              telefono: '1157449192' },
  { email: 'virginiaheduan15@gmail.com',         telefono: '1141583138' },
  { email: 'trixiriva@hotmail.com',              telefono: '1132368593' },
  { email: 'ferler70@gmail.com',                 telefono: '1169681344' },
  { email: 'silvializer@gmail.com',              telefono: '1154059362' },
  { email: 'saralopezmata@gmail.com',            telefono: '1166259222' },
  { email: 'martin.macadam@gmail.com',           telefono: '1144093644' },
  { email: 'silvinamaggi@gmail.com',             telefono: '1126864314' },
  { email: 'mmamede55@gmail.com',                telefono: '1156682007' },
  { email: 'jcmmazzoli@gmail.com',               telefono: '1144725247' },
  { email: 'oxobymarthe03@gmail.com',            telefono: '1163566467' },
  { email: 'mlpereztain@gmail.com',              telefono: '1165131123' },
  { email: 'monicabsarquis25@gmail.com',         telefono: '1165364736' },
  { email: 'guillepotcova@gmail.com',            telefono: '1150384018' },
  { email: 'richardprimrose@hotmail.com',        telefono: '1133023985' },
  { email: 'claudia@escribaniarebagliati.com',   telefono: '1156984764' },
  { email: 'amelia.rigada@gmail.com',            telefono: '1156165025' },
  { email: 'sabanflor@gmail.com',                telefono: '1164887270' },
  { email: 'miguelsarquis15@gmail.com',          telefono: '1133014760' },
  { email: 'vicsw2025@gmail.com',                telefono: '1141871142' },
  { email: 'alejaspa@gmail.com',                 telefono: '1151145339' },
  { email: 'anaveronicapr@gmail.com',            telefono: '1159295917' },
  { email: 'andreavarrod31@gmail.com',           telefono: '1158805897' },
]

async function main() {
  const { data: { users } } = await supabase.auth.admin.listUsers()
  
  let exitosos = 0
  let fallidos = []

  for (const c of cantantes) {
    const user = users?.find(u => u.email === c.email)

    if (!user) {
      console.error(`❌ No encontrado en Auth: ${c.email}`)
      fallidos.push(c.email)
      continue
    }

    const { error } = await supabase
      .from('perfiles')
      .update({ telefono: c.telefono })
      .eq('id', user.id)
      .eq('coro_id', CORO_ID)

    if (error) {
      console.error(`❌ Error [${c.email}]: ${error.message}`)
      fallidos.push(c.email)
      continue
    }

    console.log(`✅ ${c.email} → ${c.telefono}`)
    exitosos++
  }

  console.log(`\n--- Resultado ---`)
  console.log(`✅ Exitosos: ${exitosos}`)
  console.log(`❌ Fallidos: ${fallidos.length}`)
  if (fallidos.length > 0) console.log(fallidos.join('\n'))
}

main()
