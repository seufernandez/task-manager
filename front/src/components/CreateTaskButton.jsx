
import { useNavigate } from "react-router-dom";

export default function CreateTaskButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/create-task`);
   };
  return (
    <div>
      <button onClick={handleClick}>
       Create Task
      </button>    
    </div>
  )
}

