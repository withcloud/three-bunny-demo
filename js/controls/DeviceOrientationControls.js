import * as THREE from 'three';
/**
 * @classdesc Device Orientation Control
 * @constructor
 * @external DeviceOrientationControls
 * @param {THREE.Object} object
 */
function DeviceOrientationControls(object) {
  const scope = this;
  this.object = object;//被控制的摄像机。
  this.object.rotation.reorder('YXZ');

  this.enabled = true;
  this.deviceOrientation = null;//当前 deviceorientation 事件的对象
  this.screenOrientation = 0;//相对于设备自然朝向的视口朝向，以角度表示（增量为90）。默认为0。
  this.alphaOffset = 100; // radians 角偏移量，以弧度表示，默认为0。
  this.initialOffset = null;
  var alpha = 0, beta = 0, gamma = 0, orient = 0;

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
    window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent(scope.getAlpha, scope.getBeta, 0), false);//手機執行

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
      alpha = device.alpha ? THREE.Math.degToRad(device.alpha) + scope.alphaOffset : 0; // Z
      $("#alpha").text(alpha)
      beta = device.beta ? THREE.Math.degToRad(device.beta) : 0; // X'
      $("#beta").text(beta)
      gamma = device.gamma ? THREE.Math.degToRad(device.gamma) : 0; // Y''
      $("#device").text(gamma)

      orient = scope.screenOrientation ? THREE.Math.degToRad(scope.screenOrientation) : 0; // O
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


// 手机可以连接陀螺仪
// 获取陀螺仪坐标
// 时刻更新坐标
// 更新相机转动角度及偏移量