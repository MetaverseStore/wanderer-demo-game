import React from 'react'
import { Plane, useTexture } from '@react-three/drei'

const Terrain = () => {

    const terrainTexture = useTexture({
        map: './3dModels/terrain/texture/coast_sand_rocks_02_diff_1k.jpg',
        displacementMap: './3dModels/terrain/texture/coast_sand_rocks_02_disp_1k.jpg',
        aoMap: './3dModels/terrain/texture/coast_sand_rocks_02_arm_1k.jpg',
        roughnessMap: './3dModels/terrain/texture/coast_sand_rocks_02_arm_1k.jpg',
        metalnessMap: './3dModels/terrain/texture/coast_sand_rocks_02_arm_1k.jpg',
        normalMap: './3dModels/terrain/texture/coast_sand_rocks_02_nor_gl_1k.jpg',
    });

    return (
        <Plane
            position={[0, 0, 0]}
            receiveShadow
            rotation={[-Math.PI / 2, 0, 0]}
            args={[1000, 1000, 250, 250]}
        >
            <meshStandardMaterial attach="material" {...terrainTexture} />
        </Plane>
    )
}

export default Terrain