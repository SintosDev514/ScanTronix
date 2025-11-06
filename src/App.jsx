import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'; // Canvas and useFrame from R3F
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'; // Import GLTFLoader
import { OrbitControls } from '@react-three/drei'; // OrbitControls for interactive camera movement
import { useLoader } from '@react-three/fiber'; // Import useLoader for loading models
import { AnimationMixer } from 'three'; // Import AnimationMixer for animations

import './App.css';

const Model = () => {
  const gltf = useLoader(GLTFLoader, '/free_mixamo_retextured_model.glb');  // Load your model
  const modelRef = useRef();  // Reference for the model to apply animations
  const mixer = useRef();  // Reference for AnimationMixer
  
  // Run when the model is loaded
  useEffect(() => {
    if (gltf.animations.length) {
      mixer.current = new AnimationMixer(gltf.scene);
      gltf.animations.forEach((clip) => {
        mixer.current.clipAction(clip).play();  // Play the animation
      });
    }
  }, [gltf]);

  // Use the useFrame hook to update the animation mixer on each frame
  useFrame((state, delta) => {
    if (mixer.current) mixer.current.update(delta);  // Update the mixer with each frame
  });

  return <primitive object={gltf.scene} ref={modelRef} scale={[6,6,6]} position={[0,-16.10,-3]} />;
};

const App = () => {
  return (
    <Canvas >
      {/* Add ambient light */}
      <ambientLight intensity={2.5} />
      {/* Add directional light */}
      <directionalLight position={[0,25, 20]} intensity={10} />
      
      <spotLight intensity={200} positon={[0,15,1]} color="green" />
      

      {/* Add your model to the scene */}
      <Model  />

      {/* Add OrbitControls for interacting with the scene */}
     <OrbitControls />
    </Canvas>
  );
}

export default App;
