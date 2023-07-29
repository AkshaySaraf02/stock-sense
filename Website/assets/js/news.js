function createNewsElements(data) {
    const container = document.querySelector(".headlines");

    data.forEach(item => {
        const headMainDiv = document.createElement("div");
        headMainDiv.classList.add("head-main");

        const headLineDiv = document.createElement("div");
        headLineDiv.classList.add("head-line");
        headLineDiv.textContent = item.headline;

        const infoDiv = document.createElement("div");
        infoDiv.classList.add("info-div");

        const dateSpan = document.createElement("span");
        dateSpan.classList.add("details");
        dateSpan.textContent = "Dated: ";

        const dateValueSpan = document.createElement("span");
        dateValueSpan.classList.add("values");
        dateValueSpan.textContent = item.date;
        dateValueSpan.id = "head-date";

        const sentimentSpan = document.createElement("span");
        sentimentSpan.classList.add("details");
        sentimentSpan.textContent = "Sentiment: ";

        const sentimentValueSpan = document.createElement("span");
        sentimentValueSpan.classList.add("values");
        sentimentValueSpan.textContent = item.sentiment;
        sentimentValueSpan.id = "sentiment";

        infoDiv.appendChild(dateSpan);
        infoDiv.appendChild(dateValueSpan);
        infoDiv.appendChild(sentimentSpan);
        infoDiv.appendChild(sentimentValueSpan);

        headMainDiv.appendChild(headLineDiv);
        headMainDiv.appendChild(infoDiv);

        container.appendChild(headMainDiv);
    });
}

function fetchNews() {
    const query = document.getElementById("newsQuery")
    const queryText = query.value
    const heading = document.getElementById("top-headline");
    const prevTags = document.getElementById("headlines");

    if (queryText !== "") {
        fetch(`/fetch_news?query=${queryText}`)
            .then(response => response.json()).then(data => {
                prevTags.innerHTML = ""
                heading.style.display = "block";
                if (data.length > 0) {
                    heading.textContent = "Top Headlines"
                    createNewsElements(data)
                }
                else {
                    heading.textContent = "Try something else"
                }
            }
            )
    }
    else {
        heading.style.display = "none";
        prevTags.innerHTML = "";

    }
};
