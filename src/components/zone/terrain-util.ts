export function getHeightAtPoint(mesh, p: Point) {
    var ray = new THREE.Raycaster();
    var rayPos = new THREE.Vector3();

    // Use y = 100 to ensure ray starts above terran
    rayPos.set(x, 100, z);
    var rayDir = new THREE.Vector3(0, -1, 0); // Ray points down

    // Set ray from pos, pointing down
    ray.set(rayPos, rayDir);

    // Check where it intersects terrain Mesh
    let intersect = ray.intersectObject(terrainMesh);
    console.log(intersect);
}
