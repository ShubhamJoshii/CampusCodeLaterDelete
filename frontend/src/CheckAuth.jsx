import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import Loading from './pages/Loading';

// 1. Helper function to keep logic consistent
export const checkAuth = (user) => {
  return !!(user?.email && user?._id && user?.firstName);
};

export const RedirectIfAuthenticated = ({ children }) => {
  const { user, status } = useSelector((state) => state.user);

  if (checkAuth(user)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export const RedirectIfNotAuthenticated = ({ children }) => {
  const { user, status } = useSelector((state) => state.user);

  // if (status === 'loading') return null;

  if (!checkAuth(user)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export const RestrictUser = ({ text = "dashboard", style, children }) => {
  const { user, status } = useSelector((state) => state.user);
  const navigate = useNavigate();
  if (status == "loading") {
    return <Loading style="flex-1 !h-[100%] bg-white" />
  }
  if (!checkAuth(user)) {
    return (
      <div className={`absolute z-100 w-full flex flex-col items-center justify-center bg-gray-100 p-4 ${style}`}>
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-sm">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m11-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">{text}.</p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  return children
};
