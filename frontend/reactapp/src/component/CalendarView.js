
import "./CalendarView.css"
import Calendar from "./Calendar";
import CalendarTaskRow from "./CalendarTaskRow";
import { useEffect, useState } from "react";
import axios from "axios";


export default function CalendarView (){
    const [date,setDate] = useState();
    const [incompletedTasks,setincompletedTasks] = useState();
    const [completedTasks,setcompletedTasks] = useState();
    const getTasks = async ()=>{
        if(date){

        const {data} = await axios.get(`http://localhost:3002/api/tasks/date/${date}`);
        if(data.success === true){
            const incompleted =  
            data.data.filter(e=>e.completed === false)
            .map((e,i)=> {
                     return <CalendarTaskRow key={i} {...e}/>;
                
            });
            setincompletedTasks([...incompleted]);
            const completed =data.data.filter(e=>e.completed === true)
            .map((e,i)=> {
                     return <CalendarTaskRow key={i} {...e}/>;
            });
            setcompletedTasks([...completed]);            

        }
    }

    };
        useEffect(()=>{
            getTasks();
        },[date])
    return (
        <div id="calendar_view_container">
        <Calendar dateState={setDate} />
        <div id="calendar_tasks_container">
            {completedTasks}
            {incompletedTasks}
        </div>
        </div>
    )
}