let context = {

	// Window values
	windowWidth : window.innerWidth,
	windowHeight : window.innerHeight,

	canvasHeight : null,
	canvasWidth : null,

	canvasWindowPart : 0.75,

	setResizeUpdate()
	{
		this.canvasWidth = window.innerWidth
		this.canvasHeight = window.innerHeight * this.canvasWindowPart
		document.querySelector('.inputContainer').style.height = `${window.innerHeight - this.canvasHeight - document.querySelector('.warningBar').style.height}px`
		window.addEventListener('resize', () =>
		{
			this.canvasWidth = window.innerWidth
			this.canvasHeight = window.innerHeight * this.canvasWindowPart
			document.querySelector('.inputContainer').style.height = `${window.innerHeight - this.canvasHeight - document.querySelector('.warningBar').style.height}px`
		})
	}
}
context.setResizeUpdate()

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
	allowedLetters : ['a', 'à', 'b', 'c', 'ç', 'd', 'e', 'é', 'è', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'ù', 'v', 'w', 'x', 'y', 'z', ' ', 'Enter', 'Backspace'],

	init()
	{
		this.setKeyboardEvent()
	},

	setKeyboardEvent()
	{
		window.addEventListener('keydown', (_event) =>
		{
			if(this.allowedLetters.indexOf(_event.key) != -1)
			{
				if (_event.key == 'Enter')
				{
					// TEST WIN
					console.log('test win')
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