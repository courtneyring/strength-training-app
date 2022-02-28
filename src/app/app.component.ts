import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from './services/data.service';
import * as moment from 'moment';
import { AuthService } from './services/auth.service';
import { skip } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'strength-training-app';

    today = moment().format('MMMM DD, YYYY');

    fields = [{key: 'weight'}, {key: 'reps'}, {key: 'sets'}, {key: 'distance', unit: 'mi'}, {key: 'time', unit: 'min'}];

    

    constructor(public dataService: DataService, private route: ActivatedRoute, private authService: AuthService) {

        route.fragment
        .pipe(skip(1))
        .subscribe( async (res) => {
            let params = new URLSearchParams(res);
            let data = await this.authService.readSheet(params);
            this.dataService.token = data.values[0][0];
            dataService.getContent();
        })
 
    }

    async complete(data) {
        await this.dataService.completeStory(data.group);
        await this.dataService.completeStory(data.routine);
    }

}
