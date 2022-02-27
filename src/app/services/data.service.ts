import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as moment from 'moment';
import { filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class DataService {
    
    spaceId = '146643'; 
    version;

    constructor() {}

    async getCurrentVersion() {
        let url = `https://api.storyblok.com/v2/cdn/spaces/${this.spaceId}?token=${environment.storyblokToken}`;
        let resp = await fetch(url);
        let data = await resp.json();
        return data.version;
    }

    async getAppContent() {
        let url = `https://api.storyblok.com/v2/cdn/stories/app/?cv=${this.version}&token=${environment.storyblokToken}`;
        let resp = await fetch(url);
        let data = await resp.json();
        return data.story.content.groups;
    }

    async getStories(uuids) {
        console.log(uuids)
        let url = `https://api.storyblok.com/v2/cdn/stories?by_uuids=${uuids}&token=${environment.storyblokToken}&version=${this.version}`
        let resp = await fetch(url);
        let data = await resp.json();
        console.log(data);
        return data.stories
    }

    getNext(stories) {
        let next;
        for (let story of stories) {
            if (!next || moment(story.content.last_completed) > moment(next.content.last_completed)) {
                next = story;
            }
        }
        console.log(next);
        return next
    }

    nextRoutineMapper(supersets) {
        return supersets.map(async (superset) => superset.workouts = await this.getStories(superset.workouts))
    }


    async getContent() {
        this.version = await this.getCurrentVersion();
        
        let groupUuids = await this.getAppContent();
        let groups = await this.getStories(groupUuids);
        let nextGroup = this.getNext(groups);
        let routines = await this.getStories(nextGroup.content.routines);
        let nextRoutine = this.getNext(routines);
        let supersets = await Promise.all(this.nextRoutineMapper(nextRoutine.content.supersets));
        console.log(supersets)

    }

}
