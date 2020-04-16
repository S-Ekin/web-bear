let hasErrorCrash = false;

const setError = (status?:boolean)=>{
    if(status!==undefined){
        hasErrorCrash = status ;
    }else{
        return hasErrorCrash ;
    }
};

export {
    setError
};