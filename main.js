var dataObj = {
    weather: {},
    landTopo: {},
    world: {}
};
const getVal = (feat, yeardata) => {
    var id = feat.id;

    var country = COUNTRY_CODES.filter((c) => c.numeric == id);

    if (country.length) {
        country = country[0];
        var val = yeardata[country.alpha2];
        return val || 0;
    }

    return 0;
};

const updateGlobe = (selectedyear) => {
    var yeardata = dataObj.weather[selectedyear];

    var allvals = [];
    for (y in yeardata) {
        allvals.push(yeardata[y]);
    }

    var max = Math.max(...allvals);

    const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);
    colorScale.domain([0, max]);

    dataObj.world
        .polygonsData(topojson.feature(dataObj.landTopo, dataObj.landTopo.objects.countries).features)
        .polygonCapColor((feat) => {
            var val = getVal(feat, yeardata);
            var clr = colorScale(val);
            return clr;
        })
        .polygonSideColor(() => "rgba(0, 100, 0, 0.15)")
        .polygonStrokeColor(() => "#111");
};

(async function () {
    var response = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
    dataObj.landTopo = await response.json();

    response = await fetch("./data/weather-yc.json");
    dataObj.weather = await response.json();

    selectedyear = $("#curr-year").data("year");

    dataObj.world = Globe()($("#earth")[0]).showGlobe(true).showAtmosphere(true).backgroundImageUrl("./images/night-sky.png").globeImageUrl("./images/earth-night.jpeg");

    updateGlobe(selectedyear);

    $("#earth").on("year-change", function (e, year) {
        updateGlobe(year);
    });
})();
