import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class DataService {

    config = {
        client_id: '379651065405-n3jfqu6m0p84scaprlkimokgf11b4oh2.apps.googleusercontent.com',
        redirect_uri: 'http://localhost:4200',
        response_type: 'token',
        scope: 'https://www.googleapis.com/auth/spreadsheets',
        include_granted_scopes: 'true',
    }

    constructor(private route: ActivatedRoute, private router: Router) {

    }

    async getUrl() {
        let url = 'https://accounts.google.com/o/oauth2/v2/auth';
        let params = new URLSearchParams();
        for (let [key, value] of Object.entries(this.config))
            params.set(key, value);
        location.href = url + '?' + params.toString();
    }

    async getData(token) {
        let id = '1dm4Vhky6sF92Y6W_EurRp-MbbQULzx0nNE4HuTW3eBI';
        let url = `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/Sheet24`
        let resp = await fetch(url,
            {
                headers: { Authorization: `Bearer ${token}` }
            });
        let data = await resp.json();
        console.log(data);
    }

    async writeData(token) {
        let id = '1dm4Vhky6sF92Y6W_EurRp-MbbQULzx0nNE4HuTW3eBI';
        let url = `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/Sheet24!A1:B1?valueInputOption=USER_ENTERED`;

        let body = {
            "range": "Sheet24!A1:B1",
            "majorDimension": "ROWS",
            "values": [
                ["Shoulders", "TEST2"]
            ],
        }
        let resp = await fetch(url,
            {
                headers: { Authorization: `Bearer ${token}` },
                method: 'PUT', 
                body: JSON.stringify(body)
            });
        console.log(resp);
    }


}
