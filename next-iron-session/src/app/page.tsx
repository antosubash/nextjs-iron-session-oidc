"use client";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button onClick={() => {
        location.href = '/auth/api';
      }}>
        Login
      </button>
    </main>
  );
}
