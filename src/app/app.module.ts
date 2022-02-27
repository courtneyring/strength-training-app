import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DataService } from './services/data.service';

export function initContent(dataService: DataService) {
    return () => dataService.getContent();
}


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [{ provide: APP_INITIALIZER, useFactory: initContent, deps: [DataService], multi: true }],
    bootstrap: [AppComponent]
})
export class AppModule { }
