<template>
    <div class="relative w-full h-full">
        <div ref="container" class="three-container w-full h-full"></div>
    </div>
</template>

<script lang="ts" setup>
import ModalController from '@/controllers/modal-controller';
import { Pin } from '@/game-data/pin/pin';
import { useEnvStore } from '@/store/env-store';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { onBeforeUnmount, onMounted, PropType, ref, watch } from 'vue';
import BusyModal from './modals/templates/busy-modal.vue';
import { getHeightAtPoint, getViewportPoint } from './zone/terrain-util';

const props = defineProps({
    pins: {
        type: Array<Pin>,
        required: true
    },
    waterLevel: {
        type: Number,
        default: 0.008
    },
    focusedPin: {
        type: Object as PropType<Pin | null>,
        default: null
    }
});

const env = useEnvStore();
const isLoaded = ref(false);

const container = ref<HTMLDivElement>();
let animationId: number;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let terrain: THREE.Group;
let water: Water;

let pinPoints: { id: string; point: THREE.Vector3 }[] = [];

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

    if (env.STEALTH) {
        terrain.visible = false;
    } else {
        addWaterPlane();
        addSkybox();
        addLights();
    }

    addCameraControls();

    // Determine pinPoints (calculate height for each)
    calculatePinPoints();

    window.addEventListener('resize', onResize);

    // Start the animation loop
    animate();

    isLoaded.value = true;
    requestAnimationFrame(() => {
        ModalController.close();
    });
});

watch(
    () => props.pins.map((pin) => pin.id), // Only track pin ids
    (newIds, oldIds) => {
        // Check if the number of pins changed or an ID changed
        if (newIds.length !== oldIds.length || !newIds.every((id, i) => id === oldIds[i])) {
            calculatePinPoints();
        }
    },
    { deep: false }
);

function addCameraControls() {
    const el = container.value!;
    const width = el.clientWidth;
    const height = el.clientHeight;

    camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
    camera.position.set(0, 4, 0);
    camera.lookAt(0, 0, 0);
}

function calculatePinPoints() {
    pinPoints = [];
    props.pins.forEach((p) => {
        const point = p.address.point;
        const height = getHeightAtPoint(terrain, point);
        const pointWithHeight: THREE.Vector3 = new THREE.Vector3(point.x, height + 0.02, point.y);
        pinPoints.push({ id: p.id, point: pointWithHeight });
    });
}

