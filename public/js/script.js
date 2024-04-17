function updateTime() {
    var now = new Date();
    var dateString = now.toDateString();
    var timeString = now.toLocaleTimeString();

    document.getElementById("current-date").innerText = dateString;
    document.getElementById("current-time").innerText = timeString;
}

setInterval(updateTime, 1000);

function validateFindForm() {
    var type = document.getElementById("pet-type").value;
    var breed = document.getElementById("breed").value;
    var age = document.getElementById("age").value;
    var gender = document.getElementById("gender").value;

    if (type === "" || breed === "" || age === "" || gender === "") {
        alert("Please fill in all fields.");
        return false;
    }
    return true;
}

function validateGiveAwayForm() {
    var type = document.getElementById("pet-type").value;
    var breed = document.getElementById("breed").value;
    var age = document.getElementById("age").value;
    var gender = document.getElementById("gender").value;
    var ownerName = document.getElementById("owner-name").value;
    var ownerEmail = document.getElementById("owner-email").value;

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (type === "" || breed === "" || age === "" || gender === "" || ownerName === "" || ownerEmail === "") {
        alert("Please fill in all fields.");
        return false;
    }

    if (!emailRegex.test(ownerEmail)) {
        alert("Please enter a valid email address.");
        return false;
    }

    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('overlay');
    const loginBtn = document.getElementById('loginBtn');
    const closeBtn = document.querySelector('.close');

    loginBtn.addEventListener('click', function() {
        overlay.style.display = 'block';
    });

    closeBtn.addEventListener('click', function() {
        overlay.style.display = 'none';
    });
});