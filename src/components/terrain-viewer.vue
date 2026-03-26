<template>
    <div class="relative w-full h-full">
        <div ref="container" class="three-container w-full h-full"></div>
    </div>
</template>

<script lang="ts" setup>
import ModalController from '@/controllers/modal-controller';
import { Pin } from '@/game-data/pin/pin';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import BusyModal from './modals/templates/busy-modal.vue';
import { getHeightAtPoint, getViewportPoint } from './zone/terrain-util';

const props = defineProps({
    zoneId: {
        type: String,
        required: true
    },
    pins: {
        type: Array<Pin>,
        required: true
    },
    isMapEnabled: {
        type: Boolean,
        required: true
    },
    waterLevel: {
        type: Number,
        default: 0.008
    }
});

const hideTerrain = false;
const isLoaded = ref(false);

const container = ref<HTMLDivElement>();
let animationId: number;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let terrain: THREE.Group;
let pins: THREE.Sprite[];
let controls: OrbitControls;
let water: Water;

const pinPoints: THREE.Vector3[] = [];

watch(
    () => props.isMapEnabled,
    (newValue, oldValue) => {
        pins.forEach((p) => (p.visible = newValue));
    }
);

onMounted(async () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    ModalController.open(BusyModal, { message: 'Loading' });

    // Renderer
    const el = container.value!;
    renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    await loadAndAddTerrain();
    if (hideTerrain) terrain.visible = false;

    addCamera();
    addLights();
    if (!hideTerrain) addWaterPlane();
    if (!hideTerrain) addSkybox();
    addControls();
    addPins();

    window.addEventListener('resize', onResize);

    if ((window as any).debug) addMouseTarget();

    animate();

    isLoaded.value = true;
    requestAnimationFrame(() => {
        ModalController.close();
    });
});

async function loadAndAddTerrain(): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();

        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        loader.setDRACOLoader(dracoLoader);

        loader.load(
            'assets/terrain/' + props.zoneId + '/' + props.zoneId + '.glb',
            (gltf) => {
                terrain = gltf.scene;
                scene.add(terrain);

                const box = new THREE.Box3().setFromObject(terrain);
                const center = box.getCenter(new THREE.Vector3());
                terrain.position.sub(center);
                resolve(terrain);
            },
            undefined,
            (error) => {
                console.error('An error happened', error);
                reject(error);
            }
        );
    });
}

function addCamera() {
    const el = container.value!;
    const width = el.clientWidth;
    const height = el.clientHeight;
    camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
    camera.position.set(0.5, 0.5, 0.5);
    camera.lookAt(0, 0, 0);
}

function addLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);
}

function addWaterPlane() {
    const terrainBounds = new THREE.Box3().setFromObject(terrain);
    const size = terrainBounds.getSize(new THREE.Vector3());
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
    water.position.y = terrainBounds.min.y + props.waterLevel;

    water.material.uniforms['size'].value = 100;
    water.material.depthWrite = true;

    scene.add(water);
}

function addSkybox() {
    const exrLoader = new EXRLoader();
    exrLoader.setDataType(THREE.FloatType);

    exrLoader.load('/assets/images/skybox/sky.exr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;
    });
}

function addControls() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 0.1;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;
}

function addPins() {
    pins = [];
    props.pins.forEach((p) => {
        const point = p.address.point;
        const map = new THREE.TextureLoader().load('assets/images/pin.png');
        const material = new THREE.SpriteMaterial({ map });
        const pin = new THREE.Sprite(material);
        const height = getHeightAtPoint(terrain, point);
        pin.position.set(point.x, height + 0.02, point.y);
        pin.scale.set(0.05, 0.05, 0.05);
        pinPoints.push(pin.position);
        pins.push(pin);
        scene.add(pin);
    });
}

function animate() {
    controls?.update();

    // Animate water
    if (water) water.material.uniforms['time'].value += 0.1 / 60;

    // Update the pin's labelPoints
    props.pins.forEach((pin, index) => {
        const p = pinPoints[index];
        pin.labelPoint = getViewportPoint(p, camera, renderer);
    });

    animationId = requestAnimationFrame(animate);
    renderer.render(scene, camera);
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

function addMouseTarget() {
    const geometry = new THREE.CircleGeometry(0.01, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
    const cursor = new THREE.Mesh(geometry, material);
    cursor.visible = false;
    scene.add(cursor);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('mousemove', onMouseMove);
    function onMouseMove(event: MouseEvent) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    setInterval(() => {
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObject(terrain);
        if (intersects.length == 0) return (cursor.visible = false);

        const point = intersects[0].point;
        cursor.position.copy(point);
        cursor.position.y += 0.05;
        cursor.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), intersects[0].face!.normal);
        const extraRotation = new THREE.Quaternion();
        extraRotation.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
        cursor.quaternion.multiply(extraRotation);
        cursor.visible = true;
    }, 250);

    window.addEventListener('click', onMouseClick);
    function onMouseClick(event: MouseEvent) {
        console.log(cursor.position.x, cursor.position.z); // Just the x and z, since pins are stored in 2D
    }
}

onBeforeUnmount(() => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', onResize);
    controls?.dispose();
    water?.geometry.dispose();
    (water?.material as THREE.Material)?.dispose();

    renderer?.dispose();
});
</script>
