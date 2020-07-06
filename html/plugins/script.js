const js    = (el) => document.querySelector(el);
const jsAll = (el) => document.querySelectorAll(el);

const Calc = {}

Calc.key   = 
{
	109: true,
	100: true,
	111: true,
	106: true,
	107: true,
	103: true,
	104: true,
	105: true,
	101: true,
	102: true,
	103: true,
	97: true,
	98: true,
	99: true,
	96: true,
	53: true,
	8: true,
	188: true,
	13: true,
	8: true
}

Calc.temporary 	 	= null
Calc.valueString 	= 0
Calc.op 		 	= ["+", "*", "/", "-"]
Calc.status 	 	= false
Calc.Operator    	= "+"
Calc.value 			= ""
Calc.count 			= 0

jsAll('.buttons-action li').forEach((element) =>
{
	element.addEventListener("click", (event) =>
	{
		let e = {}
		e.key = element.getAttribute('key')
		e.keyCode = "click"

		Calc.ActionCalc(e)
	})
})

document.addEventListener("keyup", (e) =>
{
	Calc.ActionCalc(e)	
})

Calc.ActionCalc = (e) =>
{
	if(e)
	{
		if(e.key)
		{
			const keyCode = e.keyCode
			let keyFind   = false

			if(keyCode && Calc.key[keyCode] || keyCode == "click")
			{
				jsAll(`.buttons-action li`).forEach((e) =>
				{
					e.classList.remove('buttons-backcolor')
				})

				js(`.buttons-action li[key="${e.key}"]`).classList.add('buttons-backcolor')
				setTimeout(() =>
				{
					js(`.buttons-action li[key="${e.key}"]`).classList.remove('buttons-backcolor')
				}, 200)

				keyFind = Calc.VerifyOperator(e, Calc.op)
				
				if(e.key == "Enter")
				{
					if(Calc.status && Calc.value.length > 0)
					{
						Calc.temporary = Calc.Operation(Calc.value, Calc.Operator)
						if(Calc.value != Calc.temporary)
						{
							Calc.value = Calc.temporary
							Calc.valueString += " = " + Calc.temporary

							js(".a-value-insert p").innerHTML = Calc.valueString
						}

						keyFind 	= true
						Calc.status = true
						Calc.count  = 0
					}
				}
				else if(e.key == "CE" || e.key == "C")
				{
					Calc.value 	   	 = ""
					Calc.valueString = ""
					Calc.status    	 = true
					Calc.temporary 	 = "0"
					keyFind 	   	 = false

					js(".a-value-insert p").innerHTML = Calc.valueString
				}
				else if(e.key == "Backspace")
				{
					let verifyS = Calc.VerifyOperator(Calc.value.charAt(Calc.value.length - 1), Calc.op)

					if(!verifyS)
					{
						Calc.value 		 = Calc.value.substring(0, Calc.value.length - 1)
						Calc.valueString = Calc.valueString.substring(0, Calc.valueString.length - 2)
						Calc.temporary   = Calc.temporary.substring(0, Calc.temporary.length - 1)

						js(".a-value-insert p").innerHTML = Calc.valueString
					}
				}
				else if(!keyFind && e.key != "Backspace")
				{
					if(Calc.valueString.length > 1)
						Calc.valueString += " " + e.key
					else
						Calc.valueString = " " + e.key

					if(Calc.temporary && Calc.temporary != "0")
						Calc.temporary += e.key
					else
						Calc.temporary = e.key

					Calc.value += e.key
					Calc.status = true
				}
				else if(keyFind && Calc.count <= 2)
				{
					let verifyS = Calc.VerifyOperator(Calc.value.charAt(Calc.value.length - 1), Calc.op)

					if(Calc.value.length > 0 && !verifyS)
					{
						Calc.valueString += " " + e.key

						js(".a-value-insert p").innerHTML = Calc.valueString

						Calc.value     += e.key
						Calc.Operator  = e.key
						
					}
					else if(verifyS)
					{
						Calc.valueString = Calc.valueString.substring(0, Calc.valueString.length - 1) + " " + e.key

						js(".a-value-insert p").innerHTML = Calc.valueString

						Calc.value     = Calc.value.substring(0, Calc.value.length - 1) + e.key
						Calc.Operator  = e.key						
					}

					Calc.status    = false
					Calc.temporary = null
					keyFind 	   = false
				}

				if(Calc.status)
					js(".a-value-insert span").innerHTML = Calc.temporary
			}
		}
	}
}

Calc.Operation = (value, op) =>
{
	let valueT = value.substring(value.length - 1, value.length)

	if(valueT && op && valueT == "%")
	{
		value = value.substring(0, value.length - 1).split(op)

		if(value[0] && value[1])
		{
			let x = value[0] * value[1] / 100

			return (value[0] - x).toString()
		}
	}

	value = value.split(",")

	if(value[0] && value[1])
	{
		let valueFixed = `${value[0]}.${value[1]}`

		return eval(valueFixed).toString()
	}
}

Calc.VerifyOperator = (e, op) =>
{
	let keyFind = false,
		value 	= null

	if(e.key)
		value = e.key
	else
		value = e

	for(let i in op)
	{
		if(op[i] == value)
			return true
	}

	return false
}