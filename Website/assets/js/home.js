google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);


const stockSelection = document.getElementById("stock-selection")
const selectedStock = document.getElementById("selected-stock")

stockSelection.addEventListener("click", function () {
    fetch(`/stock_list`)
        .then(response => response.json()).then(data => {
            const fetchedData = data
            console.log("Stock List Fetched Successfully");

            stockSelection.innerHTML = ""

            fetchedData.forEach(option => {
                const optionElement = document.createElement("option");
                optionElement.textContent = option;
                optionElement.value = option;
                stockSelection.appendChild(optionElement);
            });
        })
});

stockSelection.addEventListener("change", function () {
    const newStockSelection = stockSelection.value.replace("&", "%26")
    selectedStock.textContent = newStockSelection.replace("%26", "&")

    if (newStockSelection !== "") {
        fetch(`/stock_data?name=${newStockSelection}`)
            .then(response => response.json()).then(data => {
                const stockData = data;
                console.log("Stock Data Fetched Successfully");

                drawChart(stockData);
            });
    }
}
);


function drawChart(data) {
    const dataArray = Object.entries(data).map(([date, values]) => {

        const currDate = document.getElementById("date");
        const open = document.getElementById("open")
        const close = document.getElementById("close")
        const high = document.getElementById("high")
        const low = document.getElementById("low")
        const volume = document.getElementById("volume")

        currDate.textContent = "As on " + " " + date;
        open.textContent = values.open + " (USD)";
        close.textContent = values.close + " (USD)";
        high.textContent = values.high + " (USD)";
        low.textContent = values.low + " (USD)";
        volume.textContent = values.volume;

        return [new Date(date), values.close];
    });
    const newData = new google.visualization.DataTable();
    newData.addColumn('date', 'Date');
    newData.addColumn('number', 'Close Price');
    newData.addRows(dataArray);

    // Set options for the chart
    const options = {
        title: 'Stock Close Prices',
        titleTextStyle: { color: "black" },
        curveType: 'function',
        legend: {
            position: 'top',
            textStyle: { color: "#a8a8a8" },

        },
        hAxis: {
            title: "Date",
            titleTextStyle: { color: "black" },
            format: 'MMM dd, yyyy', // Format the date display
            gridlines: { color: 'transparent' },
            textStyle: {
                color: 'a8a8a8' // Set the text color for the y-axis
            }
        },
        backgroundColor: 'white',
        vAxis: {
            title: "USD",
            titleTextStyle: { color: "black" },
            gridlines: { color: 'transparent' }, // Set vAxis gridlines color to transparent
            textStyle: {
                color: 'a8a8a8' // Set the text color for the y-axis
            },
        },
        colors: ["black"]
    };

    // Instantiate and draw the chart
    const chart = new google.visualization.LineChart(document.getElementById('chart'));
    chart.draw(newData, options);
}


function forecast() {
    const future_days = document.getElementById("daysInp").value
    const forecastText = document.getElementById("forecast")
    console.log("Fetching")
    fetch(`/forecast_prices?days=${future_days}`)
        .then(fcstResponse => fcstResponse.json()).then(fcst => {
            forecastText.textContent = fcst;
            console.log("Fetched Successfully")

        })
}


function add_stock() {
    const add_btn = document.getElementById("add-stock");
    if (selectedStock.textContent != "") {
        // add_btn.style.transition = "all 0.3s ease";
        add_btn.textContent = "Stock Added";
        add_btn.style.backgroundColor = "#26A65B";
        add_btn.style.color = "white"
        add_btn.style.marginLeft = "30rem"
    }
    else {
    }
}
