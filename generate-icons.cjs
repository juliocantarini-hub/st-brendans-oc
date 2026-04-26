const sharp = require('sharp')

// SVG del ícono: letra A con una corchea, fondo verde
const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Fondo verde -->
  <rect width="512" height="512" rx="80" fill="#0F6E56"/>
  
  <!-- Letra A estilizada -->
  <text x="140" y="340" 
    font-family="Georgia, serif" 
    font-size="280" 
    font-weight="bold" 
    fill="white"
    opacity="0.95">A</text>
  
  <!-- Corchea musical -->
  <circle cx="370" cy="165" r="28" fill="#9FE1CB"/>
  <rect x="394" y="80" width="14" height="120" fill="#9FE1CB" rx="7"/>
  <path d="M408 80 Q450 95 440 130 Q430 150 408 145" fill="#9FE1CB"/>
</svg>
`

async function generarIconos() {
  const svgBuffer = Buffer.from(svg)
  
  await sharp(svgBuffer).resize(192, 192).png().toFile('public/icon-192.png')
  console.log('✓ icon-192.png generado')
  
  await sharp(svgBuffer).resize(512, 512).png().toFile('public/icon-512.png')
  console.log('✓ icon-512.png generado')
  
  console.log('¡Íconos listos!')
}

generarIconos().catch(console.error)