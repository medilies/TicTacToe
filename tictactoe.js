/**
 * @property **boardContainer** refrenced via the constructor
 * ### Start menu elements
 * @property **nameInputField**
 * @property **startBtn** - gets an event handeler
 * @property **partyIdInputField**
 * @property **joinBtn** - gets an event handeler
 * ### Game screen
 * @property **playerTrunToggle**
 * @property **localScoreElement**
 * @property **xoGridBoard** - REQUIRES click event handler: to locate which gamesquare was targeted
 * @property **opponentScoreElement**
 * @property **gameSquaresIdPrfix**
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

    //**********************************************
    // START MENU
    //**********************************************
    drawStartMenu() {
        this.boardContainer.innerHTML = "";

        const startMenu = document.createElement("div");
        startMenu.id = "xo-startMenu";

        this.appendStartPartyMenu(startMenu);
        this.appendJoinPartyMenu(startMenu);

        this.boardContainer.appendChild(startMenu);
    }

    appendStartPartyMenu(parent) {
        const startPartyMenu = document.createElement("div");
        startPartyMenu.id = "xo-startPartyMenu";

        this.appentNameInputField(startPartyMenu);
        this.appendCreatePartyBtn(startPartyMenu);

        parent.appendChild(startPartyMenu);
    }

    appendJoinPartyMenu(parent) {
        const joinPartyMenu = document.createElement("div");
        joinPartyMenu.id = "xo-joinPartyMenu";

        this.appendPartyIdInputField(joinPartyMenu);
        this.appendJoinPartyBtn(joinPartyMenu);

        parent.appendChild(joinPartyMenu);
    }

    appentNameInputField(parent) {
        this.nameInputField = document.createElement("input");
        this.nameInputField.type = "text";
        this.nameInputField.placeholder = "player Name";
        this.nameInputField.classList.add("input", "long-input");
        parent.appendChild(this.nameInputField);
    }

    appendCreatePartyBtn(parent) {
        this.startBtn = document.createElement("button");
        this.startBtn.innerText = "Create a party";
        this.startBtn.classList.add("btn", "long-btn");
        parent.appendChild(this.startBtn);
    }

    appendPartyIdInputField(parent) {
        this.partyIdInputField = document.createElement("input");
        this.partyIdInputField.type = "text";
        this.partyIdInputField.placeholder = "Party code";
        this.partyIdInputField.classList.add("input", "short-input");
        parent.appendChild(this.partyIdInputField);
    }

    appendJoinPartyBtn(parent) {
        this.joinBtn = document.createElement("button");
        this.joinBtn.innerText = "Join a party";
        this.joinBtn.classList.add("btn", "short-btn");
        parent.appendChild(this.joinBtn);
    }

    //**********************************************
    // PARTY SCREEN
    //**********************************************
    drawPartyScreen(userName, Localsymbol, partyId = undefined) {
        const partyScreen = document.createElement("div");
        partyScreen.id = "xo-partyScreen";
        this.boardContainer.innerHTML = "";
        this.boardContainer.appendChild(partyScreen);

        this.appendlocalPlayerCard(partyScreen, userName, Localsymbol);
        this.appendXOGridBoard(partyScreen);
        this.appendEmptyOpponentArea(partyScreen);

        if (partyId !== undefined) this.displayPartyCodeForOwner(partyId);
    }

    appendXOGridBoard(parent) {
        this.xoGridBoard = document.createElement("div");
        this.xoGridBoard.id = "xo-gridBoard";

        for (let i = 0; i < 9; i++) {
            const div = document.createElement("div");
            div.id = "xo-gamesquare-" + i;
            div.setAttribute("xo-gamesquare", "");
            this.xoGridBoard.appendChild(div);
        }

        parent.appendChild(this.xoGridBoard);
    }

    appendlocalPlayerCard(parent, userName, Localsymbol) {
        this.localScoreElement = document.createElement("p");
        this.playerTrunToggle = document.createElement("p");
        this.playerTrunToggle.classList.add("turn-toggle");

        const localPlayerCard = this.createPlayerCard(
            userName,
            Localsymbol,
            this.localScoreElement,
            this.playerTrunToggle
        );

        localPlayerCard.appendChild(this.playerTrunToggle);
        parent.appendChild(localPlayerCard);
    }

    appendEmptyOpponentArea(parent) {
        this.opponentElement = document.createElement("div");
        this.opponentElement.classList.add("player-card");
        parent.appendChild(this.opponentElement);
    }

    displayOpponentPlayerCrad(opponentName, opponentSymbol) {
        this.opponentScoreElement = document.createElement("p");
        const remotePlayerCard = this.createPlayerCard(
            opponentName,
            opponentSymbol,
            this.opponentScoreElement
        );

        this.opponentElement.innerHTML = "";
        this.opponentElement.appendChild(remotePlayerCard);
    }

    createPlayerCard(userName, symbol, scoreElement) {
        const playerCard = document.createElement("div");
        playerCard.classList.add("player-card");

        const playerName = document.createElement("p");
        playerName.innerHTML = `Nickname: <b>${userName}</b>`;
        playerCard.appendChild(playerName);

        const playerSymbol = document.createElement("p");
        playerSymbol.innerHTML = `Symbol: <b>${symbol}</b>`;
        playerCard.appendChild(playerSymbol);

        scoreElement.innerHTML = "Score: 0";
        playerCard.appendChild(scoreElement);

        return playerCard;
    }

    displayPartyCodeForOwner(partyID) {
        const inv = document.createElement("p");
        inv.classList.add("join-code");
        inv.innerText = "Share the party code with one friend: " + partyID;

        this.opponentElement.appendChild(inv);
    }

    drawSymbol(target, symbol) {
        const targetElement = document.querySelector(
            "#" + this.gameSquaresIdPrfix + target
        );
        targetElement.innerText = symbol;
        console.log(symbol);
        console.log(targetElement);
        if (symbol === "X") targetElement.style.color = "#1580D6";
        else if (symbol === "O") targetElement.style.color = "#D61C15";
    }
}

/**
 * @property localRoundSymbol "X" | "O"
 * @property remoteRoundSymbol "X" | "O"
 * @property gameState
 * @property turnState "locked" | "unlocked"
 * @property roundResult "win" | "loss" | "tie" |undefined
 */
