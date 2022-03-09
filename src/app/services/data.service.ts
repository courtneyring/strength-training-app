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
    token;
    data = [];


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
        return data.story.content;
    }

    async getStories(uuids) {
        let url = `https://api.storyblok.com/v2/cdn/stories?by_uuids=${uuids}&token=${environment.storyblokToken}&version=${this.version}`
        let resp = await fetch(url);
        let data = await resp.json();
        return data.stories
    }

    getNext(stories) {
        let next;
        for (let story of stories) {
            if (!next || moment(story.content.last_completed) < moment(next.content.last_completed)) {
                next = story;
            }
        }
        return next
    }

    nextRoutineMapper(supersets) {
        return supersets.map(async (superset) => {
            let workouts = await this.getStories(superset.workouts)
            workouts = workouts.map((workout) => {
                return {...workout.content, name: workout.name}
            });
            return superset.workouts = workouts;
        })
    }

    async completeStory(story) {

        let raw = (await this.getStories([story.uuid]))[0];

        let body = {
            story: {
                name: raw.name,
                slug: raw.full_slug,
                content: {...raw.content, last_completed: moment().format('YYYY-MM-DD hh:mm')},    
            },
            publish: 1
        }

        let resp = await fetch(`https://mapi.storyblok.com/v1/spaces/${this.spaceId}/stories/${raw.id}`, {
            method: 'PUT', 
            headers: {Authorization: this.token, 'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
        console.log(resp);
    }

    sort(arr) {
        return arr.sort((a, b) => {
            moment(a.content.last_completed).unix() - moment(b.content.last_completed).unix()
        })
        
    }

    async getContent() {
        this.version = await this.getCurrentVersion();
        this.data = [];
        
        let blocks = ['abs','strength', 'cardio'];
        let app = await this.getAppContent();
        

        for (let block of blocks) {
            let groupUuids = app[block];
            let groups = this.sort(await this.getStories(groupUuids));
            console.log(groups);
            // return;
            let nextGroup = this.getNext(groups);
            let routines = await this.getStories(nextGroup.content.routines);
            let nextRoutine = this.getNext(routines);
            await Promise.all(this.nextRoutineMapper(nextRoutine.content.supersets));
            console.log(nextRoutine)

            this.data.push({routine: nextRoutine, group: nextGroup});
        }

        console.log(this.data);


    }

}
