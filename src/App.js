import React, { useState, useRef, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Canvas, extend, useThree, useFrame, useLoader } from 'react-three-fiber';
import { useSpring, a } from 'react-spring/three';

import './styles.css';

extend({ OrbitControls });

const Rock = () => {
  const scene  = useLoader(GLTFLoader, "/scene.gltf")
	return (
		<primitive object={scene.scene} /> 
  	)
}

const Controls = () => {
	const orbitRef = useRef();
	const { camera, gl } = useThree();

	useFrame(() => {
		// this is called on every frame
		orbitRef.current.update()
	})

	return (
		<orbitControls 
			autoRotate 
			maxPolarAngle={ Math.PI / 3 }
			minPolarAngle={ Math.PI / 3 }
			args={ [camera, gl.domElement] }
			ref={ orbitRef }
		 />
	)
}

const Plane = () => (
	<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
		<planeBufferGeometry attach="geometry" args={[100, 100]} />
		<meshPhysicalMaterial attach="material" color="white" />
	</mesh>
)

const Box = () => {
	const [hovered, setHovered] = useState(false);
	const [active, setActive] = useState(false);
	const props = useSpring({ 
		scale: active ? [1.5, 1.5, 1.5] : [1, 1, 1],
		color: hovered ? "hotpink" : "gray",
	})

	return (
		<a.mesh
			onPointerOver={() => setHovered(true)} 
			onPointerOut={() => setHovered(false)}
			onClick={() => setActive(!active)}
			scale={props.scale}
			castShadow
		>
			<ambientLight />
			<spotLight 
				position={[0, 5, 0]} 
				penumbra={1} 
				castShadow
			/>
			<boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
			<a.meshPhysicalMaterial attach="material" color={props.color} />
		</a.mesh>
	)
};

export default () => (
	<Canvas camera={{position: [ 0, 0, 5 ]}} onCreated={({ gl }) => {
		gl.shadowMap.enabled = true
		gl.shadowMap.type = THREE.PCFSoftShadowMap	
	}}>
		<ambientLight intensity={0.75} />
        <pointLight intensity={1} position={[-10, -25, -10]} />
		<spotLight 
			position={[0, 5, 0]} 
			penumbra={1} 
			castShadow
		/>
		<Controls />
		<fog attach="fog" args={['#cc7b32', 16, 20]}/>
		<Suspense fallback={<Box />}>
			<Rock />
		</Suspense>
	</Canvas>
)