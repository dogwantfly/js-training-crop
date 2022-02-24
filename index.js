const url = "https://hexschool.github.io/js-filter-data/data.json";
const productsList = document.querySelector(".showList");
const buttonGroup = document.querySelector(".button-group");
const search = document.querySelector(".search");
const searchResult = document.querySelector(".show-result");
const cropName = document.querySelector('#crop');
const select = document.querySelector('.sort-select');
const mobileSelect = document.querySelector('.mobile-select');
const sortAdvanced = document.querySelector(".js-sort-advanced");
let data = [];
let filterType = '';
let filterData = [];
let searchData = [];
let sortData = [];

function renderData(data) {
  let str = '';
  data.forEach((item) => {
    str += `<tr>
        <td>${item.作物名稱}</td>
        <td>${item.市場名稱}</td>
        <td>${item.上價}</td>
        <td>${item.中價}</td>
        <td>${item.下價}</td>
        <td>${item.平均價}</td>
        <td>${item.交易量}</td>
        </tr>`;
  })
  productsList.innerHTML = str;
}
function getData(){
  axios.get(url)
    .then(function (response) {
      data = response.data.filter((item) => item['作物名稱'] && item['種類代碼'].trim());
      renderData(data);
    })
    .catch(function (err) {
      console.log(err);
    })
}
function filter(e) {
  if (e.target.classList.contains('btn-type')) {
    let arr = [...buttonGroup.querySelectorAll('button')];
    let type = e.target.dataset.type;
    
    arr.forEach((item) => {
      if (item.dataset.type !== type) {
        item.classList.remove('active')
      }
    })
    e.target.classList.toggle('active');
    if (e.target.classList.contains('active')) {
      filterType = type;
    } else {
      filterType = '';
    }
    if (filterType) {
      filterData = data.filter((item) => item.種類代碼 === filterType);
    } else {
      filterData = []
    }
  }
}
function searchCrop(e) {
  if (e.target.id === 'crop' && e.type === 'click') return false;
  if (e.target.classList.contains('search')) {
    if (cropName.value.trim() === '' && e.type === 'click') {
      searchResult.textContent = '請輸入作物名稱！'
      searchResult.classList.add('text-danger');
      return false;
    }
  }
  if (cropName.value.trim()) {
    if (filterData.length) {
      searchData = filterData.filter((item) => item.作物名稱.match(cropName.value))
    } else {
      searchData = data.filter((item) => item.作物名稱.match(cropName.value))
    }
    if (cropName.value.trim() && !searchData.length) {
      searchResult.textContent = '';
      productsList.innerHTML = `<tr><td colspan="6" class="text-center p-3">查詢不到交易資訊QQ</td></tr>`;
      return false;
    } else {
      searchResult.textContent = `查看「${cropName.value}」的比價結果，共有 ${searchData.length} 筆`
      searchResult.classList.remove('text-danger');
    }
  } else {
    searchData = []
    searchResult.textContent = ''
    searchResult.classList.remove('text-danger');
  }
  return true;
}
function selectSort(e) {
  if (e.target.nodeName === 'I') {
    let sortPrice = e.target.dataset.price;
    select.value = sortPrice;
  } else if (e.target.classList.contains('mobile-select')) {
    select.value = mobileSelect.value
  }
  if (select.value){
    if (searchData.length && filterData.length) {
      sortData = [...searchData];
    } else if (searchData.length){
      sortData = [...searchData];
    } else if (filterData.length){
      sortData = [...filterData];
    } else {
      sortData = [...data];
    }
    let sortBy = select.value.slice(1, select.value.length -2);
    let sortCaret = e.target.dataset.sort;
    if (sortCaret === 'down') {
      sortData.sort((a,b) => a[sortBy] -  b[sortBy])
    } else if (sortCaret === 'up'|| !sortCaret){
      sortData.sort((a,b) => b[sortBy] -  a[sortBy])
    }
  } else {
    sortData = [];
  }
}
function handleData(e) {
  filter(e);
  if (!searchCrop(e)) return;
  selectSort(e)
  productsList.innerHTML = `<tr><td colspan="6" class="text-center p-3">資料載入中...</td></tr>`;
  let finalData = [];
  if (sortData.length && searchData.length && filterData.length) {
    finalData = [...sortData];
  } else if (searchData.length && filterData.length) {
    finalData = [...searchData];
  } else if (sortData.length && filterData.length) {
    finalData = [...sortData];
  } else if (sortData.length && searchData.length) {
    finalData = [...sortData];
  } else if (sortData.length) {
    finalData = [...sortData];
  } else if (searchData.length) {
    finalData = [...searchData];
  } else if (filterData.length) {
    finalData = [...filterData];
  } else {
    finalData = [...data];
  }
  renderData(finalData);
}

buttonGroup.addEventListener("click", handleData);
search.addEventListener('click', handleData)
cropName.addEventListener('change', handleData)
select.addEventListener('change', handleData)
sortAdvanced.addEventListener('click', handleData)
mobileSelect.addEventListener('change', handleData)
getData();
