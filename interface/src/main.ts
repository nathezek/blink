import type { Todo } from "../types/todo.ts";
const BACKEND_BASE_URL = "http://127.0.0.1:8000";

const fetchData = async () => {
    const response = await fetch("http://localhost:8000/api/todos");

    if (!response.ok) {
        console.error("Failed to fetch todos");
        return;
    }

    const data: Todo[] = await response.json();
    renderData(data);
};

// -------------------------- CREATE A TASK ---------------------------- //
const createTask = async () => {
    let input = document.getElementById("task_input") as HTMLInputElement;
    if (!input.value.trim()) return;

    // we create a todo object
    const todo: Todo = {
        id: Date.now(),
        task: input.value,
        completed: false,
    };

    // post the todo to the backend api
    await fetch(`${BACKEND_BASE_URL}/api/todos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
    });

    // empty the input
    input.value = "";

    //refresh the list
    fetchData();
};

// -------------------------------- RENDER TODO LIST -------------------------------- //
const renderData = (data: Todo[]) => {
    const container = document.getElementById("data-container");
    if (!container) return;

    container.innerHTML = data
        .map(
            (todo) => `
                <div class="p-4 border-b border-gray-300">
                    <strong>#${todo.id}</strong> — ${todo.task}
                    ${todo.completed ? "✅" : "❌"}
                </div>
            `,
        )
        .join("");
};

// fetch the data using the button
document.getElementById("fetch-data")?.addEventListener("click", fetchData);

// create task witht the add task button
document.getElementById("add_task_btn")?.addEventListener("click", createTask);
