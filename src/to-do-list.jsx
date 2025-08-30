import React,{useState} from "react"
function Todolist(){
    const [task,setTask] = useState(["learn react","complete django projects","learn how to use github"]);
    const [newTask,setNewTask] = useState("");
    function deletelist(index){
        const updated  = task.filter((_,i) => i !==index);
        setTask(updated)


    }
    function addTask(){
        if(newTask.trim() !== ""){
            setTask(t => [...t,newTask]);
            setNewTask("")
        }
    }
    function handleMoveTaskUp(index){
        if(index > 0){
            const updatedtask = [...task];
            [updatedtask[index],updatedtask[index-1]] = [updatedtask[index-1],updatedtask[index]]
            setTask(updatedtask);
        }
        setTask(...t)


    }
    function handleMoveTaskDown(index){
        if(index <task.length -1 ){
            const updatedtask = [...task];
            [updatedtask[index],updatedtask[index+1]] = [updatedtask[index+1],updatedtask[index]]
            setTask(updatedtask);
        }
        setTask(...t)


    }
    function handleAddTask(e){
          setNewTask(e.target.value)
    }
    
 return(
    <>
    {/* onChange={addTask}<button onclick={deletelist}>Delete</button> */}
    <div className="">
        <div>
           <input type="text" placeholder="please enter your task"  value={newTask} onChange={handleAddTask}/>
           <button onClick={addTask}>Add Task</button>
        </div>
        <div>
        <ol>
           {task.map((t,index)=>  <li  key={index}>   {t} 
            <button key={index} onClick={()=>deletelist(index)}>Delete</button> 
            <button key={index} onClick={()=>handleMoveTaskUp(index)}>up</button> 
            <button key={index} onClick={()=>handleMoveTaskDown(index)}>down</button> 
             </li>  ) }
        </ol>

        </div>

    </div>
       
    </>
 )
}
export default Todolist