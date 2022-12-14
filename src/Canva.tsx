import React, { Suspense } from "react";
import { Loader, OrbitControls, softShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Nature from "./components/Nature";
import Terrain from "./components/Terrain";
import Character from "./components/Character";


softShadows();
const Canva = ({ characterModal }: { characterModal: string }) => {

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xfffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(25, 10, 25);

    const light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(-100, 100, 100);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 50;
    light.shadow.camera.right = -50;
    light.shadow.camera.top = 50;
    light.shadow.camera.bottom = -50;

    return (
        <>
            <Canvas shadows camera={camera}>
                <hemisphereLight args={[hemiLight.color, hemiLight.groundColor, 0.6]} />
                <directionalLight
                    castShadow
                    position={light.position}
                    intensity={light.intensity}
                    shadow-mapSize-width={light.shadow.mapSize.width}
                    shadow-mapSize-height={light.shadow.mapSize.height}
                    shadow-camera-near={light.shadow.camera.near}
                    shadow-camera-far={light.shadow.camera.far}
                    shadow-camera-left={light.shadow.camera.left}
                    shadow-camera-right={light.shadow.camera.right}
                    shadow-camera-top={light.shadow.camera.top}
                    shadow-camera-bottom={light.shadow.camera.bottom}
                />
                <ambientLight intensity={0.1} />
                <OrbitControls />
                <Suspense fallback={null}>
                    <Terrain />
                    <perspectiveCamera
                        position={camera.position}
                        near={camera.near}
                        far={camera.far}
                        fov={camera.fov}
                        aspect={camera.aspect}
                    />
                    <Character
                        camera={camera}
                        glbFile={characterModal}
                    />
                    <Nature />
                </Suspense>
                <fog attach="fog" color="#ffffff" near={50} far={300} />
            </Canvas>
            <Loader
                dataInterpolation={(p) => `Loading ${p.toFixed(2)}%`}
                initialState={(active) => active}
            />
        </>
    )
}

export default Canva