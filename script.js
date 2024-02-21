/* Populate h2 and h3 elements with intra-page links

Each heading will get:

- "top" link pointing to {topDestination}, by default #title
  - unless the heading has class "no-top-link", then it's not generated
    (useful if topDestination is changed to a specific heading, then I don't want a link to itself)

- "chain" link pointing to itself
  - unless the heading doesn't have any id, then it's not generated
  - unless the heading has class "no-self-link", then it's not generated

- "solved" checkbox if the heading has class "checkable"
  - mostly only for logic.html

Notes:
This script is kinda a mess because I'm writing the new HTML elements entirely in text
Better approach is probably to create the objects by JS properly instead of chaining text attributes
I might also want to put the elements somewhere else besides inside h2/h3?
I might also want to move the checkbox to a script inside logic.html itself?
*/

var topDestination = "title";

/* Given header element el, add the appropriate links */
function populateHeader(el) {
    var newText = "";
    var isCheckable = false;
    /* Top */
    if (!el.classList.contains("no-top-link")) {
        newText += "<a href=\"#" + topDestination + "\" class=\"anchor\">&#x1F51D;</a> "; /* "top" emoji */
    }
    /* Chain/self */
    if (el.id && !el.classList.contains("no-self-link")) {
        newText += "<a href=\"#" + el.id + "\" class=\"anchor\">&#x1F517;</a> "; /* chain emoji */
    }
    /* Checkbox */
    if (el.classList.contains("checkable")) {
        // I probably should create a new node by code instead of string
        isCheckable = true;
        const startsChecked = (localStorage.getItem("check-" + el.id) == "yes");
        newText += "<label><input type=\"checkbox\" id=\"check-" + el.id + "\"" + (startsChecked ? " checked" : "") + "></label> ";
    }
    /* Actually insert the generated HTML */
    el.insertAdjacentHTML("afterbegin", newText);
    if (isCheckable) {
        document.getElementById("check-" + el.id).addEventListener("change", toggleClick);
    }
}

/* Toggle for the checkbox */
function toggleClick(e) {
    if (e.target.checked) {
        localStorage.setItem(e.target.id, "yes");
    } else {
        localStorage.removeItem(e.target.id);
    }
}

/* Wait until page is loaded then run the script for every h2/h3 heading
h1 is only #title
h4 is too small to be relevant

Also hide all no-js content and show all yes-js content
*/
document.addEventListener("DOMContentLoaded", () => {
    for (el of document.querySelectorAll("h2, h3")) {
        populateHeader(el);
    }
    for (el of document.querySelectorAll(".no-js")) {
        el.style.display = "none";
    }
    for (el of document.querySelectorAll(".yes-js")) {
        el.style.display = "block";
    }
});
