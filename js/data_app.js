import {db_data, db_im} from './app.js'

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

//モデルの準備
const loadModelsPromise = Promise.all([
    faceapi.loadSsdMobilenetv1Model("../models/"),
    faceapi.loadFaceLandmarkModel("../models/"),
    faceapi.loadFaceRecognitionModel("../models/")
]);

//ここまでおけ
loadModelsPromise.then(() => {
    console.log("All models loaded successfully");
    detectAllFaces();
});

loadModelsPromise.catch((error) => {
    console.error("Error loading models:", error);
});

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

async function detectAllFaces() {
    console.log("detectAllFaces");
    
    try {
        // データベースから写真データを取得
        const photos = await db_im.photos.toArray();
        const filteredData = processPhotos(photos);
        //名前とblobデータセット
        console.log(filteredData);
        
        const photoDataArray = filteredData.map(item => item.photoData);
        //blobデータのみ
        console.log(photoDataArray);
        //データは来てる？？はず

        // 画像ごとに顔検出を行う
        const faceDetectionPromises = photoDataArray.map(async (photoData) => {
            try {
                // BlobデータからBlob URLを作成
                const blobUrl = URL.createObjectURL(photoData);
                const blobArray = new Uint8Array(photoData);
                console.log(blobArray);
                // 画像を読み込む
                const img = new Image();
                img.src = blobUrl;

                console.log("a")
                // 画像の読み込みが完了するのを待つ
                await new Promise((resolve, reject) => {
                    img.onload = () => resolve();
                    img.onerror = reject;
                });
                console.log("a")

                // 顔検出を実行
                const faceData = await faceapi.detectAllFaces(img);
                console.log("Detected faces:", faceData);
                
                // 検出された顔に対して何か処理を行う
                
                // Blob URLを解放する
                URL.revokeObjectURL(blobUrl);
                
                return faceData;
            } catch (error) {
                console.error("Error detecting faces:", error.message);
                throw error;
            }
        });
        
        // すべての画像の顔検出が完了するのを待つ
        await Promise.all(faceDetectionPromises);
    } catch (error) {
        console.error('Error fetching photos:', error.message);
    }
}


