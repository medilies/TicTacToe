class Party {
    /**
     *
     * @param {HTMLDivElement} boardContainer
     */
    constructor(boardContainer) {
        this.mqttLogs = false;

        this.boardContainer = boardContainer;
        this.drawStartMenu(this.boardContainer);
    }

    /**
     *
     * @param {HTMLDivElement} boardContainer
     */

    initGame() {
        this.setUserName();
        this.setPartyIdOnInit();
        this.setPartySubTopic();
        this.setXOPubTopic();
        this.unlockTurn();
        this.setSymbols("X", "O");
        this.initGameState();
        this.setOpponentUserName("unknown*");
        this.connect();
        this.mqttCallbacks();
        this.makeBoard(this.boardContainer);
        this.displayPartyCodeForOwner();
    }

    joinGame() {
        this.setUserName();
        this.setPartyIdOnJoin();
        this.setPartySubTopic();
        this.setXOPubTopic();
        this.lockTurn();
        this.setSymbols("O", "X");
        this.initGameState();
        this.setOpponentUserName("unknown*");
        this.connect();
        this.mqttCallbacks();
        this.pubHi();
        this.makeBoard(this.boardContainer);
    }

    setUserName() {
        this.userName = this.nameInputField.value;
    }

    setPartyIdOnInit() {
        this.PartyID = this.userName + Date.now();
    }

    setPartyIdOnJoin() {
        this.PartyID = this.partyIdInputField.value;
    }

    setOpponentUserName(opponentUserName) {
        this.opponentUserName = opponentUserName;
    }

    setSymbols(local, remote) {
        this.localSymbol = local;
        this.remoteSymbol = remote;
    }

    // ***********************
    // game state
    // ***********************

    initGameState() {
        this.gameState = ["", "", "", "", "", "", "", "", ""];
    }

    updateGameState(target, symbole) {
        this.gameState[target] = symbole;
    }

    checkGameWinner() {
        const g = this.gameState;
        console.log(g);
        // horizontal
        if (g[0] === g[1] && g[0] === g[2]) {
            if (g[0] === this.localSymbol) this.win();
            else if (g[0] === this.remoteSymbol) this.lose();
        } else if (g[3] === g[4] && g[3] === g[5]) {
            if (g[3] === this.localSymbol) this.win();
            else if (g[3] === this.remoteSymbol) this.lose();
        } else if (g[6] === g[7] && g[6] === g[8]) {
            if (g[6] === this.localSymbol) this.win();
            else if (g[6] === this.remoteSymbol) this.lose();
        }
        // vertical
        else if (g[0] === g[3] && g[0] === g[6]) {
            if (g[0] === this.localSymbol) this.win();
            else if (g[0] === this.remoteSymbol) this.lose();
        } else if (g[1] === g[4] && g[1] === g[7]) {
            if (g[1] === this.localSymbol) this.win();
            else if (g[1] === this.remoteSymbol) this.lose();
        } else if (g[2] === g[5] && g[2] === g[8]) {
            if (g[2] === this.localSymbol) this.win();
            else if (g[2] === this.remoteSymbol) this.lose();
        }
        // Diagonal
        else if (g[0] === g[4] && g[0] === g[8]) {
            if (g[0] === this.localSymbol) this.win();
            else if (g[0] === this.remoteSymbol) this.lose();
        } else if (g[2] === g[4] && g[2] === g[6]) {
            if (g[2] === this.localSymbol) this.win();
            else if (g[2] === this.remoteSymbol) this.lose();
        }
    }

    win() {
        this.lockTurn();
        this.initGameState();
        console.log("win");
    }

    lose() {
        this.lockTurn();
        this.initGameState();
        console.log("die");
    }

    lockTurn() {
        this.turn = "locked";
    }

    unlockTurn() {
        this.turn = "unlocked";
    }

    // ***********************
    // UI
    // ***********************
    displayPartyCodeForOwner() {
        const inv = document.createElement("p");
        inv.innerText = this.PartyID;
        this.boardContainer.appendChild(inv);
    }

    drawStartMenu() {
        this.boardContainer.innerHTML = "";
        this.appendStartMenu(this.boardContainer);
        this.appendJoinMenu(this.boardContainer);
    }

    appendStartMenu(parent) {
        // Create start menu
        const menu = document.createElement("form");
        menu.id = "tictactoe-init-game";
        parent.appendChild(menu);

        this.appentNameInputField(menu);
        this.appendCreatePartyBtn(menu);

        menu.addEventListener("submit", (e) => {
            e.preventDefault();
            this.initGame();
        });
    }

    appendJoinMenu(parent) {
        this.appendPartyIdInputField(parent);
        this.appendJoinPartyBtn(parent);

        // Join party
    }

    appentNameInputField(parent) {
        const nameInputField = document.createElement("input");
        nameInputField.type = "text";
        parent.appendChild(nameInputField);

        this.nameInputField = nameInputField;
    }

    appendCreatePartyBtn(parent) {
        const startBtn = document.createElement("button");
        startBtn.type = "submit";
        startBtn.innerText = "Create a party";
        parent.appendChild(startBtn);
    }

    appendPartyIdInputField(parent) {
        const partyIdField = document.createElement("input");
        partyIdField.type = "text";
        parent.appendChild(partyIdField);

        this.partyIdInputField = partyIdField;
    }

    appendJoinPartyBtn(parent) {
        const joinBtn = document.createElement("button");
        joinBtn.innerText = "Join a party";
        parent.appendChild(joinBtn);

        joinBtn.addEventListener("click", () => {
            this.joinGame();
        });
    }

    /**
     *
     * @param {HTMLDivElement} boardContainer
     */
    makeBoard() {
        this.boardContainer.innerHTML = "";

        const board = document.createElement("div");
        board.style.display = "grid";
        board.style.gap = "0.2rem";
        board.style.gridTemplateRows = "repeat(3, 75px)";
        board.style.gridTemplateColumns = "repeat(3, 75px)";
        board.style.background = "#ccc";
        board.style.width = "fit-content";
        board.style.width = "max-content";

        for (let i = 0; i < 9; i++) {
            const div = document.createElement("div");
            div.id = "xo-gamesquare-" + i;
            div.setAttribute("xo-gamesquare", "");
            div.style.background = "#fff";
            board.appendChild(div);
        }

        this.boardContainer.appendChild(board);

        board.addEventListener("click", (e) => {
            if (
                this.opponentUserName !== "unknown*" &&
                e.target.hasAttribute("xo-gamesquare") &&
                this.turn === "unlocked"
            ) {
                this.lockTurn();

                this.pubXO(e.target.id[14]);
            }
        });
    }

    drawSymbol(target, symbol) {
        const targetElement = document.querySelector(
            "#xo-gamesquare-" + target
        );
        targetElement.innerText = symbol;
    }

    // ***********************
    // MQTT
    // ***********************
    connect() {
        this.MQTTConnection = mqtt.connect({
            protocol: "ws",
            host: "127.0.0.1",
            port: 8080,
            username: this.userName,
            clientId: this.userName,
            // path: "/mqtt",
        });
    }

    mqttCallbacks() {
        this.MQTTConnection.on("connect", () => {
            this.MQTTConnection.subscribe(
                this.partyTopicSubscriptions,
                (err, grant) => {
                    if (this.mqttLogs) {
                        if (err) console.warn("SUBSCRIBE ERROR:", err);
                        console.log("SUBSCRIBED TO :", grant);
                    }
                }
            );
        });

        this.MQTTConnection.on("message", (topic, message) => {
            const msg = message.toString();
            const sender = topic.split("/")[2];

            // log
            if (this.mqttLogs) console.log(topic, "<<>>", msg);

            this.MQTTConnection.on("packetsend", (packet) => {
                // log
                if (this.mqttLogs) console.log("sent:    ", packet);
            });

            // XO exchanges
            if (
                this.opponentUserName !== "unknown*" &&
                sender === this.opponentUserName &&
                !isNaN(msg)
            ) {
                this.drawSymbol(msg, this.remoteSymbol);
                this.updateGameState(msg, this.remoteSymbol);
                this.unlockTurn();
                this.checkGameWinner();
            } else if (sender === this.userName && !isNaN(msg)) {
                this.drawSymbol(msg, this.localSymbol);
                this.updateGameState(msg, this.localSymbol);
                this.checkGameWinner();
            }
            // Handshake
            else if (
                this.opponentUserName === "unknown*" &&
                msg === "hi" &&
                sender
            ) {
                this.setOpponentUserName(sender);
                this.pubHi();
            }
        });
    }

    pubXO(squareNb) {
        const qos = { qos: 2 };
        this.MQTTConnection.publish(this.xoPubTopic, squareNb, qos);
    }

    pubHi() {
        if (this.hiSent) return;
        const qos = { qos: 2 };
        this.MQTTConnection.publish(this.xoPubTopic, "hi", qos);
        this.hiSent = true;
    }

    setPartySubTopic() {
        this.partyTopicSubscriptions = JSON.parse(
            `{"tictactoe/${this.PartyID}/#": {"qos":2}}`
        );
    }

    setXOPubTopic() {
        this.xoPubTopic = `tictactoe/${this.PartyID}/${this.userName}`;
    }
}

const board = document.querySelector("#xo-container");

const party = new Party(board);
