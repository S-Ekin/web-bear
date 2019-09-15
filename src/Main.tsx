/**
 * @name 公共组件接口
 * @description 暴露出所有的公共组件接口
 * @time 2019-09-15
 */
import * as React from "react";


type props={

};
type states={

};
interface IMain {

}
class Main extends React.PureComponent<props,states> implements IMain{


    state:states={

    };
    render(){
        const {} = this.props;

        return "Main";
    }
}


export default Main;