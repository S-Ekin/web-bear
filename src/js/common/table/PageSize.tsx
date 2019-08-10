import * as React from "react";
import Combobox  from "@js/common/combobox/index";

type pageSizePorps={
    curNum: number;//当前的页码
    jumpPage(size:string|number):void;//页码跳转
    pages:number;//总页数
    total:Number;//总条数
    changePageNum(pageNum:number):void; // 改变每页显示的条数
}

type pageSizeState={

}

const pageNumsArr = [

    {id:"1",text:"10"},
    {id:"2",text:"20"},
    {id:"3",text:"30"},
    {id:"4",text:"50"},
    {id:"5",text:"100"},
]

class PageSize extends React.PureComponent<pageSizePorps,pageSizeState>{

    pageCodeHandle = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.currentTarget!;
        if(target.classList.contains("active")){
            return ;
        }
        const num = target.dataset.num;
        this.props.jumpPage(num!);
    }
    curNumInpHandle=(e:React.ChangeEvent<HTMLInputElement>)=>{

        const {pages} = this.props;

        let val = e.currentTarget!.value.trim();

        val = +val < 1 ? "1" : +val>pages ? pages+"" :val;

        this.props.jumpPage(val);
    }

    firstPage() {
        const { pages, curNum } = this.props;
        const arr = Array.from({length:5},(...args)=>(args[1]+1));
        return (
        <React.Fragment>
            {arr.map(val=> (
                <span className={"m-page-num " + (val == curNum ? "active" : "")}
                        key={val}
                        data-num={val}
                        onClick={this.pageCodeHandle}
                >
                    {val}
                </span>
            ))}  
            <span>...</span>
            <span 
                className={"m-page-num " + (pages == curNum ? "active" : "")}
                data-num={pages}
                onClick={this.pageCodeHandle}
                >
                    {pages}
                </span>
        
        </React.Fragment>
        );
    }
    lastPage() {
        const { pages, curNum } = this.props;
        const arr = Array.from({length:5},(...args)=>(args[1]+1));
        return (
        <React.Fragment>
            <span
            className={"m-page-num " + (1 == curNum ? "active" : "")}
            data-num={1}
            onClick={this.pageCodeHandle}
            >
            {1}
            </span>
            <span>...</span>
            {arr.map(val => (
                <span
                    className={"m-page-num " + (pages - 5 +val == curNum ? "active" : "")}
                    data-num={pages-5+val}
                    onClick={this.pageCodeHandle}
                    key={pages-5+val}
                >

                    {pages - 5 + val }
                </span>
            ))}
        </React.Fragment>
        );
    }
    centerPage() {
        const {curNum, pages } = this.props;
        const arr = Array.from({length:5},(...args)=>(args[1]+1));
        return (
        <React.Fragment>
            <span

            className={"m-page-num " + (1 == curNum ? "active" : "")}
            data-num={1}
            onClick={this.pageCodeHandle}
            >
            {1}
            </span>
            <span>...</span>
            {arr.map(val => (
            <span
                data-num={curNum - 3 + val }
                onClick={this.pageCodeHandle}
                className={"m-page-num " + (curNum -3 +  val == curNum ? "active" : "")}
                key={curNum - 3 + val}
            >
                {curNum - 3 + val}
            </span>
            ))}

            <span>...</span>
            <span

            className={"m-page-num " + (pages == curNum ? "active" : "")}
            data-num={pages}
            onClick={this.pageCodeHandle}
            >
            {pages}
            </span>
        </React.Fragment>
        );
    }
    normalPage() {
        const { curNum, pages } = this.props;

        const arr = Array.from({length:pages},(...args)=>(args[1]+1));
        return arr.map(val => {
            return (
            <span
            className={"m-page-num " + (val == curNum ? "active" : "")}
            data-num={val}
            onClick={this.pageCodeHandle}
            key={val}
            >
                {val}
            </span>
            );
        });
    }

    controlBtnHandle=(e:React.MouseEvent<HTMLSpanElement>)=>{

        const type = e.currentTarget!.dataset.type;
        const {jumpPage,curNum,pages}=this.props;
        if(type=="pre"){
            jumpPage(Math.max(+curNum - 1, 1));
        }else{
            jumpPage(Math.min(+curNum + 1, pages));
        }
        
    }
    perNumComboClick=(selectedArr:any[])=>{

        this.props.changePageNum(+selectedArr[0].text);
    }
    render(){

        const {pages,curNum,total} = this.props;
        let navigatepageCom;

        if (pages < 11) {
            navigatepageCom = this.normalPage();
        } else if (curNum - 1 < 4) {
            navigatepageCom = this.firstPage();
        } else if (pages - curNum < 4) {
            navigatepageCom = this.lastPage();
        } else {
            navigatepageCom = this.centerPage();
        }

        return (
			<div className="g-pageCode">
                <div className="g-pageLeft">

                    <div className="m-page-total">
                        <span >共 {pages} 页</span>

                        <span>{total}条</span>
                       
                    </div>
                    <div style={{display:"flex",alignItems:"center"}}>
                       <span>每页显示：</span>
                      <Combobox 

                        field="pageNums"
                        data={pageNumsArr}
                        width={100} 
                        dirctionUp
                        clickCallback={this.perNumComboClick} 
                        defaultVal="2"
                    />  
                    <span>&nbsp;条</span>
                    </div>
                </div>
				
                <div className="g-pageRight">
                    
                     <div style={{ marginRight: "20px" }}>
                            <span >跳转到</span>
                            <input className="j-jump-page s-inp normal" value={curNum} type="number" min={1}  onChange={this.curNumInpHandle} />
                    </div>

                    <div className="m-code-number">
                        <span className="m-page-num"
                        data-type="pre"
                            onClick={this.controlBtnHandle}
                        ><i className="fa fa-chevron-left "></i></span>
                        <span>
                            {navigatepageCom}
                        </span>
                        <span className="m-page-num"
                            onClick={this.controlBtnHandle}
                            data-type="next"
                        ><i className="fa fa-chevron-right "></i></span>
                    </div>
                </div>
				

			</div>

		)
    }

}



export default PageSize;