<template>
    <div ref="container" class="w-full h-full"></div>
</template>

<script lang="ts" setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Water } from 'three/examples/jsm/objects/Water.js';

const props = defineProps({
    src: {
        type: String,
        required: true
    },
    waterLevel: {
        type: Number,
        default: 0.01 // offset from terrain bottom, in world units
    }
});

const container = ref<HTMLDivElement>();

let animationId: number;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let model: THREE.Group;
let controls: OrbitControls;
let water: Water;
let foam: THREE.Mesh;

function init() {
    const el = container.value!;
    const width = el.clientWidth;
    const height = el.clientHeight;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
    camera.position.set(0.5, 0.5, 0.5);
    camera.lookAt(0, 0, 0);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    el.appendChild(renderer.domElement);

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(props.src, (gltf) => {
        model = gltf.scene;
        scene.add(model);

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // Re-compute box after centering
        const centeredBox = new THREE.Box3().setFromObject(model);
        createWaterPlane(centeredBox);
        createFoamPlane(centeredBox);
        createSkybox();
        createControls();
    });

    window.addEventListener('resize', onResize);

    function animate() {
        controls?.update();

        if (water) water.material.uniforms['time'].value += 0.1 / 60;

        animationId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}

function createWaterPlane(terrainBox: THREE.Box3) {
    const size = terrainBox.getSize(new THREE.Vector3());
    const geometry = new THREE.PlaneGeometry(size.x, size.z);

    water = new Water(geometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load('/assets/images/water/water-normals.avif', (t) => {
            t.wrapS = t.wrapT = THREE.RepeatWrapping;
        }),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x095859,
        distortionScale: 0.5,
        fog: scene.fog !== undefined
    });

    water.rotation.x = -Math.PI / 2;
    water.position.y = terrainBox.min.y + props.waterLevel;

    water.material.uniforms['size'].value = 100;

    scene.add(water);
}

function createFoamPlane(terrainBox: THREE.Box3) {
    const size = terrainBox.getSize(new THREE.Vector3());

    const geometry = new THREE.PlaneGeometry(size.x, size.z, 1, 1);

    const heightMap = new THREE.TextureLoader().load('/assets/terrain/svalbard-1-height.png');
    heightMap.wrapS = heightMap.wrapT = THREE.ClampToEdgeWrapping;

    const terrainHeight = terrainBox.max.y - terrainBox.min.y;
    const waterYNormalized = props.waterLevel / terrainHeight;

    const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
            tHeight: { value: heightMap },
            waterYNormalized: { value: waterYNormalized },
            foamColor: { value: new THREE.Color(0xffffff) },
            foamThreshold: { value: 0.05 },
            foamFalloff: { value: 0.03 },
            waterColor: { value: new THREE.Color(0x095859) },
            waterOpacity: { value: 0.85 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D tHeight;
            uniform float waterYNormalized;
            uniform vec3 foamColor;
            uniform float foamThreshold;
            uniform float foamFalloff;
            uniform vec3 waterColor;
            uniform float waterOpacity;

            varying vec2 vUv;

            void main() {
                float g = texture2D(tHeight, vUv).g;
                float diff = abs(g - waterYNormalized);

                float foam = 1.0 - smoothstep(0.0, foamThreshold, diff);
                foam *= smoothstep(0.0, foamFalloff, foam);

                vec3 color = mix(waterColor, foamColor, foam);
                float alpha = mix(waterOpacity, 1.0, foam);

                gl_FragColor = vec4(color, alpha);
            }
        `
    });

    foam = new THREE.Mesh(geometry, material);
    foam.rotation.x = -Math.PI / 2;
    foam.position.y = terrainBox.min.y + props.waterLevel + 0.1;
    scene.add(foam);
}

function createSkybox() {
    const exrLoader = new EXRLoader();
    exrLoader.setDataType(THREE.FloatType);

    exrLoader.load('/assets/images/skybox/sky.exr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;
    });
}

function createControls() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 0.1;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;
}

function onResize() {
    const el = container.value;
    if (!el) return;
    const width = el.clientWidth;
    const height = el.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

onMounted(init);

onBeforeUnmount(() => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', onResize);
    controls?.dispose();
    water?.geometry.dispose();
    (water?.material as THREE.Material)?.dispose();
    foam?.geometry.dispose();
    (foam?.material as THREE.Material)?.dispose();

    renderer?.dispose();
});
</script>
