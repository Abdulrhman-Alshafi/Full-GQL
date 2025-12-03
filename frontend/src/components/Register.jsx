import { useMutation } from "@apollo/client/react";
import { REGISTER } from "../graphql/queries.js";

export default function Register() {
  const [register, { loading }] = useMutation(REGISTER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const password = formData.get("password");
    const confirm = formData.get("confirm");

    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }
    if (password !== confirm) {
      alert("Passwords don't match!");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      await register({
        variables: {
          input: { name, email, password },
        },
      });
      alert("Account created! Logging you in...");
      window.location.reload();
    } catch (err) {
      alert(err.message || "Registration failed. Try another email.");
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-indigo-700">
        Create Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          required
          className="w-full px-5 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          required
          className="w-full px-5 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          name="password"
          type="password"
          placeholder="Password (min 6 chars)"
          required
          minLength="6"
          className="w-full px-5 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          name="confirm"
          type="password"
          placeholder="Confirm Password"
          required
          className="w-full px-5 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-70 transition"
        >
          {loading ? "Creating Account..." : "Register Now"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        By registering, you agree to absolutely nothing (it's just a demo)
      </p>
    </div>
  );
}
