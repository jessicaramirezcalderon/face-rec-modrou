//NOT WORKING YET

$(function () {
    $(".submit-form").on("submit", function (event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();

        const newUser = {
            name: $("#user-name").val().trim(),
        };

        // Send the POST request.
        $.ajax("/api/user", {
            type: "POST",// or get
            data: newUser,
            dataType: "json",
        }).done(
            function () {
                console.log("created new user");//response with data
                // Reload the page to get the updated list
                location.reload();
            }
        );
    });
});

