import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const schema = z.object({
  username: z.string(),
  password: z.string().min(5),
});

export default function Login() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useUser();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/tasks');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch('https://thequoteshub.com/api/');
        const data = await response.json();
        setQuote(data.text);
        setAuthor(data.author);
      } catch (error) {
        console.error('Error fetching quote:', error);
      }
    };
    fetchQuote();
  }, []);

  const onSubmit = async (data) => {
    try {
      await login(data.username, data.password);
      navigate('/tasks');
    } catch (error) {
    }
  };

  return (
    <>
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-3/4 min-w-72 bg-white border-none p-4 text-center">
        {quote && <p className="text-sm italic">"{quote}" {author && `- ${author}`}</p>}
      </div>

      <div className="flex h-screen w-full align-middle">
        <div className="my-auto align-middle min-w-72 text-center w-1/3 px-3 py-4 mx-auto rounded">
            <h1 className="text-xl font-bold mb-4">Task Manager</h1>
            <p className="text-sm mb-4">Please enter your credentials to access your tasks</p>

          <form onSubmit={handleSubmit(onSubmit)} className="">
            <input {...register('username')} type="text" placeholder="Username" className="w-full mx-auto text-sm py-2 px-3 rounded bg-neutral-200" />
            {errors.username && <span className="text-red-600 text-sm">{errors.username.message}</span>}
            <input {...register('password')} type="password" placeholder="Password" className="w-full mx-auto text-sm py-2 px-3 rounded my-3 bg-neutral-200" />
            {errors.password && <span className="text-red-600 text-sm">{errors.password.message}</span>}

            <button className="text-slate-600 font-bold py-2 px-4 rounded border block mx-auto w-full hover:bg-neutral-100 transition-all" type="submit">
              Login
            </button>
          </form>
          <p className="text-sm mt-4">Don't have an account? <Link to="/register" className="text-blue-500">Register</Link></p>
        </div>
      </div>
    </>
  );
}