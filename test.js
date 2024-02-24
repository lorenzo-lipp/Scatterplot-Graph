function it(msg, fn) { console.assert(fn(), msg); }

window.addEventListener("load", async () => {
    await sleep(500);

    it("should have a title with a corresponding id=\"title\"", () => {
        return document.querySelector("#title") !== undefined;
    });

    it("should have a x-axis with a corresponding id=\"x-axis\"", () => {
        return document.querySelector("#x-axis") !== undefined;
    });

    it("should have a y-axis with a corresponding id=\"y-axis\"", () => {
        return document.querySelector("#y-axis") !== undefined;
    });

    it("should have dots with class=\"dot\", which represent the data being plotted", () => {
        return document.querySelectorAll("circle.dot").length > 1;
    });

    it("should have the properties data-xvalue and data-yvalue containing their corresponding x and y values for each dot", () => {
        let dots = document.querySelectorAll("circle.dot");

        for (let dot of dots) {
            if (!dot.dataset.hasOwnProperty("xvalue") || !dot.dataset.hasOwnProperty("yvalue")) return false;
        }

        return true;
    });

    it("the data-xvalue and data-yvalue of each dot should be within the range of the actual data and in the correct data format (integers for xvalue and dates for yvalues).", () => {
        let dots = document.querySelectorAll("circle.dot");

        for (let dot of dots) {
            let x = Number(dot.dataset.xvalue);
            let y = new Date(dot.dataset.yvalue);

            if (isNaN(x) ||
                x > 2015 || 
                x < 1994 ||
                isNaN(y) ||
                y.getMinutes() > 39 ||
                y.getMinutes() < 36
            ) return false;
        }

        return true;
    });

    it("the data-xvalue and its corresponding dot should align with the corresponding point/value on the x-axis", () => {
        let dots = document.querySelectorAll("circle.dot");

        for (let i = 0; i < dots.length; i++) {
            for (let j = i + 1; j < dots.length; j++) {
                if (+dots[i].dataset.xvalue > +dots[j].dataset.xvalue) {
                    if (+dots[i].getAttribute("cx") <= +dots[j].getAttribute("cx")) return false;
                } else if (+dots[i].dataset.xvalue < +dots[j].dataset.xvalue) {
                    if (+dots[i].getAttribute("cx") >= +dots[j].getAttribute("cx")) return false;
                } else {
                    if (+dots[i].getAttribute("cx") !== +dots[j].getAttribute("cx")) return false;
                }
            }
        }

        return true;
    });

    it("the data-yvalue and its corresponding dot should align with the corresponding point/value on the y-axis", () => {
        let dots = document.querySelectorAll("circle.dot");

        for (let i = 0; i < dots.length; i++) {
            for (let j = i + 1; j < dots.length; j++) {
                if (new Date(dots[i].dataset.yvalue) > new Date(dots[j].dataset.yvalue)) {
                    if (+dots[i].getAttribute("cy") <= +dots[j].getAttribute("cy")) return false;
                } else if (new Date(dots[i].dataset.yvalue) < new Date(dots[j].dataset.yvalue)) {
                    if (+dots[i].getAttribute("cy") >= +dots[j].getAttribute("cy")) return false;
                } else {
                    if (+dots[i].getAttribute("cy") !== +dots[j].getAttribute("cy")) return false;
                }
            }
        }

        return true;
    });

    it("should have multiple tick labels on the y-axis with %M:%S time format", () => {
        let labels = document.querySelectorAll("#y-axis .tick text");

        for (let label of labels) {
            if (label.textContent.length !== 5 ||
                isNaN(Number(label.textContent.slice(0, 2))) ||
                isNaN(Number(label.textContent.slice(3, 5)))
            ) return false;
        }

        return labels.length > 1;
    });

    it("should have multiple tick labels on the x-axis that show the year", () => {
        let labels = document.querySelectorAll("#x-axis .tick text");

        for (let label of labels) {
            if (isNaN(Number(label.textContent))) return false;
        }

        return labels.length > 1;
    });

    it("should have the same range of the x-axis labels and of the actual x-axis data", () => {
        let labels = document.querySelectorAll("#x-axis .tick text");

        return labels.length > 1 && 
               +labels[0].textContent <= 1994 &&
               +labels[labels.length - 1].textContent >= 2015;
    });

    it("should have the same range of the y-axis labels and of the actual y-axis data", () => {
        let labels = document.querySelectorAll("#y-axis .tick text");

        return labels.length > 1 &&
               +labels[labels.length - 1].textContent.slice(0, 2) <= 36 &&
               +labels[0].textContent.slice(0, 2) >= 39;
    });

    it("should have a legend with a corresponding id=\"legend\"", () => {
        return document.querySelector("#legend") !== undefined;
    });

    let dot = document.querySelectorAll(".dot")[0];
    let mOver = new MouseEvent("mouseover");
    let mLeave = new MouseEvent("mouseleave");
    mOver.fromTarget = mLeave.fromTarget = dot;
    dot.dispatchEvent(mOver);

    it("I can mouse over an area and see a tooltip with a corresponding id=\"tooltip\" which displays more information about the area", () => {
        let tooltip = document.querySelector("#tooltip");

        if (!tooltip || tooltip.style.display === "none") return false;

        return true;
    });

    it("should have in the tooltip a data-year property that corresponds to the data-xvalue of the active area", () => {
        let tooltip = document.querySelector("#tooltip");
        
        return tooltip.dataset.year == dot.dataset.xvalue;
    });

    dot.dispatchEvent(mLeave);
});

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }