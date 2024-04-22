import {db_data} from './app.js';
var id=0
async function FormReceive(){
    // const FormName = document.forms['form1'].elements['name'].value;
    let FormNames = [];
    const FormName = document.forms['form1'].elements['selectElement'].value;
    const FormEvent = document.forms['form1'].elements['event'].value;
    const Formday = document.forms['form1'].elements['datepicker'].value;
    console.log("namae",FormName)
    console.log("イベント",FormEvent)
    console.log("日付",Formday)

    FormNames.push(FormName)
    
    // フォーム要素の個数を取得
    const formElementsCount = document.forms['form1'].children.length;
    
    // 追加された要素が存在するかどうかを確認
    if (formElementsCount > 5) {
        console.log("フォーム要素が追加されました。");
        console.log("formElementCount", formElementsCount);
        const loopTimes = formElementsCount - 5;
        for (let i = 1; i < loopTimes + 1; i++){
            let FormNameAlpha = document.forms['form1'].elements['selectElement' + i].value;
            FormNames.push(FormNameAlpha);
        }
    } else {
        console.log("フォーム要素は追加されませんでした。");
    }
    

    db_data.notes.count().then((num)=>{
        db_data.notes.put({
            id:num+1,
            //day:aniv_day.day,
            day: Formday,
            name: FormNames,
            event: FormEvent,
        });
        if (formElementsCount > 5) {
            console.log(formElementsCount);
            const loopTimes1 = formElementsCount - 5;
            console.log('loopTimes1', loopTimes1);
            for (let i = 1; i < loopTimes1 + 1; i++){
                console.log('i', i)
                const selectId = 'selectName' + i;
                console.log('selectId', selectId);
                // document.forms['form1'].elements[selectId].value = '';
                // 削除する select 要素を取得
                const selectToRemove = document.getElementById(selectId);
            
                // select 要素が存在すれば削除
                if (selectToRemove) {
                    selectToRemove.parentNode.removeChild(selectToRemove);
                };
            };
        };
        // フォーム内の各要素を取得し、値をクリアする
        document.forms['form1'].elements['selectElement'].value = '';
        document.forms['form1'].elements['event'].value = '';
        document.forms['form1'].elements['datepicker'].value = '';

        const target = document.querySelector('input[type="date"]');
        target.setAttribute('data-date', '');
    });
}
document.querySelector('#FormInput').addEventListener('click', () => FormReceive());

// // addNameで追加された要素の値を取得する
// document.querySelector('#addName').addEventListener('click', function() {
//     const addedFormName = document.getElementById('selectName1').value;
//     console.log("追加された名前:", addedFormName);
// });

// 日付関連
$(function(){
    $("#datepicker").datepicker({
        dateFormat: "yy-mm-dd", 
        changeYear: true,
        // changeMonth: true,
    });
  });
// document.querySelector('input[type="text"]').addEventListener('change', event => {
//     const target = event.target;
//     target.setAttribute('data-date', target.value);
//   }, false);

//タイピングアニメーション
var typed = new Typed('.typed', {
    strings: [
    'Please input your data',
    ],
    typeSpeed: 50,
    startDelay: 500,
    loop: false,
    cursorChar: "",
});
