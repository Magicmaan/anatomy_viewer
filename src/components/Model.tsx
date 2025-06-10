import useScene from "@/store/store";
import { getCameraEuler, getCameraPosition } from "@/util/util";
import { ObjectMap, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box3, Group } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useShallow } from "zustand/react/shallow";
import * as THREE from "three";
import { useXR, XR } from "@react-three/xr";
import {
  AnatomyLayers,
  anatomyLayers as AnatomyLayersList,
  AnatomyString_en,
  getAnatomyString,
} from "@/constants/localisation";
import { stripName } from "@/util/modelUtil";
import Selected from "./Selected";
import type { EventHandlers } from "@react-three/fiber";
import useRagdoll from "./RagdollControl";
// import { RagdollControl } from "./RagdollControl";

interface ModelProps {
  model: string;
}

const useHover = () => {
  console.log("useHover called");
  const hoverMaterial = new THREE.MeshStandardMaterial({
    name: "hoverMaterial",
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.5,
    transparent: true,
  });
  useEffect(() => {
    // Clean up the hover material when the component unmounts
    return () => {
      hoverMaterial.dispose();
    };
  }, []);
  const onPointerEnter: EventHandlers["onPointerEnter"] = (e) => {
    // on hover, change the material to a hover material
    // the hover material is a clone of the original material with an emissive effect
    // the materials are stored in the userData of the object
    console.log("Pointer entered", e.object);
    const object = e.object as THREE.Mesh;
    object.userData.hovered = true;

    if (!object.userData.originalMaterial) {
      object.userData.originalMaterial = object.material;
    }
    const material = object.material as THREE.MeshStandardMaterial;
    if (!material) {
      console.warn("No material found for", object.name);
      return;
    }
    if (material.opacity === 0) {
      console.warn(
        "Material opacity is 0, cannot apply hover effect",
        object.name
      );
      return;
    }
    hoverMaterial.map = material.map;
    hoverMaterial.emissiveMap = material.map;
    hoverMaterial.needsUpdate = true;
    hoverMaterial.opacity = material.opacity;

    // const mat = object.userData.hoverMaterial as THREE.MeshStandardMaterial;
    object.material = hoverMaterial;
    e.stopPropagation();
  };
  const onPointerLeave: EventHandlers["onPointerLeave"] = (e) => {
    // on hover leave, restore the original material
    const object = e.object as THREE.Mesh;
    object.userData.hovered = false;
    if (object.userData.originalMaterial) {
      // e.object.material.dispose();
      // Restore the original material
      object.material = object.userData.originalMaterial;
    } else {
      console.warn("No original material found for", object.name);
    }
  };

  //return the event handlers for pointer enter and leave
  // these will be used in the Model component
  return { onPointerEnter, onPointerLeave };
};

const useSelect = () => {};

const useLayerOpacity = (model: Group<THREE.Object3DEventMap>) => {
  const { anatomyLayer, layerMix } = useScene(
    useShallow((state) => ({
      anatomyLayer: state.anatomyLayer,
      layerMix: state.layerMix,
    }))
  );

  const materials = useMemo(() => {
    const mats: { [key: string]: THREE.Material } = {};
    model.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material as THREE.MeshStandardMaterial;
        material.name =
          (material.map?.name as string).split(".")[0] || "defaultMaterial";
        // correct render order from inner to outer layers
        child.renderOrder =
          5 -
          AnatomyLayersList.indexOf(
            material.name.toLowerCase() as AnatomyLayers
          ) +
          1;
        material.transparent = true;
        mats[material.id] = material;
      }
    });
    return Object.values(mats);
  }, [model]);

  materials.forEach((material) => {
    // console.log("Anatomy Layer:", anatomyLayer, "Material Name:", material.name);
    const name = material.name.toLowerCase();
    if (name.includes(anatomyLayer)) {
      // Set the opacity based on the layer mix
      // will slowly transition the opacity of the current layer
      // keep at max opacity until 25% of the layer mix, then slowly decrease opacity
      // to 0 at 100% layer mix
      material.opacity = layerMix <= 0.25 ? 1 : 1 - (layerMix - 0.25) * (4 / 3);
      material.visible = true; // Ensure the current layer is visible
    } else {
      if (AnatomyLayersList.includes(name as AnatomyLayers)) {
        const currentIndex = AnatomyLayersList.indexOf(anatomyLayer);
        const targetIndex = AnatomyLayersList.indexOf(name as AnatomyLayers);

        // if lower layer, then render it, else don't render it
        if (targetIndex > currentIndex) {
          material.opacity = 1; // Set a lower opacity for layers above the current one
          material.visible = true;
          console.log("Setting opacity to 0.5 for", name);
        } else {
          console.log("Setting opacity to 0 for", name);
          material.opacity = 0;
          material.visible = false; // Hide layers below the current one
        }
      }
    }
    material.needsUpdate = true;
  });

  // model.traverse((child) => {
  // 	if (child instanceof THREE.Mesh) {
  // 		const material = child.material as THREE.MeshStandardMaterial;
  // 		if (material && material.name) {
  // 			if (material.opacity === 0) {
  // 				child.visible = false; // Hide the mesh if its material is fully transparent
  // 			} else {
  // 				child.visible = true; // Ensure the mesh is visible if its material is not fully transparent
  // 			}
  // 		}
  // 	}
  // });

  console.log("Materials in model:", materials);
};

