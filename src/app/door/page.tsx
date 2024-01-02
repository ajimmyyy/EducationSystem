"use client";
import * as THREE from "three";
import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, Text } from "@react-three/drei";
import { useSpring } from "@react-spring/core";
import { a as three } from "@react-spring/three";
import { Model } from "./model";
import { useRouter } from "next/navigation";

export default function App() {
  const [open, setOpen] = useState(false);
  const props = useSpring({ open: Number(open) });
  const router = useRouter();
  return (
    <div className="relative h-screen w-screen items-center justify-center bg-gradient-to-tr from-[#f0f0f0] to-[#d25578]">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, -20], fov: 35 }}
        gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
        linear
      >
        <Text
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/NotoSans.ttf"
          rotation={[0, Math.PI, 0]}
          position={[13, 6, 10]}
          fontSize={3}
        >
          Hi
        </Text>
        <Text
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/NotoSans.ttf"
          rotation={[0, Math.PI, 0]}
          position={[4.5, 2, 10]}
          fontSize={3}
        >
          我們是第 14 組
        </Text>
        <Text
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/NotoSans.ttf"
          rotation={[0, Math.PI, 0]}
          position={[-1, -2, 10]}
          fontSize={3}
        >
          為您帶來 新北科課程網
        </Text>
        <three.pointLight
          position={[10, 10, 10]}
          intensity={1.5}
          color={props.open.to([0, 1], ["#f0f0f0", "#d25578"])}
        />
        <Suspense fallback={null}>
          <group
            rotation={[0, Math.PI, 0]}
            onClick={(e) => (e.stopPropagation(), setOpen(!open))}
          >
            <Model open={open} hinge={props.open.to([0, 1], [1.575, -0.425])} />
          </group>
          <Environment preset="city" />
        </Suspense>
        <ContactShadows
          position={[0, -4.5, 0]}
          opacity={0.4}
          scale={20}
          blur={1.75}
          far={4.5}
        />
      </Canvas>
      <div
        className="pointer-events-none fixed left-[calc(50vw-100px)] flex w-[200px] justify-center rounded-full bg-gray-900 py-2 text-2xl text-white opacity-80
          transition-all duration-500 ease-in-out
        "
        style={{
          bottom: open ? "-96px" : "48px",
        }}
      >
        點擊電腦
      </div>
      <div
        className=" fixed left-[calc(50vw-160px)] flex w-[320px] cursor-pointer justify-center rounded-full bg-gray-900 py-2 text-2xl text-white opacity-80
          transition-all duration-500 ease-in-out
        "
        onClick={() => {
          router.push("/search");
        }}
        style={{
          top: open ? "48px" : "-96px",
        }}
      >
        點我正式進入網頁
      </div>
    </div>
  );
}
