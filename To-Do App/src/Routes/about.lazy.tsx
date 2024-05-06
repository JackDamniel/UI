import { createLazyFileRoute } from '@tanstack/react-router'
import React, { useEffect, useState } from "react";
import '../Components/file.css';
import EditButton from "../Components/Buttons/EditButton";
import DeleteButton from "../Components/Buttons/DeleteButton";
import CompletionButton from "../Components/Buttons/CompletionButton";
import { useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';


interface ToDoListProps {
  showForm: (taskData: TaskData) => void; // Update type to TaskData
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
export type Error = {
    message: string;
}

export const Route = createLazyFileRoute('/ToDo')({
  component: ToDo,
});

function ToDo() {
  const [content, setContent] = useState(<ToDoList showForm={showForm} />);
  const [, setSelectedTask] = useState<TaskData | null>(null);

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
    const { data: ToDo, isLoading, isError } = useQuery<TaskData[], Error>({
        queryKey: ['todos'], 
        queryFn: () =>
          fetch("http://localhost:3004/ToDo")
            .then((response) => {
              if (!response.ok) {
                throw new Error("Unexpected error Response");
              }
              return response.json();
            })
      });
      const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  function toggleCompletion(taskId: number) {
    const updatedCompletedTasks = completedTasks.includes(taskId)
        ? completedTasks.filter((id) => id !== taskId)
        : [...completedTasks, taskId];
    setCompletedTasks(updatedCompletedTasks);
  }

 
  const queryClient = useQueryClient(); 

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
        // Refresh the task list after deletion
        queryClient.invalidateQueries('todos');
    })
    .catch((error) => console.error("Error deleting task:", error));
  }

  function editTask(task: TaskData) {
    props.showForm(task);
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;
  if (!ToDo) return <div>No tasks found</div>;
  
  return (
    <>
      <h2 className="text-center mb-3">List of Tasks</h2>
      <button onClick={() => props.showForm({ id: 0, taskName: '', description: '', comment: '' })} type="button" className="btn btn-primary me-2">Create</button>

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
                <EditButton onClick={() => editTask(ToDoLis)} />
                <DeleteButton onClick={() => deleteTask(ToDoLis.id)} />
                <CompletionButton onClick={() => toggleCompletion(ToDoLis.id)} completed={completedTasks.includes(ToDoLis.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function TaskForm(props: TaskFormProps & { task?: TaskData }) {
  const [taskData, setTaskData] = useState<TaskData>(props.task || { id: 0, taskName: '', description: '', comment: '' });
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    setTaskData(props.task || { id: 0, taskName: '', description: '', comment: '' });
  }, [props.task]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const product = Object.fromEntries(formData.entries());

    if (!product.taskName || !product.description) {
      setErrorMessage("Please provide all the required fields!");
      return;
    } else {
      setErrorMessage(""); // Clear error message if fields are provided
    }

    const url = taskData.id ? `http://localhost:3004/ToDo/${taskData.id}` : "http://localhost:3004/ToDo";
    const method = taskData.id ? "PUT" : "POST";

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
      .then(() => props.showList())
      .catch((error) => {
        console.error("Error", error);
        setErrorMessage("Error submitting the form. Please try again later.");
      });
  }

  return (
    <>
      <h2 className="text-center mb-3">{props.task ? "Edit Task" : "Create a new Task"}</h2>
      <button onClick={props.showList} type="button" className="btn btn-secondary me-2">Cancel</button>
      {errorMessage && (
        <div className="alert alert-info" role="alert">
          {errorMessage}
        </div>
      )}
      <div className="row">
        <div className="col-lg-6 mx-auto">
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