window.addEventListener("load", function () {

    const params = new URLSearchParams(window.location.search);
    const property_id = params.get("property_id");

    var is_interested_image = document.getElementsByClassName("is-interested-image")[0];

    if (!is_interested_image) {
        return;
    }

    is_interested_image.addEventListener("click", function (event) {

        event.preventDefault();

        document.getElementById("loading").style.display = "block";

        var XHR = new XMLHttpRequest();

        XHR.onreadystatechange = function () {

            if (XHR.readyState === 4) {

                document.getElementById("loading").style.display = "none";

                if (XHR.status === 200) {

                    console.log("Response:", XHR.responseText);

                    try {

                        var response = JSON.parse(XHR.responseText);

                        if (response.success) {

                            var heart = document.getElementsByClassName("is-interested-image")[0];
                            var count = document.getElementsByClassName("interested-user-count")[0];

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
                        console.log(XHR.responseText);
                        alert("Invalid server response.");

                    }

                } else {

                    alert("Server Error : " + XHR.status);

                }

            }

        };

        XHR.onerror = function () {

            document.getElementById("loading").style.display = "none";

            alert("Unable to connect to the server.");

            console.log("AJAX Error");

        };

        XHR.open("GET", "api/toggle_interested.php?property_id=" + property_id, true);

        XHR.send();

    });

});