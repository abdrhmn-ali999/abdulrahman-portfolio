import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import * as THREE from 'three';
import { ArrowDown, Brain, MapPin } from 'lucide-react';
import MagneticButton from '../components/MagneticButton';

gsap.registerPlugin(TextPlugin, ScrollTrigger);

// ── كل الـ Shaders كما هي بدون تغيير ──
const earthVertexShader = `
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vNormal   = normalize(normalMatrix * normal);
    vUv       = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const earthFragmentShader = `
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vPosition;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  float fbm(vec2 p) {
    float v=0.0; float a=0.5;
    vec2 shift=vec2(100.0);
    mat2 rot=mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.5));
    for(int i=0;i<6;i++){v+=a*noise(p);p=rot*p*2.0+shift;a*=0.5;}
    return v;
  }
  void main() {
    vec2 uv=vUv;
    float terrain=fbm(uv*3.8+vec2(1.7,9.2));
    float landMask=smoothstep(0.50,0.54,terrain);
    vec3 deepOcean=vec3(0.01,0.04,0.18),shallowOcean=vec3(0.04,0.14,0.38);
    vec3 sand=vec3(0.80,0.72,0.52),grass=vec3(0.20,0.48,0.14);
    vec3 forest=vec3(0.06,0.28,0.06),mountain=vec3(0.52,0.46,0.40),snow=vec3(0.92,0.96,1.00);
    vec3 oceanColor=mix(deepOcean,shallowOcean,terrain/0.52);
    float elev=clamp((terrain-0.52)/0.48,0.0,1.0);
    vec3 landColor=sand;
    landColor=mix(landColor,grass,smoothstep(0.04,0.18,elev));
    landColor=mix(landColor,forest,smoothstep(0.18,0.36,elev));
    landColor=mix(landColor,mountain,smoothstep(0.36,0.60,elev));
    landColor=mix(landColor,snow,smoothstep(0.72,0.92,elev));
    float lat=abs(vUv.y-0.5)*2.0;
    float polar=smoothstep(0.72,0.96,lat+noise(uv*10.0)*0.12);
    landColor=mix(landColor,snow,polar);
    oceanColor=mix(oceanColor,snow*0.9,polar*0.8);
    vec3 color=mix(oceanColor,landColor,landMask);
    vec3 sunDir=normalize(vec3(2.0,1.0,2.0));
    float diff=max(0.0,dot(vNormal,sunDir));
    float fresnel=pow(1.0-max(dot(vNormal,normalize(vec3(0.0,0.0,1.0))),0.0),3.5);
    vec3 atmColor=vec3(0.15,0.55,1.0)*fresnel*1.4;
    vec3 viewDir=normalize(vec3(0.0,0.0,1.0));
    vec3 halfDir=normalize(sunDir+viewDir);
    float spec=pow(max(dot(vNormal,halfDir),0.0),64.0);
    float oceanSpec=spec*(1.0-landMask)*1.2;
    color=color*(0.12+diff*0.88)+vec3(oceanSpec*0.6,oceanSpec*0.7,oceanSpec);
    float night=1.0-smoothstep(-0.05,0.35,dot(vNormal,sunDir));
    float cities=fbm(uv*14.0+vec2(5.3,2.1));
    color+=vec3(1.0,0.88,0.55)*step(0.62,cities)*night*0.35*landMask;
    color+=atmColor;
    gl_FragColor=vec4(clamp(color,0.0,1.0),1.0);
  }
`;
const atmVertexShader = `
  varying vec3 vNormal;
  void main() { vNormal=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }
`;
const atmFragmentShader = `
  varying vec3 vNormal;
  void main() {
    float intensity=pow(0.7-dot(vNormal,vec3(0.0,0.0,1.0)),3.5);
    gl_FragColor=vec4(0.1,0.5,1.0,intensity*0.8);
  }
`;
const cloudVertexShader = `
  varying vec2 vUv; varying vec3 vNormal;
  void main() { vUv=uv; vNormal=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }
`;
const cloudFragmentShader = `
  varying vec2 vUv; varying vec3 vNormal;
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
  float fbm(vec2 p){float v=0.0;float a=0.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.1;a*=0.5;}return v;}
  uniform float uTime;
  void main(){float cloud=fbm(vUv*4.0+vec2(uTime*0.004,0.0));float alpha=smoothstep(0.55,0.72,cloud)*0.75;gl_FragColor=vec4(0.95,0.97,1.0,alpha);}
