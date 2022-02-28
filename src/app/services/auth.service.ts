import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

    config = {
        client_id: '379651065405-n3jfqu6m0p84scaprlkimokgf11b4oh2.apps.googleusercontent.com',
        redirect_uri: environment.redirectUrl,
        response_type: 'token',
        scope: 'https://www.googleapis.com/auth/spreadsheets',
        include_granted_scopes: 'true',
    }

    constructor(private route: ActivatedRoute, private router: Router) {

    }

    getToken(params) {
        let token = this.getCookie('access_token');
        if (token){
            return token;
        }
        else if (params.get('access_token')) {
            this.setCookie(params);
            return params.get('access_token');
        }
        else {
            this.getUrl();
        }
    }

    setCookie(params) {
        let expiration = parseInt(params.get('expires_in'))
        let date = new Date();
        date.setSeconds(date.getSeconds() + expiration);
        
        document.cookie = `access_token=${params.get('access_token')};expires=${date.toUTCString()}`;
        window.location.hash = '';
    }


    getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    async getUrl() {
        let url = 'https://accounts.google.com/o/oauth2/v2/auth';
        let params = new URLSearchParams();
        for (let [key, value] of Object.entries(this.config))
            params.set(key, value);
        location.href = url + '?' + params.toString();
    }

    async readSheet(params = new URLSearchParams) {
        let sheetId = '1PyJMQy9YXMVq3o45KS0kZAjLojSyqypQhC0b4qo3veo';
        let sheetName = 'Sheet1';
        let token = this.getToken(params);
        
        let url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}`
        let resp = await fetch(url,
            {
                headers: { Authorization: `Bearer ${token}` }
            });
        let data = await resp.json();
        console.log(data);
        return data;
        
        // this.rowsToObject(data.values);
        
    }


    rowsToObject(rows) {
        let data = [];
        let headers = rows.shift();
        for (let row of rows) {
            let obj = {};
            for (let [idx, col] of row.entries()) {
                let key = headers[idx];
                obj[key] = col;
            }
            data.push(obj);
        }
        console.log(data);
    }

    async writeSheet(token) {
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
