import { useNavigate } from "react-router-dom";
import { api } from "../utils/axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";


export default function CreateTask() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({});
  
  async function CreateTask({title, description}) {
    try {
      await api.post(`/tasks`, {
        title,
        description,
        completed: false,
      });
      toast.success('Task created successfully!')

      navigate('/tasks')
    } catch (error) {
      toast.error('Failed to create task. Please try again.');
      console.error(error);
    }
  }
  
  return (
    <>
      <div className="w-full h-screen flex items-center justify-center p-4">
        <div className="flex flex-col w-2/4 min-w-72 p-4 border-solid border-2 border-neutral-200 rounded-md">
          <h1>New Task:</h1>
          <form onSubmit={handleSubmit(CreateTask)} className="align-middle text-center w-full px-3 py-4 mx-auto rounded">
            <input {...register('title')} type="text" placeholder="Title" className="block w-full mx-auto text-sm py-2 px-3 rounded my-3 bg-neutral-200" />
            <textarea {...register('description')} type="text" placeholder="Description" className="block w-full mx-auto text-sm py-2 px-3 rounded my-3 bg-neutral-200" />
            <button className="text-slate-600 font-bold py-2 px-4 rounded border block mx-auto w-full hover:bg-neutral-100 transition-all" type="submit">
              Create Task
            </button>
          </form>
        </div>    
      </div>    
    </>
  )
}