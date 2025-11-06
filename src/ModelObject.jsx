import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import { AnimationMixer } from "three";
import { OrbitControls } from "@react-three/drei";

import LandingPage from "./landingPage.jsx";

import "./style/ModelObject.css";

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
    if (mixer.current) mixer.current.update(delta);
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

const CameraScroll = () => {
  const scrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY * 0.01;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(({ camera }) => {
    camera.position.z = 5 + scrollY.current;
    camera.position.y = scrollY.current * 0.5;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

const ModelObject = () => {
  return (
    <Canvas camera={{ position: [0, 1, 0.5], fov: 50 }}>
      <ambientLight intensity={2.5} />

      <directionalLight position={[0, 25, 20]} intensity={10} />

      <spotLight intensity={200} position={[0, 15, 1]} color="green" />

      <Model />

      <CameraScroll />
    </Canvas>
  );
};

export default ModelObject;
