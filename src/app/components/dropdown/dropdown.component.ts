import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data.service';



@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {

    @Output() selectEmitter = new EventEmitter();

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
    }



    onButtonClick(e) {
        console.log(e);
        this.selectEmitter.emit(e)

    }

}
