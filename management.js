let jobCount = parseInt(localStorage.getItem("jobCount") || "0");

let jobNumberSpan = document.getElementById("jobNumber");
jobNumberSpan.innerText = jobCount.toString();

const materials = [
  { name: "Tool Steel", price: 10.00, stock: 5, id: 0 },
  { name: "High-Speed Steel", price: 20.19, stock: 2, id: 1 },
  { name: "Carbide", price: 32.00, stock: 5, id: 2 },
  { name: "Cast Iron", price: 1, stock: 500, id: 3 },
  { name: "Polymer composites", price: 10.00, stock: 5, id: 4 },
  { name: "M12 Dies", price: 15.50, stock: 2, id: 5 },
];

const materialsTableBody = document.getElementById("materialsTableBody");
const materialsForJobTableBody = document.getElementById("materialsForJobTableBody");
const editMaterialsForJobTableBody = document.getElementById("editMaterialsTableBody");
const deleteMaterialsForJobTableBody = document.getElementById("deleteMaterialsForJobTableBody");


const jobSaveButton = document.getElementById("jobSaveButton");


const jobDisplayButton = document.getElementById("jobViewButton");
let isTableVisible = false; // Track the visibility state


const jobTable = document.getElementById("jobList");

const jobDeleteButton = document.getElementById("jobDeleteButton");

function addMaterialToTable(material) {
  const tableRow = document.createElement("tr");

  const checkboxCell = document.createElement("td");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("itemCheckbox");
  checkbox.name = "item";
  checkbox.value = material.id.toString();
  checkboxCell.appendChild(checkbox);

  const nameCell = document.createElement("td");
  nameCell.textContent = material.name;

  const priceCell = document.createElement("td");
  priceCell.textContent = `$${material.price.toFixed(2)}`; // Format price with 2 decimals

  const stockCell = document.createElement("td");
  stockCell.textContent = material.stock;

  const idCell = document.createElement("td");
  idCell.textContent = material.id;

  tableRow.appendChild(checkboxCell);
  tableRow.appendChild(nameCell);
  tableRow.appendChild(priceCell);
  tableRow.appendChild(stockCell);
  tableRow.appendChild(idCell);

  materialsTableBody.appendChild(tableRow);
}

materials.forEach(addMaterialToTable);

function checkInputs() {
  const jobName = document.getElementById("name").value.trim();
  const jobDescription = document.getElementById("description").value.trim();
  const jobStartDate = document.getElementById("startDate").value.trim();
  const jobEndDate = document.getElementById("endDate").value.trim();
  const jobStartTime = document.getElementById("startTime").value.trim();
  const jobEndTime = document.getElementById("endTime").value.trim();

  const today = new Date();
  let dateStarting = new Date();
  let selectedDate = null;

  const materialSelected = [];
  const allCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  for (let i = 0; i < allCheckboxes.length; i++) {
    materialSelected.push(allCheckboxes[i].value);
  }

  let hasErrors = false;
  let errorMessages = "";

  if (jobName.length === 0) {
    hasErrors = true;
    errorMessages += "Please enter a job name.\n";
  }

  if (jobDescription.length === 0) {
    hasErrors = true;
    errorMessages += "Please provide a job description.\n";
  }

  if (jobStartDate.length === 0) {
    hasErrors = true;
    errorMessages += "Please select a start date.\n";
  }

  try {
    selectedDate = new Date(jobStartDate);
  } catch (error) {
    console.error("Invalid date format:", error);
  }

  if (!selectedDate) {
    hasErrors = true;
    errorMessages += "Please select a start date on or after today.";
  }

  dateStarting = new Date(jobStartDate);

  if (jobEndDate.length === 0) {
    hasErrors = true;
    errorMessages += "Please select an end date.\n";
  }

  try {
    selectedDate = new Date(jobEndDate);
  } catch (error) {
    console.error("Invalid date format:", error);
  }

  if (selectedDate < dateStarting) {
    hasErrors = true;
    errorMessages += "Please select an end date after starting date.";
  }

  if (jobStartTime.length === 0) {
    hasErrors = true;
    errorMessages += "Please select a start time.\n";
  }

  if (jobEndTime.length === 0) {
    hasErrors = true;
    errorMessages += "Please select an end time.\n";
  }

  if (materialSelected.length === 0) {
    hasErrors = true;
    errorMessages += "Please select at least one material.\n";
  }

  if (hasErrors) {
    window.alert(errorMessages); // Or display errors in a more user-friendly way
    return false; // Prevent form submission if errors exist
  } else {
    console.log("All inputs are valid!"); // Proceed with form submission or other actions
    return true;
  }
}

