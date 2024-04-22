import {db} from './main.js';

let buff = await db.files.get('image.png');
console.log(typeof(buff));
