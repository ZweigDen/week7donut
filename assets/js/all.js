
let data = [];
let myData = data;


// 抓取填寫資料內容
const packName = document.querySelector("#packName");
const packUrl = document.querySelector("#packUrl");
const areaOptions = document.querySelector("#areaOptions");
const packMoney = document.querySelector("#packMoney");
const packNum = document.querySelector("#packNum");
const packStar = document.querySelector("#packStar");
const packTextArea = document.querySelector("#packTextArea");

// 新增資料按鈕
const addClickBtn = document.querySelector("#addData");
addClickBtn.addEventListener("click", function (e) {
    addData(packName.value, packUrl.value, areaOptions.value, packMoney.value, packNum.value, packStar.value, packTextArea.value);
})

// 地區搜尋選項
const areaSelect = document.querySelector(".areaSelect");
areaSelect.addEventListener("change", function () {
    seachData();
});


// axios請求api
function init() {
    axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
        .then(function (response) {
            response.data.data.forEach(function (item,index){
                data.push(item);
            });
            travelData(myData); //執行呈現風景資料
            searchNum(); //執行收尋計數
            donut(); //執行圓餅圖函式
        })
}

// 收尋資料
function seachData() {
    myData = [];
    data.forEach(function (item, index) {
        if (areaSelect.value == item.area) {
            myData.push(item);
        } else if (areaSelect.value == "") {
            myData = data;
        }
    });
    // 重新繪製畫面
    travelData(myData);
    searchNum();
    donut();
}

// 搜尋計數器
function searchNum() {
    const dataNum = document.querySelector(".searchNum");
    let str = `<h6>本次搜尋共 ${myData.length} 筆資料</h6>`;
    dataNum.innerHTML = str;
}

// 呈現各風景資料
function travelData(data) {
    let str = "";
    const list = document.querySelector("#showData");
    data.forEach(function (item, index) {
        let content = `<li class="col-4 mb-4">
    <div class="card h-100 headerBorder">
        <img src="${item.imgUrl}" class="card-img-top imgBorder">
        <div class="areaBox">${item.area}</div>
        <div class="starBox">${item.rate}</div>
        <div class="card-body d-flex flex-column justify-content-between">
          <div class="mb-4">
            <h4 class="card-title text-primary borderLine3 pb-2 mb-3">${item.name}</h4>
            <p class="card-text text-dark">${item.description}</p>
          </div>
          <div class="d-flex justify-content-between text-primary">
            <div class="d-flex align-items-center"><i class="fas fa-exclamation-circle h5 mr-1 mb-0"></i>剩下最後 ${item.group} 組</div>
            <div class="d-flex align-items-center ">TWD<h2 class="mb-0 ml-1">$${item.price}</h2></div>
          </div>
        </div>
      </div>
</li>`;
        str += content;
    });
    list.innerHTML = str;
};

// 新增資料
function addData(packName, packUrl, areaOptions, packMoney, packNum, packStar, packTextArea) {
    if (packName == "" || packUrl == "" || areaOptions == "地區搜尋" || packMoney == "" || packNum == "" || packStar == "" || packTextArea == "") {  //資料檢查
        alert('所有欄位都要填寫！');
        return;
    }
    let newData = {};
    newData.id = data.length;
    newData.name = packName;
    newData.imgUrl = packUrl;
    newData.area = areaOptions;
    newData.description = packTextArea;
    newData.group = packNum;
    newData.price = packMoney;
    newData.rate = packStar;
    data.push(newData);
    seachData();
    // 執行清除資料
    clearNewData();
};

// 清除資料
function clearNewData() {
    packName.value = "";
    packUrl.value = "";
    packMoney.value = "";
    packNum.value = "";
    packStar.value = "";
    packTextArea.value = "";
}

// 圓餅圖
function donut(){
    // 紀錄目前各地區的資料數
    let areaBox = {};
    let columnsAry=[]; 
    myData.forEach(function(item){
        if(areaBox[item.area] == undefined){
            areaBox[item.area] = 1;
        }else{
            areaBox[item.area] +=1;
        }
    });
    // 將資料轉為陣列
    let areaAry = Object.keys(areaBox).forEach(function(item){
        columnsAry.push([item,areaBox[item]]);
    });
    console.log(columnsAry);
    let chart = c3.generate({
        bindto: '#chart',
        data: {
          columns: columnsAry,
          type:"donut",
          colors:{
              "高雄":"#E68618",
              "台中":"#5151D3",
              "台北":"#26BFC3"
          }
        },
        donut:{
            title:"套票地區比重"
        }
    });
}

window.onload = init;

