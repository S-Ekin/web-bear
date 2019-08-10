


interface Window{
	__REDUX_DEVTOOLS_EXTENSION__:any;
    hex_md5:(s:string)=>string;
    getSession(key:"getPath"|"getUser"|"hospitalName"):any;
   
    sys_defaultTime:{
        time:string,
        rotate:number,
    }
}


interface NodeModule {
        hot : {
            accept(path?: string, callback?: () => void): void
        }
    }





 


 