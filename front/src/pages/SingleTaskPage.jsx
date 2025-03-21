import  { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../utils/axios";
import toast from "react-hot-toast";

export default function SingleTaskPage() {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedCompleted, setEditedCompleted] = useState(false);
  const [getTaskError, setGetTaskError] = useState(false);
  
  const { id } = useParams();

  const navigate = useNavigate();

  async function getTask() {
    try {
      setLoading(true);
      const response = await api.get(`/tasks/${id}`);
      setTask(response.data);
    } catch (error) {
      console.error(error);
      setGetTaskError(true)
    } finally {
      setLoading(false);

    }
  }

  useEffect(() => {
    getTask();
  }, []);

  const formatLocalDate = (utcDateString) => {
    const utcDate = new Date(utcDateString);
    const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
    return localDate.toLocaleString("pt-BR");
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedCompleted(task.completed);
  };

  const handleDeleteClick = async () => {
    try {
      setLoading(true);
      await api.delete(`/tasks/${id}`); 
      toast.success('Task deleted successfully')
    } catch (error) {
      console.error(error);
    } finally {
       navigate('/tasks')
    }
  };

  const handleSaveClick = async () => {
    try {
      setLoading(true);
      await api.put(`/tasks/${id}`, {
        title: editedTitle,
        description: editedDescription,
        completed: editedCompleted,
      });
      setTask({
        ...task,
        title: editedTitle,
        description: editedDescription,
        completed: editedCompleted,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsEditing(false);
      getTask();
    }
  };

  if (getTaskError){
    return (
      <h1>Task not found :(</h1>
    )
  }

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="w-full h-screen flex items-center justify-center p-4">
          <div className="flex flex-col w-2/4 min-w-72 p-4 border-solid border-2 border-neutral-200 rounded-md">
            <button className="w-44 mb-4 m-0 " onClick={() => navigate('/tasks')}> ◀️Back to board</button>
            <div className="flex flex-col w-full p-4 border-solid rounded-md">
              {isEditing ? (
                <>
                    <strong>Title:</strong>{" "}
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="block w-full mx-auto text-sm py-2 px-3 rounded my-3 bg-neutral-200"
                      />
                    <strong>Description:</strong>{" "}
                    <textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="block w-full mx-auto text-sm py-2 px-3 rounded my-3 bg-neutral-200"
                      />
                      <div className=" align-middle h-24 w-full" >
                        <strong>Completed:</strong>{" "}
                        <input
                          type="checkbox"
                          checked={editedCompleted}
                          onChange={(e) => setEditedCompleted(e.target.checked)}
                          className="self-start text-sm align-middlepy-2 rounded my-3 mx-4"   
                        />
                      </div>
                  <button onClick={handleSaveClick}>Save</button>
                </>
              ) : (
                <>
                  <div className="mb-2">
                    <strong>Title:</strong> {task.title}
                  </div> 
                  <div className="mb-2">
                    <strong>Description:</strong> {task.description}
                  </div>
                  <div className="mb-2">
                    <strong>Completed:</strong> {task.completed ? "✅" : "⏳"}
                  </div>
                  <div className="mb-2">
                    <strong>Created At:</strong> {formatLocalDate(task.createdAt)}
                  </div>
                  <div className="mb-2">
                    <strong>Updated At:</strong> {formatLocalDate(task.updatedAt)}
                  </div>
                  <div className="space-y-2 mt-4">
                    <button onClick={handleEditClick}>Edit</button>
                    <button onClick={handleDeleteClick} className="hover:bg-red-400">Delete</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
