// Signup Page Component
import { Link } from 'react-router-dom';
import SignupForm from '../../components/auth/SignupForm';
import { useState } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';

export default function Signup() {
    const [error, setError] = useState(null);

    return (
        <ErrorBoundary>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                    <div>
                        <img
                            className="mx-auto h-12 w-auto"
                            src="https://cdn-icons-png.flaticon.com/512/2991/2991471.png"
                            alt="Your Company"
                        />
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Create your account
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                Sign in
                            </Link>
                        </p>
                    </div>
                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    {/* Error icon */}
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.75 8.75a.75.75 0 00-1.5 0v4.5c0 .414.336.75.75.75h1.5a.75.75 0 000-1.5H8.75V8.75zM10 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        There was an error with your submission
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>{error}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <SignupForm setError={setError} />
                    {/* You can add social login buttons or other signup methods here */}
                    {/* Example: 
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                        </div>
                    </div> 
                    */}
                </div>
            </div>
        </ErrorBoundary>
    );
}