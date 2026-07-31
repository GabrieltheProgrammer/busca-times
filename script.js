const API_URL = "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=";

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const statusMessage = document.getElementById("statusMessage");
const teamCard = document.getElementById("teamCard");

const teamLogo = document.getElementById("teamLogo");
const teamName = document.getElementById("teamName");
const teamCountry = document.getElementById("teamCountry");
const teamFounded = document.getElementById("teamFounded");
const teamStadium = document.getElementById("teamStadium");
const teamCapacity = document.getElementById("teamCapacity");
const teamCity = document.getElementById("teamCity");

searchButton.addEventListener("click", searchTeam);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchTeam();
  }
});

async function searchTeam() {
  const query = searchInput.value.trim();

  if (!query) {
    showStatus("Digite o nome de um time para buscar.", true);
    return;
  }

  try {
    setLoadingState(true);

    const response = await fetch(`${API_URL}${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error("Não foi possível se conectar à API.");
    }

    const data = await response.json();

    if (!data.teams) {
      showStatus(`Nenhum time encontrado para "${query}".`, true);
      teamCard.classList.add("hidden");
      return;
    }

    const team = data.teams[0];
    updateTeamCard(team);
    hideStatus();
    teamCard.classList.remove("hidden");
  } catch (error) {
    console.error(error);
    showStatus("Ocorreu um erro ao buscar os dados. Tente novamente.", true);
    teamCard.classList.add("hidden");
  } finally {
    setLoadingState(false);
  }
}

function updateTeamCard(team) {
  teamLogo.src = team.strBadge || team.strTeamLogo || "";
  teamLogo.alt = `Escudo do ${team.strTeam}`;

  teamName.textContent = team.strTeam || "Nome não disponível";
  teamCountry.textContent = team.strCountry || "País não disponível";

  teamFounded.textContent = team.intFormedYear || "Não informado";
  teamStadium.textContent = team.strStadium || "Não informado";
  teamCity.textContent = team.strStadiumLocation || team.strLocation || "Não informado";

  teamCapacity.textContent = team.intStadiumCapacity
    ? `${Number(team.intStadiumCapacity).toLocaleString("pt-BR")} espectadores`
    : "Não informado";
}

function setLoadingState(isLoading) {
  searchButton.disabled = isLoading;
  if (isLoading) {
    showStatus("Buscando informações...", false);
  }
}

function showStatus(message, isError) {
  statusMessage.textContent = message;
  statusMessage.classList.remove("hidden");
  statusMessage.style.color = isError ? "var(--secondary-color)" : "var(--text-muted)";
}

function hideStatus() {
  statusMessage.classList.add("hidden");
}