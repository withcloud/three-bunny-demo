## 需求
陀螺儀轉動熒幕（已實現）
加載兔子（已實現）
兔子有動畫（已實現）
按有聲音
背景聲音
兔兔能面轉向鏡面

## 點擊事件
创建three小教程：https://blog.csdn.net/u010080492/article/details/78854226
点击事件详细教程：https://www.jianshu.com/p/5ced65195566
世界坐标系和本地坐标系：https://blog.csdn.net/weixin_33910385/article/details/88853253

## 平面外方塊 threejs是右手坐标系
平面所有坐標集x,y匹配上之外的坐標及物體本身邊框的坐標

數學問題
一個點在圓圈內，一個點在圓圈外面
其它辦法或問下尚洪

本地坐标系（局部坐标系）：原点为模型位于世界坐标的位置。其他顶点以这个点为原点计算坐标。
世界坐标系：threejs中世界坐标单位为1 。这个1 没有实际的计量单位，如果想和物理世界里的计量单位关联可以等比进行计算。同时这个坐标长度也是无限的。（threejs是右手坐标系）
matrix（本地矩阵） 、matrixWorld（世界矩阵）

## 模型位置問題
obj模型确实是会有位置属性的bug，所以在以后我们的开发中避免使用obj模型来进行开发，选用web端效率最高的gltf模型。

最终提供的解决方案是转换模型文件的格式
第一种情形：在和建模师和合作时，不要让建模师提供obj格式的文件，obj模型还没有层级关系，要求建模师提供gltf或者fbx都可以。
第二种情形：我们自己在网站上下载的obj模型的处理方式，下载一个建模软件，比如blender，在blender中导入模型后选择模型，设置模型的原点，将模型的原点改到自己本身，在进行导出即可。

## Three.js加载gITF文件
```
加载模型：https://juejin.cn/post/7026220849942233096
资源占用时需要及时清除：https://blog.csdn.net/u014361280/article/details/124309410
从三个 JS 的场景中删除组类型 GLTF 对象:https://stackoverflow.com/questions/52026728/removing-group-type-gltf-object-from-the-scene-in-three-js
釋放內存：https://chowdera.com/2022/04/202204230516339358.html#
```

## 攝像機控件
四周控件效果：https://blog.csdn.net/qq_33635385/article/details/101721390
手機轉鏡頭：https://github.com/jacopocolo/device-orientation-locomotion-r3f

## 注意
陀螺儀，必须使用 https（手機中） 才能使deviceorientation事件正常进行
控制器只兼容含有陀螺仪的移动端

## 陀螺儀功能實現流程
html5的陀螺仪(手机旋转方式)：https://blog.csdn.net/qq_30100043/article/details/73323617
陀螺仪四参数描述：https://w3c.github.io/deviceorientation/spec-source-orientation.html#deviceorientation
陀螺仪水平查看：https://github.com/mrdoob/three.js/issues/9047
```
加入陀螺儀流程
允許手机訪問陀螺儀
获取陀螺仪坐标
时刻更新坐标
更新相机转动角度及偏移量
```

## 背景音樂及設置
three語音模塊：https://www.w3xue.com/jsjq/threejs/threejs_audio.html

## 鏡頭平移後保持方向
https://mlog.club/article/1223169

第一種(加密流暢)，stringArrayEncoding不能設置任何值
{
    compact: true,
    controlFlowFlattening: false,
    deadCodeInjection: false,
    debugProtection: false,
    debugProtectionInterval: 0,
    disableConsoleOutput: true,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: false,
    renameGlobals: false,
    selfDefending: true,
    simplify: true,
    splitStrings: false,
    stringArray: true,
    stringArrayCallsTransform: false,
    stringArrayEncoding: [],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 1,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 2,
    stringArrayWrappersType: 'variable',
    stringArrayThreshold: 0.75,
    unicodeEscapeSequence: false
}

第2種(加密流暢) ，stringArrayEncoding不能設置任何值

{
    compact: true,
    controlFlowFlattening: false,
    deadCodeInjection: false,
    debugProtection: false,
    debugProtectionInterval: 0,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: false,
    renameGlobals: false,
    selfDefending: false,
    simplify: true,
    splitStrings: false,
    stringArray: true,
    stringArrayCallsTransform: false,
    stringArrayCallsTransformThreshold: 0.5,
    stringArrayEncoding: [],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 1,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 2,
    stringArrayWrappersType: 'variable',
    stringArrayThreshold: 0.75,
    unicodeEscapeSequence: false
}

"optimizers": {
    "*.js": [
      "@parcel/optimizer-esbuild",
      "@rbf/parcel-optimizer-javascript-obfuscator"
     
    ]