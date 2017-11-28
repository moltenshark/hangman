const inquirer = require("inquirer"), Word = require("./word.js"), Letter = require("./letter.js");

let newWord, letterArr, hangArr, currentArr, guessArr, totalRight, wrongLeft;

function startGame() {
	newWord = new Word(), letterArr = [], hangArr = [], guessArr = [], totalRight = 0, wrongLeft = 9;
	for (let i = 0; i < newWord.chosen.length; i++) letterArr.push(newWord.chosen[i]);
	for (let index of letterArr) hangArr.push(new Letter(index));
}

function displayGame(guess) {
	let currentArr = [], newRight = 0;
	for (let index of hangArr) {
		let match = false;
		for (let guess of guessArr) if (index.visible == guess) match = true;
		match ? (currentArr.push(index.visible), newRight++) : currentArr.push(index.hidden);
	}
	if (guess && newRight > totalRight) {
		console.log(`\nCorrect!`);
		totalRight = newRight;
		console.log(`\n${currentArr.join(" ")}\n`);
	}
	else if (guess) {
		wrongLeft--;
		if (wrongLeft > 1) console.log(`\nIncorrect! ${wrongLeft} guesses remaining!\n`);
		else if (wrongLeft > 0) console.log(`\nIncorrect! ${wrongLeft} guess remaining!\n`);
	}
	else console.log(`\n${currentArr.join(" ")}\n`);
}

function userPrompt() {
	inquirer
		.prompt([ {type: "input", message: "Guess a letter!", name: "guess", validate: validateNew }])
		.then(function(response) {
			if (response.guess != "exit") {
				guessArr.push(response.guess.toLowerCase());
				displayGame(true);
				totalRight == newWord.chosen.length 
					? (console.log(`You win!\n`), playAgain())
					: wrongLeft == 0 
						? (console.log(`\nYou lose! The word was "${newWord.chosen}".\n`), playAgain())
						: userPrompt();
			}
		});
}

function playAgain() {
	inquirer
		.prompt([{type: "confirm", message: "Play again?", name: "replay"}])
		.then(function(response) {
			if (response.replay) {
				startGame();
				displayGame();
				userPrompt();
			}
		});
}

function validateNew(letter) {
	if (letter == "exit") return true;
	let noMatch = true
	for (let guess of guessArr) if (letter == guess) noMatch = false;
	return (letter.match(/^[A-Za-z]+$/) && letter.length == 1) ? noMatch || "You've already guessed that letter!" : false || "Invalid guess!";
}

startGame();
displayGame();
userPrompt();