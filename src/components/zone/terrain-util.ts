import { Point } from '@/util/math-util';
import * as THREE from 'three';

export function getHeightAtPoint(mesh: THREE.Group<THREE.Object3DEventMap>, p: Point) {
    const x = p.x;
    const z = p.y; // The point is a 2D coord

    const ray = new THREE.Raycaster();
    const rayPosition = new THREE.Vector3();
    const rayDirection = new THREE.Vector3(0, -1, 0);

    rayPosition.set(x, 10, z);
    ray.set(rayPosition, rayDirection);

    let intersections = ray.intersectObject(mesh);
    if (intersections.length > 0) return intersections[0].point.y;
    return 0;
}
