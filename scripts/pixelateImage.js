// USING PAPER.JS TO PIXELATE AN IMAGE ON A CANVAS THEN GET COLORS VALUES OF EACH PIXELS

// CANVAS SETUP 
paper.install(window)
paper.setup()

let unpixelizationSizes

function pixelateImage(_imageName, _maxWidth, _maxHeight)
{

	let _raster = new Raster(`assets/gamePics/${_imageName}`)
	unpixelizationSizes = []

	_raster.on('load', function()
	{
		// MAKE THE IMAGE AS SMALL AS AT LEAST ONE OF THE MAXIMUM LENGTH
		let _width = _raster.size._width
		let _height = _raster.size._height

		do
		{
			_width /= 1.1
			_height /= 1.1
			unpixelizationSizes.push([Math.ceil(_width), Math.ceil(_height)])
		} while (_width >= _maxWidth || _height >= _maxHeight)
		
		_width = Math.ceil(_width)
		_height = Math.ceil(_height)

		_raster.size = new Size(_width, _height)

		// COLOR DATA ARRAY CREATION
		let _colorArray = []
		for (let y = 0; y < _raster.height; y++)
		{
			let _array = []
			for(let x = 0; x < _raster.width; x++)
			{

				let _rasterColor = _raster.getPixel(x, y)
				let _color = {}
				_color.r = _rasterColor.components[0] * 255
				_color.g = _rasterColor.components[1] * 255
				_color.b = _rasterColor.components[2] * 255
				_array.push(_color)
			}
			_colorArray.push(_array)
		}

		// COLORS ARRAY, NUMBER OF BOXES AND BOXES BY COLUMN => SEND TO => MATTER.JS
		matterSystem.systemPropertiesSetup(_colorArray.length * _colorArray[0].length, _colorArray.length)
		transposeMatrix(_colorArray).map(x => x.reverse())
		matterSystem.sceneCreating(transposeMatrix(_colorArray).map(x => x.reverse()))

		// console.log(unpixelizationSizes)
		// unpixelizationSetup(unpixelizationSizes, _imageName)

	})
	// clear canvas ?
}

function unpixelizationSetup(_sizesArray, _imageName)
{

	let _numberOfUnpixelisationStates = 10
	let _sizesArrayStep = _sizesArray.length / _numberOfUnpixelisationStates
	let _sizesArrayCounter = 0
	let _newSizesArray = []

	do {
		
		_newSizesArray.push(_sizesArray[Math.floor(_sizesArrayCounter)])
		_sizesArrayCounter += _sizesArrayStep
	} while (_sizesArrayCounter < _sizesArray.length)

	let _unpixelizationStates = []
	for (const _element of _newSizesArray) {
		let _raster = new Raster(`assets/gamePics/${_imageName}`)
		_raster.size = new Size(_element[0], _element[1])

		// COLOR DATA ARRAY CREATION
		let _colorArray = []
		for (let y = 0; y < _raster.height; y++)
		{
			let _array = []
			for(let x = 0; x < _raster.width; x++)
			{
				let _rasterColor = _raster.getPixel(x, y)
				let _color = {}
				_color.r = _rasterColor.components[0] * 255
				_color.g = _rasterColor.components[1] * 255
				_color.b = _rasterColor.components[2] * 255
				_array.push(_color)
			}
			_colorArray.push(_array)
		}
		_unpixelizationStates.push(_colorArray)
	}
}
