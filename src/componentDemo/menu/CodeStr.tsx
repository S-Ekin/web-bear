export const str1 =`//点击的回调函数
function clickCallBack(node:any){
//参数是菜单节点
    console.log(node);
}

// 默认选中 只是改变菜单的选中状态，不会做路由跳转，
//因为知道选那个肯定可以控制去跳转到对应的路由上，而不是在这个菜单组件内容操作

//要是想在不同的层级的组件改变菜单显示的节点，可以通过发布订阅模块
`;
