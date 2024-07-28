document.addEventListener("DOMContentLoaded", () => {
  const dogBarDiv = document.querySelector("#dog-bar");
  const dogInfoDiv = document.querySelector("#dog-info");
  const goodDogFilterButton = document.querySelector("#good-dog-filter");

  let filterOn = false;

  function addPupToBar(pup) {
    const pupSpan = document.createElement("span");
    pupSpan.textContent = pup.name;
    pupSpan.addEventListener("click", () => {
      dogInfoDiv.innerHTML = "";
      const pupImg = document.createElement("img");
      pupImg.src = pup.image;

      const pupNameH2 = document.createElement("h2");
      pupNameH2.textContent = pup.name;

      const goodBadButton = document.createElement("button");
      goodBadButton.textContent =
        pup.isGoodDog === true ? "Good Dog!" : "Bad Dog!";
      goodBadButton.addEventListener("click", () => {
        fetch(`http://localhost:3000/pups/${pup.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            isGoodDog: pup.isGoodDog === true ? false : true,
          }),
        });
      });

      dogInfoDiv.append(pupImg, pupNameH2, goodBadButton);
    });

    dogBarDiv.append(pupSpan);
  }

  function fetchPupsAndDisplay() {
    fetch("http://localhost:3000/pups")
      .then((res) => res.json())
      .then((pups) => {
        for (let pupObj in pups) {
          const pup = pups[pupObj];
          if (filterOn && pup.isGoodDog === true) {
            addPupToBar(pup);
          } else if (!filterOn) {
            addPupToBar(pup);
          }
        }
      });
  }

  goodDogFilterButton.addEventListener("click", () => {
    filterOn = filterOn === true ? false : true;
    goodDogFilterButton.textContent =
      filterOn === true ? "Filter good dogs: OFF" : "Filter good dogs: ON";
    dogBarDiv.innerHTML = "";
    fetchPupsAndDisplay();
  });

  fetchPupsAndDisplay();
});
