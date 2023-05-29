import { NgModule } from '@angular/core';
import { FilterPipe } from './filter/filter.pipe';

@NgModule({
  declarations: [
    FilterPipe
  ],
  exports: [ FilterPipe ]
})
export class PipesModule { }
