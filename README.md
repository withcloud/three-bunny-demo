## 步骤
1. 自己找教學 html + three.js 裡面有三個立方體
2. 看看其他人，起碼找多兩個，，，按 object 是不是真的他們也是這樣做
3. 把三個立方體按了會有 alert 出來
4. 把 html 放到 github 給我

注意：不動的。三個一模一樣長寬高的

1. 我要三個 cube 出現在隨機三個位置,  隨機的 x, 隨機的 y,隨機的 z

2. 按完其中一個後，，，他會消失 

3. 當三個都消失時。 又會出現新的三個出現在三個隨機位置

4. 再按他們，，，又會消失

5. 不斷重複

中間畫一個平面圓圈。我要消失重現的地方要在圓圈外面

1. 圓要大一點
2. 那些 cube 改為 gtlf 模型 自己找找 gtlf 例子就知道

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
加载模型：https://juejin.cn/post/7026220849942233096
资源占用时需要及时清除：https://blog.csdn.net/u014361280/article/details/124309410
从三个 JS 的场景中删除组类型 GLTF 对象:https://stackoverflow.com/questions/52026728/removing-group-type-gltf-object-from-the-scene-in-three-js
釋放內存：https://chowdera.com/2022/04/202204230516339358.html#