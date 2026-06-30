"use client"

import { Canvas } from "@react-three/fiber"
import styles from "./Scene.module.css"
import { OrbitControls} from "@react-three/drei"
import { Suspense, useEffect, useRef } from 'react'
import { Object3D } from "three"
import { shpToGLFT, shpToJSON, shpToOBJ } from "@/src/serverFunctions/action"


export default function Scene() {
    
    const meshRef = useRef<Object3D>(null!)
   
    async function init() {
        const resolution = '10m'
        const shpfilePath = `public/natural_earth_vector/${resolution}_physical/ne_${resolution}_coastline.shp`
        const output = "public/output3DObject.obj"

        const landModel = await shpToOBJ(shpfilePath, output, true)
               
    }

    useEffect(() => {
        //    init()

       document.addEventListener('keydown', (e) => {
        if (e.code == "Space") {
            console.log("Space clicked");
            console.dir(meshRef.current)
        }
       })
    }, [])


    return (
        
        <div className={styles.Scene}>

            <Canvas
                linear={true}
                shadows
                className={styles.canvas}
                camera={{
                    position: [-6, 10, 20],
                }}
                >

                <Suspense fallback={null}>
                    <OrbitControls/>
                    <ambientLight intensity={1} />
                    {/* <mesh visible castShadow receiveShadow position={[0,0,0]}>
                        <sphereGeometry args={[88, 64, 64]} />
                        <meshStandardMaterial
                            color="black"
                            wireframe
                            />
                    </mesh> */}

                        <mesh ref={meshRef} visible position={[0,0,0]}>
                            <meshStandardMaterial
                            color="black"
                            wireframe
                            />
                        </mesh>

                </Suspense>
                    

            </Canvas>
        </div> 
    )
}