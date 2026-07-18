import { Suspense, type RefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { View } from '@react-three/drei'

type SceneCanvasProps = {
    eventSource: RefObject<HTMLElement>
}

/**
 * Único <Canvas> WebGL compartido por toda la aplicación.
 *
 * En vez de montar un <Canvas> por cada escena 3D (lo que agota los
 * contextos WebGL del navegador y provoca "THREE.WebGLRenderer: Context
 * Lost"), montamos éste una sola vez y cada sección usa <View> de
 * `@react-three/drei` para "trackear" su propio elemento HTML. Todas las
 * vistas comparten el mismo renderer/contexto WebGL.
 *
 * `eventSource` apunta al contenedor que envuelve todo el contenido de la
 * página: como este Canvas es fijo, invisible (pointer-events: none) y a
 * pantalla completa, necesita escuchar los eventos de puntero desde ese
 * contenedor para que OrbitControls y el raycasting sigan funcionando sobre
 * cada <View>.
 */
export function SceneCanvas({ eventSource }: SceneCanvasProps) {
    return (
        <Canvas
            eventSource={eventSource}
            eventPrefix="client"
            dpr={[1, 1.5]}
            gl={{ antialias: true, powerPreference: 'default' }}
            // react-three-fiber sets `position: relative` via an inline style on
            // its wrapper div, which always beats a Tailwind class (inline
            // styles win over stylesheet rules). So the fixed, full-viewport
            // positioning has to be passed through `style`, not `className`.
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
        >
            <Suspense fallback={null}>
                <View.Port />
            </Suspense>
        </Canvas>
    )
}
