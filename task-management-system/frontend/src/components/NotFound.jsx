import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagonIcon } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-cyan-50 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="mb-8 flex justify-center">
                    <div className="bg-gradient-to-br from-violet-100 to-cyan-100 rounded-full p-6 inline-block">
                        <AlertOctagonIcon 
                            className="h-20 w-20 text-violet-600" 
                            strokeWidth={1.5}
                        />
                    </div>
                </div>
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                    Page Not Found
                </h1>
                <p className="text-gray-600 mb-6">
                    Oops! The page you're looking for seems to have wandered off. 
                    Don't worry, we'll help you find your way back.
                </p>
                <div className="flex justify-center gap-4">
                    <Link 
                        to="/dashboard" 
                        className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-lg hover:from-violet-700 hover:to-cyan-700 transition-colors"
                    >
                        Go to Dashboard
                    </Link>
                    <Link 
                        to="/" 
                        className="px-6 py-3 border border-violet-600 text-violet-600 rounded-lg hover:bg-violet-50 transition-colors"
                    >
                        Return to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;