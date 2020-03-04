/**
 * @name 列表下拉框
 * @description description
 * @time 2020-02-27
 */
import * as React from "react";
import {Combobox} from '../index';
import CodeBlock from '../../../containers/codeBlock/CodeBlock';
import EditCode from '../../../containers/codeBlock/EditCode';
import './demo.scss';
type Props={

};
type States={

};
interface IDemo {

}

const data =  [
    {
        text:"1",
        id:1
    },
    {
        text:"2",
        id:2
    },{
        text:"3",
        id:3
    },{
        text:"4",
        id:4
    },{
        text:"5",
        id:5
    },
]


class Demo extends React.PureComponent<Props,States> implements IDemo{


    state:States={

    };
    clickBack(selecteArr:ComboSpace.Iselected[]){
        console.log(selecteArr);
        
    }
    render(){
        const {} = this.props;

        return (
            <div className="g-layout combo-page">
                <div className="g-layout-head">
                    列表下拉框
                </div>
                <div className="g-layout-article">
                    <div className="g-item-show">
                        <span> 下拉框：</span>
                        <Combobox data={data} field="first" clickCallback={this.clickBack}/>
                    </div>
                    <div className="g-item-show">
                        <CodeBlock >
                            {
                                ` function add(){}`
                            }
                        </CodeBlock>
                    </div>
                   
                </div>
            </div>
        );
    }
}


export default Demo;