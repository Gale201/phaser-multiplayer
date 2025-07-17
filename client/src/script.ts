import { GameRoomData, GameServerData } from "@shared/server/server-types";
import "./styles.css";

const expressApiURL = "http://localhost:3001/api/servers";

/**
 * Updates the room list based on the selected region.
 */
async function updateRoomList() {
  const regionSelect = document.getElementById("region") as HTMLSelectElement;
  const roomList = document.getElementById("room-list") as HTMLDivElement;

  const savedRegion = localStorage.getItem("region");
  if (savedRegion) regionSelect.value = savedRegion;

  roomList.innerHTML = "<p class='text-gray-400'>Loading...</p>";

  try {
    const res = await fetch(expressApiURL);
    if (!res.ok) {
      throw new Error("Failed to fetch server list");
    }

    const data: Array<GameServerData> = await res.json();
    const servers: Array<GameServerData> = data.filter(
      (server) => server.region === regionSelect.value
    );

    roomList.innerHTML = "";
    if (servers.length === 0) {
      roomList.innerHTML =
        "<p class='text-gray-400'>No servers found for this region.</p>";
    }

    // For every room in the region create a card element for it
    servers.forEach((server) => {
      server.rooms.forEach((room) => {
        const card = createRoomCard(room.name, room.players);
        card.addEventListener("click", () => {
          joinRoom(server.url, room.name);
        });
        roomList.appendChild(card);
      });
    });
  } catch (err) {
    console.error("Error fetching server list:", err);
  }
}

/**
 * Updates the player count for each room every second.
 */
async function updateRoomPlayerCount() {
  const roomList = document.getElementById("room-list") as HTMLDivElement;

  try {
    const res = await fetch(expressApiURL);
    if (!res.ok) {
      throw new Error("Failed to fetch server list");
    }

    const servers: Array<GameServerData> = await res.json();

    roomList.childNodes.forEach((child) => {
      if (child instanceof HTMLDivElement && child.id.startsWith("room-")) {
        const roomName = child.id.replace("room-", "");
        const server = servers.find((s) =>
          s.rooms.some((r) => r.name === roomName)
        );

        if (server) {
          const room = server.rooms.find((r) => r.name === roomName);
          if (room) {
            child.querySelector(
              ".text-sm"
            )!.textContent = `Players: ${room.players}`;
          }
        }
      }
    });
  } catch (err) {
    console.error("Error fetching server list:", err);
  }
}

function createRoomCard(name: string, players: number): HTMLDivElement {
  const div = document.createElement("div");
  div.className =
    "min-w-[200px] p-4 bg-gray-800 text-white rounded shadow hover:bg-gray-700 cursor-pointer transition";

  div.innerHTML = `
    <div class="text-xl font-bold">${name}</div>
    <div class="text-sm">Players: ${players}</div>
  `;
  div.id = `room-${name}`;

  return div;
}

/**
 * Gets the username and sets localStorage values and changes to game.html.
 *
 * @param serverUrl
 * @param roomName
 * @returns
 */
function joinRoom(serverUrl: string, roomName: string) {
  console.log("Joining room:", roomName, "on server:", serverUrl);

  const username = (
    document.getElementById("username") as HTMLInputElement
  ).value.trim();
  if (!username) {
    alert("Please enter a username.");
    return;
  }

  localStorage.setItem("username", username);
  localStorage.setItem("serverUrl", serverUrl);
  localStorage.setItem("room", roomName);

  window.location.href = "game.html";
}

// When the DOM is loaded, update the room list and set up the region selector event listener
document.addEventListener("DOMContentLoaded", async () => {
  updateRoomList();

  const regionSelect = document.getElementById("region") as HTMLSelectElement;
  regionSelect.addEventListener("change", () => {
    localStorage.setItem("region", regionSelect.value);
    updateRoomList();
  });

  setInterval(updateRoomPlayerCount, 1000);
});
