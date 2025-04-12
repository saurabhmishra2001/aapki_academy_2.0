import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { auth } from '../../utils/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '../../components/common/Button';

export default function Login() {
  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      // Redirect or update user state on successful login
      console.log('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      setFieldError('general', 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Sign in to your account</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, errors }) => (
            <Form className="space-y-6">
              {errors.general && <div className="text-red-500">{errors.general}</div>}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <Field type="email" name="email" id="email" className="mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                <ErrorMessage name="email" component="p" className="text-red-500 text-xs mt-1" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <Field type="password" name="password" id="password" className="mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                <ErrorMessage name="password" component="p" className="text-red-500 text-xs mt-1" />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? 'Signing in...' : 'Sign in'}</Button>
            </Form>
          )}
        </Formik>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</Link>
        </p>
      </div>
    </div>
  );
}