// CANVAS SETUP
paper.install(window)
paper.setup()

function pixelateImage(name, imageName, maxWidth, maxHeight)
{

	let raster = new Raster(`assets/${imageName}`)

	raster.on('load', function()
	{
		// MAKE THE IMAGE AS SMALL AS AT LEAST ONE OF THE MAXIMUM LENGTH
		let width = raster.size._width
		let height = raster.size._height

		do
		{
			height /= 1.1
			width /= 1.1
		} while (width >= maxWidth || height >= maxHeight)
		
		width = Math.ceil(width)
		height = Math.ceil(height)

		raster.size = new Size(width, height)

		// COLOR DATA ARRAY CREATION
		let colorArray = []
		for (let y = 0; y < raster.height; y++)
		{
			let array = []
			for(let x = 0; x < raster.width; x++)
			{

				let rasterColor = raster.getPixel(x, y)
				let color = {}
				color.r = rasterColor.components[0] * 255
				color.g = rasterColor.components[1] * 255
				color.b = rasterColor.components[2] * 255
				array.push(color)
			}
			colorArray.push(array)
		}

		// LAUNCH HERE AFTER LOAD

		projectName.scenePropertiesSetup(colorArray.length * colorArray[0].length, colorArray.length)
		transposeMatrix(colorArray).map(x => x.reverse())
		projectName.sceneCreating(transposeMatrix(colorArray).map(x => x.reverse()))

	})
	// clear canvas ?
}

pixelateImage('joconde', 'joconde.jpeg', 10, 10)
// pixelateImage('liberty', 'liberty.jpg', 30, 15)
// pixelateImage('cri', 'cri.jpg', 20, 20)


// MATTER.JS

let context = {

    // Window values
    windowWidth : window.innerWidth,
    windowHeight : window.innerHeight,

    canvasWindowPart : 1.25,

    setResizeUpdate()
    {
        this.canvasWidth = window.innerWidth
        this.canvasHeight = window.innerHeight / this.canvasWindowPart
        window.addEventListener('resize', () =>
        {
            this.canvasWidth = window.innerWidth
            this.canvasHeight = window.innerHeight / this.canvasWindowPart
        })
	}
}
context.setResizeUpdate()

/// module aliases
let Engine = Matter.Engine,
Render = Matter.Render,
World = Matter.World,
Bodies = Matter.Bodies

// create an engine
let engine = Engine.create()
let world = engine.world

// create a renderer
let render = Render.create({
    element: document.querySelector('.canvasContainer'),
    engine: engine,
    options: {
        width: context.canvasWidth,
        height: context.canvasHeight,
    },
})
render.options.wireframes = false


// bounds
let ground = Bodies.rectangle(context.canvasWidth / 2, context.canvasHeight + 25, context.canvasWidth, 50, { isStatic: true })

// add all of the bodies to the world
World.add(engine.world, [ground])

// run the engine
Engine.run(engine)

// run the renderer
Render.run(render)


let projectName =
{
    // Scene properties
    boxSize : 50,
    numberOfBox : 50,
    boxByColumn : 10,
    boxes : [],
    xGap : 0,
	yGap : 0,
	boxesDisplayCounter : 0,

	scenePropertiesSetup(numberOfBox, boxByColumn)
	{
		this.numberOfBox = numberOfBox
		this.boxByColumn = boxByColumn

	},

    
	sceneCreating(colorArray)
    {
		let _tab = []
		let _color
        for (let i = 0; i < this.numberOfBox; i++) {
            if(i % this.boxByColumn == 0 && i != 0)
            {
				this.boxes.push(_tab)
				_tab = []
				this.xGap += this.boxSize
			}
			_color = colorArray[this.boxes.length][i - this.boxByColumn * this.boxes.length]
            _tab.push(Bodies.rectangle(context.canvasWidth / 2 - this.numberOfBox / this.boxByColumn * this.boxSize / 2 + this.xGap, -100, this.boxSize, this.boxSize, {
				render: {
					fillStyle: `rgb(${_color.r}, ${_color.g}, ${_color.b})`,
					lineWidth: 2
			   }
			}))
		}
		this.boxesShuffleAndDisplay(this.boxes)

		this.setMouseConstraint()
	},
	
	boxesShuffleAndDisplay(boxes)
	{
		function shuffle(a) {
			for (let i = a.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[a[i], a[j]] = [a[j], a[i]];
			}
			return a;
		}

		let shuffleBoxes = shuffle(boxes)

		let _columnCounter = 0
		function lauchBoxesDisplay(shuffleBoxes)
		{
			setTimeout(() =>
			{
				boxesDisplay(shuffleBoxes[_columnCounter])
				_columnCounter++
				if (_columnCounter < shuffleBoxes.length)
				{
					lauchBoxesDisplay(shuffleBoxes)
				}
			}, Math.floor(Math.random() * 300))
		}
		lauchBoxesDisplay(shuffleBoxes)

		function boxesDisplay(boxesColumn)
		{
			function boxesDisplayLoop(boxesColumn)
			{
				setTimeout(() =>
				{
					World.add(engine.world, boxesColumn[_counter])
					_counter++
					if (_counter < boxesColumn.length)
					{
						boxesDisplayLoop(boxesColumn)
					}
				}, Math.floor(Math.random() * (1000 - 500 + 1)) + 500)
			}
			let _counter = 0
			boxesDisplayLoop(boxesColumn)
		}
	},

	setMouseConstraint()
	{
		const mouse = Matter.Mouse.create(render.context.canvas)
		const options = {mouse}
		const mConstraint = Matter.MouseConstraint.create(engine, options)
		World.add(world, mConstraint)
	},
}

// Tools functions

function transposeMatrix(matrix)
{
	return matrix[0].map(function (_, c) { return matrix.map(function (r) { return r[c] }) })
}

// Answer input & win test

let answerInput = {
	
	textInput : '',
	$textInput : document.querySelector('.inputContainer span'),
	allowedLetters : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' ', 'Enter', 'Backspace'],

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
