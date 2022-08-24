import * as THREE from 'three';
/**
 * @classdesc Device Orientation Control
 * @constructor
 * @external DeviceOrientationControls
 * @param {THREE.Object} object
 */

let beta = 0;
let alpha = 0;
let gamma = 0;
let orient = 10;
let speed_percent = 1 / 100;
function DeviceOrientationControls(object) {


  const scope = this;
  this.object = object;//被控制的摄像机。
  this.object.rotation.reorder('YXZ');
  this.enabled = true;
  this.deviceOrientation = {};//当前 deviceorientation 事件的对象
  this.screenOrientation = 0;//相对于设备自然朝向的视口朝向，以角度表示（增量为90）。默认为0。
  this.alphaOffset = 0; // radians 角偏移量，以弧度表示，默认为0。
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
    window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);//手機執行
  }.bind(this);

  // 更新相机三维角度
  // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''
  const setObjectQuaternion = function () {
    const zee = new THREE.Vector3(0, 0, 0);
    const euler = new THREE.Euler();
    const q0 = new THREE.Quaternion();
    const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis
    return function (quaternion, alpha, beta, gamma, orient) {
      euler.set(beta, alpha, -gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us
      quaternion.setFromEuler(euler); // orient the device 定位设备
      quaternion.multiply(q1); // camera looks out the back of the device, not the top 相机从设备的背面看，而不是顶部
      quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation 调整屏幕方向
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

  this.update = function () {

    if (scope.enabled === false) return;
    // 陀螺儀變化量
    window.addEventListener("deviceorientation", (event) => {

      // 移动设备水平放置时，绕X轴旋转的角度，数值为-180度到180度。
      if (event?.beta) {
        beta = Number(event?.beta.toFixed(1)) * speed_percent;
      }
      //  移动设备水平放置时，绕Y轴旋转的角度，数值为-90度到90度。
      if (event?.gamma) {
        gamma = Number(event?.gamma.toFixed(1)) * speed_percent;
      }
      // 移动设备水平放置时，绕z轴旋转的角度，数值为0度到360度。
      if (event?.alpha) {
        alpha = Number(event?.alpha.toFixed(1)) * speed_percent;
      }
      orient = scope.screenOrientation ? scope.screenOrientation : 0; // O
      document.getElementById("demo_x").innerHTML = `x = ${beta?.toFixed(1)}`;
      document.getElementById("demo_z").innerHTML = `z = ${alpha?.toFixed(1)}`;
      document.getElementById("demo_y").innerHTML = `y = ${gamma?.toFixed(1)}`;
      document.getElementById("demo_orient").innerHTML = `orient = ${orient?.toFixed(1)}`;
      scope.deviceOrientation = { alpha, beta, gamma };
      setObjectQuaternion(scope.object.quaternion, alpha, beta, gamma, orient);
    });
  };

  this.dispose = function () {
    scope.disconnect();
  };

};
DeviceOrientationControls.prototype = Object.assign(Object.create(THREE.EventDispatcher.prototype), {
  constructor: DeviceOrientationControls
});
export { DeviceOrientationControls };
