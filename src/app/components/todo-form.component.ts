import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="card">
      <h2>Add todo</h2>
      <form (submit)="onSubmit($event)">
        <label>
          Title
          <input type="text" [value]="title()" (input)="title.set($any($event.target).value)" required maxlength="200" />
        </label>
        <label>
          Description
          <div class="editor-toolbar">
            <button type="button" class="toolbar-btn" title="Bold" (click)="formatText('bold')">
              <strong>B</strong>
            </button>
            <button type="button" class="toolbar-btn" title="Italic" (click)="formatText('italic')">
              <em>I</em>
            </button>
            <button type="button" class="toolbar-btn" title="Underline" (click)="formatText('underline')">
              <u>U</u>
            </button>
            <select class="toolbar-select" (change)="changeFontSize($event)">
              <option value="">Font size</option>
              <option value="1">Small</option>
              <option value="3">Normal</option>
              <option value="5">Large</option>
              <option value="7">X-Large</option>
            </select>
          </div>
          <div #descriptionEditor 
               class="description-editor" 
               contenteditable="true"
               (input)="onDescriptionInput()"></div>
        </label>
        <div class="form-actions">
          <button type="submit" [disabled]="loading()">Add</button>
          <button type="button" class="secondary" (click)="reset()" [disabled]="loading()">Clear</button>
        </div>
        <p *ngIf="error()" style="color:#d32f2f">{{ error() }}</p>
      </form>
    </section>
  `
})
export class TodoFormComponent implements AfterViewInit {
  @Output() added = new EventEmitter<void>();
  @ViewChild('descriptionEditor') descriptionEditor!: ElementRef;

  title = signal('');
  description = signal('');
  loading = signal(false);
  error = signal('');

  ngAfterViewInit() {
    // Initialize the editor with any existing description
    if (this.descriptionEditor && this.description()) {
      this.descriptionEditor.nativeElement.innerHTML = this.description();
    }
  }

  formatText(command: string) {
    document.execCommand(command, false);
    this.descriptionEditor?.nativeElement.focus();
  }

  changeFontSize(event: Event) {
    const select = event.target as HTMLSelectElement;
    if (select.value) {
      document.execCommand('fontSize', false, select.value);
      select.value = '';
      this.descriptionEditor?.nativeElement.focus();
    }
  }

  onDescriptionInput() {
    if (this.descriptionEditor) {
      this.description.set(this.descriptionEditor.nativeElement.innerHTML);
    }
  }

  constructor(private todoService: TodoService) {}

  async onSubmit(event: Event) {
    event.preventDefault();
    if (!this.title().trim()) {
      this.error.set('Title is required');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      await this.todoService.addTodo({
        title: this.title().trim(),
        description: this.description().trim() || undefined
      });
      this.reset();
      this.added.emit();
    } catch {
      this.error.set('Could not add todo.');
    } finally {
      this.loading.set(false);
    }
  }

  reset() {
    this.title.set('');
    this.description.set('');
    this.error.set('');
  }
}
