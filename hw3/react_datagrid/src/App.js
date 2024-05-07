import logo from './logo.svg';
import './App.css';
import DataGrid from 'react-data-grid';

const columns = [
    { key: 'id', name: 'ID' },
    { key: 'title', name: 'Title' }
];

const rows = [
    { id: 0, title: 'Example' },
    { id: 1, title: 'Demo' }
];

var currentPage = 1, delTable = 0, search = 0;
var dataset;
var openUrl = "https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6";
var xhr = new XMLHttpRequest();
xhr.open('GET', openUrl, true);
xhr.send();
xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        dataset = JSON.parse(this.responseText);
        addNewData(dataset, currentPage);
    }
};

function addNewData(dataset, currentPage) {
    var myTable = document.getElementById("csie");
    var dataTotal = dataset.length;
    const perpage = 10;
    var pageTotal = Math.ceil(dataTotal / perpage);

    if (currentPage > pageTotal) {
        currentPage = pageTotal;
    }
    var minData = (currentPage * perpage) - perpage + 1;
    var maxData = (currentPage * perpage);

    if (delTable === 1) {
        dataset.forEach(function (data, index) {
            var num = index + 1;
            if (num >= minData && num <= maxData) {
                var row = myTable.deleteRow(-1);
            }
        });
    }
    
    dataset.forEach(function (data, index) {
        var num = index + 1;
        if (num >= minData && num <= maxData) {
            var row = myTable.insertRow(-1);
            row.insertCell(0).innerHTML = data['title'];
            row.insertCell(1).innerHTML = data['showInfo'][0]['location'];
            row.insertCell(2).innerHTML = data['showInfo'][0]['price'];
        }
    });
    if (search === 1) {
        dataset.forEach(function (data, index) {
            var num = index + 1;
            if (num >= minData && num <= maxData) {
                var row = myTable.deleteRow(-1);
            }
        });
        dataTotal = 0;
        dataset.forEach(function (data, index) {
            var num = index + 1;
            if (num >= minData && num <= maxData) {
                if (data['title'].includes(document.getElementsByName("searchT")[0])) {
                    dataTotal++;
                    var row = myTable.insertRow(-1);
                    row.insertCell(0).innerHTML = data['title'];
                    row.insertCell(1).innerHTML = data['showInfo'][0]['location'];
                    row.insertCell(2).innerHTML = data['showInfo'][0]['price'];
                }
            }
        });
    }
    const page = {
        pageTotal,
        currentPage,
        hasPrevious: currentPage > 1,
        hasNext: currentPage < pageTotal,
    }
    pageDisplay(page);
    delTable = 0;
}

function pageDisplay(page) {
    var str = "";
    str = page.currentPage + " / " + page.pageTotal + " 頁";
    document.getElementById("pageid").innerHTML = str;
}

function prevPage() {
    delTable = 1;
    if (currentPage > 1) {
        currentPage--;
    }
    xhr.open('GET', openUrl, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            dataset = JSON.parse(this.responseText);
            addNewData(dataset, currentPage);
        }
    };
}
function nextPage() {
    delTable = 1;
    currentPage++;
    xhr.open('GET', openUrl, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            dataset = JSON.parse(this.responseText);
            addNewData(dataset, currentPage);
        }
    };
}

function searchData() {
    if (document.getElementsByName("searchT")[0] != null) search = 1;
    else search = 0;
}

function App() {
  return (
    <div className="App">
        <form searchtable="true">
            <h1>景點觀光展覽資訊  <input name="searchT" type="text" onChange={searchData()}></input></h1>
        </form>
        <table>
            <thead>
                <tr>
                    <th>名稱</th>
                    <th>地點</th>
                    <th>票價</th>
                </tr>
            </thead>
        </table>
        <table id="csie" className="table table-striped table-hover">
            <tbody>
                <tr>
                    <DataGrid columns={columns} rows={rows} pageSize={5} checkboxSelection />
                </tr>
            </tbody>
        </table>

        <button onClick={prevPage()}>上一頁</button>
        <span id="pageid"></span>
        <button onClick={nextPage()}>下一頁</button>
    </div>
  );
}

export default App;
