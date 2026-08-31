import { Canvas } from '@react-three/fiber'
import { Float, Icosahedron } from '@react-three/drei'

export default function ThreeHero() {
  return (
    <div className="absolute inset-0 -z-10 opacity-[0.05] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 4, 4]} intensity={1} />
        <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.6}>
          <Icosahedron args={[1.6, 1]}><meshStandardMaterial color="#e4e4e7" wireframe transparent opacity={0.7} /></Icosahedron>
        </Float>
      </Canvas>
    </div>
  )
}
