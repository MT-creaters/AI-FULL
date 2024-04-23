import {db_im} from './app.js';

function AddName(){
        
  // select要素を複製
  var originalSelect = document.getElementById('selectName');
  var clonedSelect = originalSelect.cloneNode(true);

  // 新しいselect要素の初期値をクリア
  clonedSelect.selectedIndex = 0;
  
  const formElementsCount = document.forms['form1'].children.length - 4;
  
  clonedSelect.id = 'selectName' + formElementsCount;
  clonedSelect.querySelector('select').id = 'selectElement' + formElementsCount;

  
  // 新しいselect要素を追加
  var form = document.forms['form1'];
  var addButton = document.getElementById('addName');

  form.insertBefore(clonedSelect, addButton);
}

function ClearName(){
  const formElementsCount = document.forms['form1'].children.length - 4;

  for(let i=1; i < formElementsCount+1; i++){
      // 削除する select 要素の id を生成
      const selectId = 'selectName' + i;

      // 削除する select 要素を取得
      const selectToRemove = document.getElementById(selectId);
  
      // select 要素が存在すれば削除
      if (selectToRemove) {
          selectToRemove.parentNode.removeChild(selectToRemove);
      }
  }

}
console.log("ok");
// document.getElementById('datepicker').addEventListener("change", function() {
document.getElementById('datepicker').addEventListener('click' , () => {
    db_im.open().then(function() {
      var selectElement = document.getElementById("selectElement");

      // // 既存のoptionを全て削除
      // while (selectElement.firstChild) {
      //   if (selectElement.firstChild.value !== "") {
      //     selectElement.removeChild(selectElement.firstChild);
      //   }
      //   console.log('aaaaaaaaaaaaaaaaaaaaaaaaa')
      // }
      ClearName()

      // 既存のoptionを全て削除
      var optionCount = selectElement.options.length;
      for (var i = optionCount - 1; i >= 0; i--) {
          if (selectElement.options[i].value !== "" && !selectElement.options[i].hasAttribute('hidden')) {
              selectElement.remove(i);
          }
      }
  
      // データを取得してselect要素に追加
      db_im.photos.each(function(item) {
        var option = document.createElement("option");
        option.value = item.name;
        option.textContent = item.name;
        selectElement.appendChild(option);
      }).catch(function(error) {
        console.error("データ取得中にエラーが発生しました:", error);
      });
    }).catch(function(error) {
      console.error("データベースのオープン中にエラーが発生しました:", error);
    });
  });


document.getElementById('addName').addEventListener('click', () => AddName());
document.getElementById('selectElement').addEventListener('change', () => ClearName());