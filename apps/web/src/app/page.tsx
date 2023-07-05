"use client";

import useSWR from "swr";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export default function Web() {
  const { data, isLoading, error, mutate } = useSWR(`${API_HOST}/todo`, (url) =>
    fetch(url).then((res) => res.json())
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  function IntlConverter(date: Date) {
    return Intl.DateTimeFormat("bg").format(new Date(date));
  }

  async function UpdateObject(todo: Todo) {
    await fetch(`${API_HOST}/todo`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: todo.id,
        completed: !todo.completed,
      }),
    });
    mutate();
  }

  return (
    <div>
      <h1>Todo</h1>
      {data.map((todo: Todo) => (
        <div key={todo.id}>
          <h2>
            ID:{todo.id} {todo.title}
          </h2>
          <p>Completed: {todo.completed ? "Yes" : "No"}</p>
          <p>Created at: {IntlConverter(todo.createdAt)}</p>
          <p>Updated at: {IntlConverter(todo.updatedAt)}</p>
          <button onClick={() => UpdateObject(todo)}>Toggle</button>
        </div>
      ))}
    </div>
  );
}
