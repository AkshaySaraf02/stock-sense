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

        currDate.textContent = date;
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
        titleTextStyle: { color: "#cccccc" },
        curveType: 'function',
        legend: {
            position: 'top',
            textStyle: { color: "#a8a8a8" },

        },
        hAxis: {
            title: "Date",
            titleTextStyle: { color: "a8a8a8" },
            format: 'MMM dd, yyyy', // Format the date display
            gridlines: { color: 'transparent' },
            textStyle: {
                color: '#a8a8a8' // Set the text color for the y-axis
            }
        },
        backgroundColor: 'black',
        vAxis: {
            title: "USD",
            titleTextStyle: { color: "a8a8a8" },
            gridlines: { color: 'transparent' }, // Set vAxis gridlines color to transparent
            textStyle: {
                color: '#a8a8a8' // Set the text color for the y-axis
            },
        },
        colors: ["#3198d4"]
    };

    // Instantiate and draw the chart
    const chart = new google.visualization.LineChart(document.getElementById('chart'));
    chart.draw(newData, options);
}


function forecast() {
    const future_days = document.getElementById("daysInp").value
    const forecastText = document.getElementById("forecast")

    fetch(`/forecast_prices?days=${future_days}`)
        .then(fcstResponse => fcstResponse.json()).then(fcst => {
            forecastText.textContent = fcst
        })
}