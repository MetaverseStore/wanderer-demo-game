import { useFrame } from "@react-three/fiber";
import React, { useCallback, useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

import { Mesh } from "three";

interface Animations {
  [name: string]: {
    clip: THREE.AnimationAction;
  };
}

interface CharacterProps {
  camera: THREE.PerspectiveCamera;
  glbFile: string;
}
const Character: React.FC<CharacterProps> = ({ camera, glbFile }) => {
  const character = useRef<Mesh>(null!);

  const activeAnimation: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    run: boolean;
    dance: boolean;
    jump: boolean;
  } = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    run: false,
    dance: false,
    jump: false,
  };

  const displayAnimations: Animations = {};

  const currentPosition = new THREE.Vector3();
  const currentLookAt = new THREE.Vector3();
  const decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
  const acceleration = new THREE.Vector3(1, 0.125, 100.0);
  const velocity = new THREE.Vector3(0, 0, 0);


  const { scene, animations } = useGLTF(glbFile, true);
  ;



  scene.scale.setScalar(0.1);



  scene.traverse((f) => {
    f.castShadow = true;
    f.receiveShadow = true;
  });

  const mixer = new THREE.AnimationMixer(scene);


  animations.forEach((clip) => {
    displayAnimations[clip.name.toLowerCase()] = {
      clip: mixer.clipAction(clip),
    };
  });

  // set current Action
  let currAction = displayAnimations["idle"].clip;

  let prevAction: THREE.AnimationAction;

  // Controll Input
  const handleKeyPress = useCallback((event: any) => {
    switch (event.keyCode) {
      case 87: //w
        activeAnimation.forward = true;

        break;

      case 65: //a
        activeAnimation.left = true;

        break;

      case 83: //s
        activeAnimation.backward = true;

        break;

      case 68: // d
        activeAnimation.right = true;

        break;

      case 69: //e dance
        activeAnimation.dance = true;

        break;
      case 16: // shift
        activeAnimation.run = true;
        break;
      case 32: // space
        activeAnimation.jump = true;
        break;
    }
  }, []);

  const handleKeyUp = useCallback((event: any) => {
    switch (event.keyCode) {
      case 87: //w
        activeAnimation.forward = false;
        break;

      case 65: //a
        activeAnimation.left = false;
        break;

      case 83: //s
        activeAnimation.backward = false;
        break;

      case 68: // d
        activeAnimation.right = false;
        break;

      case 69: //e dance
        activeAnimation.dance = false;
        break;

      case 16: // shift
        activeAnimation.run = false;
        break;

      case 32: // space
        activeAnimation.jump = false;
        break;
    }
  }, []);

  const calculateIdealOffset = () => {
    const idealOffset = new THREE.Vector3(0, 20, -30);
    idealOffset.applyQuaternion(character.current.quaternion);
    idealOffset.add(character.current.position);
    return idealOffset;
  };

  const calculateIdealLookat = () => {
    const idealLookat = new THREE.Vector3(0, 10, 50);
    idealLookat.applyQuaternion(character.current.quaternion);
    idealLookat.add(character.current.position);
    return idealLookat;
  };

  function updateCameraTarget(delta: number) {
    const idealOffset = calculateIdealOffset();
    const idealLookat = calculateIdealLookat();

    const t = 1.0 - Math.pow(0.001, delta);

    currentPosition.lerp(idealOffset, t);
    currentLookAt.lerp(idealLookat, t);

    camera.position.copy(currentPosition);
  }

  // movement
  const characterState = (delta: number) => {
    const newVelocity = velocity;
    const frameDecceleration = new THREE.Vector3(
      newVelocity.x * decceleration.x,
      newVelocity.y * decceleration.y,
      newVelocity.z * decceleration.z
    );
    frameDecceleration.multiplyScalar(delta);
    frameDecceleration.z =
      Math.sign(frameDecceleration.z) *
      Math.min(Math.abs(frameDecceleration.z), Math.abs(newVelocity.z));

    newVelocity.add(frameDecceleration);

    const controlObject = character.current;
    const _Q = new THREE.Quaternion();
    const _A = new THREE.Vector3();
    const _R = controlObject.quaternion.clone();

    const acc = acceleration.clone();
    if (activeAnimation.run) {
      acc.multiplyScalar(2.0);
    }

    if (currAction === displayAnimations["dance"].clip) {
      acc.multiplyScalar(0.0);
    }

    if (activeAnimation.forward) {
      newVelocity.z += acc.z * delta;
    }
    if (activeAnimation.backward) {
      newVelocity.z -= acc.z * delta;
    }
    if (activeAnimation.left) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * Math.PI * delta * acceleration.y);
      _R.multiply(_Q);
    }
    if (activeAnimation.right) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * delta * acceleration.y);
      _R.multiply(_Q);
    }

    controlObject.quaternion.copy(_R);

    const oldPosition = new THREE.Vector3();
    oldPosition.copy(controlObject.position);

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(controlObject.quaternion);
    forward.normalize();

    const sideways = new THREE.Vector3(1, 0, 0);
    sideways.applyQuaternion(controlObject.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(newVelocity.x * delta);
    forward.multiplyScalar(newVelocity.z * delta);

    controlObject.position.add(forward);
    controlObject.position.add(sideways);

    character.current.position.copy(controlObject.position);
    updateCameraTarget(delta);
  };

  useFrame((state, delta) => {
    prevAction = currAction;

    if (activeAnimation.forward) {
      if (activeAnimation.run) {
        currAction = displayAnimations["run"].clip;
      } else {
        currAction = displayAnimations["walk"].clip;
      }
    } else if (activeAnimation.left) {
      if (activeAnimation.run) {
        currAction = displayAnimations["run"].clip;
      } else {
        currAction = displayAnimations["walk"].clip;
      }
    } else if (activeAnimation.right) {
      if (activeAnimation.run) {
        currAction = displayAnimations["run"].clip;
      } else {
        currAction = displayAnimations["walk"].clip;
      }
    } else if (activeAnimation.backward) {
      if (activeAnimation.run) {
        currAction = displayAnimations["run"].clip;
      } else {
        currAction = displayAnimations["walk"].clip;
      }
    } else if (activeAnimation.dance) {
      currAction = displayAnimations["dance"].clip;
    } else if (activeAnimation.jump) {
      currAction = displayAnimations["jump"].clip;
    } else {
      currAction = displayAnimations["idle"].clip;
    }

    if (prevAction !== currAction) {
      prevAction.fadeOut(0.2);

      if (prevAction === displayAnimations["walk"].clip) {
        const ratio =
          currAction.getClip().duration / prevAction.getClip().duration;
        currAction.time = prevAction.time * ratio;
      }

      currAction.reset().play();
    } else {
      currAction.play();
    }

    characterState(delta);
    const idealLookat = calculateIdealLookat();

    state.camera.lookAt(idealLookat);
    state.camera.updateProjectionMatrix();
    mixer?.update(delta);
  });

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    document.addEventListener("keyup", handleKeyUp);
    currAction.play();
    return () => {
      document.removeEventListener("keydown", handleKeyPress);

      document.removeEventListener("keyup", handleKeyUp);
    };
  });

  return <primitive object={scene} ref={character} />;
};

export default Character;
