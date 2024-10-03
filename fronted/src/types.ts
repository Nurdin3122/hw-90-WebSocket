export interface WsDraw {
    type:string;
    payload:Draw;
}

export interface Draw {
    payload:{
        x:number;
        y:number;
    }
}