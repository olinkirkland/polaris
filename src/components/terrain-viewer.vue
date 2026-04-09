<template>
    <div class="relative w-full h-full">
        <div ref="container" class="three-container w-full h-full"></div>
    </div>
</template>

<script lang="ts" setup>
import ModalController from '@/controllers/modal-controller';
import { Pin } from '@/game-data/pin/pin';
import { useEnvStore } from '@/store/env-store';
import { usePauseStore } from '@/store/pause-store';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { onBeforeUnmount, onMounted, PropType, ref } from 'vue';
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
    waterLevel: {
        type: Number,
        default: 0.008
    },
    cameraSplines: {
        type: Array<{ cameraPosition: THREE.Vector3; targetPosition: THREE.Vector3 }>,
        required: true
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
let pins: THREE.Sprite[];
let controls: OrbitControls;
let water: Water;

const pinPoints: { id: string; point: THREE.Vector3 }[] = [];

// Debug camera
const moveSpeed = 0.01;
const keysHeld = new Set<string>();

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
    }

    if (env.NOCLIP) {
        addDebugCameraControls();
        addMouseTarget();
        addLights();
    } else {
        addCameraControls();
    }

    // Determine pinPoints (calculate height for each)
    props.pins.forEach((p) => {
        const point = p.address.point;
        const height = getHeightAtPoint(terrain, point);
        const pointWithHeight: THREE.Vector3 = new THREE.Vector3(point.x, height + 0.02, point.y);
        pinPoints.push({ id: p.id, point: pointWithHeight });
    });

    window.addEventListener('resize', onResize);

    // Start the animation loop
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

function addDebugCameraControls() {
    // Setup camera
    const el = container.value!;
    const width = el.clientWidth;
    const height = el.clientHeight;
    camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);

    // Initial position and rotation
    camera.position.set(0.5, 0.5, 0.5);
    camera.lookAt(0, 0, 0);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.minDistance = 0.1;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;

    window.addEventListener('keydown', (e: KeyboardEvent) => keysHeld.add(e.key));
    window.addEventListener('keyup', (e: KeyboardEvent) => keysHeld.delete(e.key));
}

function addCameraControls() {
    const el = container.value!;
    const width = el.clientWidth;
    const height = el.clientHeight;
    camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);

    const cameraSpline = new THREE.CatmullRomCurve3(
        props.cameraSplines.map((p) => p.cameraPosition),
        false,
        'catmullrom',
        0.5
    );

    const lookAtSpline = new THREE.CatmullRomCurve3(
        props.cameraSplines.map((p) => p.targetPosition),
        false,
        'catmullrom',
        0.5
    );

    // Modifiers
    const friction = 0.95;
    const scrollSpeed = 0.00002;
    const tiltIntensity = 0.02;
    const tiltSpeed = 0.02;

    // Vars
    const mouse = { x: 0, y: 0 };
    const targetTilt = { x: 0, y: 0 };
    const currentTilt = { x: 0, y: 0 };

    // Spline Mode vars
    let distanceAlongSpline = 0;
    let velocity = 0;

    // Focus Mode vars
    let targetPinId: string | null = null;
    let targetCameraPosition: THREE.Vector3 | null = null;
    let targetLookAtPosition: THREE.Vector3 | null = null;
    let lookAtPosition: THREE.Vector3 | null = null;

    function update() {
        if (props.focusedPin && props.focusedPin.id !== targetPinId) {
            // A pin has been focused, process this action
            targetPinId = props.focusedPin.id;
            const pin = props.focusedPin;
            const focusedPinPoint = pinPoints.find((p) => pin.id === p.id)?.point;
            if (!focusedPinPoint) throw new Error('Focused Point not found');

            // Get the closest point on the spline to the pinPoint
            const tValue = getClosestTValueOnSpline(cameraSpline, focusedPinPoint);
            const closestCameraPositionOnSpline = cameraSpline.getPoint(tValue);
            const partwayPoint = closestCameraPositionOnSpline.clone().lerp(focusedPinPoint, 0.2); // "Zoom in" from the spline
            targetCameraPosition = partwayPoint;
            targetLookAtPosition = focusedPinPoint;
        }

        if (!props.focusedPin && targetPinId) {
            // A pin has been unfocused, process this action
            // Return to the spline from wherever the camera is
            const tValue = getClosestTValueOnSpline(cameraSpline, camera.position);
            targetCameraPosition = cameraSpline.getPoint(tValue);
            targetLookAtPosition = lookAtSpline.getPoint(tValue);
            distanceAlongSpline = tValue;
            targetPinId = null;
        }

        // Focus Mode
        if (targetCameraPosition) {
            velocity = 0;

            camera.position.lerp(targetCameraPosition, 0.1);

            if (camera.position.distanceTo(targetCameraPosition) < 0.0001) {
                // Destination reached!
                camera.position.copy(targetCameraPosition);
                if (!targetPinId) targetCameraPosition = null;
            }
        }

        // Scroll Mode
        if (!targetCameraPosition) {
            distanceAlongSpline += velocity;
            if (distanceAlongSpline <= 0 || distanceAlongSpline >= 1) {
                distanceAlongSpline = Math.max(0, Math.min(1, distanceAlongSpline));
                velocity = 0;
            }

            if (Math.abs(velocity) < 0.00002) velocity = 0;
            velocity *= friction;

            updateCameraFromT(distanceAlongSpline);
        }

        if (targetLookAtPosition) lookAtPosition?.lerp(targetLookAtPosition, 0.1);
        camera.lookAt(lookAtPosition!);

        // Calculate Tilt
        currentTilt.x += (targetTilt.x - currentTilt.x) * tiltSpeed;
        currentTilt.y += (targetTilt.y - currentTilt.y) * tiltSpeed;

        const tiltQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(currentTilt.x, currentTilt.y, 0));
        camera.quaternion.multiply(tiltQuaternion);

        requestAnimationFrame(update);
    }

    function onMouseMove(event: MouseEvent) {
        if (usePauseStore().isPaused) return;
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        targetTilt.x = mouse.y * tiltIntensity;
        targetTilt.y = -mouse.x * tiltIntensity;
    }

    function updateCameraFromT(tVal: number) {
        tVal = Math.max(0, Math.min(1, tVal));
        const currentPosition = cameraSpline.getPoint(tVal);
        camera.position.copy(currentPosition);
        lookAtPosition = lookAtSpline.getPoint(tVal);
    }

    // Set initial camera position
    updateCameraFromT(distanceAlongSpline);

    // Scroll handler: move forwards/backwards along the spline
    function onWheel(event: WheelEvent) {
        event.preventDefault();

        if (targetCameraPosition) return;

        velocity += event.deltaY * scrollSpeed;
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('wheel', onWheel, { passive: false });

    update();
}