function storeJobInfo() {

  const jobNumber = jobCount;
  const jobName = document.getElementById("name").value;
  const jobDescription = document.getElementById("description").value;
  const jobStartDate = document.getElementById("startDate").value;
  const jobEndDate = document.getElementById("endDate").value;
  const jobStartTime = document.getElementById("startTime").value;
  const jobEndTime = document.getElementById("endTime").value;

  let materialSelected = [];
  const allCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');

  for (let i = 0; i < allCheckboxes.length; i++) {
    materialSelected.push(allCheckboxes[i].value);
  }

  console.log(materialSelected);

  const jobData = {
    jobNumber: jobNumber,
    jobName: jobName,
    jobDescription: jobDescription,
    jobStartDate: jobStartDate,
    jobEndDate: jobEndDate,
    jobStartTime: jobStartTime,
    jobEndTime: jobEndTime,
    materials: materialSelected

  };

  let existingJobs = JSON.parse(localStorage.getItem("jobDetails")) || [];

  existingJobs.push(jobData);

  localStorage.setItem("jobDetails", JSON.stringify(existingJobs));

  jobCount = jobCount + 1;
  localStorage.setItem("jobCount", jobCount.toString());

  document.getElementById("name").value = "";
  document.getElementById("description").value = "";
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
  document.getElementById("startTime").value = "";
  document.getElementById("endTime").value = "";
  allCheckboxes.forEach(checkbox => {
    checkbox.checked = false;
  });

}

jobSaveButton.addEventListener('click', (event) => {
  event.preventDefault();

  if (checkInputs()) {
    storeJobInfo();
    jobNumberSpan.innerText = jobCount.toString();
    ongoingJobsSelect.innerHTML = " ";
    populateDropdown();
  }

});

function displayJobs() {
  const jobs = JSON.parse(localStorage.getItem("jobDetails")) || [];
  const jobList = document.getElementById("jobList");
  jobList.innerHTML = ""; // Clear previous content

  // Create the table element
  const jobTable = document.createElement("table");
  jobTable.classList.add("job-table"); // Add a CSS class for styling (optional)

  // Create table header row
  const tableHeader = document.createElement("tr");
  tableHeader.innerHTML = `
      <th>Job Number</th>
      <th>Job Name</th>
      <th>Job Description</th>
      <th>Job Start Date</th>
      <th>Job End Date</th>
      <th>Job Start Time</th>
      <th>Job End Time</th>
      <th>Materials</th>
    `;
  jobTable.appendChild(tableHeader);

  // Loop through jobs and create table rows
  for (const job of jobs) {
    const tableRow = document.createElement("tr");
    tableRow.innerHTML = `
        <td>${job.jobNumber}</td>
        <td>${job.jobName}</td>
        <td>${job.jobDescription}</td>
        <td>${job.jobStartDate}</td>
        <td>${job.jobEndDate}</td>
        <td>${job.jobStartTime}</td>
        <td>${job.jobEndTime}</td> 
        <td>${job.materials.join(", ")}</td>`
    jobTable.appendChild(tableRow);
  }

  jobList.appendChild(jobTable);
}

function hideJobs() {
  const jobList = document.getElementById("jobList");
  const jobTable = jobList.querySelector("table.job-table"); // Target by class
  if (jobTable) {
    jobList.removeChild(jobTable);
  }
}

jobDisplayButton.addEventListener('click', (event) => {
  event.preventDefault();

  isTableVisible = !isTableVisible; // Toggle visibility state

  if (isTableVisible) {
    displayJobs();
    jobTable.style.display = 'table'; // Show the table
    jobDisplayButton.textContent = 'Hide Table'; // Update button text for clarity
  } else {
    jobTable.style.display = 'none'; // Hide the table
    jobDisplayButton.textContent = 'Show Table'; // Update button text for clarity
  }
});

// displayJobs();
// // hideJobs();
// localStorage.clear();

//===================================================================================================================================================================================//

const ongoingJobsSelect = document.getElementById("ongoing-jobs");

// Function to retrieve data from local storage
function getJobDetailsFromLocalStorage() {
  const jobDetailsString = localStorage.getItem("jobDetails");
  if (jobDetailsString) {
    return JSON.parse(jobDetailsString);
  } else {
    return []; // Return empty array if no data exists
  }
}

