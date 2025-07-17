import { Signals } from "@shared/signals/signals";
import { config } from "./game";
import { NetworkManager } from "./network-manager";

const username = localStorage.getItem("username");
const roomName = localStorage.getItem("room");
const serverUrl = localStorage.getItem("serverUrl");

if (!username || !roomName || !serverUrl) {
  alert("Missing username, room, or server URL.");
  window.location.href = "index.html";
}

const network = NetworkManager.getInstance();
network.connect(serverUrl!);

network.on("connect", () => {
  console.log("Connected to server:", network.getSocket().id);
  network.emit(Signals.JOIN_ROOM, { username, roomName });
});

network.on(Signals.JOIN_ROOM_SUCCESS, () => {
  console.log(
    "Successfully joined room:",
    roomName + ", on server:",
    serverUrl
  );
  new Phaser.Game(config);
});

network.on(Signals.JOIN_ROOM_FAILURE, (error: string) => {
  console.error("Failed to join room:", error);
  alert(`Failed to join room: ${error}`);
  window.location.href = "index.html";
});
