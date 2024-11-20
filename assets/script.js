const userData = {
    phone: "1234567890",
    pin: "1234",
    balance: 0,
    badge: "Newbie",
    activities: []
};
const trashRewards = { "E-waste": 22, "paper": 10, "Organic": 22, "plastic": 20, "Glass": 15, "iron": 30 };
const conversionRate = 0.5; // 1 point = 0.5 Naira

document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const phone = document.getElementById("phone").value;
    const pin = document.getElementById("pin").value;

    if (phone === userData.phone && pin === userData.pin) {
        const savedData = JSON.parse(localStorage.getItem("userData"));
        if (savedData) {
            Object.assign(userData, savedData);
        }
        document.getElementById("login-section").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        updateDashboard();
        displayActivities();
    } else {
        alert("Invalid login credentials");
    }
});

function updateDashboard() {
    const nairaAmount = (userData.balance * conversionRate).toFixed(2);
    document.getElementById("balance").innerText = `${userData.balance} Points (${nairaAmount} Naira)`;
    document.getElementById("badge").innerText = userData.badge;
}

function displayActivities() {
    const activitiesList = document.getElementById("activities");
    activitiesList.innerHTML = userData.activities.map(activity => `<li>${activity}</li>`).join("");
}

document.getElementById("trash-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const type = document.getElementById("type").value;
    const weight = parseFloat(document.getElementById("weight").value);

    if (weight > 0) {
        const reward = weight * trashRewards[type];
        userData.balance += reward;

        if (userData.balance > 100) userData.badge = "Recycler Pro";
        if (userData.balance > 500) userData.badge = "Eco Warrior";

        const activity = `Disposed ${weight}kg of ${type} and earned ${reward} points.`;
        userData.activities.push(activity);

        alert(`You earned ${reward} points!`);
        saveUserData();
        updateDashboard();
        displayActivities();

        document.getElementById("trash-form").reset();
    } else {
        alert("Please enter a valid weight.");
    }
});

document.getElementById("claim-reward-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById("amount").value);
    const account = document.getElementById("account").value || userData.phone;

    if (amount > 0 && amount <= userData.balance * conversionRate) {
        const equivalentPoints = amount / conversionRate;
        userData.balance -= equivalentPoints;

        const activity = `Claimed reward ${amount} Naira to account ${account}.`;
        userData.activities.push(activity);

        alert(`Payment of ${amount} Naira sent to ${account}`);
        saveUserData();
        updateDashboard();
        displayActivities();

        document.getElementById("claim-reward-form").reset();
    } else {
        alert("Invalid claim reward amount.");
    }
});

function saveUserData() {
    localStorage.setItem("userData", JSON.stringify(userData));
}

document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("userData");
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("login-section").style.display = "block";
});