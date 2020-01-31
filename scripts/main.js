let gameState = {

	gameConfig : {},

	actualImage : 0,

	init()
	{
		this.getGameConfig()
	},

	getGameConfig()
	{
		window
			.fetch('scripts/gameConfig.json')
			.then(_response => _response.json()) 
			.then(_config => 
			{
				this.gameConfig = shuffleArray(_config)
				// LAUNCH GAME HERE
				pixelateImage(this.gameConfig[this.actualImage].imageName, this.gameConfig[this.actualImage].size[0], this.gameConfig[this.actualImage].size[1])
			})
	},

	startGame()
	{

	}
}
gameState.init()

// ANSWER INPUT & WIN TEST

let answerInput = {
	
	textInput : '',
	$textInput : document.querySelector('.inputContainer span'),
	allowedLetters : ['a', 'à', 'b', 'c', 'ç', 'd', 'e', 'é', 'è', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'ù', 'v', 'w', 'x', 'y', 'z', ' ','\'', 'enter', 'backspace'],

	init()
	{
		this.setKeyboardEvent()
	},

	setKeyboardEvent()
	{
		window.addEventListener('keydown', (_event) =>
		{
			if(this.allowedLetters.indexOf(_event.key.toLowerCase()) != -1)
			{
				if (_event.key == 'Enter')
				{
					// WIN TEST
					this.winTest(this.textInput)
					this.textInput = ''
				}
				else if(_event.key == 'Backspace')
				{
					this.textInput = this.textInput.slice(0, this.textInput.length - 1)
				}
				else
				{
					this.textInput += _event.key
				}
				this.$textInput.innerHTML = this.textInput
			}
		})
	},

	winTest(input)
	{
		// SPLIT THE ANSWER INTO SPERATE WORDS
		const _words = input.split(' ')
		let goodAnswerCounter = 0

		// TEST IF EACH WORD CORRESPOND TO EACH GOOD ANSWER
		for (const _word of _words) {
			for (const _goodAnswer of gameState.gameConfig[gameState.actualImage].answers) {
				if (_word == _goodAnswer) {
					goodAnswerCounter++
				}
			}
		}
		if (goodAnswerCounter > 0) {
			console.log('WIN')
			matterSystem.isCleaning = true
		}
		else{
			console.log('LOSE')
		}
	}
}
answerInput.init()


// TOOLS FUNCTIONS

function transposeMatrix(matrix)
{
	return matrix[0].map(function (_, c) { return matrix.map(function (r) { return r[c] }) })
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}