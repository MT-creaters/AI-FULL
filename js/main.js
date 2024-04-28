//テキストアニメ;

//数字を序数に変換する関数
function josuu(number) {
	//数字ごとに序数を判定する関数(脳みそ筋肉)
	if(number=='zero') return '';//zero
    else if (number==1)return number+'st';// first
	else if(number==2)return  number+'nd'; //second
	else if(number==3)return  number+'rd'; //third
	else return number+'th';
}
//二段目のメッセージを作成する関数
function number_message(number) {
	//compareDatesの返り値を引数にしてください。
	if(number=='zero') return ''; //0周年のメッセージは何も出さないようにしています。(気の利いたメッセージいれたいですね)
	else  return number+'年間ありがとう,'
}
// 日付を比較する関数
function compareDates(date1, date2) {
	//日付を入力することで、その差を判定する関数
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
let mediaRecorder; // メディアレコーダーオブジェクトを保持する変数
let recordedChunks = []; // 録画されたチャンクを保持する配列
//データベース
export var db_cap = new Dexie('Capture');
db_cap.version(1).stores({
    videos: "video"
  });

// 録画を開始する関数
function startRecording(canvas) {
	let canvasStream = canvas.elt.captureStream();
	let stream = new MediaStream();
	canvasStream.getVideoTracks().forEach(track => stream.addTrack(track));

	mediaRecorder = new MediaRecorder(stream);
	recordedChunks = [];

	mediaRecorder.ondataavailable = event => {
		if (event.data.size > 0) {
			recordedChunks.push(event.data);
		}
	};

	mediaRecorder.onstop = () => {
		let recordedBlob = new Blob(recordedChunks, { type: 'video/mp4' });
		let videoURL = URL.createObjectURL(recordedBlob);
		// db_cap.videos.put({ video: recordedBlob }); // 録画されたビデオをデータベースに保存
		db_cap.videos.put({ video: videoURL }); // 録画されたビデオをデータベースに保存
		const a = document.createElement('a');
		a.href = videoURL;
		a.download = 'video.mp4';

		a.style.display = 'none';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	mediaRecorder.start();

	setTimeout(() => {
		mediaRecorder.stop();
	}, 8000); // 10秒後に録画を停止
}
export let aniv_text;
export function anime_init(event='aniv') {
	//変更点4/27:引数にイベント名を入れてください
	if(event=='記念日'){
		var clor_message='#ef93b6';//カラーを変更(仮)
	}
	else if(event=='誕生日'){
		var clor_message='#34eba1';//カラーを変更(仮)
	}
	var textWrapper = document.querySelector('.ml9 .letters');
	textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>")
	aniv_text = anime.timeline()
	.add({
	targets: '.ml9 .letter',
	scale: [0, 1],
	duration: 1500,
	elasticity: 600,
	//color: '#ef93b6',
	color : clor_message,
	delay: (el, i) => 45 * (i+1)
	})
	.add({
	})
}
// anime_init();
//export var buff
//データベース
export var db = new Dexie('IMG');
db.version(1).stores({
    files: "name"
  });

window.ImgReceive = async ()=>{
	let canv = document.getElementById("defaultCanvas0");
	let link = canv.toDataURL();
	// let res  = await fetch(link);
	// let blob = await res.blob();
	db.files.put({name:"image.png",data:link});
}

var load ,aniv_hide;
//モジュール
var web_cam ,message ,touch_img;
//セットアップ
window.setup =() =>{
	frameRate(30);
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.style('z-index','-1');
	web_cam = new Web_cam();
	//aniv_text.pause();
	load = document.getElementById("load");
	aniv_hide = document.getElementById("aniv");
	message = new Message();
	touch_img = new Touch_img();
}
//毎フレーム処理
var flag=0;
window.draw =()=> {
	let img = web_cam.web_cam_capture();
	var direction = Math.abs(window.orientation);
	if(img.width-300){
		if(direction==90 || direction==-90){
			if(img.width>img.height){
				web_cam.yokonaga_value_change();
				web_cam.web_cam_draw_horizon_yokonaga(load, img);
				// document.getElementById('debug').innerHTML="よこなが　よこなが　よこなが　よこなが　"
				flag = 1;
			}
			else{
				web_cam.after_value_change();
				web_cam.web_cam_draw_horizon(load, img);
				// document.getElementById('debug').innerHTML="よこ　よこ　よこ　よこ　よこ　よこ　よこ　"
			}
		}
		else if(flag==1){
			web_cam.tatenaga_value_change();
			web_cam.web_cam_draw(load, img);
			// document.getElementById('debug').innerHTML="たてなが　たてなが　たてなが　たてなが　たてなが　"
		}
		else{
			web_cam.value_change();
			web_cam.web_cam_draw(load,img);
			// document.getElementById('debug').innerHTML="たて　たて　たて　たて　たて　たて　たて　たて　"
		}
		touch_img.touch_effect();
		message.message_draw();
	}
}
//マウスクリック処理(html)
window.OnClick=()=>{
	//エフェクトをつけるかの判断部分
	var buff = window.db_buff //吉田君データベースからevent,date,nameを取得。この時点では辞書型みたいになってます。
	//buff.dayのように構造体的にアクセスできます。
	var current_date = new Date();
	buff.toArray().then((noteArray) => {
		
		var data_one= find_event_day(current_date,noteArray);//データベースからイベントを探索
		var event_day = new Date(data_one.day);//今日と最も近い月日のイベントの日付
		console.log(compareDates(current_date,event_day));
		if(compareDates(current_date,event_day)!= false && data_one){
			window.name_list=data_one.name //ここで、イベントのデータベースを送信しています。
			startRecording(canvas);
			ImgReceive(); //画像データを受信
			aniv_hide.hidden = false;
			var gif_1 = document.getElementById('myGif');//表示させるGIFのIDをHTMLから引っ張る
			var gif_2 = document.getElementById('myGif_2');//表示させるGIFを引っ張る
			var gif_3 = document.getElementById('kirakira_left');//表示させるGIFを引っ張る
			var gif_4 = document.getElementById('kirakira_right');//表示させるGIFを引っ張る
			year=document.getElementById("aniv")//HTMLのanivというidを持つテキストを引っ張ってきます。
			gif_1.style.display = 'none'; // GIFを非表示(連続してボタンを押したときの対応)
			gif_2.style.display = 'none'; // GIFを非表示
			gif_3.style.display = 'none'; // GIFを非表示
			gif_4.style.display = 'none'; // GIFを非表示
			//非常に不本意ですが、メッセージ作成の部分を関数化できなかったのでここに書きます。
			if(data_one.event=='誕生日'){ 
				//誕生日と設定した場合のメッセージを書きます。
				year.innerHTML='Happy Birthday!!!' 
				var undermessage='お誕生日おめでとう！！！！'
				gif_1.src='./resource/happy-birthday.gif'
				gif_2.src='./resource/happy-birthday.gif'
			}
			else if(data_one.event=='記念日'){
				//記念日の場合のメッセージを書きます。
				 year.innerHTML=josuu(compareDates(event_day,current_date))+'Aniversary' //計算結果を足す。
				 var undermessage=number_message(compareDates(event_day,current_date))+'これからもよろしく'
				 gif_1.src='./resource/おめでとう-嬉しい.gif'
				 gif_2.src='./resource/おめでとう-嬉しい_反転.gif'
			}
			message = new Message(undermessage)//画面上に表示する下段のメッセージをインスタンス化します。
   			gif_1.style.display = 'block'; // GIFを表示
			gif_2.style.display = 'block'; // GIFを表示
			gif_3.style.display = 'block'; // GIFを表示
			gif_4.style.display = 'block'; // GIFを表示
			anime_init(data_one.event);//HTML側の文字を設定しなおしたのでアニメーション初期化
			aniv_text.restart();
			aniv_hide.hidden = false;
			//クラッカーエフェクト
			confetti({particleCount: 5000,spread: 700000,origin: { y: 1.0 }});
			//タッチエフェクト初期化
			touch_img.xyr[0] = mouseX ,touch_img.xyr[1] = mouseY ,touch_img.xyr[2] = 0;
			//文字エフェクト
			message.message_reset();
		}
	});
	//写真データ
	//ImgReceive();
}

//マウスクリック処理(p5.js)
window.mouseClicked=()=>{
	//タッチエフェクト初期化
	touch_img.xyr[0] = mouseX ,touch_img.xyr[1] = mouseY ,touch_img.xyr[2] = 0;
}

//ウィンドウサイズ変化時の処理
window.windowResized=()=> {
	var direction = Math.abs(window.orientation);
	let img = web_cam.web_cam_capture();
	if(direction==90 || direction==-90){
		if(img.width>img.height){
			web_cam.yokonaga_value_change();
			resizeCanvas(windowWidth, windowHeight);
		}
		else{
			web_cam.after_value_change();
			resizeCanvas(windowWidth, windowHeight);
		}
	}
	else{
		web_cam.value_change();
		resizeCanvas(windowWidth, windowHeight);
	}
}

//ウェブカメラ
class Web_cam{
	constructor(){
		this.offset=[0,0];
		this.size_scale=0;
		this.scaled =[0,0];
		this.alpha = 0;
		this.capture = createCapture(VIDEO);
		this.capture.hide();
	}
	value_change(){
		let img = this.capture.get();
		this.size_scale = max(width / img.width ,height / img.height);
		this.scaled = [img.width * this.size_scale ,img.height * this.size_scale];
		this.offset = [(width - this.scaled[0]) / 2,(height - this.scaled[1]) / 2];

	}
	after_value_change(){
		let img = this.capture.get();
		this.size_scale = max(width / img.width ,height / img.height);
		this.scaled = [img.width * this.size_scale ,img.height * this.size_scale];
		this.offset = [(width - this.scaled[0]) / 2,(height - this.scaled[1]) / 2];
	}
	yokonaga_value_change(){
		let img = this.capture.get();
		this.size_scale = max(width / img.height ,height / img.width);
		this.scaled = [img.height * this.size_scale ,img.width * this.size_scale];
		this.offset = [(width - this.scaled[0]) / 2,(height - this.scaled[1]) / 2];
	}
	tatenaga_value_change(){
		let img = this.capture.get();
		this.size_scale = max(width / img.height ,height / img.width);
		this.scaled = [img.height * this.size_scale ,img.width * this.size_scale];
		this.offset = [(width - this.scaled[0]) / 2,(height - this.scaled[1]) / 2];
	}
	web_cam_draw(load ,img){
		translate(width, 0);
		scale(-1, 1);
		if(this.alpha > 0) load.hidden = true;
		if (this.alpha <255) this.alpha += 30;
		tint(255 , this.alpha);
		image(img, 0,0, this.scaled[0], this.scaled[1]);
		pop();
	}
	web_cam_draw_horizon(load ,img){
		translate(width, 0);
		scale(-1, 1);
		if(this.alpha > 0) load.hidden = true;
		if (this.alpha <255) this.alpha += 30;
		tint(255 , this.alpha);
		image(img, 0,0, windowWidth, (this.scaled[0]*windowWidth)/this.scaled[1]);
		pop();
	}
	web_cam_draw_horizon_yokonaga(load ,img){
		translate(width, 0);
		scale(-1, 1);
		if(this.alpha > 0) load.hidden = true;
		if (this.alpha <255) this.alpha += 30;
		tint(255 , this.alpha);
		image(img, 0,0, windowWidth, (this.scaled[0]*windowWidth)/this.scaled[1]);
		pop();
	}
	web_cam_capture(){
		background(255);
		push();
		return this.capture.get();
	}
}
//タッチエフェクト
class Touch_img{
	constructor(){
		this.xyr = [0,0,0];
	}
	touch_effect(){
		this.xyr[2] += 10;
		noStroke();
		fill(255, 255, 255, 100-this.xyr[2]/2);
		circle(this.xyr[0],this.xyr[1],this.xyr[2]);
	}
}
//メッセージ
class Message{
	constructor(undermessage='いえーーーーーい'){
		textFont("'Yusei Magic', sans-serif"); 
		this.str = undermessage;
		this.link_count = 0;
		this.link_flag = false;
		this.m_time = millis();
		this.link_str = "";
		console.log(this.str);
	}
	message_draw(){
		if (this.link_count < this.str.length){
			if(this.link_flag == true){
				if(this.link_count == 0){
					if(millis() - this.m_time> 1000){
						this.m_time = millis();
						this.link_str = this.link_str + this.str[this.link_count];
						this.link_count++;
					}
				}
				else if (millis() - this.m_time> 100){
					this.m_time = millis();
					this.link_str = this.link_str + this.str[this.link_count];
					this.link_count++;
				}
			}
		}
		else{
			this.link_flag = false;
		}
		fill(0,255);
		//画面の幅に応じてフォントサイズを変更していく(納金)
		var font=30
		var tall= height/7

		if(width<=300) {
			tall= height/3;
			font =10;
		}
		else if(width<=400) {
			tall= height/3.7;
			font =15;
		}
		else if(width<=500) {
			font=25;
			tall= height/5;
		}
		else if(width<=550){
			font =25;
			tall= height/6;
		}

		textSize(font);
		textAlign(CENTER);
		text(this.link_str, width/2, height/2-tall);
	}
	message_reset(){
		this.link_count = 0;
		this.link_flag = true;
		this.m_time = millis();
		this.link_str = "";
	}
}