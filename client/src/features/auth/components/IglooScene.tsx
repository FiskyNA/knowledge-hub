import { Canvas } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

function IglooModel() {
  const ref = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.1
    }
  })

  return (
    <group ref={ref}>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1.5, 2, 1.5, 8, 4]} />
        <meshStandardMaterial
          color="#a5b4fc"
          transparent
          opacity={0.4}
          metalness={0.8}
          roughness={0.1}
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#c084fc"
          transparent
          opacity={0.5}
          metalness={0.9}
          roughness={0.05}
          emissive="#a855f7"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 0.2, 16]} />
        <meshStandardMaterial
          color="#7c3aed"
          transparent
          opacity={0.6}
          emissive="#8b5cf6"
          emissiveIntensity={0.3}
        />
      </mesh>
      <pointLight position={[0, 2, 3]} intensity={1} color="#a855f7" />
      <pointLight position={[3, 0, -2]} intensity={0.5} color="#08d4d6" />
    </group>
  )
}

export default function IglooScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.5} />
      <Suspense fallback={null}>
        <Environment preset="night" />
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.2}>
          <IglooModel />
        </Float>
      </Suspense>
    </Canvas>
  )
}
