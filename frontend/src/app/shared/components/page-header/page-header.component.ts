import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <div class="page-header">
      <h1>{{ title() }}</h1>
      <ng-content></ng-content>
    </div>
  `,
})
export class PageHeaderComponent {
  title = input.required<string>();
}

