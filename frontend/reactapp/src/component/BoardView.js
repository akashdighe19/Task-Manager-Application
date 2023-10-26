import "./BoardView.css";
import { useState, useEffect, createContext } from "react";
import axios from "axios";
import BoardBox from "./BoardBox";
import { dragAndDrop } from "./ListView";

export const TasksContext = createContext();
export default function BoardViewPage(){
    const [completedTasks, setcompletedTasks] = useState();
    const [updateTasks , setupdateTasks] = useState(false);
    const [IncompletedTasks,setIncompletedTasks] = useState();
    const getTasks = async ()=>{
        const {data} = await axios.get("http://localhost:3002/api/tasks");
        if(data.success === true){
            const Incompleted =  
            data.data.filter(e=>e.completed === false)
            .map((e,i)=> {
                     return <BoardBox key={i} {...e}/>;
                
            });
            setIncompletedTasks([...Incompleted]);
            const completed =data.data.filter(e=>e.completed === true)
            .map((e,i)=> {
                     return <BoardBox key={i} {...e}/>;
            });
            setcompletedTasks([...completed]);            

        }
    };

    useEffect(()=>{
        dragAndDrop(document.querySelector("#board_view_completed"))
        dragAndDrop(document.querySelector("#board_view_Incompleted"))
    },[])
    useEffect(()=>{
        getTasks();
    },[updateTasks]);
    return (
        <>
       <TasksContext.Provider value={setupdateTasks}>
        <div id="board_view_container">
            <div className="tasks_board_container">
            <h2>Completed Tasks</h2>
            <div id="board_view_completed">
            {completedTasks}
            </div>
            </div>
            <div className="tasks_board_container">
            <h2>Incompleted Tasks</h2>
            <div id="board_view_Incompleted">
            {IncompletedTasks}
            </div>
            </div>
        </div>
        </TasksContext.Provider>
        </>
    )
}