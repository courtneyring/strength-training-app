import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';


@Component({
    selector: 'app-controls',
    templateUrl: './controls.component.html',
    styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {

    @Input() data;
    @Input() group;
    @Input() routine;

    constructor(public dataService: DataService) { }

    ngOnInit(): void {
    }

    async complete(data) {
        await this.dataService.completeStory(this.group);
        await this.dataService.completeStory(this.routine);
        this.group['complete'] = true;
    }


}
