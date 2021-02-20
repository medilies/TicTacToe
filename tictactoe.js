/**
 * @property **boardContainer** refrenced via the constructor
 * @property **nameInputField** used by other classes
 * @property **partyIdInputField** used by other classes
 * @property **startMenu** form - REQUIRES submit event handler: to call initGame procedure
 * @property **xoGridBoard** - REQUIRES click event handler: to locate which gamesquare was targeted
 * @property **joinBtn** - REQUIRES click event handler: to call joinGame procedure
 *
 */
class UI {
    /**
     *
     * @param {HTMLDivElement} boardContainer
     */
    constructor(boardContainer) {
        this.boardContainer = boardContainer;
        this.gameSquaresIdPrfix = "xo-gamesquare-";

        this.drawStartMenu();
    }

    drawStartMenu() {
        this.boardContainer.innerHTML = "";
        this.appendStartMenu(this.boardContainer);
        this.appendJoinMenu(this.boardContainer);
    }

    /**
     *
     * @param {HTMLDivElement} boardContainer
     */
    makeXOGridBoard() {
        this.boardContainer.innerHTML = "";

        this.xoGridBoard = document.createElement("div");
        this.xoGridBoard.style.display = "grid";
        this.xoGridBoard.style.gap = "0.2rem";
        this.xoGridBoard.style.gridTemplateRows = "repeat(3, 100px)";
        this.xoGridBoard.style.gridTemplateColumns = "repeat(3, 100px)";
        this.xoGridBoard.style.background = "#ccc";
        this.xoGridBoard.style.width = "fit-content";
        this.xoGridBoard.style.width = "max-content";

        for (let i = 0; i < 9; i++) {
            const div = document.createElement("div");
            div.id = "xo-gamesquare-" + i;
            div.setAttribute("xo-gamesquare", "");
            div.style.background = "#fff";
            this.xoGridBoard.appendChild(div);
        }

        this.boardContainer.appendChild(this.xoGridBoard);
    }

    appendStartMenu(parent) {
        this.startMenu = document.createElement("form");
        this.startMenu.id = "tictactoe-init-game";
        parent.appendChild(this.startMenu);

        this.appentNameInputField(this.startMenu);
        this.appendCreatePartyBtn(this.startMenu);
    }

    appendJoinMenu(parent) {
        this.appendPartyIdInputField(parent);
        this.appendJoinPartyBtn(parent);
    }

    appentNameInputField(parent) {
        this.nameInputField = document.createElement("input");
        this.nameInputField.type = "text";
        parent.appendChild(this.nameInputField);
    }

    appendCreatePartyBtn(parent) {
        const startBtn = document.createElement("button");
        startBtn.type = "submit";
        startBtn.innerText = "Create a party";
        parent.appendChild(startBtn);
    }

    appendPartyIdInputField(parent) {
        this.partyIdInputField = document.createElement("input");
        this.partyIdInputField.type = "text";
        parent.appendChild(this.partyIdInputField);
    }

    appendJoinPartyBtn(parent) {
        this.joinBtn = document.createElement("button");
        this.joinBtn.innerText = "Join a party";
        parent.appendChild(this.joinBtn);
    }

    displayPartyCodeForOwner(partyID) {
        const inv = document.createElement("p");
        inv.innerText = partyID;
        this.boardContainer.appendChild(inv);
    }

    drawSymbol(target, symbol) {
        const targetElement = document.querySelector(
            "#" + this.gameSquaresIdPrfix + target
        );
        targetElement.innerText = symbol;
    }
}

/**
 * @property localRoundSymbol "X" | "O"
 * @property remoteRoundSymbol "X" | "O"
 * @property gameState
 * @property turnState "locked" | "unlocked"
 */
class Round {
    constructor(localRoundSymbol, remoteRoundSymbol) {
        this.localRoundSymbol = localRoundSymbol;
        this.remoteRoundSymbol = remoteRoundSymbol;
    }

    initRoundState() {
        this.gameState = ["", "", "", "", "", "", "", "", ""];
    }

    updateRoundState(target, symbole) {
        this.gameState[target] = symbole;
        this.checkRoundWinner();
    }

