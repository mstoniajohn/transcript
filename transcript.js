document.getElementById('import').onclick = function () {
	var files = document.getElementById('selectFiles').files;
	console.log(files);
	if (files.length <= 0) {
		return false;
	}

	var fr = new FileReader();

	fr.onload = function (e) {
		console.log(e);
		var result = JSON.parse(e.target.result);
		var formatted = JSON.stringify(result, null, 2);
		document.getElementById('txt2').value = formatted;
	};

	fr.readAsText(files.item(0));
};

function createSRT() {
	document.getElementById('srt').value = '';
	var start_time = '';
	var end_time = '';
	var speaker_label = '';
	var sentence = '';
	var n = 1;
	var t = 1;
	var wtb = document.getElementById('words').value;

	var j = JSON.parse(document.getElementById('txt2').value);
	var c = j.results.items.length;
	for (i = 0; i < c; i++) {
		if (j.results.items[i].type == 'pronunciation') {
			if (start_time == '') start_time = j.results.items[i].start_time;
			end_time = j.results.items[i].end_time;
			speaker_label = j.results.items[i].speaker_label;
			sentence += j.results.items[i].alternatives[0].content + ' ';
			t++;
		} else if (
			j.results.items[i].type == 'punctuation' &&
			j.results.items[i].alternatives[0].content == '.'
		) {
			document.getElementById('srt').value += 'Line ' + n + '\n';
			document.getElementById('srt').value +=
				'Start Time: ' +
				formatTime(start_time) +
				' --> ' +
				'End Time: ' +
				formatTime(end_time) +
				'\n' +
				sentence +
				'\n\n';
			sentence = '';
			start_time = '';
			speaker_label = '';
			n++;
			t = 1;
		}
		if (document.getElementById('word-break').checked && t > wtb) {
			document.getElementById('srt').value += 'Line ' + n + '\n';
			document.getElementById('srt').value +=
				'Start Time: ' +
				formatTime(start_time) +
				' --> ' +
				'End Time: ' +
				formatTime(end_time) +
				'\n' +
				sentence +
				'\n\n';
			sentence = '';
			start_time = '';
			speaker_label = '';
			n++;
			t = 1;
		}
	}
	document.getElementById('alert').classList.remove('d-none');
	document.getElementById('download-btn').addEventListener(
		'click',
		function () {
			// generate download of text file.
			// var text = document.getElementById('srt').value;
			var file = document.getElementById('srt').value;

			download(file);
			document.getElementById('final').classList.remove('d-none');
			document.getElementById('final').classList.add('d-block');
		},
		false
	);
}

function formatTime(t) {
	a = t.split('.');
	var date = new Date(null);
	date.setSeconds(a[0]); // specify value for SECONDS here
	var result = date.toISOString().substr(11, 8);
	return result + ':' + a[1];
}

function download(file) {
	var element = document.createElement('a');
	element.style.display = 'none';
	// Define file data
	element.setAttribute(
		'href',
		'data:text/plain;charset=windows-1256,' + encodeURIComponent(file)
	);

	// add downlad attribute of hidden link
	var download_file = 'transcript.txt';
	element.setAttribute('download', download_file);

	document.body.appendChild(element);
	// simulate click of link created
	element.click();
	document.body.removeChild(element);
}