// Function to populate dropdown with job details
function populateDropdown() {
  const jobDetails = getJobDetailsFromLocalStorage();
  const filteredJobs = jobDetails.filter(job => Number(job.jobNumber) !== -1);

  filteredJobs.forEach((job) => {
    const option = document.createElement("option");
    option.value = job.jobNumber; // Assuming job has an ID property
    option.textContent = "ID: " + job.jobNumber + "\tName: " + job.jobName; // Assuming job has a name property
    ongoingJobsSelect.appendChild(option);
  });
}

function viewAddMaterialsForJob(material) {
  console.log("yep baby!");
  const tableRow = document.createElement("tr");

  const nameCell = document.createElement("td");
  nameCell.textContent = material.name;

  const priceCell = document.createElement("td");
  priceCell.textContent = `$${material.price.toFixed(2)}`; // Format price with 2 decimals

  const stockCell = document.createElement("td");
  stockCell.textContent = material.stock;

  const idCell = document.createElement("td");
  idCell.textContent = material.id;

  tableRow.appendChild(nameCell);
  tableRow.appendChild(priceCell);
  tableRow.appendChild(stockCell);
  tableRow.appendChild(idCell);

  materialsForJobTableBody.appendChild(tableRow);
}

// Function to update job details text elements
function updateJobDetailsText(selectedJob) {
  const jobDetails = getJobDetailsFromLocalStorage();
  const selectedJobObject = jobDetails[selectedJob];

  for (var i = materialsForJobTableBody.rows.length - 1; i >= 0; i--) {
    materialsForJobTableBody.deleteRow(i);
  }

  if (selectedJobObject) {
    document.getElementById("viewJobNumber").textContent = selectedJobObject.jobNumber;
    document.getElementById("viewJobName").textContent = selectedJobObject.jobName;
    // Update other text elements based on your jobDetails object structure
    document.getElementById("viewJobDesc").textContent = selectedJobObject.jobDescription || "--"; // Handle missing property
    document.getElementById("viewJobStartDate").textContent = selectedJobObject.jobStartDate || "--";
    document.getElementById("viewJobEndDate").textContent = selectedJobObject.jobEndDate || "--";
    document.getElementById("viewJobStartTime").textContent = selectedJobObject.jobStartTime || "--";
    document.getElementById("viewJobEndTime").textContent = selectedJobObject.jobEndTime || "--";
    document.getElementById("viewJobProgress").textContent = `${calculateProjectPercentageComplete(selectedJobObject).toFixed(2)}%` || "--";
    selectedJobObject.materials.forEach((index) => {
      viewAddMaterialsForJob(materials[index]);  // Access and print elements
    });;
  } else {
    // Handle case where no job is selected or job not found
    console.warn("Selected job not found in local storage"); // Log a warning for debugging
    updateTextWithDashes(); // Optionally, reset text elements with dashes
  }


}

// Helper function to reset text elements with dashes (optional)
function updateTextWithDashes() {
  document.getElementById("viewJobNumber").textContent = "--";
  document.getElementById("viewJobName").textContent = "--";
  document.getElementById("viewJobDesc").textContent = "--";
  document.getElementById("viewJobStartDate").textContent = "--";
  document.getElementById("viewJobEndDate").textContent = "--";
  document.getElementById("viewJobStartTime").textContent = "--";
  document.getElementById("viewJobEndTime").textContent = "--";
}

// Call the populate function on page load
populateDropdown();

// Add event listener to handle dropdown selection change
ongoingJobsSelect.addEventListener("change", function () {
  const selectedJob = this.value;
  updateJobDetailsText(selectedJob);
});


function calculateProjectPercentageComplete(selectedJobObject) {
  // Get today's date
  const today = new Date();

  // Convert strings to date objects
  const projectStartDate = new Date(selectedJobObject.jobStartDate);
  const projectEndDate = new Date(selectedJobObject.jobEndDate);

  // Calculate project duration in days (adjust for weeks if needed)
  const totalProjectDuration = (projectEndDate - projectStartDate) / (1000 * 60 * 60 * 24);

  // Calculate days elapsed since project start
  const daysElapsed = (today - projectStartDate) / (1000 * 60 * 60 * 24);

  // Calculate percentage complete (handle potential division by zero)
  let projectPercentageComplete = 0;
  if (totalProjectDuration > 0) {
    projectPercentageComplete = (daysElapsed / totalProjectDuration) * 100;
  }

  return projectPercentageComplete;
  console.log(`Project completion percentage: ${projectPercentageComplete.toFixed(2)}%`);
}

