import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/axios';
import toast from 'react-hot-toast';

const schema = z.object({
  username: z.string().min(3),
  password: z.string().min(5),
  confirmPassword: z.string().min(5),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await api.post('/users/register', {
        username: data.username,
        password: data.password,
      });
      toast.success('User registered successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('Error on registration');
    }
  };

  return (
    <div className="flex h-screen w-full align-middle">
      <form onSubmit={handleSubmit(onSubmit)} className="my-auto min-w-72 align-middle text-center w-1/3 px-3 py-4 mx-auto rounded space-y-3">
        <h1 className="text-xl font-bold mb-4">Task Manager - Register</h1>
        <p className="text-sm mb-4">Create an account to manage your tasks</p>

        <input {...register('username')} type="text" placeholder="Username" className="w-full mx-auto text-sm py-2 px-3 rounded bg-neutral-200" />
        {errors.username && <span className='text-red-600 text-sm'>{errors.username.message}</span>}

        <input {...register('password')} type="password" placeholder="Password" className="w-full mx-auto text-sm py-2 px-3 rounded bg-neutral-200" />
        {errors.password && <span className='text-red-600 text-sm'>{errors.password.message}</span>}

        <input {...register('confirmPassword')} type="password" placeholder="Confirm Password" className="w-full mx-auto text-sm py-2 px-3 rounded bg-neutral-200" />
        {errors.confirmPassword && <span className='text-red-600 text-sm'>{errors.confirmPassword.message}</span>}

        <button className="text-slate-600 font-bold py-2 px-4 rounded border block mx-auto w-full hover:bg-neutral-100 transition-all" type="submit">
          Register
        </button>
        <p className="text-sm mt-4">Already have an account? <Link to="/" className="text-blue-500">Login</Link></p>
      </form>
    </div>
  );
}