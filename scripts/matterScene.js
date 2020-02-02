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
engine.positionIterations = 10
engine.velocityIterations = 20

// CREATE A RENDERER
const render = Render.create({
	element: document.querySelector('.canvasContainer'),
	engine: engine,
	options: {
		width: context.canvasWidth,
		height: context.canvasHeight,
		wireframes : false,
		background : 'transparent'
	},
})

context.setResizeUpdate()

// GROUND
const ground = Bodies.rectangle(context.canvasWidth / 2, context.canvasHeight + 25, context.canvasWidth, 50, { isStatic: true })
World.add(engine.world, [ground])

// RUN THE ENGIN & RENDERER
Engine.run(engine)
Render.run(render)

const matterSystem =
{
	// Scene properties
	boxSize : context.boxesSize,
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

	wreckingBall : null,
	wreckingBallConstraint : null,
	activeWreckingBall : true,

	init()
	{
		this.setMouseConstraint()
	},

	systemPropertiesSetup(numberOfBox, boxByColumn)
	{
		this.boxes = []
		this.numberOfBox = numberOfBox
		this.boxByColumn = boxByColumn

		this.xStep = 0
		this.yStep = 0
		this.boxesDisplayCounter = 0

		setTimeout(() =>
		{
			gameState.overlayDataActualization()
		},1000)
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
				this.xStep += this.boxSize
			}
			_color = colorArray[this.boxes.length][i - this.boxByColumn * this.boxes.length]
			_tab.push(Bodies.rectangle(this.xStep + context.canvasWidth - this.numberOfBox / this.boxByColumn * this.boxSize - this.distanceFromRight, -100, this.boxSize, this.boxSize, {
				render:
				{
					fillStyle: `rgb(${_color.r}, ${_color.g}, ${_color.b})`,
					lineWidth: 2
				}
			}))
		}
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

		this.setCleaningSystem()
		this.activeWreckingBall = true
		this.setWreckingBall()
	},

	setMouseConstraint()
	{
		const mouse = Matter.Mouse.create(render.context.canvas)
		const mConstraint = Matter.MouseConstraint.create(engine, {mouse})
		World.add(world, mConstraint)
	},

	setCleaningSystem()
	{
		// CREATING CLEANING ARM BODY
		this.cleaningArm = Bodies.rectangle(-1000, 0, 50, context.canvasHeight, { isStatic: true, render: { fillStyle: '#FFF'} })
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
				this.cleaningArm.position.x = -100
				cleaningArmPos = -100
				answerInput.canWrite = true
				// REMOVING ALL BOXES FROM THE SCENE
				for (const _array of this.boxes) {
					for (const _element of _array) {
						World.remove(engine.world, [_element])
					}
				}
				// LAUNCH NEXT IMAGE AFTER CLEANING
				if (gameState.actualImage == gameState.gameConfig.length - 1) {
					gameState.actualImage = 0
				}
				else
				{
					gameState.actualImage++
				}
				pixelateImage(gameState.gameConfig[gameState.actualImage].imageName, gameState.gameConfig[gameState.actualImage].size[0], gameState.gameConfig[gameState.actualImage].size[1])
			}
		})
	},

	setWreckingBall()
	{
		wreckingBallInitPosX = -500
		this.wreckingBall = Bodies.circle(wreckingBallInitPosX, context.canvasHeight - 300, 100, { density: 0.5, frictionAir: 0.005})
		World.add(engine.world, this.wreckingBall)
		this.wreckingBallConstraint = Matter.Constraint.create({
			pointA: { x: wreckingBallInitPosX , y: -100 },
			bodyB: this.wreckingBall
		})
		World.add(engine.world, this.wreckingBallConstraint)
		Events.on(engine, 'beforeUpdate', () =>
		{
			if (this.activeWreckingBall == true) {
				wreckingBallInitPosX += 5 * (Math.sin(engine.timing.timestamp * 0.001) + 0.5)
				console.log(wreckingBallInitPosX, 5 *  Math.sin(engine.timing.timestamp * 0.001) + 0.5)
				console.log(this.activeWreckingBall)
				this.wreckingBallConstraint.pointA.x = wreckingBallInitPosX
			}
			if (this.wreckingBallConstraint.pointA.x > context.canvasWidth + 100 && this.wreckingBall.position.x > context.canvasWidth + 110) {
				this.activeWreckingBall = false
				this.wreckingBall.position.x = -500
				this.wreckingBallConstraint.pointA.x = -500
				wreckingBallInitPosX = -500
				World.remove(engine.world, this.wreckingBall)
				World.remove(engine.world, this.wreckingBallConstraint)
				gameState.overlayDisplay()
				console.log('finish')
			}
		})
	},
}
matterSystem.init()