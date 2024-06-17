export interface errorLogsProps {
  status: number;
  location: string;
  
  message: {
    title : string;
    content : string;
    data : any
  }
  
}

export const errorLogs = (props : errorLogsProps) => {

}