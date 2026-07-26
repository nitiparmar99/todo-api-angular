import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TodoFormComponent } from './todo-form.component';
import { TodoService } from '../services/todo.service';

describe('TodoFormComponent', () => {
  let fixture: ComponentFixture<TodoFormComponent>;
  let component: TodoFormComponent;
  let todoServiceStub: { addTodo: jasmine.Spy };

  beforeEach(async () => {
    todoServiceStub = {
      addTodo: jasmine.createSpy('addTodo').and.returnValue(
        Promise.resolve({
          id: '1',
          title: 'Test todo',
          description: 'Description',
          isComplete: false,
          createdAt: new Date().toISOString()
        })
      )
    };

    await TestBed.configureTestingModule({
      imports: [TodoFormComponent],
      providers: [{ provide: TodoService, useValue: todoServiceStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the form component', () => {
    expect(component).toBeTruthy();
  });

  it('requires a title before submitting', async () => {
    component.title.set('');
    await component.onSubmit(new Event('submit'));
    expect(component.error()).toBe('Title is required');
    expect(todoServiceStub.addTodo).not.toHaveBeenCalled();
  });

  it('emits added after successful submit', async () => {
    spyOn(component.added, 'emit');
    component.title.set('New todo');
    component.description.set('Test');
    await component.onSubmit(new Event('submit'));

    expect(todoServiceStub.addTodo).toHaveBeenCalledWith({
      title: 'New todo',
      description: 'Test'
    });
    expect(component.added.emit).toHaveBeenCalled();
    expect(component.title()).toBe('');
  });
});
