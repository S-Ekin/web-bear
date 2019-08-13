declare module "rc-easyui" {

    type columonItem = {
        align: string;
        colspan: number;
        editable: false;
        expander: false;
        field: string;
        filterOperators: any[];
        filterable: false;
        frozen: false;
        grid: any;
        onColumnAdd: any;
        onColumnRemove: any;
        order: "asc";
        render: any;
        rowspan: number;
        sortable: boolean;
        title: string;
        width: string;
        myBtnHandle?:(e:React.MouseEvent<HTMLButtonElement>)=>void;
        otherFiled?:string;
    }

    export interface  clickProps{
        row:any;
        column:{
            props:columonItem
        }
    }

    type treeGridProps = {


        style?:React.CSSProperties;
        data:any[]
        idField:string;
        treeField?:string;
        footerData?:any[];
        showFooter?: boolean;
        frozenAlign?: "left" | "center" | "right";
        frozenWidth?:string;
        onRowExpand?:(row:any)=>void;
        onCellClick?:(obj:clickProps)=>void;
        checkbox?:boolean;
        myBtnHandle?:(e:React.MouseEvent<HTMLButtonElement>)=>void;
        onCheckChange?:(sel:any[])=>void;
        onRowClick?(e:any):void;
        ref?:(ref:any)=>void;
    }

    interface treegridInterface {
        getCheckedRows(state?:string):void;
    }
    export class TreeGrid  extends React.Component<treeGridProps> implements treegridInterface {
        getCheckedRows:(state?:string)=>void;
    }

    type gridColumnProps={
        field:string;
        title:string;
        width?:string;
        align?:"center" | "left" | "right";
        colspan?: number;
        render?:(data:{value?:string | number,rowIndex?:number,row?:any})=>React.ReactNode;
        myBtnHandle?:(e:React.MouseEvent<HTMLButtonElement>)=>void;
        otherFiled?:string;
        frozen?:boolean;
    }

    export class  GridColumn extends React.Component<gridColumnProps> {
    }
   

    type gridColumnGroupProps={
        frozen?:boolean;
        width?:number|string;
    }
    export class GridColumnGroup  extends React.Component<gridColumnGroupProps>{

    }
    
    type gridHeaderRowProps ={

    }
    export class GridHeaderRow extends React.Component<gridHeaderRowProps>{

    }
    
    type dataGridProps = {

        style?:React.CSSProperties;
        data:any[]
        idField:string;
        frozenAlign?: "left" | "center" | "right";
        frozenWidth?:string;
        checkbox?:boolean;
        myBtnHandle?:(e:React.MouseEvent<HTMLButtonElement>)=>void;
        onCheckChange?:(sel:any[])=>void;
    }

   
    export class  DataGrid  extends React.Component<dataGridProps > {
    }
} 