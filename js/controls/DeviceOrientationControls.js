// import * as THREE from "three";
// (function () {

//   var deviceOrientation = {};
//   var screenOrientation = window.orientation || 0;

//   function onDeviceOrientationChangeEvent(evt) {
//     deviceOrientation = evt;
//   }
//   window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);

//   function getOrientation() {
//     switch (window.screen.orientation || window.screen.mozOrientation) {
//       case 'landscape-primary':
//         return 90;
//       case 'landscape-secondary':
//         return -90;
//       case 'portrait-secondary':
//         return 180;
//       case 'portrait-primary':
//         return 0;
//     }
//     // this returns 90 if width is greater then height
//     // and window orientation is undefined OR 0
//     // if (!window.orientation && window.innerWidth > window.innerHeight)
//     //   return 90;
//     return window.orientation || 0;
//   }

//   function onScreenOrientationChangeEvent() {
//     screenOrientation = getOrientation();
//   }
//   window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);


//   THREE.DeviceOrientationControls = function (object) {

//     this.object = object;

//     this.object.rotation.reorder('YXZ');

//     this.freeze = true;

//     this.movementSpeed = 1.0;
//     this.rollSpeed = 0.005;
//     this.autoAlign = true;
//     this.autoForward = false;

//     this.alpha = 0;
//     this.beta = 0;
//     this.gamma = 0;
//     this.orient = 0;

//     this.alignQuaternion = new THREE.Quaternion();
//     this.orientationQuaternion = new THREE.Quaternion();

//     var quaternion = new THREE.Quaternion();
//     var quaternionLerp = new THREE.Quaternion();

//     var tempVector3 = new THREE.Vector3();
//     var tempMatrix4 = new THREE.Matrix4();
//     var tempEuler = new THREE.Euler(0, 0, 0, 'YXZ');
//     var tempQuaternion = new THREE.Quaternion();

//     var zee = new THREE.Vector3(0, 0, 1);
//     var up = new THREE.Vector3(0, 1, 0);
//     var v0 = new THREE.Vector3(0, 0, 0);
//     var euler = new THREE.Euler();
//     var q0 = new THREE.Quaternion(); // - PI/2 around the x-axis
//     var q1 = new THREE.Quaternion(- Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));


//     this.update = (function (delta) {

//       return function (delta) {

//         if (this.freeze) return;

//         // should not need this
//         //var orientation = getOrientation();
//         //if (orientation !== this.screenOrientation) {
//         //this.screenOrientation = orientation;
//         //this.autoAlign = true;
//         //}

//         this.alpha = deviceOrientation.gamma ?
//           THREE.Math.degToRad(deviceOrientation.alpha) : 0; // Z
//         this.beta = deviceOrientation.beta ?
//           THREE.Math.degToRad(deviceOrientation.beta) : 0; // X'
//         this.gamma = deviceOrientation.gamma ?
//           THREE.Math.degToRad(deviceOrientation.gamma) : 0; // Y''
//         this.orient = screenOrientation ?
//           THREE.Math.degToRad(screenOrientation) : 0; // O

//         // The angles alpha, beta and gamma
//         // form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

//         // 'ZXY' for the device, but 'YXZ' for us
//         euler.set(this.beta, this.alpha, - this.gamma, 'YXZ');

//         quaternion.setFromEuler(euler);
//         quaternionLerp.slerp(quaternion, 0.5); // interpolate

//         // orient the device
//         if (this.autoAlign) this.orientationQuaternion.copy(quaternion); // interpolation breaks the auto alignment
//         else this.orientationQuaternion.copy(quaternionLerp);

//         // camera looks out the back of the device, not the top
//         this.orientationQuaternion.multiply(q1);

//         // adjust for screen orientation
//         this.orientationQuaternion.multiply(q0.setFromAxisAngle(zee, - this.orient));

//         this.object.quaternion.copy(this.alignQuaternion);
//         this.object.quaternion.multiply(this.orientationQuaternion);

//         if (this.autoForward) {

//           tempVector3
//             .set(0, 0, -1)
//             .applyQuaternion(this.object.quaternion, 'ZXY')
//             .setLength(this.movementSpeed / 50); // TODO: why 50 :S

//           this.object.position.add(tempVector3);

//         }

//         if (this.autoAlign && this.alpha !== 0) {

//           this.autoAlign = false;

//           this.align();

//         }

//       };

//     })();

//     // //debug
//     // window.addEventListener('click', (function(){
//     //   this.align();
//     // }).bind(this));