`;

export default function HeroSection() {
  const sectionRef = useRef(null);
  const canvasRef  = useRef(null);
  const typingRef  = useRef(null);

  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);
  const badge1X = useTransform(mouseX, [-500, 500], [-35, 35]);
  const badge1Y = useTransform(mouseY, [-500, 500], [-8, 8]);
  const badge2X = useTransform(mouseX, [-500, 500], [18, -18]);
  const badge2Y = useTransform(mouseY, [-500, 500], [35, -35]);

  useEffect(() => {
    const onMove = (e) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const W = window.innerWidth, H = window.innerHeight;
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W/H, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    scene.add(new THREE.DirectionalLight(0xfff5e0, 2.2).position.set(5,3,5) && new THREE.DirectionalLight(0xfff5e0, 2.2));
    const sun = new THREE.DirectionalLight(0xfff5e0, 2.2); sun.position.set(5,3,5); scene.add(sun);
    scene.add(new THREE.AmbientLight(0x111133, 0.6));
    // Stars
    const starCount = 6000;
    const sp = new Float32Array(starCount*3), sc = new Float32Array(starCount*3);
    for(let i=0;i<starCount;i++){
      const t=Math.random()*Math.PI*2, p=Math.acos(2*Math.random()-1), r=80+Math.random()*120;
      sp[i*3]=r*Math.sin(p)*Math.cos(t); sp[i*3+1]=r*Math.sin(p)*Math.sin(t); sp[i*3+2]=r*Math.cos(p);
      const tint=Math.random();
      if(tint<0.15){sc[i*3]=0.7;sc[i*3+1]=0.85;sc[i*3+2]=1.0;}
      else if(tint<0.25){sc[i*3]=1.0;sc[i*3+1]=0.95;sc[i*3+2]=0.7;}
      else{sc[i*3]=1.0;sc[i*3+1]=1.0;sc[i*3+2]=1.0;}
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(sp,3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(sc,3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({size:0.18,sizeAttenuation:true,vertexColors:true,transparent:true,opacity:0.9,blending:THREE.AdditiveBlending,depthWrite:false}));
    scene.add(stars);
    // Earth
    const earth = new THREE.Mesh(new THREE.SphereGeometry(1.3,128,128), new THREE.ShaderMaterial({vertexShader:earthVertexShader,fragmentShader:earthFragmentShader}));
    earth.position.set(2.2,0,0); scene.add(earth);
    earth.add(new THREE.Mesh(new THREE.SphereGeometry(1.42,64,64), new THREE.ShaderMaterial({vertexShader:atmVertexShader,fragmentShader:atmFragmentShader,blending:THREE.AdditiveBlending,side:THREE.FrontSide,transparent:true,depthWrite:false})));
    const cloudMat = new THREE.ShaderMaterial({vertexShader:cloudVertexShader,fragmentShader:cloudFragmentShader,transparent:true,depthWrite:false,uniforms:{uTime:{value:0}}});
    const cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(1.35,64,64), cloudMat);
    earth.add(cloudMesh);
    const orbitRing = new THREE.Mesh(new THREE.TorusGeometry(1.9,0.008,6,200), new THREE.MeshBasicMaterial({color:0x00d4ff,transparent:true,opacity:0.25}));
    orbitRing.rotation.x = Math.PI/2.5; earth.add(orbitRing);
    const satellite = new THREE.Mesh(new THREE.SphereGeometry(0.025,8,8), new THREE.MeshBasicMaterial({color:0xffffff}));
    scene.add(satellite);
    // Scroll
    const scrollState = {progress:0};
    const st = ScrollTrigger.create({trigger:sectionRef.current,start:'top top',end:'bottom top',scrub:1.5,onUpdate:(s)=>{scrollState.progress=s.progress;}});
    // Raycaster
    const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
    const onClick = (e) => {
      pointer.x=(e.clientX/window.innerWidth)*2-1; pointer.y=-(e.clientY/window.innerHeight)*2+1;
      raycaster.setFromCamera(pointer,camera);
      if(raycaster.intersectObject(earth).length>0){
        gsap.to(earth.scale,{x:1.12,y:1.12,z:1.12,duration:0.2,ease:'power2.out',onComplete:()=>gsap.to(earth.scale,{x:1,y:1,z:1,duration:0.8,ease:'elastic.out(1,0.4)'})});
      }
    };
    window.addEventListener('click',onClick);
    let tCX=0,tCY=0;
    const onMove=(e)=>{tCX=(e.clientX/window.innerWidth-0.5)*0.5;tCY=-(e.clientY/window.innerHeight-0.5)*0.3;};
    window.addEventListener('mousemove',onMove);
    const clock = new THREE.Clock(); let animId;
    const animate=()=>{
      animId=requestAnimationFrame(animate);
      const t=clock.getElapsedTime(), p=scrollState.progress;
      earth.rotation.y=t*0.08; cloudMesh.rotation.y=t*0.04; cloudMat.uniforms.uTime.value=t*60;
      const sa=t*0.6; satellite.position.set(earth.position.x+Math.cos(sa)*1.9,Math.sin(sa*0.8)*0.5,earth.position.z+Math.sin(sa)*1.9);
      stars.rotation.y=t*0.005; stars.rotation.x=t*0.002;
      camera.position.z=5-p*4;
      camera.position.x+=(tCX-camera.position.x)*0.04; camera.position.y+=(tCY-camera.position.y)*0.04;
      camera.lookAt(1.5,0,0); renderer.render(scene,camera);
    };
    animate();
    const onResize=()=>{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);};
    window.addEventListener('resize',onResize);
    return ()=>{
      cancelAnimationFrame(animId); st.kill();
      window.removeEventListener('click',onClick); window.removeEventListener('mousemove',onMove); window.removeEventListener('resize',onResize);
      scene.traverse((obj)=>{if(obj.geometry)obj.geometry.dispose();if(obj.material){Array.isArray(obj.material)?obj.material.forEach(m=>m.dispose()):obj.material.dispose();}});
      renderer.dispose();
    };
  }, []);

  // ── GSAP typing — الأدوار الحقيقية من CV ─────────────────────────────
  useEffect(() => {
    if (!typingRef.current) return;
    const roles = [
      'Full-Stack Developer',
      'System Analysis Student',
      'AI Workflow Engineer',
      'Digital Artist',
    ];
    const master = gsap.timeline({ repeat: -1 });
    roles.forEach((role) => {
      const tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 1.5 });
      tl.to(typingRef.current, { text: role, duration: 1.2, ease: 'power1.inOut' });
      master.add(tl);
    });
    return () => master.kill();
  }, []);

  const container = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.4 } },
  };
  const item = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section ref={sectionRef} id="home"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 space-y-8">

          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Available For Freelance · Basra, Iraq
            </span>
          </div>

          <motion.div variants={container} initial="initial" animate="animate" className="space-y-2">
            <motion.p variants={item} className="text-primary font-mono text-lg font-medium">
              Hello, I am
            </motion.p>
            <motion.h1 variants={item} className="text-4xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight leading-none">
              Abdulrahman <br />
              <span className="text-gradient">Ali Hussein</span>
            </motion.h1>
          </motion.div>

          {/* Typing roles */}
          <div className="h-8 flex items-center">
            <span className="font-mono text-xl md:text-2xl text-gray-300 font-light" ref={typingRef} />
            <span className="w-1.5 h-6 bg-primary ml-1 animate-pulse" />
          </div>

          {/* Bio — من CV الحقيقي */}
          <p className="text-gray-400 text-base md:text-lg max-w-xl leading-relaxed">
            Computer Science student at <span className="text-white font-medium">University of Basrah</span> building
            full-stack web applications, designing databases, and using AI-assisted workflows to deliver complete projects from Basra, Iraq.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <MagneticButton>
              <a href="#projects" className="block px-6 py-3 bg-gradient-to-r from-primary to-secondary text-dark font-semibold text-sm rounded-xl hover:opacity-90 transition shadow-lg shadow-primary/20">
                View Projects
              </a>
            </MagneticButton>
            <MagneticButton>
              <a href="/cv.pdf" download className="block px-6 py-3 glass hover:border-primary/40 text-white font-medium text-sm rounded-xl transition">
                Download CV
              </a>
            </MagneticButton>
            <MagneticButton>
              <a href="#contact" className="block px-6 py-3 text-sm text-gray-300 hover:text-white font-medium hover:underline">
                Contact Me
              </a>
            </MagneticButton>
          </div>
        </div>

        {/* Right — floating info badges */}
        <div className="lg:col-span-5 relative flex justify-center items-center h-80 lg:h-auto">
          <div className="relative w-full h-full flex items-center justify-center">

            {/* Badge 1 — University */}
            <motion.div style={{ x: badge1X, y: badge1Y }}
              className="absolute top-4 left-0 glass p-3 rounded-xl flex items-center gap-3 border border-white/10 shadow-xl">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500">University</p>
                <p className="text-xs font-semibold">Univ. of Basrah</p>
              </div>
            </motion.div>

            {/* Badge 2 — Location */}
            <motion.div style={{ x: badge2X, y: badge2Y }}
              className="absolute bottom-4 right-0 glass p-3 rounded-xl flex items-center gap-3 border border-white/10 shadow-xl">
              <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500">Location</p>
                <p className="text-xs font-semibold">Basra, Iraq</p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 z-10">
        <span className="text-[10px] uppercase tracking-widest font-mono">Scroll</span>
        <ArrowDown className="w-4 h-4 animate-bounce text-primary" />
      </div>
    </section>
  );
}