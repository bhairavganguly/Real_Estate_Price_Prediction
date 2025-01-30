function getBathValue() {
    const uiBathrooms = document.getElementsByName("uiBathrooms");
    for (let i in uiBathrooms) {
        if (uiBathrooms[i].checked) {
            return parseInt(uiBathrooms[i].value);
        }
    }
    return -1; // Invalid value
}

function getBHKValue() {
    const uiBHK = document.getElementsByName("uiBHK");
    for (let i in uiBHK) {
        if (uiBHK[i].checked) {
            return parseInt(uiBHK[i].value);
        }
    }
    return -1; // Invalid value
}

function populateLocations() {
    const url = "http://127.0.0.1:5000/get_location_names";
    $.get(url, function (data, status) {
        if (data) {
            const locations = data.locations;
            const locationDropdown = $("#location");
            locationDropdown.empty();
            locationDropdown.append('<option value="" disabled selected>Choose a Location</option>');
            locations.forEach((location) => {
                locationDropdown.append(new Option(location, location));
            });
            locationDropdown.select2({
                placeholder: "Choose a Location",
                allowClear: true,
            });
        }
    });
}

function onClickedEstimatePrice() {
    const sqft = parseFloat($("#uiSqft").val());
    const bhk = getBHKValue();
    const bathrooms = getBathValue();
    const location = $("#location").val();

    if (!location) {
        alert("Please select a location");
        return;
    }

    const url = "http://127.0.0.1:5000/predict_home_price";
    $.post(
        url,
        { total_sqft: sqft, bhk: bhk, bath: bathrooms, location: location },
        function (data, status) {
            if (data.estimated_price) {
                $("#price").text(`${data.estimated_price} Lakh`);
            } else {
                $("#price").text("Prediction Error");
            }
        }
    );
}

$(document).ready(function () {
    populateLocations();
});
