import axios from axios;
import { formEvent, from} from 'rxjs'
import {
    map,
    switchMap,
    debounceTime,
    distinctUntilChanged
} from 'rxjs/oprators'

const search = document.getElementById('search');

formEvent(search, 'keyup')
.pipe(
    debounceTime(1000),
    map(event=>event.target.value),
    distinctUntilChanged(), // 防止写了又删，实际没改，还要重复发请求
    switchMap(keyword=>{
        from(
            axios.get(`https://...?query=${keyword}`)
        )
        .pluck('data') //返回的数据在对象的data属性中
    })
)
.subscribe(console.log)