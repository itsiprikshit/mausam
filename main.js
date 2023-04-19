var dataObj = {
    weather: {
        tavg: {},
        prcp: {},
        snow: {},
        awnd: {}
    },
    countries: [],
    landTopo: {},
    world: {}
};

const getVal = (feat, yeardata) => {
    var id = feat.id;

    var country = dataObj.countries.filter((c) => c.numeric == id);

    if (country.length) {
        country = country[0];
        var val = yeardata[country.alpha2];
        return val || 0;
    }

    return 0;
};

const updateGlobe = (datatype, selyear) => {
    var yeardata = dataObj.weather[datatype][selyear];

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

    var responses = await Promise.all([
        fetch("./data/country-codes.json"),
        fetch("./data/weather-yc-tavg.json"),
        fetch("./data/weather-yc-prcp.json"),
        fetch("./data/weather-yc-snow.json"),
        fetch("./data/weather-yc-wind.json")
    ]);

    dataObj.countries = (await responses[0].json()).countries;
    dataObj.weather.tavg = await responses[1].json();
    dataObj.weather.prcp = await responses[2].json();
    dataObj.weather.snow = await responses[3].json();
    dataObj.weather.awnd = await responses[4].json();

    var selectedYear = $("#curr-year").data("year");
    var selectedDataType = $("#data-type select").val();

    dataObj.world = Globe()($("#earth")[0])
        .showGlobe(true)
        .showAtmosphere(true)
        .backgroundImageUrl("./images/night-sky.png")
        .globeImageUrl("./images/earth-night.jpeg")
        .onPolygonHover((hoverD) => {
            dataObj.world.polygonAltitude((d) => {
                var val = d === hoverD ? 0.06 : 0.01;
                return val;
            });
        })
        .polygonsTransitionDuration(300);

    updateGlobe(selectedDataType, selectedYear);

    $("#earth").on("year-change", function (e, year) {
        var selectedDataType = $("#data-type select").val();
        updateGlobe(selectedDataType, year);
    });

    $("#earth").on("data-type-change", function (e, type) {
        var year = $("#curr-year").attr("data-year");
        updateGlobe(type, year);
    });
})();
