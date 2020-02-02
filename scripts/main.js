let gameState = {

	gameConfig : {},
	actualImage : 0,

	$resultOverlay : document.querySelector('.resultOverlay'),
	$resultOverlayImage : document.querySelector('.resultOverlay .imageContainer img'),
	$resultOverlayImageName : document.querySelector('.resultOverlay .imageTitle'),
	$resultOverlayArtistName : document.querySelector('.resultOverlay .artistName'),
	$resultOverlayImageDescription : document.querySelector('.resultOverlay .description'),

	$resultOverlayExitCross : document.querySelector('.resultOverlay .exitCrossButton'),

	init()
	{
		this.getGameConfig()
		this.setResultOverlayExitEvent()
	},

	getGameConfig()
	{
		// GETTING THE JSON CONFIG FILE
		window
			.fetch('scripts/gameConfig.json')
			.then(_response => _response.json()) 
			.then(_config => 
			{
				// SHUFFLE THE PICS
				this.gameConfig = shuffleArray(_config)
				// LAUNCH GAME WITH THE FIRST PICTURE
				pixelateImage(this.gameConfig[this.actualImage].imageName, this.gameConfig[this.actualImage].size[0], this.gameConfig[this.actualImage].size[1])
			})
	},

	startGame()
	{

	},

	overlayDataActualization()
	{
		this.$resultOverlayImage.setAttribute('src', `assets/gamePics/${this.gameConfig[this.actualImage].imageName}`)
		this.$resultOverlayImageName.innerHTML = this.gameConfig[this.actualImage].name
		this.$resultOverlayArtistName.innerHTML = this.gameConfig[this.actualImage].artistName
		this.$resultOverlayImageDescription.innerHTML = this.gameConfig[this.actualImage].description
	},

	overlayDisplay()
	{
		answerInput.canWrite = false
		this.$resultOverlay.style.pointerEvents = 'auto'
		gsap.to(this.$resultOverlay, {opacity: 1, duration: 1})
	},

	setResultOverlayExitEvent()
	{
		this.$resultOverlayExitCross.addEventListener('click', () =>
		{
			this.exitOverlay()
		})
	},

	exitOverlay()
	{
		this.$resultOverlay.style.pointerEvents = 'none'
		gsap.to(this.$resultOverlay, {opacity: 0, duration: 0.5})
		matterSystem.isCleaning = true

		answerInput.$textInput.style.color = 'white'
		answerInput.$textInput.innerHTML = ''
		answerInput.textInput = ''
	},
}
gameState.init()

// ANSWER INPUT & WIN TEST
let answerInput = {
	
	textInput : '',
	$textInput : document.querySelector('.inputContainer span'),
	allowedLetters : ['a', 'à', 'b', 'c', 'ç', 'd', 'e', 'é', 'è', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'ù', 'v', 'w', 'x', 'y', 'z', ' ','\'', 'enter', 'backspace'],
	canWrite : true,

	init()
	{
		this.setKeyboardEvent()
	},

	setKeyboardEvent()
	{
		// ON KEYBOARDS EVENTS => GET THE KEY CODE
		window.addEventListener('keydown', (_event) =>
		{
			// MAKE IT LOWER CASE AND TEST IF IT IS AN ALLOWED CHARACTER
			if(this.allowedLetters.indexOf(_event.key.toLowerCase()) != -1 && this.canWrite == true)
			{
				// ENTER EVENT => TEST WIN AND RESET THE INPUT
				if (_event.key == 'Enter')
				{
					this.winTest(this.textInput)
				}
				// BACKSPACE EVENT => DELETE THE LAST CHARACTER
				else if(_event.key == 'Backspace')
				{
					this.textInput = this.textInput.slice(0, this.textInput.length - 1)
				}
				// OTHER CODES EVENTS => ADD TO THE INPUT
				else
				{
					this.textInput += _event.key
				}
				// ACTUALIZE THE DOM
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
		// IF AT LEAST ONE WORD IS GOOD => THEN WIN
		if (goodAnswerCounter > 0) {
			this.win()
		}
		else{
			this.badAnswer()
		}
	},

	win()
	{
		this.canWrite = false
		this.$textInput.style.color = '#7CFC00'
		setTimeout(() => {
			gameState.overlayDisplay()
			matterSystem.activeWreckingBall = false
			// World.remove(engine.world, [matterSystem.wreckingBall])
			// World.remove(engine.world, [matterSystem.wreckingBallConstraint])
		}, 1500)
	},

	// IF LOSE => RED TEXT + RESET TEXT INPUT
	badAnswer()
	{
		this.canWrite = false
		this.$textInput.style.color = 'red'
		setTimeout(() => {
			this.canWrite = true
			this.$textInput.style.color = 'white'
			this.$textInput.innerHTML = ''
			this.textInput = ''
		}, 1500)
	},
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