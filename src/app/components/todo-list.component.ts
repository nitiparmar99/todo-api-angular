import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Todo } from '../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="card">
      <h2>Your todos</h2>

      <ng-container *ngIf="todos.length; else emptyState">
        <div *ngFor="let todo of todos" [class.completed]="todo.isComplete" class="todo-item">
          <div>
            <label>
              <input type="checkbox" [checked]="todo.isComplete" (change)="toggle.emit(todo.id)" />
              <strong>{{ todo.title }}</strong>
            </label>
            <div class="description" *ngIf="todo.description" [innerHTML]="getSafeHtml(todo.description)"></div>
            <p class="meta">Created {{ todo.createdAt | date:'medium' }}</p>
          </div>
          <button class="delete" type="button" (click)="remove.emit(todo.id)">Delete</button>
        </div>
      </ng-container>

      <ng-template #emptyState>
        <p>No todos yet. Add one to get started.</p>
      </ng-template>
    </section>
  `
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];
  @Output() remove = new EventEmitter<string>();
  @Output() toggle = new EventEmitter<string>();

  constructor(private sanitizer: DomSanitizer) {}

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

