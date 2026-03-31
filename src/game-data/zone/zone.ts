import * as THREE from 'three';

export class Zone {
    id: string;
    label: string;
    description: string;
    cameraSplines: { cameraPosition: THREE.Vector3; targetPosition: THREE.Vector3 }[];

    static unpack(data: any): Zone {
        const z = new Zone();
        Object.assign(z, data);

        // Unpack the spline to the right types
        z.cameraSplines = (data.cameraSplines as any[]).map(
            (cameraPositionAndTargetPosition: {
                cameraPosition: { x: number; y: number; z: number };
                targetPosition: { x: number; y: number; z: number };
            }) => {
                const { cameraPosition: p, targetPosition: t } = cameraPositionAndTargetPosition;
                const cameraPosition = new THREE.Vector3(p.x, p.y, p.z);
                const targetPosition = new THREE.Vector3(t.x, t.y, t.z);
                return { cameraPosition, targetPosition };
            }
        );

        return z;
    }
}
