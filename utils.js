(function () {
    $("#time .previous").on("click", function () {
        var currentYear = $("#curr-year").attr("data-year");
        currentYear--;

        $("#curr-year").attr("data-year", currentYear);
        $("#curr-year").text(currentYear);

        $("#earth").trigger("year-change", currentYear);
    });

    $("#time .start").on("click", function () {
        var startYear = 1900;
        $("#curr-year").attr("data-year", startYear);
        $("#curr-year").text(startYear);

        $("#earth").trigger("year-change", startYear);
    });

    $("#time .next").on("click", function () {
        var currentYear = $("#curr-year").attr("data-year");
        currentYear++;

        if (currentYear > 2022) {
            return;
        }

        $("#curr-year").attr("data-year", currentYear);
        $("#curr-year").text(currentYear);

        $("#earth").trigger("year-change", currentYear);
    });

    $("#time .end").on("click", function () {
        var endYear = 2022;
        $("#curr-year").attr("data-year", endYear);
        $("#curr-year").text(endYear);

        $("#earth").trigger("year-change", endYear);
    });
})();
