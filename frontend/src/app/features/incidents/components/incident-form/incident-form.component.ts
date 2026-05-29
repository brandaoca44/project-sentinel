import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateIncidentPayload, IncidentPriority } from '../../models/incident.model';

@Component({
  selector: 'app-incident-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './incident-form.component.html',
  styleUrl: './incident-form.component.scss',
})
export class IncidentFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  @Input() isSubmitting = false;
  @Output() formSubmit = new EventEmitter<CreateIncidentPayload>();

  readonly priorities: { value: IncidentPriority; label: string }[] = [
    { value: 'LOW', label: 'Baixa' },
    { value: 'MEDIUM', label: 'Média' },
    { value: 'HIGH', label: 'Alta' },
    { value: 'CRITICAL', label: 'Crítica' },
  ];

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]],
    category: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    assignee: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    priority: this.fb.control<IncidentPriority>('HIGH', [Validators.required]),
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formSubmit.emit(this.form.getRawValue());
  }

  hasError(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
}