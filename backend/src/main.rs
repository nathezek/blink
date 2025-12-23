use actix_cors::Cors;
use actix_web::{web, App, HttpResponse, HttpServer};
use std::sync::Mutex;

mod models;
use models::Todo;

struct AppState {
    todos: Mutex<Vec<Todo>>,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let state = web::Data::new(AppState {
        todos: Mutex::new(Vec::new()),
    });

    HttpServer::new(move || {
        App::new()
            .app_data(state.clone())
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header(),
            )
            .route("/api/todos", web::get().to(get_todos))
            .route("/api/todos", web::post().to(add_todo))
            .route("/api/todos/{id}", web::delete().to(delete_todo))
    })
    .bind(("127.0.0.1", 8000))?
    .run()
    .await
}

// ------------------------------------ HANDLERS ---------------------------------- //
async fn get_todos(data: web::Data<AppState>) -> HttpResponse {
    let todos = data.todos.lock().unwrap();
    HttpResponse::Ok().json(&*todos)
}

async fn add_todo(new_todo: web::Json<Todo>, data: web::Data<AppState>) -> HttpResponse {
    let mut todos = data.todos.lock().unwrap();
    let todo = new_todo.into_inner();
    todos.push(todo.clone());
    HttpResponse::Created().json(todo)
}

async fn delete_todo(path: web::Path<usize>, data: web::Data<AppState>) -> HttpResponse {
    let id = path.into_inner();

    let mut todos = data.todos.lock().unwrap();

    if let Some(pos) = todos.iter().position(|x| x.id == id) {
        todos.remove(pos);
        HttpResponse::Ok().finish()
    } else {
        HttpResponse::NotFound().finish()
    }
}
