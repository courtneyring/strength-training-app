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
        let url = `https://api.storyblok.com/v2/cdn/stories?by_uuids=${uuids}&token=${environment.storyblokToken}&version=${this.version}&sort_by=position:desc`
        let resp = await fetch(url);
        let data = await resp.json();
        return data.stories
    }



    
    sort(arr) {
        return arr.sort((a, b) => {
            if (a.content.last_completed == '') return -1;
            return (moment(a.content.last_completed).unix() - moment(b.content.last_completed).unix())
        })
        
        
    }

    async getContent() {
        this.version = await this.getCurrentVersion();
        this.data = [];

        let blocks = ['abs','strength', 'cardio'];
        let app = await this.getAppContent();
        

        for (let block of blocks) {
            let groupIdx = 0;
            let routineIdx = 0;
            let groupUuids = app[block];

            let groups = this.sort(await this.getStories(groupUuids));
            let group = groups[groupIdx];

            let routines = this.sort(await this.getStories(group.content.routines));
            group.content.routines = routines;
            await Promise.all(this.populateSupersets(routines[routineIdx].content.supersets));


            this.data.push({groups, groupIdx, routineIdx, block});
        }

        console.log(this.data);

    }

    populateSupersets(supersets) {
        return supersets.map(async (superset) => {
            let workouts = await this.getStories(superset.workouts)
            return superset.workouts = workouts;
        })
    }


    getNewIdx(currentIdx, arr, direction) {
        if(direction == 'next') {
            return currentIdx == arr.length - 1 ? 0 : currentIdx + 1;
        }
        else {
            return currentIdx == 0 ? arr.length - 1 : currentIdx - 1;
        }
    }


    async changeRoutine(data, direction) {

        let group = data.groups[data.groupIdx]
        let routines = group.content.routines;
        let newIdx = this.getNewIdx(data.routineIdx, routines, direction);

        let routine = routines[newIdx]
        console.log(routine.content.supersets[0])
        if (!routine.content.supersets[0].workouts[0].content) {
            await Promise.all(this.populateSupersets(routine.content.supersets));
        }
        
        data.routineIdx = newIdx;
    }

    async changeGroup(data, direction) {
        let routineIdx = 0;
        let group = data.groups[data.groupIdx];
        let newIdx = this.getNewIdx(data.groupIdx, data.groups, direction);

        group = data.groups[newIdx];

        if (!group.content.routines[0].content) {
            let routines = this.sort(await this.getStories(group.content.routines));
            group.content.routines = routines;
            console.log(group);
            await Promise.all(this.populateSupersets(routines[routineIdx].content.supersets));
        }
        

        data.routineIdx = routineIdx;
        data.groupIdx = newIdx;

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


    async remove(data) {
        await this.changeRoutine(data, 'next');
        
        let routines = data.groups[0].content.routines;
        routines.shift();
        console.log(routines)
        data.routineIdx = 0;

        let raw = (await this.getStories([data.groups[0].uuid]))[0];
        console.log(raw);
        raw.content.routines.shift();
        console.log(raw.content.routines);

        let body = {
            story: {
                name: raw.name,
                slug: raw.full_slug,
                content: {...raw.content, routines: raw.content.routines},    
            },
            publish: 1
        }

        let resp = await fetch(`https://mapi.storyblok.com/v1/spaces/${this.spaceId}/stories/${raw.id}`, {
            method: 'PUT', 
            headers: {Authorization: this.token, 'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
    }

}
