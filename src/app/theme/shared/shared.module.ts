// Angular Imports
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// project import
import {CardModule} from './components';

import {SpinnerComponent} from './components/spinner/spinner.component';
import {NgScrollbarModule} from 'ngx-scrollbar';

// bootstrap import
import {NgbCollapseModule, NgbDropdownModule, NgbModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbModule,
    NgbCollapseModule,
    NgScrollbarModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    SpinnerComponent,
    NgbModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbCollapseModule,
    NgScrollbarModule
  ],
  declarations: [SpinnerComponent]
})
export class SharedModule {
}
