import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { environment } from '../../environments/environment';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService]
    });
    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should request todos from api', async () => {
    const mockTodos = [{ id: '1', title: 'One', description: '', isComplete: false, createdAt: '2026-01-01T00:00:00Z' }];

    service.getTodos().then(result => {
      expect(result).toEqual(mockTodos);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/todos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos);
  });
});
