import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ExplorerComponent } from './explorer/explorer.component';
import { ViewTableComponent } from './explorer/view-table/view-table.component';
import { ViewDirective } from './explorer/view.directive';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ExplorerComponent,
    ViewTableComponent,
    ViewDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
