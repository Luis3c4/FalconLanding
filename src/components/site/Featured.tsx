import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'

function Box(props) {
    const meshRef = useRef(null)
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    useFrame((state, delta) => (meshRef.current.rotation.x += delta))
    return (
        <mesh
            {...props}
            ref={meshRef}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}
export function Featured() {
    return (
        <section id="featured" className="bg-background">
            <div className="relative min-h-[90vh] bg-gradient-dark text-background flex items-center overflow-hidden">
                <div className="mx-auto max-w-7xl w-full px-6 grid md:grid-cols-2 gap-12 items-center py-24">
                    <div className="reveal">
                        <p className="text-[13px] uppercase tracking-[0.25em] text-white/50 mb-6">
                            Última generación
                        </p>
                        <h2 className="text-5xl md:text-7xl font-semibold leading-[1.05] text-white">
                            iPhone.
                            <br />
                            <span className="text-white/60">Forjado en titanio.</span>
                        </h2>
                        <p className="mt-6 text-lg text-white/70 max-w-md">
                            El smartphone más avanzado de Apple, con chip de última
                            generación, cámara Pro y diseño aeroespacial.
                        </p>
                        <ul className="mt-10 space-y-4 text-sm text-white/80">
                            {[
                                "Chip A-series con Neural Engine",
                                "Sistema de cámara Pro 48MP",
                                "Pantalla Super Retina XDR",
                                "Conectividad USB-C",
                            ].map((f) => (
                                <li key={f} className="flex items-center gap-3">
                                    <span className="h-1 w-6 bg-white/40" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="reveal relative">
                        <Canvas>
                            <ambientLight intensity={Math.PI / 2} />
                            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
                            <Box position={[-1.2, 0, 0]} />
                            <Box position={[1.2, 0, 0]} />
                        </Canvas>
                    </div>
                </div>
            </div>
        </section>
    );
}