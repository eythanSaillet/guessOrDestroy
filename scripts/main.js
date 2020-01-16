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
		// console.log(transposeMatrix(colorArray))
		transposeMatrix(colorArray).map(x => x.reverse())
		projectName.sceneCreating(transposeMatrix(colorArray).map(x => x.reverse()))

	})
	// clear canvas ?
}

pixelateImage('joconde', 'joconde.jpeg', 10, 10)
// pixelateImage('liberty', 'liberty.jpg', 30, 10)
// pixelateImage('cri', 'cri.jpg', 10, 10)


// MATTER.JS

let context = {

    // Window values
    windowWidth : window.innerWidth,
    windowHeight : window.innerHeight,

    canvasWindowPart : 1.2,

    resizeUpdate()
    {
        this.canvasWidth = window.innerWidth / this.canvasWindowPart
        this.canvasHeight = window.innerHeight / this.canvasWindowPart
        window.addEventListener('resize', () =>
        {
            this.canvasWidth = window.innerWidth / this.canvasWindowPart
            this.canvasHeight = window.innerHeight / this.canvasWindowPart
        })
    }
}
context.resizeUpdate()

/// module aliases
let Engine = Matter.Engine,
Render = Matter.Render,
World = Matter.World,
Bodies = Matter.Bodies

// create an engine
let engine = Engine.create()

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
let ground = Bodies.rectangle(400, 610, 1500, 60, { isStatic: true })

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
		console.log(colorArray)
		let _tab = []
		let _color
        for (let i = 0; i < this.numberOfBox; i++) {
            if(i % this.boxByColumn == 0 && i != 0)
            {
				this.boxes.push(_tab)
				_tab = []
				this.xGap += this.boxSize
			}
			_color = colorArray[this.boxes.length][i - parseInt(`${this.boxes.length}${0}`)]
			console.log(_color)
            _tab.push(Bodies.rectangle(context.canvasWidth / 2 - this.numberOfBox / this.boxByColumn * this.boxSize / 2 + this.xGap, -100, this.boxSize, this.boxSize, {
				render: {
					fillStyle: `rgb(${_color.r}, ${_color.g}, ${_color.b})`,
					lineWidth: 2
			   }
			}))
		}
		console.log(this.boxes)
		this.boxesShuffleAndDisplay(this.boxes)
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
		console.log(shuffleBoxes)

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
}

// TOOLS FUNCTION

function transposeMatrix(matrix)
{
	return matrix[0].map(function (_, c) { return matrix.map(function (r) { return r[c] }) })
}