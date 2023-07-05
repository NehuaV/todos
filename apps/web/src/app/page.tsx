"use client";

import { FormEvent } from "react";
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

  function IntlConverter(date: Date): string {
    return Intl.DateTimeFormat("bg", {
      timeStyle: "medium",
      dateStyle: "short",
    }).format(new Date(date));
  }

  async function PostObject(e: FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    await fetch(`${API_HOST}/todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    mutate();
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

  async function DeleteObject(todo: Todo) {
    await fetch(`${API_HOST}/todo`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: todo.id,
      }),
    });
    mutate();
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
      }}
    >
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
            <button onClick={() => DeleteObject(todo)}>Delete</button>
          </div>
        ))}
      </div>
      <div>
        <h1>Submit Form</h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            PostObject(e);
          }}
        >
          <label htmlFor="title">Title</label>
          <input type="text" name="title" id="title" />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
