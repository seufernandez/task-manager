import { useNavigate } from "react-router-dom";

export default function TaskListItem({id, taskName, completed}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/task/${id}`);
   };
   
   return (
    <div>
      <div
        onClick={handleClick}
        className="flex items-center w-full h-12 p-4 border-solid border-2 border-gray-200 bg-white rounded-md justify-between cursor-pointer"
      >
        <span className={completed ? "line-through" : ""}>{taskName}</span>
        <span>{completed ? "✅" : "⏳"}</span>
      </div>
    </div>
  );

}

