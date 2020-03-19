/**
 * @name 二叉树学习
 * @description description
 * @time 2019-10-23
 */
import * as React from "react";
import BinTree from "../BinTree";
import CodeBlock from '@container/codeBlock/CodeBlock';

const data = [
    {val:1,jk:3},
    {val:2,jk:3},
    {val:3,jk:3},
    {val:4,jk:3},
    {val:5,jk:3},
    {val:6,jk:3},
    {val:7,jk:3},
    {val:8,jk:3},
    {val:9,jk:3},
    {val:10,jk:3},
    {val:11,jk:3},
    {val:12,jk:3},
];
type treeVal = {val:number;jk:number};
const tree = new BinTree<treeVal>(data);

console.log(tree);
let arrContainer:treeVal[] = [];
let arrContainer1:treeVal[] = [];
console.log(tree.preOrderTraversal(tree.root,arrContainer));
console.log(tree.inOrderTraversal(tree.root,arrContainer1));

type Props={

};
type States={

};

const str1 = `
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
}`;

class Demo extends React.PureComponent<Props,States> {
    state:States={

    };
    render(){
        const {} = this.props;

        return (
            <div className="g-layout">
                <div className="g-layout-head">
                    二叉树
                </div>
                <div className="g-layout-article">
                     <div className="g-item-show">
                        <CodeBlock tit='二叉树遍历'>
                            {str1}
                        </CodeBlock>
                    </div>
                </div>
            </div>
        );
    }
}
export default Demo;