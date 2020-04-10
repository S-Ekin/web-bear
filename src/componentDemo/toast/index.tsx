/**
 * @name name
 * @description description
 * @time 2020-02-19
 */
import * as React from "react";
import {Button} from "@component/button/index";
import notice from "@component/toast/index";

type Props={

};
type States={

};
interface IIndex {

}
class Demo extends React.PureComponent<Props,States> implements IIndex{


    state:States={

    };

    openToast=(e:React.MouseEvent<HTMLButtonElement>)=>{
        const dom = e.currentTarget!;
        const type = dom.value as 'error';

        notice.add('toast',type);
    }
    render(){
        const {} = this.props;

        return (
           <div className="g-layout loading-box">
            <div className="g-layout-head">
              <h3>toast</h3>
            </div>
            <div className="g-layout-article">
              <div className="g-item-show">
                <p className="title">通过组件，指定容器的加载</p>
              </div>
              <div className="g-item-show">
                <div className="btn-box">
                  <Button val="error"  handle={this.openToast} colorType="danger">
                    错误
                  </Button>
                 
                </div>
              </div>
            </div>
          </div>
       
        )
    }
}


export default Demo;