import { useQuery } from "@apollo/client/react";
import { GET_ME } from "./graphql/queries.js";
import Login from "./components/Login.jsx";
import Tasks from "./components/Tasks.jsx";
import Layout from "./components/Layout.jsx";
import { useState } from "react";
import Register from "./components/Register.jsx";

export default function App() {
  const { data, loading } = useQuery(GET_ME);
  const [isRegister, setIsRegister] = useState(false);

  if (loading) {
    return (
      <Layout>
        <div className="text-center mt-32 text-2xl">Loading...</div>
      </Layout>
    );
  }

  const user = data?.me;

  if (user) {
    return (
      <Layout>
        <Tasks user={user} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        {isRegister ? <Register /> : <Login />}

        <div className="text-center mt-8">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-indigo-600 hover:underline font-medium"
          >
            {isRegister
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </Layout>
  );
}