class Round {
    constructor(localRoundSymbol, remoteRoundSymbol) {
        this.localRoundSymbol = localRoundSymbol;
        this.remoteRoundSymbol = remoteRoundSymbol;
    }

    initRoundState() {
        this.gameState = ["", "", "", "", "", "", "", "", ""];
        this.roundResult = undefined;
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
            this.tie();
        }
    }

    win() {
        this.lockTurn();
        this.initRoundState();
        this.roundResult = "win";
    }

    lose() {
        this.lockTurn();
        this.initRoundState();
        this.roundResult = "loss";
    }

    tie() {
        this.lockTurn();
        this.initRoundState();
        this.roundResult = "tie";
    }

    /**
     * Simply check if tile position is empty to avoid overriding symbols
     * @param {Number} nb
     */
    isPlayedTile(nb) {
        if (this.gameState[nb] !== "") return true;
        return false;
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
 * @property {bool} subscribed
 * @property {bool} mqttLogs
 */
class MQTT {
    constructor(userName, partyId) {
        this.mqttLogs = true;
        this.userName = userName;
        this.partyId = partyId;
        this.connect();
        this.setPartySubTopic();
        this.setPartyPubTopic();
        this.mqttCallbacks();
    }

    connect() {
        this.mqttConnection = mqtt.connect({
            protocol: "ws",
            host: "test.mosquitto.org",
            port: 8080,
            username: this.userName,
            clientId: this.userName,
            path: "/mqtt",
        });
    }

    setPartySubTopic() {
        this.partySubTopic = JSON.parse(
            `{"tictactoe/${this.partyId}/#": {"qos":2}}`
        );
    }

    setPartyPubTopic() {
        this.partyPubTopic = `tictactoe/${this.partyId}/${this.userName}`;
    }

    mqttCallbacks() {
        // connection and subscribtion
        this.mqttConnection.on("connect", () => {
            this.mqttConnection.subscribe(this.partySubTopic, (err, grant) => {
                if (this.mqttLogs) {
                    if (err) throw ("SUBSCRIBE ERROR:", err);
                    this.subscribed = true;
                    console.log("SUBSCRIBED TO :", grant);
                }
            });
        });

        // Sent massages
        // this.mqttConnection.on("packetsend", (packet) => {
        //     // log
        //     if (this.mqttLogs) console.log("sent:    ", packet);
        // });
    }

    /**
     * Publish which square was played
     * @param {number} squareNb value between 0 and 8
     */
    pubXO(squareNb) {
        if (!(squareNb >= 0 && squareNb <= 8))
            throw "square number is limited inside [0-8]";
        const qos = { qos: 2 };
        this.mqttConnection.publish(this.partyPubTopic, squareNb, qos);
    }

    pubHi() {
        if (this.hiSent) return;
        // if this client is a joiner make sure it subscribed to party topic and can hear the echo of his "hi" to set this.hiSent to true to avoid more than (2)*hi in handshake
        // pubHI will only get delayed if subscribtion isn't confirmed
        if (!this.subscribed)
            setTimeout(() => {
                this.pubHi();
            }, 500);
        else {
            const qos = { qos: 2 };
            this.mqttConnection.publish(this.partyPubTopic, "hi", qos);
        }
    }
}

/**
 * @property **userName**
 * @property **partyId**
 * @property **localSymbol**
 * @property **remoteSymbol**
 * @property **opponentUserName**
 * @property **localScore**
 * @property **opponentScore**
 */
class Game {
    /**
     * Instantiates UI (UI dsplays "start menu" on intantiation) and listen to clicks on "start menu"
     * @param {HTMLDivElement} boardContainer
     */
    constructor(boardContainer) {
        this.ui = new UI(boardContainer);
        this.uiAttachStartMenuEventHandler();
    }

    /**
     * ### UI
     * Handeles clicks on "start menu":
     *
     * - Initiate a party
     * - Join a party
     */
    uiAttachStartMenuEventHandler() {
        this.ui.startBtn.addEventListener("click", (e) => {
            this.initParty();
        });
        this.ui.joinBtn.addEventListener("click", () => {
            this.joinParty();
        });
    }

    /**
     * ### UI
     * Handeles clicks on "Game screen" (XOs grid)
     */
    uiAttachXOGridBoardEventHandler() {
        this.ui.xoGridBoard.addEventListener("click", (e) => {
            this.playTurn(e.target);
        });
    }

    initParty() {
        this.setUserName();
        this.setPartyIdOnInit();
        this.setSymbols("X", "O");
        this.round = new Round(this.localSymbol, this.remoteSymbol);
        this.round.initRoundState();
        this.mqtt = new MQTT(this.userName, this.partyId);
        this.mqttOnMsgEventHandler(this.mqtt.mqttConnection);
        this.ui.drawPartyScreen(this.userName, this.localSymbol, this.partyId);
        this.uiAttachXOGridBoardEventHandler();
        this.roundUnlockTurn();
        this.initscores();
    }

    joinParty() {
        this.setUserName();
        this.setPartyIdOnJoin();
        this.setSymbols("O", "X");
        this.round = new Round(this.localSymbol, this.remoteSymbol);
        this.round.initRoundState();
        this.mqtt = new MQTT(this.userName, this.partyId);
        this.mqttOnMsgEventHandler(this.mqtt.mqttConnection);
        this.mqtt.pubHi();
        this.ui.drawPartyScreen(this.userName, this.localSymbol, undefined);
        this.uiAttachXOGridBoardEventHandler();
        this.roundLockTurn();
        this.initscores();
    }

    /**
     * Called on PARTY init() or join()
     * Get value from UI "start menu" "name input field" and asigns it to PARTY username
     * if value from "name input field" is "EMPTY" a random name will be picked from nameSrc
     */
    setUserName() {
        const input = this.ui.nameInputField.value;
        if (input === "") {
            const nameSrc = [
                "Lloyd_Gross",
                "Michel_Scarn",
                "Bestich_Manch",
                "Jim_Halpert",
                "Pam_Beesly",
                "Dwigth_K_Shrute",
                "Erin",
                "Daryl",
                "Holly",
            ];
            this.userName = nameSrc[Math.floor(Math.random() * nameSrc.length)];
        } else {
            this.userName = input;
        }
    }

    /**
     * Called only on PARTY init()
     * Defining (generating) the party ID
     */
    setPartyIdOnInit() {
        this.partyId = this.userName + Date.now();
    }

    /**
     * Called only on PARTY join()
     * Get value from UI "start menu" "party ID input field" and asigns it to PARTY party ID
     */
    setPartyIdOnJoin() {
        this.partyId = this.ui.partyIdInputField.value;
    }

    /**
     * Called on PARTY
     * - init() XO
     * - join() OX
     *
     * @param {string} local
     * @param {string} remote
     */
    setSymbols(local, remote) {
        this.localSymbol = local;
        this.remoteSymbol = remote;
    }

    /**
     * Called only once during handshake (opponentUserName used to be assumed as undefined)
     * opponentUserName is used to define to which player played the current turn at XO msg reception
     * @param {string} opponentUserName
     */
    setOpponentUserName(opponentUserName) {
        if (!(opponentUserName.length > 0))
            throw "opponent name must be a non-empty string";
        this.opponentUserName = opponentUserName;
    }

    /**
     * Called on PARTY init() or join()
     * The properties indicate how many rounds each player won during a party
     */
    initscores() {
        this.opponentScore = 0;
        this.localScore = 0;
    }

    playTurn(target) {
        /**
         * - known opponent (done handshake)
         * - clickable square
         * - allowed to play
         */
        if (
            this.opponentUserName !== undefined &&
            target.hasAttribute("xo-gamesquare") &&
            this.round.turnState === "unlocked"
        ) {
            // "xo-gamesquare-X"[14] = X AND X=[0-8]
            const msg = target.id[14];
            if (!(msg >= 0 && msg <= 8))
                throw "square number is limited inside [0-8]";
            if (this.round.isPlayedTile(msg)) return;
            this.roundLockTurn();
            this.mqtt.pubXO(msg);
        }
    }

    roundLockTurn() {
        this.round.lockTurn();
        this.ui.playerTrunToggle.innerText = "Wait";
        this.ui.playerTrunToggle.style.background = "#c22";
    }

    roundUnlockTurn() {
        this.round.unlockTurn();
        this.ui.playerTrunToggle.innerText = "Play";
        this.ui.playerTrunToggle.style.background = "#2c2";
    }

    /**
     * Uses the 3 following calsses
     *
     * - UI
     * - Round
     * - MQTT
     * @param {*} mqttConnection
     */
    mqttOnMsgEventHandler(mqttConnection) {
        mqttConnection.on("message", (topic, message) => {
            const msg = message.toString();
            const sender = topic.split("/")[2];

            // log
            if (this.mqtt.mqttLogs) console.log(topic, "<<>>", msg);

            // - XO exchanges:

            // - - User's play
            if (sender === this.userName && !isNaN(msg)) {
                this.ui.drawSymbol(msg, this.localSymbol);
                this.round.updateRoundState(msg, this.localSymbol);
                if (this.round.roundResult !== undefined)
                    this.roundEnd(this.round.roundResult);
            }
            // - - Opponent's play
            else if (
                this.opponentUserName !== undefined &&
                sender === this.opponentUserName &&
                !isNaN(msg)
            ) {
                this.ui.drawSymbol(msg, this.remoteSymbol);
                this.round.updateRoundState(msg, this.remoteSymbol);
                this.roundUnlockTurn();
                if (this.round.roundResult !== undefined)
                    this.roundEnd(this.round.roundResult);
            }
            // - Handshake
            else if (
                msg === "hi" &&
                sender === this.userName &&
                !this.mqtt.hiSent
            ) {
                this.mqtt.hiSent = true;
            } else if (
                this.opponentUserName === undefined &&
                msg === "hi" &&
                sender
            ) {
                // set change
                this.setOpponentUserName(sender);
                // display the change
                this.ui.displayOpponentPlayerCrad(
                    this.opponentUserName,
                    this.remoteSymbol
                );
                // conclude the handshake
                this.mqtt.pubHi();
            }
        });
    }

    roundEnd(result) {
        if (result === "loss") {
            this.opponentScore++;
            this.ui.opponentScoreElement.innerHTML = `Score: <b>${this.opponentScore}</b>`;
            this.roundLockTurn();
        } else if (result === "win") {
            this.localScore++;
            this.ui.localScoreElement.innerHTML = `Score: <b>${this.localScore}</b>`;
            this.roundUnlockTurn();
        }
        this.round.roundResult = undefined;
        this.ui.xoGridBoard.childNodes.forEach((child) => {
            child.innerHTML = "";
        });
    }
}

const board = document.querySelector("#xo-container");

const game = new Game(board);
