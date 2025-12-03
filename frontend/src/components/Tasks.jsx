import { useMutation, useQuery } from "@apollo/client/react";
import {
  GET_TASKS,
  CREATE_TASK,
  UPDATE_TASK,
  DELETE_TASK,
} from "../graphql/queries.js";

export default function Tasks({ user }) {
  const { data, loading, refetch } = useQuery(GET_TASKS);
  const [create] = useMutation(CREATE_TASK);
  const [update] = useMutation(UPDATE_TASK);
  const [remove] = useMutation(DELETE_TASK);

  const handleAdd = async (e) => {
    e.preventDefault();
    const title = e.target.title.value.trim();
    if (!title) return;
    await create({ variables: { input: { title } } });
    e.target.reset();
    refetch();
  };

  if (loading) return <p className="text-center text-xl">Loading tasks...</p>;

  if (!data) {
    return (
      <p className="text-center text-xl">
        Not authenticated or something went wrong.
      </p>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Welcome back, {user.name}!</h2>
        <button
          onClick={() => {
            document.cookie = "token=; Max-Age=0";
            window.location.reload();
          }}
          className="text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>

      {/* Always show the add task form */}
      <form onSubmit={handleAdd} className="flex gap-3 mb-8">
        <input
          name="title"
          placeholder="What needs to be done today?"
          required
          className="flex-1 px-5 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-indigo-700"
        >
          Add Task
        </button>
      </form>

      <div className="space-y-3">
        {data.tasks.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No tasks yet. Add one above!
          </p>
        ) : (
          data.tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-5 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() =>
                    update({
                      variables: {
                        id: task.id,
                        input: { completed: !task.completed },
                      },
                    }).then(refetch)
                  }
                  className="w-6 h-6 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span
                  className={`text-lg ${
                    task.completed
                      ? "line-through text-gray-500"
                      : "text-gray-800"
                  }`}
                >
                  {task.title}
                </span>
              </div>
              <button
                onClick={() =>
                  remove({ variables: { id: task.id } }).then(refetch)
                }
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
