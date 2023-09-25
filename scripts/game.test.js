/**
 * @jest-environment jsdom
 */

const { describe } = require('yargs');

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
});