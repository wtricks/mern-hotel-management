// src/pages/SignIn.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Card from './Wrapper';
import Button from '../../common/Button';

import { api } from '../../../api';
import { setUser } from '../../../store/slices/UserSlice';

const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error('Email is required');
            return
        }

        if (!password) {
            toast.error('Password is required');
            return
        }

        setLoading(true);
        api.post('/auth/login', { email, password })
            .then((res) => {
                localStorage.setItem('hm_token', res.data.data.token);
                navigate('/');
                dispatch(setUser(res.data.data.user));
            }).finally(() => setLoading(false));
    };

    return (
        <div className="flex items-center justify-center flex-1 h-[calc(100vh-12rem)] bg-gray-100">
            <Card title="Sign In">
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="p-2 border rounded mb-4"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="p-2 border rounded mb-4"
                        required
                    />
                    <Button type='submit' loading={loading}>
                        Sign In
                    </Button>
                </form>
                <p className="text-center mt-4">
                    Don't have an account? <Link to="/auth?v=signup" className="text-teal-500">Sign Up</Link>
                </p>
            </Card>
        </div>
    );
};

export default SignIn;
