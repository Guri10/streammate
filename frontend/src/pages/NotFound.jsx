import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Page not found</p>
      <Link
        to="/watchlist"
        className="text-blue-600 hover:underline text-sm"
      >
        ← Back to Watchlist
      </Link>
    </div>
  );
};

export default NotFound;