// Todo: Zoom in on a pin, but center the pin on the left 2/3s of the screen
function zoomToPin() {}

// Todo: Zoom back to the original camera point
function zoomOut() {}

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

function animate() {
    // Animate water
    if (water) water.material.uniforms['time'].value += 0.1 / 60;

    animationId = requestAnimationFrame(animate);
    renderer.render(scene, camera);

    // TODO don't use the index
    // Update the pin's labelPoints based on index
    props.pins.forEach((pin, index) => {
        const pinPoint = pinPoints[index];
        pin.labelPoint = getViewportPoint(pinPoint.point, camera, renderer);
    });

    if (env.NOCLIP) {
        if (keysHeld.size === 0) return;

        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

        const delta = new THREE.Vector3();
        if (keysHeld.has('ArrowUp')) delta.addScaledVector(forward, moveSpeed);
        if (keysHeld.has('ArrowDown')) delta.addScaledVector(forward, -moveSpeed);
        if (keysHeld.has('ArrowLeft')) delta.addScaledVector(right, -moveSpeed);
        if (keysHeld.has('ArrowRight')) delta.addScaledVector(right, moveSpeed);

        camera.position.add(delta);
        controls.target.add(delta);
    }

    controls?.update();
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

    window.addEventListener('keydown', onPressKey);
    function onPressKey(event: KeyboardEvent) {
        switch (event.key) {
            case 'c':
                console.log('cursor:', cursor.position.x, cursor.position.z);
                break;

            case 'v':
                const c = camera.position;
                const t = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);

                const cameraAndTarget = {
                    cameraPosition: {
                        x: parseFloat(c.x.toFixed(6)),
                        y: parseFloat(c.y.toFixed(6)),
                        z: parseFloat(c.z.toFixed(6))
                    },
                    targetPosition: {
                        x: parseFloat(t.x.toFixed(6)),
                        y: parseFloat(t.y.toFixed(6)),
                        z: parseFloat(t.z.toFixed(6))
                    }
                };
                console.log(JSON.stringify(cameraAndTarget));
                break;
        }
    }
}

function getClosestTValueOnSpline(spline: THREE.CatmullRomCurve3, point: THREE.Vector3): number {
    const steps = 100;
    let minDistance = Infinity;
    let closestT = 0;

    const pointsAlongSpline = spline.getSpacedPoints(100);

    for (let i = 0; i < pointsAlongSpline.length; i++) {
        const p = pointsAlongSpline[i];
        const distance = p.distanceTo(point);

        if (distance < minDistance) {
            minDistance = distance;
            closestT = i / steps;
        }
    }

    return closestT;
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