//     this.align = function () {

//       tempVector3
//         .set(0, 0, -1)
//         .applyQuaternion(tempQuaternion.copy(this.orientationQuaternion).inverse(), 'ZXY');

//       tempEuler.setFromQuaternion(
//         tempQuaternion.setFromRotationMatrix(
//           tempMatrix4.lookAt(tempVector3, v0, up)
//         )
//       );

//       tempEuler.set(0, tempEuler.y, 0);
//       this.alignQuaternion.setFromEuler(tempEuler);

//     };

//     this.connect = function () {
//       this.freeze = false;
//     };

//     this.disconnect = function () {
//       this.freze = true;
//     };

//   };

// })();

import * as THREE from 'three';
/**
 * @classdesc Device Orientation Control
 * @constructor
 * @external DeviceOrientationControls
 * @param {THREE.Object} object 
 */
function DeviceOrientationControls(object) {
  console.log(this.object, object)
  if (!object) return null

  const scope = this;
  this.object = object;
  this.object.rotation.reorder('YXZ');
  this.enabled = true;
  this.deviceOrientation = null;
  this.screenOrientation = 0;
  this.alphaOffset = 0; // radians
  this.initialOffset = null;
  const onDeviceOrientationChangeEvent = function ({ alpha, beta, gamma }) {
    if (scope.initialOffset === null) {
      scope.initialOffset = alpha;
    }
    alpha = alpha - scope.initialOffset;
    if (alpha < 0) alpha += 360;
    scope.deviceOrientation = { alpha, beta, gamma };
  };
  const onScreenOrientationChangeEvent = function () {
    scope.screenOrientation = window.orientation || 0;
  };
  const onRegisterEvent = function () {
    window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);
    window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
  }.bind(this);
  // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''
  const setObjectQuaternion = function () {
    const zee = new THREE.Vector3(0, 0, 1);
    const euler = new THREE.Euler();
    const q0 = new THREE.Quaternion();
    const q1 = new THREE.Quaternion(- Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis
    return function (quaternion, alpha, beta, gamma, orient) {
      euler.set(beta, alpha, - gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us
      quaternion.setFromEuler(euler); // orient the device
      quaternion.multiply(q1); // camera looks out the back of the device, not the top
      quaternion.multiply(q0.setFromAxisAngle(zee, - orient)); // adjust for screen orientation
    };
  }();
  this.connect = function () {
    onScreenOrientationChangeEvent(); // run once on load
    // iOS 13+
    if (window.DeviceOrientationEvent !== undefined && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
      window.DeviceOrientationEvent.requestPermission().then(function (response) {
        if (response == 'granted') {
          onRegisterEvent();
        }
      }).catch(function (error) {
        console.error('THREE.DeviceOrientationControls: Unable to use DeviceOrientation API:', error);
      });
    } else {
      onRegisterEvent();
    }
    scope.enabled = true;
  };
  this.disconnect = function () {
    window.removeEventListener('orientationchange', onScreenOrientationChangeEvent, false);
    window.removeEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
    scope.enabled = false;
    scope.deviceOrientation = null;
    scope.initialOffset = null;

  };
  this.update = function ({ theta = 0 } = { theta: 0 }) {
    if (scope.enabled === false) return;
    const device = scope.deviceOrientation;
    if (device) {
      const alpha = device.alpha ? THREE.Math.degToRad(device.alpha) + scope.alphaOffset : 0; // Z

      const beta = device.beta ? THREE.Math.degToRad(device.beta) : 0; // X'
      const gamma = device.gamma ? THREE.Math.degToRad(device.gamma) : 0; // Y''
      const orient = scope.screenOrientation ? THREE.Math.degToRad(scope.screenOrientation) : 0; // O
      setObjectQuaternion(scope.object.quaternion, alpha + theta, beta, gamma, orient);
    }
  };
  this.dispose = function () {
    scope.disconnect();
  };
  this.getAlpha = function () {
    const { deviceOrientation: device } = scope;
    return device && device.alpha ? THREE.Math.degToRad(device.alpha) + scope.alphaOffset : 0;
  };
  this.getBeta = function () {
    const { deviceOrientation: device } = scope;
    return device && device.beta ? THREE.Math.degToRad(device.beta) : 0;
  };
};
DeviceOrientationControls.prototype = Object.assign(Object.create(THREE.EventDispatcher.prototype), {
  constructor: DeviceOrientationControls
});
export { DeviceOrientationControls };
