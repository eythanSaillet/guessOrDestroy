// CANVAS SETUP
paper.install(window)
paper.setup()

function pixelateImage(name, imageName, maxWidth, maxHeight, tableContainer)
{

	let raster = new Raster(`assets/${imageName}`)

	raster.on('load', function() {

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
		for (let y = 0; y < raster.height; y++) {
			let array = []
			for(let x = 0; x < raster.width; x++) {

				let rasterColor = raster.getPixel(x, y)
				let color = {}
				color.r = rasterColor.components[0] * 255
				color.g = rasterColor.components[1] * 255
				color.b = rasterColor.components[2] * 255
				array.push(color)
			}
			colorArray.push(array)
		}
		// console.log(colorArray)
		// return colorArray


		// *** // exp


		// ARRAY CREATION
		table = document.createElement('table')
		table.classList.add(name)
		tableContainer.appendChild(table)
		for (let i = 0; i < height; i++) {
			const row = document.createElement('tr')
			table.appendChild(row)
			for (let j = 0; j < width; j++) {
				const cell = document.createElement('td')
				row.appendChild(cell)
			}
		}


		// ARRAY PAINTING
		let tableCells = document.querySelectorAll(`.${name} td`)
		let counter = 0
		for (let y = 0; y < raster.height; y++) {
			for(let x = 0; x < raster.width; x++) {
				tableCells[counter].style.background = `rgb(${colorArray[y][x].r}, ${colorArray[y][x].g}, ${colorArray[y][x].b})`
				counter++
			}
		}


		// *** // exp

	})

	// clear canvas ?
}

pixelateImage('joconde', 'joconde.jpeg', 10, 10, document.querySelector('.container'))
pixelateImage('liberty', 'liberty.jpg', 20, 20, document.querySelector('.container'))
pixelateImage('cri', 'cri.jpg', 10, 10, document.querySelector('.container'))


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
console.log(render)


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
    // Scene 
    boxSize : 50,
    numberOfBox : 50,
    boxByColumn : 10,
    boxes : [],
    xGap : 0,
	yGap : 0,
	boxesDisplayCounter : 0,

    
    sceneCreating()
    {
		let tab = []
        for (let i = 0; i < this.numberOfBox + 1; i++) {
            if(i % this.boxByColumn == 0 && i != 0)
            {
				this.boxes.push(tab)
				tab = []
				this.xGap += this.boxSize
			}
            tab.push(Bodies.rectangle(context.canvasWidth / 2 - this.numberOfBox / this.boxByColumn * this.boxSize / 2 + this.xGap, -100, this.boxSize, this.boxSize))
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
				}, 300)
			}
			let _counter = 0
			boxesDisplayLoop(boxesColumn)
		}
	},
}
projectName.sceneCreating()

// Math.random() * context.canvasWidth