import * as THREE from 'three';

export class Zone {
    id: string;
    label: string;
    description: string;
    cameraSpline: { position: THREE.Vector3; rotation: THREE.Quaternion }[];

    static unpack(data: any): Zone {
        const z = new Zone();
        Object.assign(z, data);

        // Unpack the spline to the right types
        console.log(data.cameraSpline);
        z.cameraSpline = (data.cameraSpline as any[]).map(
            (positionAndRotation: { position: { x: number; y: number; z: number }; rotation: number[] }) => {
                const { position: p, rotation: r } = positionAndRotation;
                const position = new THREE.Vector3(p.x, p.y, p.z);
                const rotation = new THREE.Quaternion(r[0], r[1], r[2], r[3]);
                return { position, rotation };
            }
        );

        return z;
    }
}
