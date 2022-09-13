import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ControlsComponent } from './controls/controls.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
    declarations: [
        AppComponent,
        ControlsComponent,
        DropdownComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        MatMenuModule,
        MatIconModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