//===================================================================================================================================================================================//
//EDIITTTTTTTT

const editOngoingJobsSelect = document.getElementById("editOngoing-Jobs");
function editUpdateJobDetailsText(selectedJob) {
  const jobDetails = getJobDetailsFromLocalStorage();
  const selectedJobObject = jobDetails[selectedJob];
  console.log("hiii");

  for (var i = editMaterialsForJobTableBody.rows.length - 1; i >= 0; i--) {
    editMaterialsForJobTableBody.deleteRow(i);
  }

  if (selectedJobObject) {
    // document.getElementById("viewJobNumber").textContent = selectedJobObject.jobNumber;
    document.getElementById("editName").value = selectedJobObject.jobName;
    // Update other text elements based on your jobDetails object structure
    document.getElementById("editDescription").value = selectedJobObject.jobDescription || "--"; // Handle missing property
    document.getElementById("editStartDate").value = selectedJobObject.jobStartDate || "--";
    document.getElementById("editEndDate").value = selectedJobObject.jobEndDate || "--";
    document.getElementById("editStartTime").value = selectedJobObject.jobStartTime || "--";
    document.getElementById("editEndTime").value = selectedJobObject.jobEndTime || "--";
    selectedJobObject.materials.forEach((index) => {
      editAddMaterialToTable(materials[index])  // Access and print elements
    });;
  } else {
    // Handle case where no job is selected or job not found
    console.warn("Selected job not found in local storage"); // Log a warning for debugging
    updateTextWithDashes(); // Optionally, reset text elements with dashes
  }
}

function populateEditDropdown() {
  const jobDetails = getJobDetailsFromLocalStorage();
  const filteredJobs = jobDetails.filter(job => Number(job.jobNumber) !== -1);

  filteredJobs.forEach((job) => {
    const option = document.createElement("option");
    option.value = job.jobNumber; // Assuming job has an ID property
    option.textContent = "ID: " + job.jobNumber + "\tName: " + job.jobName; // Assuming job has a name property
    editOngoingJobsSelect.appendChild(option);
  });
}

function editAddMaterialToTable(material) {
  const tableRow = document.createElement("tr");

  const checkboxCell = document.createElement("td");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("itemCheckbox");
  checkbox.name = "item";
  checkbox.value = material.id.toString();
  checkboxCell.appendChild(checkbox);

  const nameCell = document.createElement("td");
  nameCell.textContent = material.name;

  const priceCell = document.createElement("td");
  priceCell.textContent = `$${material.price.toFixed(2)}`; // Format price with 2 decimals

  const stockCell = document.createElement("td");
  stockCell.textContent = material.stock;

  const idCell = document.createElement("td");
  idCell.textContent = material.id;

  tableRow.appendChild(checkboxCell);
  tableRow.appendChild(nameCell);
  tableRow.appendChild(priceCell);
  tableRow.appendChild(stockCell);
  tableRow.appendChild(idCell);

  editMaterialsForJobTableBody.appendChild(tableRow);
}


populateEditDropdown();
editOngoingJobsSelect.addEventListener("change", function () {
  const selectedJob = this.value;
  editUpdateJobDetailsText(selectedJob);
  materials.forEach(editAddMaterialToTable);
});

//===================================================================================================================================================================================//


const deleteOngoingJobsSelect = document.getElementById("deleteOngoing-Jobs");

// Function to retrieve data from local storage
function getJobDetailsFromLocalStorage() {
  const jobDetailsString = localStorage.getItem("jobDetails");
  if (jobDetailsString) {
    return JSON.parse(jobDetailsString);
  } else {
    return []; // Return empty array if no data exists
  }
}

// Function to populate dropdown with job details
function deletePopulateDropdown() {
  const jobDetails = getJobDetailsFromLocalStorage();
  const filteredJobs = jobDetails.filter(job => Number(job.jobNumber) !== -1);

  filteredJobs.forEach((job) => {
    const option = document.createElement("option");
    option.value = job.jobNumber; // Assuming job has an ID property
    option.textContent = "ID: " + job.jobNumber + "\tName: " + job.jobName; // Assuming job has a name property
    deleteOngoingJobsSelect.appendChild(option);
  });
}

