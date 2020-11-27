import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from './services/data.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'strength-training-app';

    constructor(public dataService: DataService, private route: ActivatedRoute){

        route.fragment.subscribe((res) => {
            let params = new URLSearchParams(res);
            if (params.get('access_token')){
                sessionStorage.setItem('access_token', params.get('access_token'));
            }
            
            let token = sessionStorage.getItem('access_token');

            if (token){
                dataService.getData(token);
                dataService.writeData(token);
            }
            else{
                dataService.getUrl();
            }
        })

    }





}
