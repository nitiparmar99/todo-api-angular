import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todo } from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/todos`;

  getTodos() {
    return firstValueFrom(this.http.get<Todo[]>(this.apiUrl));
  }

  addTodo(todo: { title: string; description?: string }) {
    return firstValueFrom(this.http.post<Todo>(this.apiUrl, todo));
  }

  deleteTodo(id: string) {
    return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
  }

  toggleComplete(id: string) {
    return firstValueFrom(this.http.post<void>(`${this.apiUrl}/${id}/toggle`, {}));
  }
}
