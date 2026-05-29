import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShellComponent } from './shared/components/shell/shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ShellComponent],
  template: `
    <app-shell>
      <router-outlet />
    </app-shell>
  `,
})
export class AppComponent {}
