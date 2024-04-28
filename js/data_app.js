import {db_data, db_im} from './app.js'
import {db} from './main.js'

//日付を入力することで、その差を判定する関数
function compareDates(date1, date2) {
    if (date1.getDate()==date2.getDate()&&date1.getMonth()==date2.getMonth()) {
		var year=Math.abs(date1.getFullYear()-date2.getFullYear());
		if(year==0) return 'zero'; //false(0)にならないよう何かしらの文字列を返します。
		else return Math.abs(date1.getFullYear()-date2.getFullYear()) ; // 同じ日付の場合は何周年か出力
    } 
	else {
        return false; //日付が異なっていた場合
    }
}

//データベースから一番近い日付のデータを持ってくる関数
function find_event_day(date1,data){
	//引数:data(dataのフォームで入力された配列)
	//引数:date(現在時刻)
 	 var index='none';//撮影したい日のインデックス(最初は何もないの意味で'none'で初期化)
	 var length=data.length; //保存されているデータベースの個数
	 var send_data = 'none';//dataには何も格納しない(falseだとなんか動かんのでnoneで初期化)
	 for(let i=0;i<length;i++)//日付が一致する日を探索
	 {	var event_day = new Date(data[i].day);
		if(compareDates(date1, event_day))  var send_data = data[i];
	 }
	if(send_data==='none') return false;
	else return send_data;
	//返り値はdataの配列{}の形になっています。
	//名前にアクセスする場合はsend_data.nameのようにすれば日付にアクセスできます。
}

// データベースから写真データを取得して処理する関数
function processPhotos(photos) {
    // window.name_list に存在する name のデータだけを取り出す
    const filteredPhotos = photos.filter(photo => window.name_list.includes(photo.name));
    
    // フィルタリングされた写真データの name と photoData を別の配列に入れる
    const filteredData = filteredPhotos.map(photo => ({ name: photo.name, photoData: photo.photoData }));

    // 顔比較用のデータを集める関数を呼び出す
    return filteredData;
}

//イベントと一致するデータのみを取り出す準備
let buff = await db_data.notes;
window.db_buff = buff
var current_date = new Date();
buff.toArray().then((noteArray) => {
    var data_one= find_event_day(current_date,noteArray);
    var event_day = new Date(data_one.day);//データベースの一番上の日をとってくる。本当は複数のを参照したい。
    if(compareDates(current_date,event_day)!= false && data_one){
        window.name_list=data_one.name
    }
})

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('../models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('../models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('../models')
  ]).then(loadlabelimages)

async function loadlabelimages() {
    // データベースから写真データを取得
    const photos = await db_im.photos.toArray();
    const filteredData = processPhotos(photos);
    const labels = filteredData.map(item => item.name);
    console.log(labels)
    const photoDataArray = filteredData.map(item => item.photoData);
    console.log(filteredData)
    console.log(photoDataArray)
    
    return Promise.all(
        labels.map(async label => {
            const descriptions = []
            for (let i = 0; i < photoDataArray.length; i++) {
                const photoData = photoDataArray[i];
                const label = labels[i]; // 対応するラベルを取得
                const blobUrl = URL.createObjectURL(photoData);
                const blobArray = new Uint8Array(photoData);
                // 画像を読み込む
                const img = new Image();
                img.src = blobUrl;

                // 画像の読み込みが完了するのを待つ
                await new Promise((resolve, reject) => {
                    img.onload = () => resolve();
                    img.onerror = reject;
                });

                // const img = await faceapi.bufferToImage(photoData); // 写真データを画像に変換
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor(); // 顔を検出して特徴量を取得
                if (detections) {
                    // 特徴量が検出された場合は処理を行う（例えば、console.logでラベルと特徴量を表示するなど）
                    descriptions.push(detections.descriptor)
                    console.log("a")

                } else {
                    // 顔が検出されなかった場合の処理（例えば、エラーメッセージを表示するなど）
                    console.log(`ラベル: ${label}, 顔が検出されませんでした`);
                }
            }
        return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
      )
    }

// main.jsから送信されたイベントをリッスンし、関数を呼び出す
window.addEventListener('ImgReceive', receiveImgEvent);
// main.jsからイベントを受け取るための関数を定義
export async function receiveImgEvent() {
    const img = await db.files.toArray()
    const imgArray = img.map(item => item.data)
    const input_blobUrl = URL.createObjectURL(imgArray[0]);
    const blobArray = new Uint8Array(imgArray); 

    // 画像を読み込む
    const use_img = new Image();
    use_img.src = input_blobUrl;

    // 画像の読み込みが完了するのを待つ
    await new Promise((resolve, reject) => {
        use_img.onload = () => resolve();
        use_img.onerror = reject;
    });

    // loadlabelimages関数の実行を待つ
    const labeledFaceDescriptors = await loadlabelimages();

    // FaceMatcherの作成と顔の検出、比較を行う
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5);
    const detections = await faceapi.detectAllFaces(use_img).withFaceLandmarks().withFaceDescriptors();
    const results = detections.map(detection => faceMatcher.findBestMatch(detection.descriptor));
    const bestMatches = detections.map(detection => {
        const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
        const name = bestMatch.toString().replace(/\s*\([^)]*\)/g, '').trim(); // 名前のみを取得して整形
        return name;
    });
    
    // 新しい配列に名前を追加する
    const newArray = [];
    bestMatches.forEach(name => {
        newArray.push(name);
    });
    
    const isMatching = window.name_list.length === newArray.length && window.name_list.every(name => newArray.includes(name));

    if (isMatching) {
        window.globalVariable = true;
    } else {
        window.globalVariable = false;
    }
    console.log(window.globalVariable)

}