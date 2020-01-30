// MATTER.JS

let Engine = Matter.Engine,
Render = Matter.Render,
World = Matter.World,
Bodies = Matter.Bodies

// CREATE ENGINE
let engine = Engine.create()
let world = engine.world

// CREATE A RENDERER
let render = Render.create({
    element: document.querySelector('.canvasContainer'),
    engine: engine,
    options: {
        width: context.canvasWidth,
        height: context.canvasHeight,
        wireframes : false,
    },
})

// GROUND
let ground = Bodies.rectangle(context.canvasWidth / 2, context.canvasHeight + 25, context.canvasWidth, 50, { isStatic: true })
World.add(engine.world, [ground])

// RUN THE ENGIN & RENDERER
Engine.run(engine)
Render.run(render)

let matterSystem =
{
    // Scene properties
    boxeSize : 40,
    numberOfBox : 50,
    boxByColumn : 10,
    boxes : [],
    xStep : 0,
	yStep : 0,
    boxesDisplayCounter : 0,
    distanceFromRight : 150,

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
				this.xStep += this.boxeSize
			}
			_color = colorArray[this.boxes.length][i - this.boxByColumn * this.boxes.length]
            _tab.push(Bodies.rectangle(this.xStep + context.canvasWidth - this.numberOfBox / this.boxByColumn * this.boxeSize - this.distanceFromRight, -100, this.boxeSize, this.boxeSize, {
                render:
                {
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
