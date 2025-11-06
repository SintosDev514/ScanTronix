import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import { AnimationMixer } from "three";

import "./App.css";

const Model = () => {
  const gltf = useLoader(GLTFLoader, "/free_mixamo_retextured_model.glb");
  const modelRef = useRef();
  const mixer = useRef();

  useEffect(() => {
    if (gltf.animations.length) {
      mixer.current = new AnimationMixer(gltf.scene);
      gltf.animations.forEach((clip) => {
        mixer.current.clipAction(clip).play();
      });
    }
  }, [gltf]);

  useFrame((state, delta) => {
    if (mixer.current) mixer.current.update(delta); // Update the mixer with each frame
  });

  return (
    <primitive
      object={gltf.scene}
      ref={modelRef}
      scale={[6, 6, 6]}
      position={[0, -16.1, -3]}
    />
  );
};

const App = () => {
  return (
    <Canvas>
      <ambientLight intensity={2.5} />

      <directionalLight position={[0, 25, 20]} intensity={10} />

      <spotLight intensity={200} positon={[0, 15, 1]} color="green" />

      <Model />

      <OrbitControls />
    </Canvas>
  );
};

export default App;
