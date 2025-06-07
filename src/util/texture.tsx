import * as THREE from "three";

export function loadPanoramaTexture(path: string): THREE.Texture {
	const textureLoader = new THREE.TextureLoader();
	const texture = textureLoader.load(path, (texture) => {
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(1, 1);
	});
	return texture;
}
