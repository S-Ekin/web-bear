export const str1 = `
 // 本质上就是传入异步加载文件的方法 import("../"),因为这个路径得在使用得地方显示指定-才可以根据使用的地方以相对路径找到目标文件。
 // 然后返回一个 组件，这个组件是带路由参数的。然后直接在要异步加载的地方使用这个组件
`;
