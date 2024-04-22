import {db_data} from './app.js'
//let buff = await db_data.notes.get(1);
let buff = await db_data.notes;
window.db_buff = buff
// buff.toArray().then((noteArray) => {
//     console.log("取得したノート一覧:", noteArray);
//     console.log("データの長さ", noteArray.length);
//     // ここでnoteArrayを使って何か処理を行う
//     window.day_db_data = buff
//     var desiredNote = noteArray.offset(0).first();
//     console.log("出したいインデックス", desiredNote);
// });


//console.log(buff);