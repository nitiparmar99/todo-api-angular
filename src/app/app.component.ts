import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TodoService } from './services/todo.service';
import { TodoFormComponent } from './components/todo-form.component';
import { TodoListComponent } from './components/todo-list.component';
import { Todo } from './models/todo.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TodoFormComponent, TodoListComponent],
  template: `
    <div class="app-shell">
      <h1>Todo list</h1>
      <app-todo-form (added)="loadTodos()"></app-todo-form>
      <div *ngIf="loading()" class="card" style="margin-top:16px; text-align:center;">Loading...</div>
      <div *ngIf="error()" class="card" style="margin-top:16px; color:#d32f2f;">{{ error() }}</div>
      <app-todo-list
        *ngIf="!loading() && !error()"
        [todos]="todos()"
        (remove)="deleteTodo($event)"
        (toggle)="toggleTodo($event)">
      </app-todo-list>
    </div>
  `
})
export class AppComponent implements OnInit {
  private todoService = inject(TodoService);
  todos = signal<Todo[]>([]);
  loading = signal(true);
  error = signal('');

  constructor() {}

  ngOnInit() {
    this.loadTodos();
  }

  async loadTodos() {
    this.loading.set(true);
    this.error.set('');

    try {
      this.todos.set(await this.todoService.getTodos());
    } catch {
      this.error.set('Unable to load todos.');
    } finally {
      this.loading.set(false);
    }
  }

  async deleteTodo(id: string) {
    this.loading.set(true);
    try {
      await this.todoService.deleteTodo(id);
      this.todos.set(this.todos().filter(item => item.id !== id));
    } catch {
      this.error.set('Could not delete todo.');
    } finally {
      this.loading.set(false);
    }
  }

  async toggleTodo(id: string) {
    try {
      await this.todoService.toggleComplete(id);
      this.todos.set(this.todos().map(item => item.id === id ? { ...item, isComplete: !item.isComplete } : item));
    } catch {
      this.error.set('Could not update todo.');
    }
  }
}
