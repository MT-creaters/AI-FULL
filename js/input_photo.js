import {db_im} from './app.js';

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
document.getElementById('photo').addEventListener('change', function() {
    const canv = document.getElementById("picture");
    const file = canv.files[0];
    const reader = new FileReader();
    reader.onloadend = function() {
            const imageData = reader.result;
            document.querySelector('#FormInput').addEventListener('click', () => saveImage(imageData, file.type));
        }
        reader.readAsDataURL(file);
    });