const useAnimation = (model: Group<THREE.Object3DEventMap>) => {
  const parts = [
    "head",
    "body",
    "left_arm",
    "right_arm",
    "left_leg",
    "right_leg",
  ]
    .filter((part) => model.getObjectByName(part))
    .map((part) => model.getObjectByName(part) as THREE.Mesh);

  const headAnimation = (head: THREE.Mesh, camera) => {
    const maxYaw = 30 * (Math.PI / 180); // 30 degrees
    const maxPitch = 22.5 * (Math.PI / 180); // 22.5 degrees
    const yawSpeed = 0.008; // Speed of yaw rotation
    const pitchSpeed = 0.003; // Speed of pitch rotation

    // Animate the head to look at the camera
    // Get positions
    const headPosition = head.getWorldPosition(new THREE.Vector3());
    const cameraPosition = camera.getWorldPosition(new THREE.Vector3());

    // // Limit camera height to avoid extreme angles
    // cameraPosition.y = THREE.MathUtils.clamp(
    // 	cameraPosition.y,
    // 	headPosition.y - 0.1,
    // 	headPosition.y + 0.1
    // );
    // console.log("Camera position:", cameraPosition.x);

    const targetRotation = new THREE.Euler();
    const oldRotation = head.rotation.clone();
    // if behind camera, return to 0,0,0
    if (cameraPosition.x > 0.5) {
      targetRotation.set(0, 0, 0); // Reset rotation if camera is too far away
    } else {
      // // Store original rotation and calculate target rotation
      head.lookAt(cameraPosition);
      head.rotateY(Math.PI); // Rotate the head to face the camera
      targetRotation.copy(head.rotation);
    }

    // Apply rotation limits
    targetRotation.y = THREE.MathUtils.clamp(targetRotation.y, -maxYaw, maxYaw); // 36 degrees
    targetRotation.x = THREE.MathUtils.clamp(
      targetRotation.x,
      -maxPitch,
      maxPitch
    ); // 22.5 degrees
    targetRotation.z = THREE.MathUtils.clamp(
      targetRotation.z,
      -maxPitch,
      maxPitch
    ); // 22.5 degrees

    // Smoothly interpolate between current rotation and target rotation
    head.rotation.y = THREE.MathUtils.lerp(
      oldRotation.y,
      targetRotation.y,
      yawSpeed
    );
    head.rotation.x = THREE.MathUtils.lerp(
      oldRotation.x,
      targetRotation.x,
      pitchSpeed
    );
    head.rotation.z = THREE.MathUtils.lerp(
      oldRotation.z,
      targetRotation.z,
      pitchSpeed
    );
  };
  const armAnimation = (arm: THREE.Mesh, offset?: number = 0) => {
    // Add arm animation logic here if needed
    // For now, just log the arm name
    // console.log("Animating arm:", arm.name);

    const time = Date.now() * 0.001; // Convert to seconds for smoother animation
    const speed = 0.5; // Speed of rotation
    const maxAngle = 2.5 * (Math.PI / 180); // Maximum angle in radians (5 degrees)

    // Calculate position using sine and cosine for a smooth circular motion
    const xAngle = Math.cos(time * speed * offset) * maxAngle;
    const zAngle = Math.sin(time * speed * offset) * maxAngle;

    // Apply a subtle rotation with interpolation for smooth movement
    arm.rotation.x = THREE.MathUtils.lerp(arm.rotation.x, xAngle, 0.05);
    arm.rotation.z = THREE.MathUtils.lerp(arm.rotation.z, zAngle, 0.05);
  };

  useFrame((state) => {
    const head = parts.find((part) => part.name === "head");
    if (head) {
      headAnimation(head, state.camera);
    } else {
      console.warn("Head part not found in model");
    }
    parts.forEach((part) => {
      if (part.name.includes("arm")) {
        armAnimation(part, part.name.includes("left") ? 1 : -1);
      }
      // Add more animations for other parts if needed
    });
  });
  // console.log("Animating parts:", parts);
};

export default function Model({ model }: ModelProps) {
  const store = useScene();
  const { selected, setSelected } = useScene(
    useShallow((state) => ({
      selected: state.selected,
      setSelected: state.setSelected,
    }))
  );

  const ref = useRef<Group>(null!);
  const gltf = useLoader(GLTFLoader, model);
  const bounds = new Box3().setFromObject(gltf.scene);
  // console.log("Model bounds:", bounds);
  const { scene } = useThree();

  const onHover = useHover();

  // insert model into the scene
  useEffect(() => {
    if (!gltf.scene) return;

    gltf.scene.name = "model";
    scene.add(gltf.scene);
    return () => {
      if (gltf.scene) {
        scene.remove(gltf.scene);
      }
    };
  }, [gltf.scene, scene]);

  useLayerOpacity(gltf.scene);
  useAnimation(gltf.scene);
  const { onClick: ragdollOnClick } = useRagdoll({
    model: gltf.scene,
  });

  return (
    <group ref={ref} name="model_group">
      <primitive
        name="model"
        ref={ref}
        object={gltf.scene}
        position={[0, 0, 0]}
        scale={1}
        rotation={[0, Math.PI / 2, 0]}
        onClick={(e) => {
          const displayName = getAnatomyString(
            stripName(e.object.name) as keyof typeof AnatomyString_en
          );

          console.log(
            "Model clicked",
            e.object.name,
            "Display Name:",
            displayName
          );
          e.stopPropagation();
          const position = e.object.getWorldPosition(new THREE.Vector3());
          const rotation = e.object.rotation.clone();
          ragdollOnClick(e);
          setSelected(e.object as THREE.Mesh);
        }}
        {...onHover}
      />
      <Selected />
    </group>
  );
}
