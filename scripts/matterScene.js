// DEFINE A RESPONSIVE CONTEXT TO CREATE MATTER CANVAS SCENE

const context = {

	canvasWindowPart : 0.75,

	canvasWidth : window.innerWidth,
	canvasHeight : null,

	boxesSize : null,

	init()
	{
		this.canvasHeight = window.innerHeight * this.canvasWindowPart
		document.querySelector('.inputContainer').style.height = `${window.innerHeight - this.canvasHeight - document.querySelector('.warningBar').style.height}px`
		this.boxesSize = Math.floor(this.canvasHeight / 15)
	},

	setResizeUpdate()
	{
		window.addEventListener('resize', () =>
		{
			render.canvas.width = window.innerWidth
			this.canvasHeight = window.innerHeight * this.canvasWindowPart
			render.canvas.height = this.canvasHeight
			document.querySelector('.inputContainer').style.height = `${window.innerHeight - this.canvasHeight - document.querySelector('.warningBar').style.height}px`
			this.boxesSize = Math.floor(this.canvasHeight / 15)
		})
	}
}
context.init()

// MATTER.JS

const Engine = Matter.Engine,
Render = Matter.Render,
World = Matter.World,
Bodies = Matter.Bodies,
Body = Matter.Body,
Events = Matter.Events

// CREATE ENGINE
const engine = Engine.create()
const world = engine.world

// console.log(engine.positionIterations, engine.velocityIterations)
engine.positionIterations = 5
engine.velocityIterations = 20

// CREATE A RENDERER
const render = Render.create({
	element: document.querySelector('.canvasContainer'),
	engine: engine,
	options: {
		width: context.canvasWidth,
		height: context.canvasHeight,
		wireframes : false,
	},
})

context.setResizeUpdate()

// GROUND
const ground = Bodies.rectangle(context.canvasWidth / 2, context.canvasHeight + 25, context.canvasWidth, 50, { isStatic: true })
World.add(engine.world, [ground])

// TO MAKE DETERNIMISMM
// let runner = Matter.Runner.create()
// runner.isFixed = true


// RUN THE ENGIN & RENDERER
Engine.run(engine)
Render.run(render)

const matterSystem =
{
	// Scene properties
	boxeSize : context.boxesSize,
	numberOfBox : 50,
	boxByColumn : 10,
	boxes : [],
	xStep : 0,
	yStep : 0,
	boxesDisplayCounter : 0,
	distanceFromRight : 150,

	ground : null,
	cleaningArm : null,
	isCleaning : false,

	systemPropertiesSetup(numberOfBox, boxByColumn)
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
		this.setCleaningSystem()
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

	setCleaningSystem()
	{
		// CREATING CLEANING ARM BODY
		this.cleaningArm = Bodies.rectangle(-100, 0, 50, context.canvasHeight, { isStatic: true })
		World.add(engine.world, [this.cleaningArm])

		// CLEANING CLOCK ANIMATION
		let cleaningArmPos = -100
		Events.on(engine, 'beforeUpdate', () =>
		{
			// IF TRUE => CLEAN
			if (this.isCleaning) {
				Body.setVelocity(this.cleaningArm, { x: 15, y: 0 })
				Body.setPosition(this.cleaningArm, { x: cleaningArmPos, y: context.canvasHeight / 2})
				cleaningArmPos += 5
			}
			// RESET CLEANING SYSTEM
			if (cleaningArmPos > context.canvasWidth + 100) {
				this.isCleaning = false
				cleaningArmPos = -100
				// REMOVING ALL BOXES FROM THE SCENE
				for (const _array of this.boxes) {
					for (const _element of _array) {
						World.remove(engine.world, [_element])
					}
				}
			}
		})
	},
}