async function loadAndAddTerrain(): Promise<THREE.Group> {
    console.log('@3d-atlas-viewer.loadAndAddTerrain');
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        loader.setDRACOLoader(dracoLoader);

        loader.load(
            'assets/terrain/atlas/atlas.glb',
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

// function addCameraControls() {
//     const el = container.value!;
//     const width = el.clientWidth;
//     const height = el.clientHeight;
//     camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);

//     const cameraSpline = new THREE.CatmullRomCurve3(
//         props.cameraSplines.map((p) => p.cameraPosition),
//         false,
//         'catmullrom',
//         0.5
//     );

//     const lookAtSpline = new THREE.CatmullRomCurve3(
//         props.cameraSplines.map((p) => p.targetPosition),
//         false,
//         'catmullrom',
//         0.5
//     );

//     // Modifiers
//     const friction = 0.95;
//     const scrollSpeed = 0.00002;
//     const tiltIntensity = 0.02;
//     const tiltSpeed = 0.02;

//     // Vars
//     const mouse = { x: 0, y: 0 };
//     const targetTilt = { x: 0, y: 0 };
//     const currentTilt = { x: 0, y: 0 };

//     // Spline Mode vars
//     let distanceAlongSpline = 0;
//     let velocity = 0;

//     // Focus Mode vars
//     let targetPinId: string | null = null;
//     let targetCameraPosition: THREE.Vector3 | null = null;
//     let targetLookAtPosition: THREE.Vector3 | null = null;
//     let lookAtPosition: THREE.Vector3 | null = null;

//     function update() {
//         if (props.focusedPin && props.focusedPin.id !== targetPinId) {
//             // A pin has been focused, process this action
//             targetPinId = props.focusedPin.id;
//             const pin = props.focusedPin;
//             const focusedPinPoint = pinPoints.find((p) => pin.id === p.id)?.point;
//             if (!focusedPinPoint) throw new Error('Focused Point not found');

//             // Get the closest point on the spline to the pinPoint
//             const tValue = getClosestTValueOnSpline(cameraSpline, focusedPinPoint);
//             const closestCameraPositionOnSpline = cameraSpline.getPoint(tValue);
//             const partwayPoint = closestCameraPositionOnSpline.clone().lerp(focusedPinPoint, 0.5); // "Zoom in" from the spline

//             // If the partwayPoint is higher, the camera needs to be higher too to avoid looking out over terrain that isn't actually in the scene. So we raise the camera by the same amount that the partwayPoint is raised from the spline.
//             const splineHeightAtPoint = closestCameraPositionOnSpline.y;
//             const partwayPointHeight = partwayPoint.y;
//             const heightDifference = splineHeightAtPoint - partwayPointHeight;
//             partwayPoint.y += heightDifference / 3;

//             targetCameraPosition = partwayPoint;
//             targetLookAtPosition = focusedPinPoint;
//         }

//         if (!props.focusedPin && targetPinId) {
//             // A pin has been unfocused, process this action
//             // Return to the spline from wherever the camera is
//             const tValue = getClosestTValueOnSpline(cameraSpline, camera.position);
//             targetCameraPosition = cameraSpline.getPoint(tValue);
//             targetLookAtPosition = lookAtSpline.getPoint(tValue);
//             distanceAlongSpline = tValue;
//             targetPinId = null;
//         }

//         // Focus Mode
//         if (targetCameraPosition) {
//             velocity = 0;

//             camera.position.lerp(targetCameraPosition, 0.1);

//             if (camera.position.distanceTo(targetCameraPosition) < 0.0001) {
//                 // Destination reached!
//                 camera.position.copy(targetCameraPosition);
//                 if (!targetPinId) targetCameraPosition = null;
//             }
//         }

//         // Scroll Mode
//         if (!targetCameraPosition) {
//             distanceAlongSpline += velocity;
//             if (distanceAlongSpline <= 0 || distanceAlongSpline >= 1) {
//                 distanceAlongSpline = Math.max(0, Math.min(1, distanceAlongSpline));
//                 velocity = 0;
//             }

//             if (Math.abs(velocity) < 0.00002) velocity = 0;

//             velocity *= friction;

//             updateCameraFromT(distanceAlongSpline);
//         }

//         if (targetLookAtPosition) lookAtPosition?.lerp(targetLookAtPosition, 0.1);
//         camera.lookAt(lookAtPosition!);

//         // Calculate Tilt
//         currentTilt.x += (targetTilt.x - currentTilt.x) * tiltSpeed;
//         currentTilt.y += (targetTilt.y - currentTilt.y) * tiltSpeed;

//         const tiltQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(currentTilt.x, currentTilt.y, 0));
//         camera.quaternion.multiply(tiltQuaternion);

//         requestAnimationFrame(update);
//     }

//     function onMouseMove(event: MouseEvent) {
//         if (usePauseStore().isPaused) return;
//         mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//         mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//         targetTilt.x = mouse.y * tiltIntensity;
//         targetTilt.y = -mouse.x * tiltIntensity;
//     }

//     function updateCameraFromT(tVal: number) {
//         tVal = Math.max(0, Math.min(1, tVal));
//         const currentPosition = cameraSpline.getPoint(tVal);
//         camera.position.copy(currentPosition);
//         lookAtPosition = lookAtSpline.getPoint(tVal);
//     }

//     // Set initial camera position
//     updateCameraFromT(distanceAlongSpline);

//     // Scroll handler: move forwards/backwards along the spline
//     function onWheel(event: WheelEvent) {
//         event.preventDefault();

//         if (targetCameraPosition) return;

//         velocity += event.deltaY * scrollSpeed;
//     }

//     window.addEventListener('mousemove', onMouseMove);
//     window.addEventListener('wheel', onWheel, { passive: false });

//     update();
// }

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
        waterColor: 0x017b92,
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

function animate() {
    // Animate water
    if (water) water.material.uniforms['time'].value += 0.1 / 60;

    animationId = requestAnimationFrame(animate);
    renderer.render(scene, camera);

    props.pins.forEach((pin) => {
        const pinPoint = pinPoints.find((p) => p.id === pin.id);
        if (pinPoint) pin.labelPoint = getViewportPoint(pinPoint.point, camera, renderer);
    });
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

onBeforeUnmount(() => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', onResize);
    water?.geometry.dispose();
    (water?.material as THREE.Material)?.dispose();

    renderer?.dispose();
});
</script>
