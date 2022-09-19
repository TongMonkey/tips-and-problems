import { fromEvent } from "rxjs";
import {map, switchMap, takeUntil} from 'rxjs/operators';


const box = document.getElementById('box');

fromEvent(box, 'mousedown')
.pipe(
    map(event=>({
        distanceX: event.clientX - event.target.offsetLeft,
        distanceY: event.clientY - event.target.offsetTop
    })),
    switchMap(({distanceX, distanceY})=>{
        fromEvent(document, 'mouseover')
        .pipe(
            map(event=>({
                positionX: event.clientX - distanceX,
                positionY: event.clientY - distanceY
            })),
            takeUntil(fromEvent(document, 'mouseup'))
        )
    })
)
.subscribe(()=>{
    box.style.left = positionX + 'px',
    box.style.top = positionY + 'px'
})