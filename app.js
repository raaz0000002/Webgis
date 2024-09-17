let inputCount = 0;

// Function to add rows based on number of stations
document.getElementById("addRowsBtn").addEventListener("click", function () {
    const numStations = parseInt(document.getElementById("numStations").value);
    const inputContainer = document.getElementById("inputContainer");

    // Clear existing inputs if any
    inputContainer.innerHTML = "";
    inputCount = numStations;

    for (let i = 1; i <= numStations; i++) {
        const newInputGroup = document.createElement("div");
        newInputGroup.classList.add("input-group");
        newInputGroup.innerHTML = `
            <label for="angle${i}">Angle at Station ${i} (in degrees):</label>
            <input type="number" id="angle${i}" name="angle${i}" step="0.01" required>
            <label for="distance${i}">Distance to Station ${i} (in meters):</label>
            <input type="number" id="distance${i}" name="distance${i}" step="0.01" required>
        `;
        inputContainer.appendChild(newInputGroup);
    }
});

// Function to calculate bearings and traverse
document.getElementById("traverseForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const resultDialog = document.getElementById("resultDialog");
    const dialogContent = document.getElementById("dialogContent");
    let resultHtml = "<ul>";
    let tableRows = "";

    let bearing = 0; // Starting bearing
    let prevNorthing = 0; // Initial northing
    let prevEasting = 0; // Initial easting

    for (let i = 1; i <= inputCount; i++) {
        const angle = parseFloat(document.getElementById(`angle${i}`).value);
        const distance = parseFloat(document.getElementById(`distance${i}`).value);

        // Calculating new bearing
        bearing = (bearing + angle) % 360; // Keep bearing between 0-360 degrees

        // Converting bearing to radians for calculations
        const radian = bearing * (Math.PI / 180);
        const northing = distance * Math.cos(radian); // Northing component
        const easting = distance * Math.sin(radian);  // Easting component

        // Calculating cumulative northing and easting
        const totalNorthing = prevNorthing + northing;
        const totalEasting = prevEasting + easting;

        resultHtml += `
            <li>Station ${i}: Bearing: ${bearing.toFixed(2)}°, Northing: ${totalNorthing.toFixed(2)} m, Easting: ${totalEasting.toFixed(2)} m</li>
        `;

        // Adding data to table
        tableRows += `
            <tr>
                <td>${i}</td>
                <td>${bearing.toFixed(2)}</td>
                <td>${angle.toFixed(2)}</td>
                <td>${distance.toFixed(2)}</td>
                <td>${totalNorthing.toFixed(2)}</td>
                <td>${totalEasting.toFixed(2)}</td>
            </tr>
        `;

        // Updating previous Northing and Easting for the next station
        prevNorthing = totalNorthing;
        prevEasting = totalEasting;
    }

    resultHtml += "</ul>";
    dialogContent.innerHTML = resultHtml;

    // Entering the calculated data to the table
    document.querySelector("#dataTable tbody").innerHTML = tableRows;

    // Showing the dialog box with the results
    resultDialog.showModal();
});

// Closing the dialog box
document.getElementById("closeDialog").addEventListener("click", function () {
    document.getElementById("resultDialog").close();
});
