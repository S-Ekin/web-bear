/**
 * @name 二叉树学习
 * @description description
 * @time 2019-10-23
 */
import * as React from "react";
import BinTree from "./BinTree";


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

const tree = new BinTree<{val:number;jk:number}>(data);
console.log(tree);

type Props={

};
type States={

};
interface IDemo {

}
class Demo extends React.PureComponent<Props,States> implements IDemo{


    state:States={

    };
    render(){
        const {} = this.props;

        return "Demo";
    }
}


export default Demo;