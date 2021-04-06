import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ExplorerComponent } from './explorer/explorer.component';
import { ViewTableComponent } from './explorer/view-table/view-table.component';
import { ViewDirective } from './explorer/view.directive';
import { HttpErrorComponent } from './http-error/http-error.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ExplorerComponent,
    ViewTableComponent,
    ViewDirective,
    HttpErrorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
