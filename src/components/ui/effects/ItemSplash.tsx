export function ItemSplash({ src }: { src: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {[...Array(12)].map((_, i) => {
        const angle = Math.random() * 2 * Math.PI
        const distance = 30 + Math.random() * 40
        const dx = `${Math.cos(angle) * distance}px`
        const dy = `${Math.sin(angle) * distance}px`

        return (
          <img
            key={i}
            src={src}
            className="absolute w-5 h-5 opacity-80"
            style={
              {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                animation: 'itemPop 0.8s ease-out forwards',
                animationDelay: `${i * 0.05}s`,
                '--dx': dx,
                '--dy': dy,
              } as React.CSSProperties
            }
          />
        )
      })}
    </div>
  )
}
