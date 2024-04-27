import {db_im} from './app.js';

function base64toBlob(base64String) {
    var byteCharacters = atob(base64String);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray]);
}
function isBase64(str) {
    try {
        return btoa(atob(str)) === str;
    } catch (err) {
        return false;
    }
}
function dataURLToBlob(dataURL) {
    var arr = dataURL.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

// 画像をデータベースに保存する関数
function saveImage(imageData, fileType){
    const form = document.forms['form1'];
    const FormName = form.elements['name'].value;
    // const blob = new Blob([imageData], { type: fileType});
    db_im.photos.count().then((num)=>{
        db_im.photos.put({
            name: FormName,
            id: num+1,
            photoData:imageData,
        });
        // フォーム内の各要素を取得し、値をクリアする
        form.elements['name'].value = '';
        // 画像のファイルを選択するinput要素もクリアする
        document.getElementById('photo').value = '';
    });
}

// 画像ファイルのinput要素にchangeイベントを設定
document.getElementById('picture').addEventListener('change', function(event){
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = function() {
            const imageData = reader.result;
            console.log(imageData)
            // var string = btoa(imageData);
            // let blob = base64toBlob(string);
            var blob = dataURLToBlob(imageData);
            document.querySelector('#FormInput').addEventListener('click', () => saveImage(blob, file.type));
        }
        reader.readAsDataURL(file);
    });

//入力チェック
document.getElementById('picture').addEventListener('change', function() {
    let fileCheck = this.value.length;
    if(fileCheck != 0){
        document.getElementById('file_check_text').innerText="　 Selected!";
	}else{
        document.getElementById('file_check_text').innerText="";
    }
    
});