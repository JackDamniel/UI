import { createLazyFileRoute } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import "../index.css";
import Button from "../Components/Buttons/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ToDoListProps {
  showForm: (taskData: TaskData) => void;
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
};

export const Route = createLazyFileRoute("/about")({
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

  return <div className="container my-5">{content}</div>;
}

function ToDoList(props: ToDoListProps) {
  const {
    data: ToDo,
    isLoading,
    isError,
  } = useQuery<TaskData[], Error>({
    queryKey: ["todos"],
    queryFn: () =>
      axios
        .get<TaskData[]>("http://localhost:3004/ToDo")
        .then((response) => response.data)
        .catch(() => {
          throw new Error("Unexpected error Response");
        }),
  });

  // Load completed tasks from local storage or initialize an empty array
  const initialCompletedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
  const [completedTasks, setCompletedTasks] = useState<number[]>(initialCompletedTasks);

  useEffect(() => {
    // Save completed tasks to local storage whenever it changes
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  function useDeleteTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, number>({
      mutationFn: async (taskId: number) => {
        await axios.delete(`http://localhost:3004/ToDo/${taskId}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
      },
    });
  }

  const deleteTaskMutation = useDeleteTaskMutation();

  function toggleCompletion(taskId: number) {
    const updatedCompletedTasks = completedTasks.includes(taskId)
      ? completedTasks.filter((id) => id !== taskId)
      : [...completedTasks, taskId];

    setCompletedTasks(updatedCompletedTasks);
  }

  function deleteTask(taskId: number) {
    deleteTaskMutation.mutate(taskId);
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
      <button
        onClick={() =>
          props.showForm({ id: 0, taskName: "", description: "", comment: "" })
        }
        type="button"
        className="btn btn-primary me-2"
      >
        Create
      </button>
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
                <Button type="edit" onClick={() => editTask(ToDoLis)} />
                <Button type="delete" onClick={() => deleteTask(ToDoLis.id)} />
                <Button
                  type="completion"
                  onClick={() => toggleCompletion(ToDoLis.id)}
                  completed={completedTasks.includes(ToDoLis.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function TaskForm(props: TaskFormProps & { task?: TaskData }) {
  const [taskData, setTaskData] = useState<TaskData>(
    props.task || { id: 0, taskName: '', description: '', comment: '' }
  );
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    setTaskData(props.task || { id: 0, taskName: '', description: '', comment: '' });
  }, [props.task]);

  const mutationOptions = {
    mutationFn: async (taskData: TaskData) => {
      const url = taskData.id
        ? `http://localhost:3004/ToDo/${taskData.id}`
        : 'http://localhost:3004/ToDo';
      const method = taskData.id ? 'PUT' : 'POST';
    
      const response = await axios({
        method: method,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: taskData,
      });
    
      if (!response.data) {
        throw new Error('No data received from server');
      }
    },
    onSuccess: () => {
      props.showList();
    },
    onError: (error: Error) => {
      console.error('Error', error);
      setErrorMessage('Error submitting the form. Please try again later.');
    },
  };
  
  const mutation = useMutation<void, Error, TaskData>(mutationOptions);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  
    const formData = new FormData(event.currentTarget);
    const updatedTaskData = Object.fromEntries(formData.entries());
  
    if (!updatedTaskData.taskName || !updatedTaskData.description) {
      setErrorMessage('Please provide all the required fields!');
      return;
    }
    
    const updatedData = { ...taskData, ...updatedTaskData };
  
    if (taskData.id) {
      mutation.mutate(updatedData); 
    } else {
      mutation.mutate(updatedTaskData as unknown as TaskData); 
    }
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
