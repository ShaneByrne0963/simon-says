/**
 * @jest-environment jsdom
 */

const { default: JSDOMEnvironment } = require('jest-environment-jsdom');
const { game, newGame, showScore, addTurn, lightsOn, showTurns, playerTurn } = require("../game");

jest.spyOn(window, 'alert').mockImplementation(() => { });

beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync('index.html', 'utf-8');
    document.open()
    document.write(fileContents);
    document.close();
});

describe("The game object contains correct keys", () => {
    test("score key exists", () => {
        expect("score" in game).toBe(true);
    });
    test("currentGame key exists", () => {
        expect("currentGame" in game).toBe(true);
    });
    test("playerMoves key exists", () => {
        expect("playerMoves" in game).toBe(true);
    });
    test("choices key exists", () => {
        expect("choices" in game).toBe(true);
    });
    test("turnNumber key exists", () => {
        expect("turnNumber" in game).toBe(true);
    });
    test("lastButton key exists", () => {
        expect("lastButton" in game).toBe(true);
    });
    test("turnInProgress key exists", () => {
        expect("turnInProgress" in game).toBe(true);
    });
    test("choices contains the correct IDs", () => {
        expect(game.choices).toEqual(['button1', 'button2', "button3", "button4"]);
    });
});

describe("newGame works correctly", () => {
    beforeAll(() => {
        game.score = 42;
        game.playerMoves = ['button1', 'button2'];
        game.currentGame = ['button1', 'button2'];
        game.lastButton = 'button4';
        game.turnInProgress = false;
        document.getElementById('score').innerText = 42;
        newGame();
    });
    test("Should set game score to 0", () => {
        expect(game.score).toBe(0);
    });
    test("Should clear the playerMoves array", () => {
        expect(game.playerMoves.length).toBe(0);
    });
    test("Should be one move in the currentGame array", () => {
        expect(game.currentGame.length).toBe(1);
    });
    test("Should display 0 for the element with id of score", () => {
        expect(document.getElementById('score').innerText).toEqual(0);
    });
    test("Expect data-listener to be true", () => {
        const elements = document.getElementsByClassName('circle');
        for (element of elements) {
            expect(element.getAttribute('data-listener')).toBe("true");
        }
    });
    test("Should clear the value of the last button pressed", () => {
        expect(game.lastButton).toEqual("");
    });
    test("Should set the value of turnInProgress to true", () => {
        expect(game.turnInProgress).toEqual(true);
    });
});

describe("Gameplay works correctly", () => {
    beforeEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
        addTurn();
    });
    afterEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
    });
    test("addTurn adds a new turn to the game", () => {
        addTurn();
        expect(game.currentGame.length).toBe(2);
    });
    test("Should add correct class to light up the buttons", () => {
        let button = document.getElementById(game.currentGame[0]);
        lightsOn(game.currentGame[0]);
        expect(button.classList).toContain('light');
    });
    test("showTurns should update game.turnNumber", () => {
        game.turnNumber = 42;
        showTurns();
        expect(game.turnNumber).toBe(0);
    });
    test("Should increment the score if the turn is correct", () => {
        game.playerMoves.push(game.currentGame[0]);
        playerTurn();
        expect(game.score).toBe(1);
    });
    test("Should call an alert if the move is wrong", () => {
        game.playerMoves.push('wrong');
        playerTurn();
        expect(window.alert).toBeCalledWith("Wrong Move!");
    });
    test("turnInProgress should be true while showing turns", () => {
        showTurns();
        expect(game.turnInProgress).toBe(true);
    });
    test("clicking during the computer sequence should fail", () => {
        showTurns();
        game.lastButton = '';
        document.getElementById('button2').click();
        expect(game.lastButton).toEqual("");
    });
});