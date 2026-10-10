import React, { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { site } from './data';

// Procedural campus scene: replace facade materials with optimized PBR textures for a production asset pass.
function Building({ item, selected, onSelect, reduceMotion }) {
  const group = useRef(); const glow = useRef(); const [hovered,setHovered] = useState(false);
  const [x,y,z] = item.position; const [w,h,d] = item.size;
  const glass = item.id === 'facilities';
  const windows = useMemo(() => {
    const arr=[];
    for(let floor=0; floor<Math.max(2,Math.floor(h/0.9)); floor++){
      for(let col=0; col<Math.max(2,Math.floor(w/0.8)); col++) arr.push([-(w/2)+.42+col*.8, .5+floor*.82, d/2+.025]);
    } return arr;
  },[w,h,d]);
  useFrame((state,dt)=>{
    if(group.current && !reduceMotion) group.current.position.y = THREE.MathUtils.damp(group.current.position.y, hovered ? .1 : 0, 5, dt);
    if(glow.current) glow.current.material.opacity = THREE.MathUtils.damp(glow.current.material.opacity, (hovered||selected)?0.7:0, 7, dt);
  });
  const baseMat = glass ? '#233b4b' : '#1b2b39';
  return <group ref={group} position={[x,y,z]} onClick={(e)=>{e.stopPropagation();onSelect(item.id)}} onPointerOver={(e)=>{e.stopPropagation();setHovered(true);document.body.style.cursor='pointer'}} onPointerOut={()=>{setHovered(false);document.body.style.cursor='auto'}}>
    <mesh position={[0,h/2,0]} castShadow receiveShadow>
      <boxGeometry args={[w,h,d]}/><meshStandardMaterial color={baseMat} roughness={glass ? .23 : .62} metalness={glass ? .65 : .28}/>
    </mesh>
    <mesh position={[0,h+.09,0]} castShadow><boxGeometry args={[w+.22,.18,d+.22]}/><meshStandardMaterial color={item.accent} metalness={.35} roughness={.4}/></mesh>
    {windows.map((p,i)=><mesh key={i} position={[p[0],p[1],p[2]]}><boxGeometry args={[.48,.43,.04]}/><meshStandardMaterial color={item.accent} emissive={item.accent} emissiveIntensity={.38} metalness={.65} roughness={.2}/></mesh>)}
    <mesh position={[0,.65,d/2+.045]}><boxGeometry args={[.95,1.3,.1]}/><meshStandardMaterial color="#07131d" metalness={.35} roughness={.25}/></mesh>
    <mesh position={[0,1.48,d/2+.11]}><boxGeometry args={[Math.min(w-.35,2.8),.32,.12]}/><meshStandardMaterial color={item.accent} emissive={item.accent} emissiveIntensity={.8}/></mesh>
    <mesh ref={glow} position={[0,h/2,0]}><boxGeometry args={[w+.12,h+.12,d+.12]}/><meshBasicMaterial color={item.accent} wireframe transparent opacity={0}/></mesh>
    <Html position={[0,h+.65,0]} center distanceFactor={18} style={{pointerEvents:'none'}}>
      <div className={`building-label ${hovered||selected?'is-visible':''}`} style={{'--accent':item.accent}}><span>{item.icon}</span>{item.name}</div>
    </Html>
    {item.id==='hq' && <mesh position={[0,h+.42,0]}><boxGeometry args={[w*.5,.08,d*.5]}/><meshStandardMaterial color="#d9a45e" metalness={.6}/></mesh>}
  </group>;
}
function Tree({position,scale=1}) {
  const ref=useRef(); useFrame((s)=>{if(ref.current) ref.current.rotation.z=Math.sin(s.clock.elapsedTime*.55+position[0])*.025});
  return <group ref={ref} position={position} scale={scale}><mesh position={[0,.55,0]} castShadow><cylinderGeometry args={[.12,.17,1.1,7]}/><meshStandardMaterial color="#6f5541"/></mesh><mesh position={[0,1.45,0]} castShadow><coneGeometry args={[.7,1.7,7]}/><meshStandardMaterial color="#284d47" roughness={.9}/></mesh><mesh position={[0,2.05,0]}><coneGeometry args={[.5,1.2,7]}/><meshStandardMaterial color="#37645a" roughness={.9}/></mesh></group>;
}
function Scene({selected,onSelect,controlsRef,reduceMotion, tourTarget}) {
  const ground = useRef();
  useFrame((state,dt)=>{
    if(tourTarget && controlsRef.current){
      const target = new THREE.Vector3(...tourTarget.position); target.y += tourTarget.size[1]*.5;
      const camera = new THREE.Vector3(target.x+tourTarget.size[0]*1.5,target.y+2.5,target.z+tourTarget.size[2]*2.6);
      state.camera.position.lerp(camera,1-Math.exp(-dt*1.25));
      controlsRef.current.target.lerp(target,1-Math.exp(-dt*1.25)); controlsRef.current.update();
    }
  });
  const trees = useMemo(()=>Array.from({length:42},(_,i)=>{const a=i/42*Math.PI*2;const r=14+(i%3)*1.6;return [Math.cos(a)*r,0,Math.sin(a)*r]}),[]);
  return <>
    <color attach="background" args={['#0a1825']}/><fog attach="fog" args={['#172a37',18,53]}/>
    <ambientLight intensity={.62}/><hemisphereLight args={['#b8d8e5','#17221f',.7]}/>
    <directionalLight position={[-12,18,9]} intensity={3.1} color="#ffc18a" castShadow shadow-mapSize={[1024,1024]}/>
    <pointLight position={[2,7,-2]} intensity={35} distance={35} color="#e7a66a"/>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.08,0]} receiveShadow><planeGeometry args={[200,200]}/><meshStandardMaterial color="#172630" roughness={.95}/></mesh>
    <gridHelper args={[80,80,'#31424a','#20323b']} position={[0,-.055,0]}/>
    {/* Campus roads and painted lane lines */}
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.045,0]}><planeGeometry args={[4.8,44]}/><meshStandardMaterial color="#101a22" roughness={1}/></mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.04,0]}><planeGeometry args={[44,4.8]}/><meshStandardMaterial color="#101a22" roughness={1}/></mesh>
    {Array.from({length:18},(_,i)=><mesh key={i} rotation={[-Math.PI/2,0,0]} position={[0,-.025,-20+i*2.4]}><planeGeometry args={[.07,.9]}/><meshBasicMaterial color="#d5b77f"/></mesh>)}
    {trees.map((p,i)=><Tree key={i} position={p} scale={.65+(i%4)*.1}/>)}
    {site.services.map(item=><Building key={item.id} item={item} selected={selected===item.id} onSelect={onSelect} reduceMotion={reduceMotion}/>)}
    {/* Street lamps */}
    {[-13,13].flatMap((x)=>[-12,0,12].map((z,i)=><group key={`${x}-${z}`} position={[x,0,z]}><mesh position={[0,1.8,0]}><cylinderGeometry args={[.045,.07,3.6,8]}/><meshStandardMaterial color="#6c7b7e" metalness={.7}/></mesh><mesh position={[.22,3.55,0]} rotation={[0,0,-.4]}><boxGeometry args={[.55,.06,.06]}/><meshStandardMaterial color="#e6b87a" emissive="#ffc57e" emissiveIntensity={1.5}/></mesh><pointLight position={[.25,3.4,0]} intensity={4} distance={6} color="#ffbd79"/></group>))}
    <ContactShadows position={[0,-.06,0]} opacity={.4} scale={50} blur={2.5} far={20}/>
    <OrbitControls ref={controlsRef} makeDefault enableDamping dampingFactor={.07} minDistance={8} maxDistance={38} minPolarAngle={.25} maxPolarAngle={Math.PI/2.15} />
  </>;
}
export default function Campus({selected,onSelect,reduceMotion,tourTarget,webglFallback}) {
  const controlsRef=useRef();
  return <div className="campus-canvas" aria-label="Interactive 3D DRFCO campus. Drag to orbit and select buildings." role="application">
    <Canvas shadows dpr={[1,1.6]} camera={{position:[19,15,24],fov:42}} gl={{antialias:true,alpha:false,powerPreference:'high-performance'}} onCreated={({gl})=>{gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.12}}>
      <Suspense fallback={null}><Scene selected={selected} onSelect={onSelect} controlsRef={controlsRef} reduceMotion={reduceMotion} tourTarget={tourTarget}/></Suspense>
    </Canvas>
    <div className="scene-vignette" aria-hidden="true"/>
    <div className="scene-hint"><span className="hint-dot"/> DRAG TO EXPLORE <span>·</span> SELECT A BUILDING</div>
  </div>;
}