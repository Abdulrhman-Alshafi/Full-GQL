export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-indigo-600">TaskFlow 2025</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6">{children}</main>
    </div>
  );
}
