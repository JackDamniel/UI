import React, { useEffect, useState } from "react";
import './file.css';

    interface ToDoListProps {
    showForm: (taskData: any) => void; 
  }
  
  interface TaskFormProps {
    showList: () => void;
  }
  interface TaskData {
    id: number;
    taskName: string;
    description: string;
    comment: string;
  }

  export function ToDo() {
    const [content, setContent] = useState(<ToDoList showForm={showForm} />);
    const [selectedTask, setSelectedTask] = useState<TaskData | null>(null); 

    function showList() {
        setContent(<ToDoList showForm={showForm} />);
        setSelectedTask(null); 
    }

    function showForm(taskData: TaskData) {
        setContent(<TaskForm task={taskData} showList={showList} />);
        setSelectedTask(taskData);
    }

    return (
        <div className="container my-5">
            {content}
        </div>
    );
}

function ToDoList(props: ToDoListProps) {
    const [ToDo, setToDo] = useState<TaskData[]>([]);
    const [completedTasks, setCompletedTasks] = useState<number[]>([]);

    function fetchToDo() {
        fetch("http://localhost:3004/ToDo")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Unexpected error Response");
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setToDo(data);
            })
            .catch((error) => console.log("Error", error));
    }

    useEffect(() => {
        fetchToDo();
    }, []);

    function deleteTask(taskId: number) {
        fetch(`http://localhost:3004/ToDo/${taskId}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete task");
                }
                return response.json();
            })
            .then(() => {
                fetchToDo();
            })
            .catch((error) => console.error("Error deleting task:", error));
    }
    function editTask(task: TaskData) {
        props.showForm(task);
    }

    function toggleCompletion(taskId: number) {
        const updatedCompletedTasks = completedTasks.includes(taskId)
            ? completedTasks.filter((id) => id !== taskId)
            : [...completedTasks, taskId];
        setCompletedTasks(updatedCompletedTasks);
    }

    return (
        <>
            <h2 className="text-center mb-3">List of Tasks</h2>
            <button onClick={props.showForm} type="button" className="btn btn-primary me-2">Create</button>
            <button onClick={fetchToDo} type="button" className="btn btn-outline-primary me-2">Refresh</button>

            <table className="table">
                <thead>
                    <tr>
                        <th>Task Name</th>
                        <th>Description</th>
                        <th>Comment</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {ToDo.map((ToDoLis, index) => (
                        <tr key={index}>
                            <td>{ToDoLis.taskName}</td>
                            <td>{ToDoLis.description}</td>
                            <td>{ToDoLis.comment}</td>
                            <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                                <button onClick={() => editTask(ToDoLis)} type="button" className="btn btn-primary btn-sm me-2">
                                    Edit Task
                                </button>
                                <button onClick={() => deleteTask(ToDoLis.id)} type="button" className="btn btn-danger btn-sm me-2">
                                    Delete Task
                                </button>
                                <button
                                    onClick={() => toggleCompletion(ToDoLis.id)}
                                    type="button"
                                    className={`btn btn-success btn-sm me-2 ${completedTasks.includes(ToDoLis.id) ? 'completed' : ''}`}
                                >
                                    Mark as Completed
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

function TaskForm(props: TaskFormProps & { task?: any }) {
    const [taskData, setTaskData] = useState(props.task || {});
    const [errorMessage, setErrorMessage] = useState(""); 

    useEffect(() => {
        setTaskData(props.task || {});
    }, [props.task]);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const product = Object.fromEntries(formData.entries());

        if (!product.taskName || !product.description) {
            setErrorMessage("Please provide all the required fields!");
            return;
        }

        const url = props.task && props.task.id ? `http://localhost:3004/ToDo/${props.task.id}` : "http://localhost:3004/ToDo";

        const method = props.task && props.task.id ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not OK");
                }
                return response.json();
            })
            .then((data) => props.showList())
            .catch((error) => {
                console.error("Error", error);
            })
            .finally(() => {
                setErrorMessage("");
            });
    }

    return (
        <>
            <h2 className="text-center mb-3">{props.task ? "Edit Task" : "Create a new Task"}</h2>
            <button onClick={props.showList} type="button" className="btn btn-secondary me-2">Cancel</button>
            <div className="row">
                <div className="col-lg-6 mx-auto">
                    {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div>
                    )}
                    <form onSubmit={(event) => handleSubmit(event)}>
                        <div className="mb-3">
                            <label htmlFor="taskName" className="form-label">Task Name</label>
                            <input type="text" className="form-control" id="taskName" name="taskName" defaultValue={taskData.taskName} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea className="form-control" id="description" name="description" rows={3} defaultValue={taskData.description}></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="comment" className="form-label">Comment</label>
                            <input type="text" className="form-control" id="comment" name="comment" defaultValue={taskData.comment} />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </>
    );
}