import { useMutation } from "@apollo/client/react";
import { LOGIN } from "../graphql/queries.js";

export default function Login() {
  const [login, { loading }] = useMutation(LOGIN);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await login({
        variables: {
          input: {
            email: formData.get("email"),
            password: formData.get("password"),
          },
        },
      });
      window.location.reload();
    } catch (err) {
      alert("Wrong email or password!", err);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-indigo-700">
        Welcome Back
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full px-5 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full px-5 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-indigo-700 hover:to-purple-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
