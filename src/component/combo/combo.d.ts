declare namespace ComboSpace {

    export interface Iselected {
        id:string;
        text:string;
    }

    export interface IDrop {
        tree:{
             childField?:string;
             noSearch?:boolean;
             parAbleClick?:boolean;//文件夹也可以触发点击事件
        },
        list:{
            
        }
       
    }

    
   export type filedObj<P extends keyof IDrop> = {
        idField: string;
        textField: string;
        multiply?: boolean;
        itemIcon?: string;
        defaultVal?: string;
        field:string;
        clickOrCheckForbid:(node:IImmutalbeMap<any>,field:string)=>boolean;
    } & IDrop[P] ;

    export type drop<P extends keyof IDrop> = {
        filedObj: IImmutalbeMap<ComboSpace.filedObj<P>>;
	    initComboVal?:{id:string};
	    changeSelect(Iselected:IImmutalbeList<Iselected>,node?:IImmutalbeMap<any>):void;
	    initSelect(Iselected:IImmutalbeList<Iselected>):void;
        data:any[];
        selected:IImmutalbeList<Iselected>;
        dropStyle:{maxHeight:number};
        formatterDropItem?:(node:IImmutalbeMap<any>)=>React.ReactNode;
	    clickMethod:(clickFn:(path?:string)=>void)=>void;//暴露点击方法，用于清除所选
    };

    export interface ICheckboxCom {
        changeHandle: (e: React.ChangeEvent<HTMLInputElement>) => void;
        checked: boolean;
        value?: string;
        name?: string;
        hasChecked?: boolean;
        type?: "checkbox" | "radio";
        isControl?: boolean;
    }
      
}