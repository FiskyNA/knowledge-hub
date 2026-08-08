import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from '@/components/layout/ThemeProvider'

function AnimatedParticles({ count = 2000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!)
  const { theme } = useTheme()

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      temp[i3] = (Math.random() - 0.5) * 20
      temp[i3 + 1] = (Math.random() - 0.5) * 20
      temp[i3 + 2] = (Math.random() - 0.5) * 20

      const t = theme === 'dark' ? 0.5 : 0.6
      colors[i3] = t
      colors[i3 + 1] = t
      colors[i3 + 2] = 1
    }

    return { positions: temp, colors }
  }, [count, theme])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.02
      ref.current.rotation.y += delta * 0.03
    }
  })

  return (
    <Points
      ref={ref}
      limit={count}
      positions={particles.positions}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        size={0.04}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors
      />
      <bufferAttribute attach="geometry-attributes-color" args={[particles.colors, 3]} />
    </Points>
  )
}

function FloatingCrystals({ count = 50 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null!)
  const { theme } = useTheme()

  const dummy = useRef(new THREE.Object3D())
  const color = new THREE.Color()

  useFrame((state) => {
    if (!ref.current) return

    const time = state.clock.getElapsedTime()
    const instanceColor = ref.current.instanceColor
    if (!instanceColor) return

    for (let i = 0; i < count; i++) {
      const id = i
      dummy.current.position.x = Math.sin(time * 0.3 + id * 0.5) * 5
      dummy.current.position.y = Math.cos(time * 0.2 + id * 0.3) * 5
      dummy.current.position.z = Math.sin(time * 0.4 + id * 0.7) * 5

      dummy.current.rotation.x = time * 0.2 + id
      dummy.current.rotation.y = time * 0.3 + id

      const scale = 0.3 + Math.sin(time + id) * 0.1
      dummy.current.scale.setScalar(scale)

      color.set(theme === 'dark' ? '#8b5cf6' : '#7c3aed')
      dummy.current.updateMatrix()
      ref.current.setMatrixAt(i, dummy.current.matrix)
      ref.current.setColorAt(i, color)
    }

    ref.current.instanceMatrix.needsUpdate = true
    instanceColor.needsUpdate = true
  })

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 0), [])

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, undefined, count]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={theme === 'dark' ? '#8b5cf6' : '#7c3aed'}
        transparent
        opacity={0.6}
        emissive={theme === 'dark' ? '#8b5cf6' : '#7c3aed'}
        emissiveIntensity={0.3}
        metalness={0.9}
        roughness={0.1}
      />
    </instancedMesh>
  )
}

interface ParticleBackgroundProps {
  className?: string
}

export default function ParticleBackground({ className }: ParticleBackgroundProps) {
  return (
    <div
      className={`fixed inset-0 z-0 pointer-events-none ${className || ''}`}
    >
      <Canvas
        camera={{ position: [0, 0, 1], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#08d4d6" />
        <AnimatedParticles count={1500} />
        <FloatingCrystals count={30} />
      </Canvas>
    </div>
  )
}
