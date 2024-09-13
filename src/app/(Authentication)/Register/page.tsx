// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import zxcvbn from 'zxcvbn';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordScore, setPasswordScore] = useState<number>(0);
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If the password field is updated, evaluate its strength
    if (name === 'password') {
      const result = zxcvbn(value);
      setPasswordScore(result.score);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    const passwordResult = zxcvbn(form.password);
    if (passwordResult.score < 3) {
      newErrors.password = 'Password is too weak. Please choose a stronger password.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const res = await fetch(`${API}/Register`, {
      method: 'POST',
      body: JSON.stringify({
        name: form.name,
        username: form.username,
        password: form.password,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/Login');
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        {form.password && (
          <p>
            Password strength:{' '}
            {['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordScore]}
          </p>
        )}
        {errors.password && (
          <p style={{ color: 'red' }}>{errors.password}</p>
        )}
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />
        {errors.confirmPassword && (
          <p style={{ color: 'red' }}>{errors.confirmPassword}</p>
        )}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
