// Decoración inspirada en el faro/poste de peluquería tradicional.
// Las bandas se hacen con un repeating-linear-gradient porque Tailwind no
// expone esta utility por default, y meterlo en config sería over-engineer.

export function BarberPole({ className = '' }) {
  return (
    <div
      className={`border-3 border-white shadow-bruta-lg ${className}`}
      style={{
        backgroundImage: `repeating-linear-gradient(
          45deg,
          #E60026 0px,
          #E60026 32px,
          #FFFFFF 32px,
          #FFFFFF 64px,
          #0044CC 64px,
          #0044CC 96px,
          #FFFFFF 96px,
          #FFFFFF 128px
        )`,
      }}
    />
  )
}
