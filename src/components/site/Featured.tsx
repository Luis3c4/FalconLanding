import { Suspense, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useGLTF, OrbitControls, Environment, View, PerspectiveCamera, Center, Bounds } from '@react-three/drei'
import type { Group } from 'three'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP)

function IPhone() {
    const { scene } = useGLTF('/iphone.glb')
    return <primitive object={scene} />
}

// Starts showing the back of the phone (rotated 180°) and turns to a side
// profile (90°) instead of stopping front-on — a clearer "this is a real 3D
// object" reveal than settling flat on either face. Rotating this wrapping
// group doesn't fight OrbitControls (which only ever moves the camera, never
// the object).
function SpinOnReveal({ spin, children }: { spin: boolean; children: ReactNode }) {
    const groupRef = useRef<Group>(null)
    const hasSpunRef = useRef(false)

    useGSAP(() => {
        if (!spin || hasSpunRef.current || !groupRef.current) return
        hasSpunRef.current = true
        gsap.to(groupRef.current.rotation, {
            y: Math.PI / -3.7,
            duration: 1.4,
            ease: "power2.inOut",
        })
    }, [spin])

    return (
        <group ref={groupRef} rotation={[0, Math.PI, 0]}>
            {children}
        </group>
    )
}

function ThreeScene({ spin }: { spin: boolean }) {
    return (
        <View style={{ width: '100%', height: '100%' }}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
            <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
                <pointLight position={[-10, -10, -10]} intensity={1} />
                <Environment preset="city" />
                {/* The GLB's own scale/pivot isn't reliable to hand-tune: Bounds
                    measures the real bounding box and fits+zooms the camera to
                    it, and Center re-centers the geometry on its own bounding
                    box so OrbitControls (which orbits around [0,0,0]) rotates
                    around the model itself instead of some off-center pivot
                    that swings it out of view while dragging. */}
                <Bounds fit clip observe margin={1.2}>
                    <SpinOnReveal spin={spin}>
                        <Center>
                            <IPhone />
                        </Center>
                    </SpinOnReveal>
                </Bounds>
            </Suspense>
            <OrbitControls
                makeDefault
                enableZoom={false}
                enablePan={false}
                enableDamping={false}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI * 5 / 6}
            />
        </View>
    )
}

const FEATURES = [
    {
        title: "Chip A-series con Neural Engine",
        desc: "Rendimiento de nueva generación con un Neural Engine más rápido, pensado para IA y machine learning directamente en el dispositivo.",
    },
    {
        title: "Sistema de cámara Pro 48MP",
        desc: "Captura fotos y video con calidad profesional gracias al sistema de cámaras Pro de 48MP, incluso con poca luz.",
    },
    {
        title: "Pantalla Super Retina XDR",
        desc: "Colores más vivos, negros más profundos y un brillo excepcional gracias a la tecnología Super Retina XDR.",
    },
    {
        title: "Conectividad USB-C",
        desc: "Transferencias más rápidas y compatibilidad universal gracias al puerto USB-C.",
    },
];

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
    );
}

function FeatureItem({
    title,
    desc,
    isOpen,
    onToggle,
}: {
    title: string;
    desc: string;
    isOpen: boolean;
    onToggle: () => void;
}) {
    const panelRef = useRef<HTMLDivElement>(null);

    // The expand/collapse itself is the "characteristic Apple" bit: a smooth
    // height tween (gsap supports animating straight to "auto") instead of an
    // abrupt show/hide.
    useGSAP(() => {
        const panel = panelRef.current;
        if (!panel) return;
        gsap.to(panel, {
            height: isOpen ? "auto" : 0,
            duration: 0.5,
            ease: "power3.inOut",
        });
    }, [isOpen]);

    return (
        <div className="rounded-2xl bg-white/6 overflow-hidden">
            <button
                onClick={onToggle}
                className="flex w-full items-center gap-3 px-5 py-4 text-left text-white"
            >
                <span
                    className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/40 transition-transform duration-300",
                        isOpen && "rotate-45",
                    )}
                >
                    <PlusIcon className="h-3 w-3" />
                </span>
                <span className="font-medium">{title}</span>
            </button>
            <div ref={panelRef} className="h-0 overflow-hidden px-5">
                <p className="pb-5 text-sm text-white/60 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

export function Featured() {
    const [mounted, setMounted] = useState(false)
    const [openIndex, setOpenIndex] = useState<number | null>(0)
    const [spin, setSpin] = useState(false)
    const sceneContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => { setMounted(true) }, [])

    // Trigger the reveal wiggle once, the first time the model is actually
    // on screen (not just mounted — Featured can mount off-screen well
    // before the user scrolls to it).
    useEffect(() => {
        const el = sceneContainerRef.current
        if (!el) return
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return
                setSpin(true)
                io.disconnect()
            },
            { threshold: 0.4 },
        )
        io.observe(el)
        return () => io.disconnect()
    }, [])

    return (
        <section id="featured" className="bg-neutral-900 min-h-screen flex items-center py-24 md:py-32">
            <div className="mx-auto max-w-7xl w-full px-6">

                <div className="reveal relative rounded-[2.5rem] bg-black overflow-hidden grid md:grid-cols-2 gap-10 p-8 md:p-14">
                    <div className="flex flex-col justify-center gap-3 order-2 md:order-1">
                        {FEATURES.map((f, i) => (
                            <FeatureItem
                                key={f.title}
                                title={f.title}
                                desc={f.desc}
                                isOpen={openIndex === i}
                                onToggle={() => setOpenIndex((cur) => (cur === i ? null : i))}
                            />
                        ))}
                    </div>
                    {/* The visual side never changes based on which feature is
                        open — it's always the same 3D model. */}
                    <div ref={sceneContainerRef} className="relative h-90 md:h-140 w-full order-1 md:order-2">
                        {mounted && <ThreeScene spin={spin} />}
                    </div>
                </div>
            </div>
        </section>
    );
}
