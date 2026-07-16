window.addEventListener("load", function () {

    // ==========================
    // Interested Button (AJAX)
    // ==========================

    var isInterestedImages = document.getElementsByClassName("is-interested-image");

    Array.from(isInterestedImages).forEach(function (element) {

        element.addEventListener("click", function (event) {

            event.preventDefault();

            var propertyId = this.getAttribute("property_id");

            document.getElementById("loading").style.display = "block";

            var XHR = new XMLHttpRequest();

            XHR.onreadystatechange = function () {

                if (XHR.readyState === 4) {

                    document.getElementById("loading").style.display = "none";

                    if (XHR.status === 200) {

                        try {

                            var response = JSON.parse(XHR.responseText);

                            if (response.success) {

                                var heart = document.querySelector(
                                    ".property-id-" + response.property_id + " .is-interested-image"
                                );

                                var count = document.querySelector(
                                    ".property-id-" + response.property_id + " .interested-user-count"
                                );


                                if (response.is_interested) {

                                    heart.classList.remove("far");
                                    heart.classList.add("fas");

                                    count.innerHTML = parseInt(count.innerHTML) + 1;

                                } else {

                                    heart.classList.remove("fas");
                                    heart.classList.add("far");

                                    count.innerHTML = parseInt(count.innerHTML) - 1;

                                }


                            } else {

                                if (response.is_logged_in === false) {

                                    $("#login-modal").modal("show");

                                } else {

                                    alert(response.message);

                                }

                            }


                        } catch (err) {

                            console.log(err);
                            alert("Invalid JSON response.");

                        }


                    } else {

                        alert("Server Error : " + XHR.status);

                    }

                }

            };


            XHR.onerror = function () {

                document.getElementById("loading").style.display = "none";
                alert("Network Error!");

            };


            XHR.open(
                "GET",
                "api/toggle_interested.php?property_id=" + propertyId,
                true
            );

            XHR.send();


        });

    });



    // ==========================
    // Filter Logic
    // ==========================

    var selectedGender = "all";
    var selectedBudget = "all";


    function applyFilters() {


        var cards = document.querySelectorAll(".property-card");

        var visible = 0;


        cards.forEach(function (card) {


            var gender = card.dataset.gender;
            var rent = parseInt(card.dataset.rent);


            var genderMatch =
                selectedGender === "all" ||
                gender === selectedGender;



            var budgetMatch = true;



            if (selectedBudget === "5000") {

                budgetMatch = rent < 5000;

            }

            else if (selectedBudget === "7000") {

                budgetMatch = rent >= 5000 && rent <= 7000;

            }

            else if (selectedBudget === "10000") {

                budgetMatch = rent > 7000;

            }



            if (genderMatch && budgetMatch) {

                card.style.display = "";

                visible++;

            }

            else {

                card.style.display = "none";

            }


        });



        var noProperty = document.querySelector(".no-property-container");


        if (noProperty) {

            noProperty.style.display =
                (visible === 0) ? "block" : "none";

        }


    }



    // Gender Filter

    document.querySelectorAll(".filter-gender").forEach(function(button){


        button.addEventListener("click", function(){


            selectedGender = this.dataset.gender;

            applyFilters();


        });


    });



    // Budget Filter

    document.querySelectorAll(".filter-budget").forEach(function(button){


        button.addEventListener("click", function(){


            selectedBudget = this.dataset.budget;

            applyFilters();


        });


    });





    // ==========================
    // Sorting Logic
    // ==========================


    function sortProperties(descending) {


        // IMPORTANT:
        // Change this class if your property cards
        // are inside another container

        var container = document.querySelector(".page-container");


        if (!container) {

            console.log("Property list container not found");

            return;

        }



        var cards = Array.from(
            container.querySelectorAll(".property-card")
        );



        cards.sort(function(a,b){


            var rentA = parseInt(a.dataset.rent);

            var rentB = parseInt(b.dataset.rent);



            if(descending){

                return rentB - rentA;

            }

            else{

                return rentA - rentB;

            }


        });



        cards.forEach(function(card){

            container.appendChild(card);

        });



    }





    // Highest Rent Button

    var highButton = document.querySelector(".sort-high");


    if(highButton){

        highButton.addEventListener("click", function(){

            sortProperties(true);

        });

    }





    // Lowest Rent Button

    var lowButton = document.querySelector(".sort-low");


    if(lowButton){

        lowButton.addEventListener("click", function(){

            sortProperties(false);

        });

    }



});