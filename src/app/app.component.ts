import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from './services/data.service';
import * as moment from 'moment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'strength-training-app';

    today = moment().format('MMMM DD, YYYY');

    fields = ['weight', 'reps', 'sets'];

    constructor(public dataService: DataService, private route: ActivatedRoute) {
 
    }


}
