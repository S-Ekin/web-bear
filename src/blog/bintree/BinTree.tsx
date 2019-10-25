/**
 * @name 二叉树构建
 * @description description
 * @time 2019-10-23
 */

 interface ITreeNode {
     val:any;
     left:ITreeNode | undefined;
     right:ITreeNode | undefined;
 }

interface IBinTree<T> {
    createTreeNode(val:T):ITreeNode;
}
class BinTree<T>  implements IBinTree<T>{
    root:ITreeNode | undefined;
    constructor(data:T[] ){
        this.createBinTree(data);
    }

    createBinTree(data:T[]){
        //把数组变为一维的 ITreeNodd[],
        //通过算法计算二叉树每个节点的索引与父级节点索引的关系，把一维的ITreeNode[]变成二叉树

        let nodeList:ITreeNode[] = [];
        data.forEach((val,listIndex) => {
            const treeNode = this.createTreeNode(val);
            nodeList.push(treeNode);
            if(listIndex !== 0){
             
                //当前节点所在的层级，层级的第一个节点索引，
                //父节点的层级，父层级的第一个节点的索引
                //找出父节点，把节点加到父节点的左树和右树

                const curLev = Math.floor(Math.sqrt(listIndex + 1));
                const curLevFirstIndex = Math.pow(2,curLev) -1;
                const parLevFirstIndex = Math.pow(2,curLev -1) -1 ;

                const parentNodeIndex = parLevFirstIndex + Math.floor( (listIndex - curLevFirstIndex)/2) ;
                const parentNode = nodeList[parentNodeIndex];

                //把当前节点与父节点做关联
                if(parentNode.left){
                    parentNode.right = treeNode;
                }else{
                    parentNode.left = treeNode;
                }

            }

        });

        this.root = nodeList.shift();
        nodeList.length = 0;

    }

    createTreeNode(val:T):ITreeNode{

        return {
            val,
            left:undefined,
            right:undefined,
        };
    }
    //中序遍历 左 - 节点 - 右
    inOrderTraversal(node:ITreeNode|undefined,arrContainer:T[]){

        if(node){
            this.inOrderTraversal(node.left,arrContainer);
            arrContainer.push(node.val);
            this.inOrderTraversal(node.right,arrContainer);
        }

        return arrContainer;
    }
    //先序遍历 节点 - 左 - 右
    preOrderTraversal(node:ITreeNode|undefined,arrContainer:T[]){

        if(node){
            arrContainer.push(node.val);
            this.preOrderTraversal(node.left,arrContainer);
            this.preOrderTraversal(node.right,arrContainer);
        }

        return arrContainer;
    }
}


export default BinTree;