import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function HeroSection() {
  const canvasRef = useRef(null);
  const threeRefs = useRef({});
  const smoothPos = useRef({ x: 0, y: 30, z: 100 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const refs = threeRefs.current;

    // Scene
    refs.scene = new THREE.Scene();
    refs.scene.fog = new THREE.FogExp2(0x000000, 0.0003);

    // Camera
    refs.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 2000);
    refs.camera.position.set(0, 20, 90);

    // Renderer
    refs.renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    refs.renderer.setSize(window.innerWidth, window.innerHeight);
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    refs.renderer.toneMappingExposure = 0.6;

    // Stars
    const createStars = (count, spread, baseColor) => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const r = 150 + Math.random() * spread;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i*3+2] = r * Math.cos(phi);
        const c = new THREE.Color();
        const rnd = Math.random();
        if (rnd < 0.7) c.setHSL(0, 0, 0.7 + Math.random() * 0.3);
        else if (rnd < 0.85) c.setHSL(0.6, 0.8, 0.8);
        else c.setHSL(0.55, 1.0, 0.9);
        col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
        sizes[i] = Math.random() * 2.5 + 0.3;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      const mat = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
          attribute float size; attribute vec3 color; varying vec3 vColor; uniform float time;
          void main() {
            vColor = color;
            vec3 p = position;
            float a = time * 0.02;
            mat2 r = mat2(cos(a), -sin(a), sin(a), cos(a));
            p.xz = r * p.xz;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = size * (250.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float a = 1.0 - smoothstep(0.0, 0.5, d);
            gl_FragColor = vec4(vColor, a);
          }`,
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
      });
      return new THREE.Points(geo, mat);
    };

    refs.stars = [
      createStars(4000, 600, 0xffffff),
      createStars(2000, 400, 0x0066ff),
      createStars(1000, 300, 0x00d4ff),
    ];
    refs.stars.forEach(s => refs.scene.add(s));

    // Nebula plane
    const nebulaGeo = new THREE.PlaneGeometry(3000, 1500, 80, 80);
    const nebulaMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        c1: { value: new THREE.Color(0x001aff) },
        c2: { value: new THREE.Color(0x7b00ff) },
        c3: { value: new THREE.Color(0xff003c) },
      },
      vertexShader: `varying vec2 vUv; uniform float time;
        void main() { vUv = uv; vec3 p = position; p.z += sin(p.x*0.01+time)*cos(p.y*0.01+time)*30.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0); }`,
      fragmentShader: `uniform vec3 c1,c2,c3; uniform float time; varying vec2 vUv;
        void main() {
          float m1 = sin(vUv.x*8.0+time*0.3)*cos(vUv.y*8.0+time*0.2);
          float m2 = sin(vUv.x*4.0-time*0.15)*0.5+0.5;
          vec3 c = mix(mix(c1,c2,m1*0.5+0.5), c3, m2*0.3);
          float a = 0.25*(1.0-length(vUv-0.5)*2.2);
          gl_FragColor = vec4(c, max(a,0.0));
        }`,
      transparent: true, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false
    });
    refs.nebula = new THREE.Mesh(nebulaGeo, nebulaMat);
    refs.nebula.position.z = -800;
    refs.scene.add(refs.nebula);

    // Dark mountains (silhouette layers)
    const mountainColors = [0x08081a, 0x0a0a1f, 0x0c0c22, 0x0f0f28];
    refs.mountains = mountainColors.map((col, idx) => {
      const pts = [];
      const segs = 80;
      const seed = idx * 137;
      for (let i = 0; i <= segs; i++) {
        const x = (i / segs - 0.5) * 1200;
        const h = 50 + idx * 25;
        let y = 0;
        for (let k = 1; k <= 5; k++) {
          y += Math.sin(i * 0.07 * k + seed) * (h / k);
        }
        y -= 120 + idx * 30;
        pts.push(new THREE.Vector2(x, y));
      }
      pts.push(new THREE.Vector2(6000, -400), new THREE.Vector2(-6000, -400));
      const shape = new THREE.Shape(pts);
      const geo = new THREE.ShapeGeometry(shape);
      const mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.95 - idx * 0.1, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, -20 + idx * 5, -30 - idx * 40);
      mesh.userData.baseZ = mesh.position.z;
      refs.scene.add(mesh);
      return mesh;
    });

    // Ambient glow sphere
    const glowGeo = new THREE.SphereGeometry(400, 32, 32);
    const glowMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `varying vec3 vN; void main() { vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `varying vec3 vN; uniform float time;
        void main() {
          float i = pow(0.65-dot(vN,vec3(0,0,1)),2.5);
          vec3 c = mix(vec3(0.0,0.4,1.0), vec3(0.48,0.0,1.0), sin(time*0.5)*0.5+0.5);
          gl_FragColor = vec4(c*i, i*0.2);
        }`,
      side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true
    });
    refs.glow = new THREE.Mesh(glowGeo, glowMat);
    refs.scene.add(refs.glow);

    // Grid floor
    const gridHelper = new THREE.GridHelper(2000, 40, 0x001aff, 0x001aff);
    gridHelper.material.opacity = 0.12;
    gridHelper.material.transparent = true;
    gridHelper.position.y = -80;
    refs.scene.add(gridHelper);
    refs.grid = gridHelper;

    // Particle field (floating blue dots)
    const partGeo = new THREE.BufferGeometry();
    const partCount = 300;
    const partPos = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount; i++) {
      partPos[i*3] = (Math.random() - 0.5) * 300;
      partPos[i*3+1] = (Math.random() - 0.5) * 200;
      partPos[i*3+2] = (Math.random() - 0.5) * 100 + 20;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({ color: 0x0066ff, size: 0.5, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
    refs.particles = new THREE.Points(partGeo, partMat);
    refs.scene.add(refs.particles);

    // Animate
    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = Date.now() * 0.001;

      refs.stars.forEach(s => { if (s.material.uniforms) s.material.uniforms.time.value = t; });
      if (refs.nebula?.material?.uniforms) refs.nebula.material.uniforms.time.value = t * 0.4;
      if (refs.glow?.material?.uniforms) refs.glow.material.uniforms.time.value = t;

      // Mouse parallax camera
      const targetX = mouseRef.current.x * 8;
      const targetY = mouseRef.current.y * 4 + 20;
      const targetZ = 90;
      smoothPos.current.x += (targetX - smoothPos.current.x) * 0.04;
      smoothPos.current.y += (targetY - smoothPos.current.y) * 0.04;
      refs.camera.position.set(
        smoothPos.current.x + Math.sin(t * 0.08) * 1.5,
        smoothPos.current.y + Math.cos(t * 0.1) * 0.8,
        targetZ
      );
      refs.camera.lookAt(0, 5, -200);

      // Mountains subtle sway
      refs.mountains?.forEach((m, i) => {
        m.position.x = Math.sin(t * 0.06 + i * 0.5) * (1.5 * (i + 1));
      });

      // Particles drift
      if (refs.particles) {
        refs.particles.rotation.y = t * 0.015;
        refs.particles.position.y = Math.sin(t * 0.2) * 3;
      }

      refs.grid.position.z = (t * 5) % 50 - 80;

      refs.renderer.render(refs.scene, refs.camera);
    };
    animate();
    setLoaded(true);

    const onResize = () => {
      refs.camera.aspect = window.innerWidth / window.innerHeight;
      refs.camera.updateProjectionMatrix();
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    const onMouse = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouse);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouse);
      refs.renderer?.dispose();
    };
  }, []);

  // Animate text in after load
  useEffect(() => {
    if (!loaded) return;
    const els = document.querySelectorAll('.hero-anim');
    els.forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 200 + i * 120);
    });
  }, [loaded]);

  return (
    <div className="hero-container" id="home">
      <canvas ref={canvasRef} className="hero-canvas" />

      <div className="hero-sticky">
        <div className="hero-overlay" />

        {/* NAV */}
        <div className="hero-logo hero-anim" style={{ opacity: 0, transform: 'translateY(-20px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
          X4<span>TECH</span>
        </div>

        <nav className="hero-nav hero-anim" style={{ opacity: 0, transform: 'translateY(-20px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s' }}>
          <a href="#services">Services</a>
          <a href="#works">Works</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
          <button className="cta-btn" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
            Start Project
          </button>
        </nav>

        {/* HERO CONTENT */}
        <div className="hero-title-wrap">
          <p className="hero-eyebrow hero-anim" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
            ✦ Freelance Tech Agency
          </p>

          <div className="hero-main-title">
            <span className="line hero-anim" style={{ display: 'block', opacity: 0, transform: 'translateY(40px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.2s' }}>
              BUILD.
            </span>
            <span className="line hero-anim accent-word" style={{ display: 'block', opacity: 0, transform: 'translateY(40px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.35s', WebkitTextStroke: '2px #00D4FF', color: 'transparent' }}>
              DESIGN.
            </span>
            <span className="line hero-anim" style={{ display: 'block', opacity: 0, transform: 'translateY(40px)', transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.5s' }}>
              LAUNCH.
            </span>
          </div>

          <p className="hero-desc hero-anim" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.65s' }}>
            Apps, websites, brand identities — we turn your vision into a digital reality that converts and captivates.
          </p>

          <div className="hero-cta-row hero-anim" style={{ opacity: 0, transform: 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.8s' }}>
            <button className="btn-primary" onClick={() => document.getElementById('works').scrollIntoView({ behavior: 'smooth' })}>
              <span>View Our Work</span>
            </button>
            <button className="btn-outline" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
              Get a Quote
            </button>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="scroll-hint hero-anim" style={{ opacity: 0, transition: 'opacity 1s ease 1.2s' }}>
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>

        {/* Corner decorations */}
        <div style={{ position: 'absolute', top: '50%', right: '2.5rem', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{ width: '1px', height: i === 2 ? '40px' : '20px', background: i === 2 ? 'var(--x4-cyan)' : 'var(--x4-border)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
