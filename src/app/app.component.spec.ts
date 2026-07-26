import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TodoService } from './services/todo.service';
import { Todo } from './models/todo.model';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  const testTodos: Todo[] = [
    {
      id: '1',
      title: 'Sample todo',
      description: 'Test description',
      isComplete: false,
      createdAt: '2026-01-01T00:00:00Z'
    }
  ];

  const todoServiceStub = {
    getTodos: () => Promise.resolve(testTodos),
    deleteTodo: () => Promise.resolve(),
    toggleComplete: () => Promise.resolve()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: TodoService, useValue: todoServiceStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('creates the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
