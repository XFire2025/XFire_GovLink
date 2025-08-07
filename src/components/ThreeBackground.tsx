// components/ThreeBackground.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
// AFTER (The correct way)
import { EffectComposer, RenderPass, UnrealBloomPass, SMAAPass } from 'three-stdlib';

type ThreeBackgroundProps = {
  className?: string;
  dark?: boolean;
};

export default function ThreeBackground({ className, dark }: ThreeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(dark ? 0x070707 : 0xf0f0f0, 60, 220); // Deeper fog for dark mode

    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
    camera.position.set(0, 10, 65); // Slightly lower and closer
    camera.lookAt(0, 0, 0); // Look at the center

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setClearAlpha(0); // Fully transparent background
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); // Limit DPR for performance
    container.appendChild(renderer.domElement);

    // 2. Responsive Sizing
    const setSize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      composerRef.current?.setSize(w, h); // Update composer size too
    };
    setSize();
    window.addEventListener('resize', setSize);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(dark ? 0x202020 : 0x707070, dark ? 0.7 : 1.0);
    scene.add(ambientLight);

    const sunDirectionalLight = new THREE.DirectionalLight(0xFFC72C, dark ? 0.3 : 0.6); // Sunrise light
    sunDirectionalLight.position.set(30, 25, 20);
    scene.add(sunDirectionalLight);

    const lotusCoreLight = new THREE.PointLight(dark ? 0x8D153A : 0xFFC72C, dark ? 0.6 : 0.8, 100);// Central glowing core
    lotusCoreLight.position.set(0, 0, 0);
    scene.add(lotusCoreLight);

    // 4. Ethereal Lotus Core (Subtle glowing sphere)
    const lotusCoreMat = new THREE.MeshBasicMaterial({
  color: dark ? 0x8D153A : 0xFFC72C,
  transparent: true,
  opacity: dark ? 0.08 : 0.15, // Adjusted opacities to match the color
  blending: THREE.AdditiveBlending,
});
    const lotusCoreMesh = new THREE.Mesh(new THREE.SphereGeometry(6, 32, 32), lotusCoreMat);
    lotusCoreMesh.position.set(0, 0, 0); // At the center of the scene
    scene.add(lotusCoreMesh);

    // 5. Flowing Ribbons (More complex paths and materials)
    const ribbons: THREE.Mesh[] = [];
    const ribbonConfigs = [
      { color: 0x8D153A, amplitude: 8, phase: 0.0, speed: 0.0008, yOffset: 4, zOffset: -10 }, // Maroon
      { color: 0xFFC72C, amplitude: 7, phase: Math.PI / 2, speed: 0.001, yOffset: 2, zOffset: 0 }, // Gold
      { color: 0x008060, amplitude: 9, phase: Math.PI, speed: 0.0009, yOffset: 0, zOffset: 10 }, // Green
    ];

    ribbonConfigs.forEach(config => {
      const path = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-60, 0, config.zOffset + 20),
        new THREE.Vector3(-30, config.amplitude / 2, config.zOffset - 10),
        new THREE.Vector3(0, config.amplitude, config.zOffset + 5),
        new THREE.Vector3(30, config.amplitude / 2, config.zOffset - 15),
        new THREE.Vector3(60, 0, config.zOffset + 25),
      ]);
      const geom = new THREE.TubeGeometry(path, 120, 0.6, 8, false); // More segments for smoother bends
      const mat = new THREE.MeshPhysicalMaterial({
        color: config.color,
        roughness: 0.4,
        metalness: 0.1,
        transmission: 0,
        transparent: true,
        opacity: dark ? 0.25 : 0.4, // Dimmmer in dark mode
        sheen: 0.2,
        clearcoat: 0.1,
        emissive: config.color, // Add emissive for glow
        emissiveIntensity: dark ? 0.2 : 0.1,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.y = config.yOffset;
      ribbons.push(mesh);
      scene.add(mesh);
    });

    // 6. Ethereal Particle Field (Bo-leaf inspired soft shapes)
    const particleCount = 600;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3); // For individual particle motion
    const scales = new Float32Array(particleCount); // For individual particle sizes

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 1] = Math.random() * 60 - 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100 - 30;

      velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.008;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.008;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.008;

      scales[i] = Math.random() * 0.8 + 0.5; // Random scale for variety
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    particleGeo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

    const particleMat = new THREE.PointsMaterial({
      color: 0xFFC72C, // Gold/Yellow for particles
      size: 1.2, // Base size
      transparent: true,
      opacity: dark ? 0.15 : 0.25, // Dimmmer in dark mode
      depthWrite: false, // Prevents depth issues with blending
      blending: THREE.AdditiveBlending, // For glowing effect
      sizeAttenuation: true,
    });

    // Custom shader to make particles look like soft blobs/leaves
    particleMat.onBeforeCompile = (shader) => {
      // Add custom attributes and varyings to the top of the shader
      shader.vertexShader = `
        attribute float aScale;
        varying float vScale;
      ` + shader.vertexShader;

      shader.fragmentShader = `
        varying float vScale;
      ` + shader.fragmentShader;

      // In the vertex shader's main function, pass the scale
      shader.vertexShader = shader.vertexShader.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
         vScale = aScale; // Pass scale to fragment shader
        `
      );

      // In the vertex shader, also modify the final point size
      // This is a robust hook that runs after size attenuation
      shader.vertexShader = shader.vertexShader.replace(
        `#include <project_vertex>`,
        `#include <project_vertex>
         gl_PointSize *= aScale; // Apply our custom scale
        `
      );

      // In the fragment shader, create the soft circular shape
      // This hook runs before the final color is set
      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <premultiplied_alpha_fragment>`,
        `
        // Calculate distance from center of the point
        float dist = length(gl_PointCoord - vec2(0.5));
        // Create a soft, fading alpha based on distance
        float alpha = 1.0 - smoothstep(0.4, 0.5, dist);

        if (alpha < 0.01) {
          discard; // Discard pixels outside the circle for performance
        }

        // Apply the new alpha to the final color
        #include <premultiplied_alpha_fragment>
        gl_FragColor.a *= alpha;
        `
      );
    };

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Post-processing (Bloom and Anti-aliasing)
    const composer = new EffectComposer(renderer);
    composerRef.current = composer; // Store composer in ref

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85); // Strength, Radius, Threshold
    // Adjust bloom for dark mode
    bloomPass.strength = dark ? 0.8 : 0.5;
    bloomPass.radius = dark ? 0.3 : 0.2;
    bloomPass.threshold = dark ? 0.7 : 0.85;
    composer.addPass(bloomPass);

    const smaaPass = new SMAAPass(window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio());
    composer.addPass(smaaPass);

    // 8. Interaction: Mouse Parallax & Dynamic Light
    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove);

    // 9. Animation Loop
    let visible = true;
    const visHandler = () => { visible = document.visibilityState === 'visible'; };
    document.addEventListener('visibilitychange', visHandler);

    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const t = clock.getElapsedTime();

      // Camera parallax and subtle drift
      camera.position.x += ((mouse.x * 12) - camera.position.x + Math.sin(t * 0.05) * 5) * 0.01;
      camera.position.y += ((mouse.y * 6) + 10 - camera.position.y + Math.cos(t * 0.06) * 3) * 0.01;
      camera.lookAt(0, 0, 0); // Always look at the core

      if (!prefersReduced) {
        // Ribbon animation: subtle rotation and position shift
        ribbons.forEach((ribbon, i) => {
          const config = ribbonConfigs[i];
          ribbon.rotation.z = Math.sin(t * (config.speed * 1000)) * (config.amplitude * 0.005);
          ribbon.position.x = Math.sin(t * (config.speed * 800) + config.phase) * (config.amplitude * 0.2);
          ribbon.position.z = Math.cos(t * (config.speed * 900) + config.phase) * (config.amplitude * 0.15);
        });

        // Particle drift and subtle scaling
        const positions = particleGeo.attributes.position.array as Float32Array;
        const velocities = particleGeo.attributes.velocity.array as Float32Array;
        const scales = particleGeo.attributes.aScale.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 0] += velocities[i * 3 + 0] * delta * 20;
          positions[i * 3 + 1] += velocities[i * 3 + 1] * delta * 20;
          positions[i * 3 + 2] += velocities[i * 3 + 2] * delta * 20;

          // Wrap particles around
          if (positions[i * 3 + 0] > 80) positions[i * 3 + 0] = -80;
          if (positions[i * 3 + 0] < -80) positions[i * 3 + 0] = 80;
          if (positions[i * 3 + 1] > 30) positions[i * 3 + 1] = -20;
          if (positions[i * 3 + 1] < -20) positions[i * 3 + 1] = 30;
          if (positions[i * 3 + 2] > 50) positions[i * 3 + 2] = -50;
          if (positions[i * 3 + 2] < -50) positions[i * 3 + 2] = 50;

          // Subtle pulsating scale
          scales[i] = (Math.sin(t * (i * 0.01 + 0.5)) * 0.2 + 0.8) * (Math.random() * 0.8 + 0.5); // Re-incorporate initial random scale
        }
        particleGeo.attributes.position.needsUpdate = true;
        particleGeo.attributes.aScale.needsUpdate = true;

        // Lotus core subtle pulsation
        lotusCoreMesh.material.opacity = (dark ? 0.15 : 0.08) + (Math.sin(t * 0.6) * (dark ? 0.05 : 0.03));
        lotusCoreLight.intensity = (dark ? 0.8 : 0.6) + (Math.sin(t * 0.7) * (dark ? 0.2 : 0.1));
      }

      composer.render(); // Render using composer
      if (visible) rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    // 10. Cleanup
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.removeEventListener('visibilitychange', visHandler);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', setSize);

      // Dispose all resources
      scene.children.forEach(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        } else if (object instanceof THREE.Points) {
          object.geometry.dispose();
          (object.material as THREE.Material).dispose();
        }
      });

      composer.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [dark]); // Re-run effect if dark mode changes

  return <div ref={containerRef} className={className} style={{ width: '100%', height: '100%', position: 'absolute' }} />;
}