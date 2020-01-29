// USING PAPER.JS TO PIXELATE AN IMAGE ON A CANVAS THEN GET COLORS VALUES OF EACH PIXELS

// CANVAS SETUP 
paper.install(window)
paper.setup()

function pixelateImage(imageName, maxWidth, maxHeight)
{

	let raster = new Raster(`assets/gamePics/${imageName}`)

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

		// COLORS ARRAY, NUMBER OF BOXES AND BOXES BY COLUMN => SEND TO => MATTER.JS
		matterSystem.scenePropertiesSetup(colorArray.length * colorArray[0].length, colorArray.length)
		transposeMatrix(colorArray).map(x => x.reverse())
		matterSystem.sceneCreating(transposeMatrix(colorArray).map(x => x.reverse()))

	})
	// clear canvas ?
}