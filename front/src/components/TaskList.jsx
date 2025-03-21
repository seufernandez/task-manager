import { useEffect, useState } from "react";
import TaskListItem from "./TaskListItem"
import { api } from "../utils/axios";

export default function TaskList() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  async function getTasks() {
    try {
      setLoading(true);
      const response = await api.get(`/tasks`);
      setTasks(response.data || []);
    } catch (error) {
      console.error(error);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <>
      {loading ? (
        <div className="text-center mt-8">
          Loading...
        </div>
      ) : error ? (
        <div className="text-center mt-8 text-red-500">
          {error}
        </div>
      ) : (
        <div className="container h-auto align-middle text-center mx-auto my-4 p-2 rounded-md space-y-2 bg-gray-200">
          {tasks.length === 0 && <p>No tasks found...</p>}
          {tasks.map(({id, title, completed}) => (
            <TaskListItem key={id} id={id} taskName={title} completed={completed} />
          ))}
        </div>
      )}
    </>
  )
}