import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

{
  /*import { useLoader } from "@react-three/fiber";*/
}
import {
  AnimationMixer,
  AxesHelper,
  LoadingManager,
  TextureLoader,
} from "three";
import { OrbitControls } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import "./style/ModelObject.css";
import LoadingBar from "./pages/Loading";

{
  /*

const LogoImage = () => {
  const texture = useLoader(TextureLoader, "/logo_white.png");
  return (
    <mesh position={[0, -13.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial map={texture} transparent={true} alphaTest={0.5} />
    </mesh>
  );
};

*/
}

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
    camera.position.z = 8 + scrollY.current * 0.5;
    camera.position.y = scrollY.current * 1;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

const Model = ({ setProgress, onLoaded }) => {
  const [gltf, setGltf] = useState(null);
  const mixer = useRef();

  useEffect(() => {
    const manager = new LoadingManager();
    manager.onProgress = (_, loaded, total) => {
      setProgress(Math.round((loaded / total) * 100));
    };
    manager.onLoad = () => {
      setProgress(100);
      onLoaded?.();
    };

    const loader = new GLTFLoader(manager);
    loader.load("/free_mixamo_retextured_model.glb", (loadedGltf) => {
      setGltf(loadedGltf);
    });
  }, []); // load only once

  useEffect(() => {
    if (gltf?.animations?.length) {
      mixer.current = new AnimationMixer(gltf.scene);
      const action = mixer.current.clipAction(gltf.animations[0]);
      action.play();
    }
  }, [gltf]);

  useFrame((_, delta) => {
    if (mixer.current) mixer.current.update(delta);
  });

  if (!gltf) return null;
  return (
    <primitive object={gltf.scene} scale={[5, 5, 5]} position={[6, -14.7, 5]} />
  );
};

const ModelObject = () => {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (!loaded) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    } else {
      html.style.overflow = "auto";
      body.style.overflow = "auto";
    }

    return () => {
      html.style.overflow = "auto";
      body.style.overflow = "auto";
    };
  }, [loaded]);

  useGSAP(() => {
    gsap.fromTo(
      "#hero-text",
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        delay: 1,
        stagger: 1,
      }
    );
  }, []);

  return (
    <>
      {!loaded && <LoadingBar progress={progress} />}
      <div className="model-wrapper">
        <Canvas camera={{ position: [14, 10, 5], fov: 80 }} dpr={[1, 1.5]}>
          <ambientLight intensity={3} color="black" />
          <directionalLight position={[0, 25, 20]} intensity={2} />
          <spotLight intensity={5} position={[0, 15, 1]} color="white" />
          <Model setProgress={setProgress} onLoaded={() => setLoaded(true)} />

          {/*      <LogoImage />
           */}
          <CameraScroll />
        </Canvas>

        <div className="hero-div">
          {/*    <h3 id="hero-text">ScanTronix</h3>*/}
        </div>
      </div>

      <div className="sec2">Section 2</div>
      <div className="sec3">Section 3</div>
      <div className="sec4">Section 4</div>
    </>
  );
};

export default ModelObject;