// Function to update job details text elements
function deleteUpdateJobDetailsText(selectedJob) {
  const jobDetails = getJobDetailsFromLocalStorage();
  const selectedJobObject = jobDetails[selectedJob];

  for (var i = deleteMaterialsForJobTableBody.rows.length - 1; i >= 0; i--) {
    deleteMaterialsForJobTableBody.deleteRow(i);
  }

  if (selectedJobObject) {
    document.getElementById("deleteJobNumber").textContent = selectedJobObject.jobNumber;
    document.getElementById("deleteJobName").textContent = selectedJobObject.jobName;
    // Update other text elements based on your jobDetails object structure
    document.getElementById("deleteJobDesc").textContent = selectedJobObject.jobDescription || "--"; // Handle missing property
    document.getElementById("deleteJobStartDate").textContent = selectedJobObject.jobStartDate || "--";
    document.getElementById("deleteJobEndDate").textContent = selectedJobObject.jobEndDate || "--";
    document.getElementById("deleteJobStartTime").textContent = selectedJobObject.jobStartTime || "--";
    document.getElementById("deleteJobEndTime").textContent = selectedJobObject.jobEndTime || "--";
    document.getElementById("deleteJobProgress").textContent = `${calculateProjectPercentageComplete(selectedJobObject).toFixed(2)}%` || "--";
    selectedJobObject.materials.forEach((index) => {
      deleteViewAddMaterialsForJob(materials[index])  // Access and print elements
    });;
  } else {
    // Handle case where no job is selected or job not found
    console.warn("Selected job not found in local storage"); // Log a warning for debugging
    updateTextWithDashes(); // Optionally, reset text elements with dashes
  }


}

// Helper function to reset text elements with dashes (optional)
function updateTextWithDashes() {
  document.getElementById("viewJobNumber").textContent = "--";
  document.getElementById("viewJobName").textContent = "--";
  document.getElementById("viewJobDesc").textContent = "--";
  document.getElementById("viewJobStartDate").textContent = "--";
  document.getElementById("viewJobEndDate").textContent = "--";
  document.getElementById("viewJobStartTime").textContent = "--";
  document.getElementById("viewJobEndTime").textContent = "--";
}

// Call the populate function on page load
deletePopulateDropdown();

// Add event listener to handle dropdown selection change
deleteOngoingJobsSelect.addEventListener("change", function () {
  const selectedJob = this.value;
  deleteUpdateJobDetailsText(selectedJob);
  indexToRemove = selectedJob;
});


function calculateProjectPercentageComplete(selectedJobObject) {
  // Get today's date
  const today = new Date();

  // Convert strings to date objects
  const projectStartDate = new Date(selectedJobObject.jobStartDate);
  const projectEndDate = new Date(selectedJobObject.jobEndDate);

  // Calculate project duration in days (adjust for weeks if needed)
  const totalProjectDuration = (projectEndDate - projectStartDate) / (1000 * 60 * 60 * 24);

  // Calculate days elapsed since project start
  const daysElapsed = (today - projectStartDate) / (1000 * 60 * 60 * 24);

  // Calculate percentage complete (handle potential division by zero)
  let projectPercentageComplete = 0;
  if (totalProjectDuration > 0) {
    projectPercentageComplete = (daysElapsed / totalProjectDuration) * 100;
  }

  return projectPercentageComplete;
  console.log(`Project completion percentage: ${projectPercentageComplete.toFixed(2)}%`);
}

function deleteViewAddMaterialsForJob(material) {
  const tableRow = document.createElement("tr");

  const nameCell = document.createElement("td");
  nameCell.textContent = material.name;

  const priceCell = document.createElement("td");
  priceCell.textContent = `$${material.price.toFixed(2)}`; // Format price with 2 decimals

  const stockCell = document.createElement("td");
  stockCell.textContent = material.stock;

  const idCell = document.createElement("td");
  idCell.textContent = material.id;

  tableRow.appendChild(nameCell);
  tableRow.appendChild(priceCell);
  tableRow.appendChild(stockCell);
  tableRow.appendChild(idCell);

  deleteMaterialsForJobTableBody.appendChild(tableRow);
}

function deleteJob(index) {

  // Retrieve the array
  letmyArray = JSON.parse(localStorage.getItem("jobDetails"));
  console.log(letmyArray);

  // Remove element by value (filter)
  const indexToRemove = 0;
  letmyArray[index].jobNumber = -1;// Removes 1 element at index

  // Store the modified array back in local storage
  localStorage.setItem("jobDetails", JSON.stringify(letmyArray));
}

jobDeleteButton.addEventListener('click', (event) => {
  event.preventDefault();

  if (indexToRemove != null) {
    deleteJob(indexToRemove);
    populateDropdown();
    deletePopulateDropdown();
  }

});


