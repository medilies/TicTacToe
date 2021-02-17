class Party {
    /**
     *
     * @param {HTMLDivElement} boardContainer
     */
    constructor(boardContainer) {
        this.mqttLogs = true;

        this.boardContainer = boardContainer;
        this.drawStartMenu(this.boardContainer);
    }

    /**
     *
     * @param {HTMLDivElement} boardContainer
     */
    drawStartMenu() {
        this.boardContainer.innerHTML = "";

        // Create start menu
        const menu = document.createElement("form");
        menu.id = "tictactoe-init-game";
        this.boardContainer.appendChild(menu);

        // Player name (Class property)
        const nameInputField = document.createElement("input");
        nameInputField.id = "tictactoe-player-name";
        nameInputField.type = "text";
        this.nameInputField = nameInputField;
        menu.appendChild(this.nameInputField);

        // Start party
        const startBtn = document.createElement("button");
        startBtn.type = "submit";
        startBtn.innerText = "Create a party";
        menu.appendChild(startBtn);

        menu.addEventListener("submit", (e) => {
            e.preventDefault();

            this.initGame();
        });

        // Party link (Class property)
        const partyIdField = document.createElement("input");
        partyIdField.id = "tictactoe-player-name";
        partyIdField.type = "text";
        this.partyIdInputField = partyIdField;
        menu.appendChild(this.partyIdInputField);

        // Join party
        const joinBtn = document.createElement("button");
        joinBtn.innerText = "Join a party";
        menu.appendChild(joinBtn);
        this.boardContainer.appendChild(joinBtn);

        joinBtn.addEventListener("click", () => {
            this.joinGame();
        });
    }

    initGame() {
        this.userName = this.nameInputField.value;
        this.PartyID = this.userName + Date.now();
        this.partyTopic = `tictactoe/${this.PartyID}/#`;
        this.partyTopicSubscriptions = JSON.parse(
            `{"${this.partyTopic}": {"qos":2}}`
        );
        this.pubTopic = `tictactoe/${this.PartyID}/${this.userName}`;

        this.mySymbole = "X";
        this.otherSymbole = "O";

        this.connect();
        this.mqttCallbacks();
        this.makeBoard(this.boardContainer);

        const inv = document.createElement("p");
        inv.innerText = this.PartyID;
        this.boardContainer.appendChild(inv);
    }

    joinGame() {
        this.userName = this.nameInputField.value;
        this.PartyID = this.partyIdInputField.value;
        this.partyTopic = `tictactoe/${this.PartyID}/#`;
        this.partyTopicSubscriptions = JSON.parse(
            `{"${this.partyTopic}": {"qos":2}}`
        );
        this.pubTopic = `tictactoe/${this.PartyID}/${this.userName}`;

        this.mySymbole = "O";
        this.otherSymbole = "X";

        this.connect();
        this.mqttCallbacks();
        this.makeBoard(this.boardContainer);
    }

    connect() {
        this.MQTTConnection = mqtt.connect({
            protocol: "ws",
            host: "test.mosquitto.org",
            port: 8080,
            username: this.userName,
            clientId: this.userName,
            path: "/mqtt",
        });
    }

    mqttCallbacks() {
        this.MQTTConnection.on("connect", () => {
            this.MQTTConnection.subscribe(
                this.partyTopicSubscriptions,
                (err, grant) => {
                    if (err) console.warn("SUBSCRIBE ERROR:", err);
                    if (this.mqttLogs) console.log("SUBSCRIBED TO :", grant);
                }
            );
        });

        this.MQTTConnection.on("message", (topic, message) => {
            const msg = message.toString();
            console.log(topic, "<<>>", msg);

            const sender = topic.split("/")[2];

            console.log(sender);
            console.log(this.userName);

            if (sender !== this.userName) {
                //
                document.querySelector("#" + msg).innerText = this.otherSymbole;
                this.lockturn = false;
            }
        });

        this.MQTTConnection.on("packetsend", (packet) => {
            console.log("sent:    ", packet);
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
        board.style.gridTemplateRows = "repeat(3, 75px)";
        board.style.gridTemplateColumns = "repeat(3, 75px)";

        for (let i = 0; i < 9; i++) {
            const div = document.createElement("div");
            div.id = "gamesquare-" + i;
            div.setAttribute("xo-square", "");
            div.style.border = "1px solid #333";
            board.appendChild(div);
        }

        this.boardContainer.appendChild(board);

        board.addEventListener("click", (e) => {
            if (e.target.hasAttribute("xo-square") && !this.lockturn) {
                this.drawXO(e.target);
                this.MQTTConnection.publish(this.pubTopic, e.target.id, {
                    qos: 2,
                });
            }
        });
    }

    drawXO(target) {
        target.innerText = this.mySymbole;
        this.lockturn = true;
    }

    lockOponnentId() {}
}

const board = document.querySelector("#tictactoe-container");

const party = new Party(board);
