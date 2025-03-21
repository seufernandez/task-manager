
import { useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import TaskList from '../components/TaskList';
import { LogoutButton } from '../components/LogoutButton';
import CreateTaskButton from '../components/CreateTaskButton';
import { useNavigate } from 'react-router-dom';

export default function Tasks() {
  const { username, getUser,isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(()=> {
    getUser()
  }, [])
  const {  } = useUser();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <>
      <div className="container w-1/2 max-w-1/2 min-w-72 align-middle mx-auto py-12 my-auto space-y-4">
        <LogoutButton/>
        <h1>Hello there,  <strong>{username}</strong>!</h1>
        <CreateTaskButton />
        <h2 className='text-sm'>Your tasks:</h2>
        <TaskList/>  
      </div>    
    </>
    )
}