    checkRoundWinner() {
        const g = this.gameState;
        // horizontal
        if (g[0] === g[1] && g[0] === g[2]) {
            if (g[0] === this.localRoundSymbol) this.win();
            else if (g[0] === this.remoteRoundSymbol) this.lose();
        } else if (g[3] === g[4] && g[3] === g[5]) {
            if (g[3] === this.localRoundSymbol) this.win();
            else if (g[3] === this.remoteRoundSymbol) this.lose();
        } else if (g[6] === g[7] && g[6] === g[8]) {
            if (g[6] === this.localRoundSymbol) this.win();
            else if (g[6] === this.remoteRoundSymbol) this.lose();
        }
        // vertical
        else if (g[0] === g[3] && g[0] === g[6]) {
            if (g[0] === this.localRoundSymbol) this.win();
            else if (g[0] === this.remoteRoundSymbol) this.lose();
        } else if (g[1] === g[4] && g[1] === g[7]) {
            if (g[1] === this.localRoundSymbol) this.win();
            else if (g[1] === this.remoteRoundSymbol) this.lose();
        } else if (g[2] === g[5] && g[2] === g[8]) {
            if (g[2] === this.localRoundSymbol) this.win();
            else if (g[2] === this.remoteRoundSymbol) this.lose();
        }
        // Diagonal
        else if (g[0] === g[4] && g[0] === g[8]) {
            if (g[0] === this.localRoundSymbol) this.win();
            else if (g[0] === this.remoteRoundSymbol) this.lose();
        } else if (g[2] === g[4] && g[2] === g[6]) {
            if (g[2] === this.localRoundSymbol) this.win();
            else if (g[2] === this.remoteRoundSymbol) this.lose();
        }
        // TIE
        else if (!g.includes("")) {
            console.log("tie");
        }
    }

    win() {
        this.lockTurn();
        this.initRoundState();
        console.log("win");
    }

    lose() {
        this.lockTurn();
        this.initRoundState();
        console.log("die");
    }

    lockTurn() {
        this.turnState = "locked";
    }

    unlockTurn() {
        this.turnState = "unlocked";
    }
}

/**
 * @property mqttConnection
 * @property userName REQUIRED for topic
 * @property partyId REQUIRED for topic
 * @property partySubTopic
 * @property partyPubTopic
 * @property {bool} hiSent
 * @property {bool} mqttLogs
 */
class MQTT {
    constructor(userName, partyId) {
        this.mqttLogs = true;
        this.userName = userName;
        this.partyId = partyId;
        this.connect();
        this.setPartySubTopic();
        this.setXOPubTopic();
        this.mqttCallbacks();
    }

    connect() {
        this.mqttConnection = mqtt.connect({
            protocol: "ws",
            host: "127.0.0.1",
            port: 8080,
            username: this.userName,
            clientId: this.userName,
            // path: "/mqtt",
        });
    }

    setPartySubTopic() {
        this.partySubTopic = JSON.parse(
            `{"tictactoe/${this.partyId}/#": {"qos":2}}`
        );
    }

    setXOPubTopic() {
        this.partyPubTopic = `tictactoe/${this.partyId}/${this.userName}`;
    }

    mqttCallbacks() {
        this.mqttConnection.on("connect", () => {
            this.mqttConnection.subscribe(this.partySubTopic, (err, grant) => {
                if (this.mqttLogs) {
                    if (err) console.warn("SUBSCRIBE ERROR:", err);
                    console.log("SUBSCRIBED TO :", grant);
                }
            });
        });

        // this.mqttConnection.on("packetsend", (packet) => {
        //     // log
        //     if (this.mqttLogs) console.log("sent:    ", packet);
        // });
    }

    pubXO(squareNb) {
        console.log("yo");
        const qos = { qos: 2 };
        this.mqttConnection.publish(this.partyPubTopic, squareNb, qos);
    }

    pubHi() {
        if (this.hiSent) return;
        const qos = { qos: 2 };
        this.mqttConnection.publish(this.partyPubTopic, "hi", qos);
        this.hiSent = true;
    }
}

class Game {
    /**
     *
     * @param {HTMLDivElement} boardContainer
     */
    constructor(boardContainer) {
        this.boardContainer = boardContainer;
        this.ui = new UI(boardContainer);
        //
        this.ui.startMenu.addEventListener("submit", (e) => {
            e.preventDefault();
            this.initGame();
        });
        this.ui.joinBtn.addEventListener("click", () => {
            this.joinGame();
        });
    }

