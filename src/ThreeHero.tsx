import { Canvas } from '@react-three/fiber'
import { Float, Icosahedron, Line } from '@react-three/drei'
import { useMemo } from 'react'

const RINGS = [2.6, 3.2, 3.9]

export default function ThreeHero() {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return <div className="absolute inset-0 -z-10 opacity-[0.18] pointer-events-none aurora" aria-hidden />
  }

  return (
    <div className="absolute inset-0 -z-10 opacity-[0.22] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 4, 4]} intensity={1.1} />
        <Float speed={0.7} rotationIntensity={0.35} floatIntensity={0.7}>
          <Icosahedron args={[1.9, 1]}>
            <meshStandardMaterial color="#e4e4e7" wireframe transparent opacity={0.75} />
          </Icosahedron>
        </Float>
        {RINGS.map((r, i) => (
          <Float key={r} speed={0.3 + i * 0.1} rotationIntensity={0.2} floatIntensity={0.2}>
            <MemoLine r={r} i={i} />
          </Float>
        ))}
      </Canvas>
    </div>
  )
}

function MemoLine({ r, i }: { r: number; i: number }) {
  const points = useMemo(
    () =>
      Array.from({ length: 65 }, (_, k) => {
        const a = (k / 64) * Math.PI * 2
        return [Math.cos(a) * r, Math.sin(a) * r * 0.42, Math.sin(a) * r * 0.3] as [number, number, number]
      }),
    [r],
  )
  return <Line points={points} color="#a1a1aa" lineWidth={1} transparent opacity={0.5 - i * 0.12} />
}
