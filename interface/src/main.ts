import type { Todo } from "../types/todo.ts";

const fetchData = async () => {
    const response = await fetch("http://localhost:8000/api/todos");

    if (!response.ok) {
        console.error("Failed to fetch todos");
        return;
    }

    const data: Todo[] = await response.json();
    renderData(data);
};

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

document.getElementById("fetch-data")?.addEventListener("click", fetchData);