    /**
     *
     * @param {HTMLDivElement} boardContainer
     */
    initGame() {
        this.setUserName();
        this.setPartyIdOnInit();
        this.setSymbols("X", "O");
        this.setOpponentUserName("unknown*");
        this.round = new Round(this.localSymbol, this.remoteSymbol);
        this.round.unlockTurn();
        this.round.initRoundState();
        this.mqtt = new MQTT(this.userName, this.partyId);
        this.mqtt.mqttConnection.on("message", (topic, message) => {
            const msg = message.toString();
            const sender = topic.split("/")[2];

            // log
            if (this.mqtt.mqttLogs) console.log(topic, "<<>>", msg);

            // XO exchanges
            if (
                this.opponentUserName !== "unknown*" &&
                sender === this.opponentUserName &&
                !isNaN(msg)
            ) {
                this.ui.drawSymbol(msg, this.remoteSymbol);
                this.round.updateRoundState(msg, this.remoteSymbol);
                this.round.unlockTurn();
            } else if (sender === this.userName && !isNaN(msg)) {
                this.ui.drawSymbol(msg, this.localSymbol);
                this.round.updateRoundState(msg, this.localSymbol);
            }
            // Handshake
            else if (
                this.opponentUserName === "unknown*" &&
                msg === "hi" &&
                sender
            ) {
                this.setOpponentUserName(sender);
                this.mqtt.pubHi();
            }
        });
        this.ui.makeXOGridBoard(this.boardContainer);
        // add evend listeners
        this.ui.xoGridBoard.addEventListener("click", (e) => {
            if (
                this.opponentUserName !== "unknown*" &&
                e.target.hasAttribute("xo-gamesquare") &&
                this.round.turnState === "unlocked"
            ) {
                this.round.lockTurn();
                this.mqtt.pubXO(e.target.id[14]);
            }
        });
        this.ui.displayPartyCodeForOwner(this.partyId);
    }

    joinGame() {
        this.setUserName();
        this.setPartyIdOnJoin();
        this.setSymbols("O", "X");
        this.setOpponentUserName("unknown*");
        this.round = new Round(this.localSymbol, this.remoteSymbol);
        this.round.lockTurn();
        this.round.initRoundState();
        this.mqtt = new MQTT(this.userName, this.partyId);
        this.mqtt.mqttConnection.on("message", (topic, message) => {
            const msg = message.toString();
            const sender = topic.split("/")[2];

            // log
            if (this.mqtt.mqttLogs) console.log(topic, "<<>>", msg);

            // XO exchanges
            if (
                this.opponentUserName !== "unknown*" &&
                sender === this.opponentUserName &&
                !isNaN(msg)
            ) {
                this.ui.drawSymbol(msg, this.remoteSymbol);
                this.round.updateRoundState(msg, this.remoteSymbol);
                this.round.unlockTurn();
            } else if (sender === this.userName && !isNaN(msg)) {
                this.ui.drawSymbol(msg, this.localSymbol);
                this.round.updateRoundState(msg, this.localSymbol);
            }
            // Handshake
            else if (
                this.opponentUserName === "unknown*" &&
                msg === "hi" &&
                sender
            ) {
                this.setOpponentUserName(sender);
                this.mqtt.pubHi();
            }
        });
        this.mqtt.pubHi();
        this.ui.makeXOGridBoard(this.boardContainer);
        this.ui.xoGridBoard.addEventListener("click", (e) => {
            if (
                this.opponentUserName !== "unknown*" &&
                e.target.hasAttribute("xo-gamesquare") &&
                this.round.turnState === "unlocked"
            ) {
                this.round.lockTurn();
                this.mqtt.pubXO(e.target.id[14]);
            }
        });
    }

    setUserName() {
        this.userName = this.ui.nameInputField.value;
    }

    setPartyIdOnInit() {
        this.partyId = this.userName + Date.now();
    }

    setPartyIdOnJoin() {
        this.partyId = this.ui.partyIdInputField.value;
    }

    setSymbols(local, remote) {
        this.localSymbol = local;
        this.remoteSymbol = remote;
    }

    setOpponentUserName(opponentUserName) {
        this.opponentUserName = opponentUserName;
    }
}

const board = document.querySelector("#xo-container");

const game = new Game(board);
