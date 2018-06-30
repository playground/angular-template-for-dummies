import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Observable, defer as observableDefer } from 'rxjs';

import { Reticle } from './reticle';
import { ThreeServiceService } from './three-service.service';

declare var THREE: any;
declare var navigator: any;
declare var XRSession: any;
declare var XRWebGLLayer: any;

const MODEL_OBJ_URL = '../assets/ArcticFox_Posed.obj';
const MODEL_MTL_URL = '../assets/ArcticFox_Posed.mtl';
const MODEL_SCALE = 0.1;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  device;
  supported: boolean = true;
  model;
  raycaster;
  session;
  camera;
  reticle;
  renderer;
  scene;
  gl;
  frameOfRef;
  stabilized;
  myCanvas;

  @ViewChild('canvasContainer') 
  canvasContainer: ElementRef;
  constructor(
    private threeService: ThreeServiceService,
    private elementRef: ElementRef,
    private renderer2: Renderer2
  ) {

  }

  ngOnInit() {
    console.log('init')
    this.initXR();
  }

  initXR() {
    // The entry point of the WebXR Device API is on `navigator.xr`.
    // We also want to ensure that `XRSession` has `requestHitTest`,
    // indicating that the #webxr-hit-test flag is enabled.
    if (navigator.xr && XRSession.prototype.requestHitTest) {
      try {
        observableDefer(async () => {
          this.device = await navigator.xr.requestDevice();
          return this.device;
        }).subscribe((device) => {
          console.log(device)
          // We found an XRDevice! Bind a click listener on our "Enter AR" button
          // since the spec requires calling `device.requestSession()` within a
          // user gesture.
          // document.querySelector('#enter-ar').addEventListener('click', this.onEnterAR);
          return;
        }, (err) => {
          console.log(err)
          return;
        });
      } catch (e) {
        // If there are no valid XRDevice's on the system,
        // `requestDevice()` rejects the promise. Catch our
        // awaited promise and display message indicating there
        // are no valid devices.
        this.onNoXRDevice();
        return;
      }
    } else {
      // If `navigator.xr` or `XRSession.prototype.requestHitTest`
      // does not exist, we must display a message indicating there
      // are no valid devices.
      this.onNoXRDevice();
      return;
    }

  }

  ngAfterViewInit() {
    // this.initXR();
  }

  enterAR() {
    // Now that we have an XRDevice, and are responding to a user
    // gesture, we must create an XRPresentationContext on a
    // canvas element.
    const outputCanvas = document.createElement('canvas');
    const ctx = outputCanvas.getContext('xrpresent');

    try {
      // Request a session for the XRDevice with the XRPresentationContext
      // we just created.
      // Note that `device.requestSession()` must be called in response to
      // a user gesture, hence this function being a click handler.
      observableDefer(async () => {
        const session = await this.device.requestSession({ outputContext: ctx });
        return session;
      }).subscribe((session) => {
        console.log(session)
        // If `requestSession` is successful, add the canvas to the
        // DOM since we know it will now be used.
        // document.body.appendChild(outputCanvas);
        this.renderer2.appendChild(document.body, outputCanvas);
        this.onSessionStarted(session)
      }, (err) => {
        console.log(err)
        this.onNoXRDevice();
      });
    } catch (e) {
      // If `requestSession` fails, the canvas is not added, and we
      // call our function for unsupported browsers.
      this.onNoXRDevice();
    }
  }

  onNoXRDevice() {
    this.supported = false;
  }

  onSessionStarted(session) {
    this.session = session;

    // Add the `ar` class to our body, which will hide our 2D components
    this.renderer2.addClass(document.body, 'ar');

    // To help with working with 3D on the web, we'll use three.js. Set up
    // the WebGLRenderer, which handles rendering to our session's base layer.
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.autoClear = false;

    this.gl = this.renderer.getContext();

    // Ensure that the context we want to write to is compatible
    // with our XRDevice
    observableDefer(async () => {
      await this.gl.setCompatibleXRDevice(this.session.device);
    }).subscribe((session) => {
      // Set our session's baseLayer to an XRWebGLLayer
      // using our new renderer's context
      this.session.baseLayer = new XRWebGLLayer(this.session, this.gl);

      // A THREE.Scene contains the scene graph for all objects in the
      // render scene. Call our utility which gives us a THREE.Scene
      // with a few lights and meshes already in the scene.
      this.scene = this.threeService.createLitScene();

      // Use the DemoUtils.loadModel to load our OBJ and MTL. The promise
      // resolves to a THREE.Group containing our mesh information.
      // Dont await this promise, as we want to start the rendering
      // process before this finishes.
      this.threeService.loadModel(MODEL_OBJ_URL, MODEL_MTL_URL).then(model => {
        this.model = model;

        // Every model is different -- you may have to adjust the scale
        // of a model depending on the use.
        this.model.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);

        // We'll update the camera matrices directly from API, so
        // disable matrix auto updates so three.js doesn't attempt
        // to handle the matrices independently.
        this.camera = new THREE.PerspectiveCamera();
        this.camera.matrixAutoUpdate = false;

        // Add a Reticle object, which will help us find surfaces by drawing
        // a ring shape onto found surfaces. See source code
        // of Reticle in shared/utils.js for more details.
        this.reticle = new Reticle(this.session, this.camera, this.threeService);
        this.scene.add(this.reticle);

        observableDefer(async () => {
          this.frameOfRef = await this.session.requestFrameOfReference('eye-level');
          return this.frameOfRef;
        }).subscribe((frameOfRef) => {
          this.session.requestAnimationFrame((time, frame) => {
            this.onXRFrame(time, frame);
          });
          // this.canvasContainer.nativeElement.addEventListener('click', this.onClick);
          window.addEventListener('click', this.onClick.bind(this));
        }, (err) => {
          console.log(err)
          this.onNoXRDevice();
        });
      });
    }, (err) => {
      console.log(err)
      this.onNoXRDevice();
    });
  }

  /**
   * Called on the XRSession's requestAnimationFrame.
   * Called with the time and XRPresentationFrame.
   */
  onXRFrame(time, frame) {
    let session = frame.session;
    let pose = frame.getDevicePose(this.frameOfRef);

    // Update the reticle's position
    this.reticle.update(this.frameOfRef);

    // If the reticle has found a hit (is visible) and we have
    // not yet marked our app as stabilized, do so
    if (this.reticle.visible && !this.stabilized) {
      this.stabilized = true;
      this.renderer2.addClass(document.body, 'stabilized');
    }

    // Queue up the next frame
    session.requestAnimationFrame(this.onXRFrame.bind(this));  
    // Bind the framebuffer to our baseLayer's framebuffer
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.session.baseLayer.framebuffer);

    if (pose) {
      // Our XRFrame has an array of views. In the VR case, we'll have
      // two views, one for each eye. In mobile AR, however, we only
      // have one view.
      for (let view of frame.views) {
        const viewport = session.baseLayer.getViewport(view);
        this.renderer.setSize(viewport.width, viewport.height);

        // Set the view matrix and projection matrix from XRDevicePose
        // and XRView onto our THREE.Camera.
        this.camera.projectionMatrix.fromArray(view.projectionMatrix);
        const viewMatrix = new THREE.Matrix4().fromArray(pose.getViewMatrix(view));
        this.camera.matrix.getInverse(viewMatrix);
        this.camera.updateMatrixWorld(true);

        this.renderer.clearDepth();

        // Render our scene with our THREE.WebGLRenderer
        this.renderer.render(this.scene, this.camera);
      }
    }
  }

  onClick(e) {
    // If our model is not yet loaded, abort
    if (!this.model) {
      return;
    }

    // We're going to be firing a ray from the center of the screen.
    // The requestHitTest function takes an x and y coordinate in
    // Normalized Device Coordinates, where the upper left is (-1, 1)
    // and the bottom right is (1, -1). This makes (0, 0) our center.
    const x = 0;
    const y = 0;

    // Create a THREE.Raycaster if one doesn't already exist,
    // and use it to generate an origin and direction from
    // our camera (device) using the tap coordinates.
    // Learn more about THREE.Raycaster:
    // https://threejs.org/docs/#api/core/Raycaster
    this.raycaster = this.raycaster || new THREE.Raycaster();
    this.raycaster.setFromCamera({ x, y }, this.camera);
    const ray = this.raycaster.ray;

    // Fire the hit test to see if our ray collides with a real
    // surface. Note that we must turn our THREE.Vector3 origin and
    // direction into an array of x, y, and z values. The proposal
    // for `XRSession.prototype.requestHitTest` can be found here:
    // https://github.com/immersive-web/hit-test
    const origin = new Float32Array(ray.origin.toArray());
    const direction = new Float32Array(ray.direction.toArray());

    observableDefer(async () => {
      const hits = await this.session.requestHitTest(origin,
        direction,
        this.frameOfRef);
      return hits;
    }).subscribe((hits) => {
      // If we found at least one hit...
      if (hits.length) {
        // We can have multiple collisions per hit test. Let's just take the
        // first hit, the nearest, for now.
        const hit = hits[0];

        // Our XRHitResult object has one property, `hitMatrix`, a
        // Float32Array(16) representing a 4x4 Matrix encoding position where
        // the ray hit an object, and the orientation has a Y-axis that corresponds
        // with the normal of the object at that location.
        // Turn this matrix into a THREE.Matrix4().
        const hitMatrix = new THREE.Matrix4().fromArray(hit.hitMatrix);

        // Now apply the position from the hitMatrix onto our model.
        this.model.position.setFromMatrixPosition(hitMatrix);

        // Rather than using the rotation encoded by the `modelMatrix`,
        // rotate the model to face the camera. Use this utility to
        // rotate the model only on the Y axis.
        this.threeService.lookAtOnY(this.model, this.camera);

        // Ensure our model has been added to the scene.
        this.scene.add(this.model);
      }
    }, (err) => {
      console.log(err)
      this.onNoXRDevice();
    });
  }
}
