import { Suspense, useEffect, useState } from 'react'
import { useGLTF, OrbitControls, Environment, View, PerspectiveCamera } from '@react-three/drei'

function IPhone() {
    const { scene } = useGLTF('/iphone.glb')
    return <primitive object={scene} scale={1} position={[0, 0, 0]} />
}

function ThreeScene() {
    return (
        <View style={{ width: '100%', height: '100%' }}>
            <PerspectiveCamera makeDefault position={[9, 0, 9]} fov={50} />
            <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
                <pointLight position={[-10, -10, -10]} intensity={1} />
                <Environment preset="city" />
                <IPhone />
            </Suspense>
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI * 5 / 6}
            />
        </View>
    )
}

export function Featured() {
    const [mounted, setMounted] = useState(false)
    useEffect(() => { setMounted(true) }, [])

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
                    <div className="reveal relative h-150 w-full">
                        {mounted && <ThreeScene />}
                    </div>
                </div>
            </div>
        </section>
    );
}