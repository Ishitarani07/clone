import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Logged in successfully');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-sm overflow-hidden">
        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-between w-2/5 bg-[#2874f0] p-8 text-white">
          <div>
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <p className="text-sm text-blue-100">
              Get access to your Orders, Wishlist and Recommendations
            </p>
          </div>
          <img
            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png"
            alt="Login"
            className="w-full"
          />
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border-b-2 border-gray-300 py-2 px-1 text-sm focus:outline-none focus:border-[#2874f0] transition"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border-b-2 border-gray-300 py-2 px-1 text-sm focus:outline-none focus:border-[#2874f0] transition"
              />
            </div>
            <p className="text-xs text-gray-500">
              By continuing, you agree to Flipkart's Terms of Use and Privacy Policy.
            </p>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#fb641b] text-white py-3 rounded-sm font-medium hover:bg-[#e85a19] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            <div className="text-center">
              <span className="text-sm text-gray-500">OR</span>
            </div>
            <Link
              to="/signup"
              className="block w-full text-center text-[#2874f0] py-3 rounded-sm font-medium border border-gray-300 hover:bg-gray-50 transition"
            >
              New to Flipkart? Create an account
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
