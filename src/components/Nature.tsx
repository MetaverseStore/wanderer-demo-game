import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three';

const Nature = () => {

    const old_tree = useGLTF('./3dModels/nature/old_tree.glb');
    const fast_urban_tree = useGLTF('./3dModels/nature/fast_urban_tree.glb');
    const platano_tree = useGLTF('./3dModels/nature/platano_tree.glb');
    const rock = useGLTF('./3dModels/nature/rock.glb');

    old_tree.scene.scale.setScalar(5);
    old_tree.scene.traverse((child) => {
        child.castShadow = true;
        child.receiveShadow = true;
    });

    fast_urban_tree.scene.scale.setScalar(0.03);
    fast_urban_tree.scene.traverse((child) => {
        child.castShadow = true;
        child.receiveShadow = true;
    });

    platano_tree.scene.scale.setScalar(0.03);
    platano_tree.scene.traverse((child) => {
        child.castShadow = true;
        child.receiveShadow = true;
    });

    rock.scene.scale.setScalar(2);
    rock.scene.traverse((child) => {
        child.castShadow = true;
        child.receiveShadow = true;
    });


    const objects: JSX.Element[] = [];

    const createNature = useMemo(() => {

        for (let i = 0; i < 200; i++) {
            const idx = Math.floor(Math.random() * 5) + 1;
            const pos = new THREE.Vector3(
                Math.ceil(Math.random() * 450) * (Math.round(Math.random()) ? 1 : -1),
                0,
                Math.ceil(Math.random() * 450) * (Math.round(Math.random()) ? 1 : -1)
            );

            const obj = (
                <primitive
                    key={i}
                    position={pos}
                    object={
                        idx === 1
                            ? old_tree.scene.clone()
                            : idx === 2
                                ? rock.scene.clone()
                                : idx === 3
                                    ? fast_urban_tree.scene.clone()
                                    : idx === 4
                                        ? platano_tree.scene.clone()
                                        : rock.scene.clone()
                    }
                />
            );

            objects.push(obj);
        }

    }, []);




    return (
        <group>
            {objects.map((obj: JSX.Element) => {
                return obj;
            })}
        </group>
    )
}

export default Nature