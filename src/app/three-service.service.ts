import { Injectable } from '@angular/core';

declare var THREE:any;

// remaps opacity from 0 to 1
const opacityRemap = mat => {
  if (mat.opacity === 0) {
    mat.opacity = 1;
  }
};

@Injectable({
  providedIn: 'root'
})
export class ThreeServiceService {

  constructor() { }

  createLitScene() {
    const scene = new THREE.Scene();

    // The materials will render as a black mesh
    // without lights in our scenes. Let's add an ambient light
    // so our material can be visible, as well as a directional light
    // for the shadow.
    const light = new THREE.AmbientLight(0xffffff, 1);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(10, 15, 10);

    // We want this light to cast shadow.
    directionalLight.castShadow = true;

    // Make a large plane to receive our shadows
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
    // Rotate our plane to be parallel to the floor
    planeGeometry.rotateX(-Math.PI / 2);

    // Create a mesh with a shadow material, resulting in a mesh
    // that only renders shadows once we flip the `receiveShadow` property.
    const shadowMesh = new THREE.Mesh(planeGeometry, new THREE.ShadowMaterial({
      opacity: 0.2,
    }));

    // Give it a name so we can reference it later, and set `receiveShadow`
    // to true so that it can render our model's shadow.
    shadowMesh.name = 'shadowMesh';
    shadowMesh.receiveShadow = true;
    shadowMesh.position.y = 10000;

    // Add lights and shadow material to scene.
    scene.add(shadowMesh);
    scene.add(light);
    scene.add(directionalLight);

    return scene;
  }

  /**
   * Creates a THREE.Scene containing cubes all over the scene.
   *
   * @return {THREE.Scene}
   */
  createCubeScene() {
    const scene = new THREE.Scene();

    const materials = [
      new THREE.MeshBasicMaterial({ color: 0xff0000 }),
      new THREE.MeshBasicMaterial({ color: 0x0000ff }),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
      new THREE.MeshBasicMaterial({ color: 0xff00ff }),
      new THREE.MeshBasicMaterial({ color: 0x00ffff }),
      new THREE.MeshBasicMaterial({ color: 0xffff00 })
    ];

    const ROW_COUNT = 4;
    const SPREAD = 1;
    const HALF = ROW_COUNT / 2;
    for (let i = 0; i < ROW_COUNT; i++) {
      for (let j = 0; j < ROW_COUNT; j++) {
        for (let k = 0; k < ROW_COUNT; k++) {
          const box = new THREE.Mesh(new THREE.BoxBufferGeometry(0.2, 0.2, 0.2), materials);
          box.position.set(i - HALF, j - HALF, k - HALF);
          box.position.multiplyScalar(SPREAD);
          scene.add(box);
        }
      }
    }

    return scene;
  }

  /**
   * Loads an OBJ model with an MTL material applied.
   * Returns a THREE.Group object containing the mesh.
   *
   * @param {string} objURL
   * @param {string} mtlURL
   * @return {Promise<THREE.Group>}
   */
  loadModel(objURL, mtlURL) {
    // OBJLoader and MTLLoader are not a part of three.js core, and
    // must be included as separate scripts.
    const objLoader = new THREE.OBJLoader();
    const mtlLoader = new THREE.MTLLoader();

    // Set texture path so that the loader knows where to find
    // linked resources
    mtlLoader.setTexturePath(mtlURL.substr(0, mtlURL.lastIndexOf('/') + 1));

    // remaps ka, kd, & ks values of 0,0,0 -> 1,1,1, models from
    // Poly benefit due to how they were encoded.
    mtlLoader.setMaterialOptions({ ignoreZeroRGBs: true });

    // OBJLoader and MTLLoader provide callback interfaces; let's
    // return a Promise and resolve or reject based off of the asset
    // downloading.
    return new Promise((resolve, reject) => {
      mtlLoader.load(mtlURL, materialCreator => {
        // We have our material package parsed from the .mtl file.
        // Be sure to preload it.
        materialCreator.preload();

        // Remap opacity values in the material to 1 if they're set as
        // 0; this is another peculiarity of Poly models and some
        // MTL materials.
        for (let material of Object.values(materialCreator.materials)) {
          opacityRemap(material);
        }

        // Give our OBJ loader our materials to apply it properly to the model
        objLoader.setMaterials(materialCreator);

        // Finally load our OBJ, and resolve the promise once found.
        objLoader.load(objURL, resolve, function(){}, reject);
      }, function(){}, reject);
    });
  }

  /**
   * Similar to THREE.Object3D's `lookAt` function, except we only
   * want to rotate on the Y axis. In our AR use case, we don't want
   * our model rotating in all axes, instead just on the Y.
   *
   * @param {THREE.Object3D} looker
   * @param {THREE.Object3D} target
   */
  lookAtOnY(looker, target) {
    const targetPos = new THREE.Vector3().setFromMatrixPosition(target.matrixWorld);

    const angle = Math.atan2(targetPos.x - looker.position.x,
                             targetPos.z - looker.position.z);
    looker.rotation.set(0, angle, 0);
  }

  /**
   * three.js switches back to framebuffer 0 after using a render target,
   * which causes issues when writing to our WebXR baseLayer's framebuffer.
   * We ensure before rendering every object in our scene that we reset our
   * framebuffer back to the baseLayer's. This is very hacky by overriding
   * all Object3D's onBeforeRender handler.
   *
   * @param {App} app
   */
  fixFramebuffer(app) {
    THREE.Object3D.prototype.onBeforeRender = () => {
      app.gl.bindFramebuffer(app.gl.FRAMEBUFFER, app.session.baseLayer.framebuffer);
    }
  }
}
