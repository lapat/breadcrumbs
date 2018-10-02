'use strict';
//when mouse up, send message to background.js with this position
document.addEventListener('mousedown', function (mousePos) {
	console.log('click on ', mousePos, "button", mousePos.button)

    if (mousePos.button == 2) {
        var p = {clientX: mousePos.pageX, clientY: mousePos.pageY};
        var msg = {text: 'example', point: p, from: 'rightclick'};
        console.log('msg ', msg)
        chrome.runtime.sendMessage(msg, function(response) {
        	// console.log(response)
        });
    }
})

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	console.log('message received')
    addNewFlagForm (request.point, request.selectedText)
  }
);

function addNewFlagForm (coordinates, selectedText) {
	console.log('newFlagForm triggered')
	var box = document.createElement('div')
		// box.style.width = "200px"
		// box.style.height = "200px"
		// box.style.background = "white"
		// box.style.borderWidth = "0.5px"
		// box.style.border = "solid black"
		// box.style.color = "black"
		// box.style.display = "none"
		// box.style.position = "absolute"
		// box.style.zIndex = "10"
		box.className = "bc_box"
		// form.id = Math.random().toString(16);
		box.id = "testFlagForm"

	var form = document.createElement('div')
		form.className = "bc_form"	
		form.style.color = "black"

	var headerDiv = document.createElement('div')
		headerDiv.className = "bc_header"

	var header = document.createElement('h3')
		header.className = "bc_header"
		header.innerHTML = "New Flag:"
		headerDiv.appendChild(header)

	var cancel = document.createElement('button')
		cancel.className = "bc_header cancel"
		cancel.innerHTML = "X"
		cancel.onclick = function() { BC_hideElement ("testFlagForm") }
		headerDiv.appendChild(cancel)

		form.appendChild(headerDiv)


	var selectedTextInput = document.createElement('textarea')
		selectedTextInput.className = "bc_input"
		selectedTextInput.id = "BC_nf_selectedText"
		if (selectedText != "undefined") {
			selectedTextInput.value = selectedText
		}
		selectedTextInput.placeholder = "Enter the offending text here"
		form.appendChild(selectedTextInput)

	var sourceUrl = document.createElement('input')
		sourceUrl.type = "text"
		sourceUrl.id = "BC_nf_sourceUrl"
		sourceUrl.className = "bc_input"
		sourceUrl.placeholder = "Enter a citation url to expedite approval"
		form.appendChild(sourceUrl)	

	var offense = document.createElement('select')
		offense.className = "bc_input offense"
		offense.id = "BC_nf_offenseSelect"

	var offenseOptions = ["Slander","Fraud / Misleading","Offensive"]

		//Create and append the options
		for (var i = 0; i < offenseOptions.length; i++) {
		    var option = document.createElement("option")
		    option.value = offenseOptions[i]
		    option.text = offenseOptions[i]
		    offense.appendChild(option)
		}
		form.appendChild(offense)

	var subject = document.createElement('select')
		subject.className = "bc_input subject"
		subject.id = "BC_nf_subjectSelect"

	var subjectOptions = ["Medical","General Science","History"]

		//Create and append the options
		for (var i = 0; i < subjectOptions.length; i++) {
		    var option = document.createElement("option")
		    option.value = subjectOptions[i]
		    option.text = subjectOptions[i]
		    subject.appendChild(option)
		}
		form.appendChild(subject)

	var descriptionTextInput = document.createElement('textarea')
		descriptionTextInput.className = "bc_input bc_description"
		descriptionTextInput.id = "BC_nf_description"
		descriptionTextInput.placeholder = "Leave a comment (optional)"
		form.appendChild(descriptionTextInput)

	var submit = document.createElement('button')
		submit.id = "BC_nf_submitNewFlagForm"
		submit.className = "bc_input submit"
		submit.innerHTML = "Submit Flag"
		submit.onclick = BC_submitNewFlagForm
		form.appendChild(document.createElement("br"))
		form.appendChild(submit)

	console.log( 'Appending new child form')

	// Append the Box
	box.appendChild(form)
	document.body.appendChild(box)

	// Add onclick listeners to the box
	console.log(document.getElementById('BC_submitNewFlagForm'))

	// appendFormContents(form.id, "flag")
	setElementPosition(box.id, coordinates)
	showElement(box.id)
}

function BC_submitNewFlagForm () {
	alert('Thanks!')
	console.log('submitted!')

	// temporarily hardcoding subject_id to 1 to avoid bugs
	var payload = {
		"source":document.getElementById("BC_nf_sourceUrl").value,
		"offense_type":document.getElementById("BC_nf_offenseSelect").value,
		"selected_text":document.getElementById("BC_nf_selectedText").value,
		"description":document.getElementById("BC_nf_description").value,
		"subject":document.getElementById("BC_nf_subjectSelect").value,
		"subject_id":"1"
	}

    var msg = {payload: payload, from: 'newFlag'};
    console.log('msg ', msg)
    chrome.runtime.sendMessage(msg, function(response) {
    	// console.log(response)
    });

}

// function appendFormContents (id, type) {
// 	if ( type === "flag" ) {
		


// 	} else {

// 		var errorMessage = document.createElement('div')	
// 			errorMessage.style.color = "red"
// 			errorMessage.innerHTML = "Failed to find popover type"
// 		document.getElementById( id ).appendChild(errorMessage)

// 	}

// }

function setElementPosition (id, position) {
	console.log( 'setting element with id ' + id + " to position ", position )
	document.getElementById( id ).style.top = position.clientY.toString() + "px";
	document.getElementById( id ).style.left = position.clientX.toString() + "px";
}

function showElement(id) {
    document.getElementById(id).style.display = "block";
}

function BC_hideElement(id) {
    var element = document.getElementById(id)
    	element.style.display = "none";
	    element.parentNode.removeChild(id);
}