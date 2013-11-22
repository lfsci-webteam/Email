(function (global) {
    var $to,
        $subject,
        $body,
		$anchor,
       	$button;

    function init() {
        $to = $("#to");
        $subject = $("#subject");
        $body = $("#body");
        $anchor = $("#open-email-client");
        $picture = $("#picture");
        $record = $("#record");
        $email = $("#send-email");
        $media = $("#audio");
        $image = $audio = null;

        $picture.on("click", function () {
        	navigator.camera.getPicture(
				function onSuccess(imageURI) { createFileEntry(imageURI); },
				function onFail(message) { console.log('Failed because: ' + message); },
				{
					destinationType: Camera.DestinationType.FILE_URI,
					encodingType: Camera.EncodingType.JPEG,
				});
        });

        $record.on("click", function () {
        	switch ($record.text()) {
        		case "Record":
        			$record.text("Stop").button("refresh");
        			recordAudio();
        			break;
        		case "Stop":
        			$record.text("Record").button("refresh");
        			$recording.stopRecord();
        			break;
        	}
        });

        $email.on("click", function () {
        	var to = $to.val().trim(),
				subject = $subject.val().trim(),
				body = $body.val().trim();

        	var attachments = [];
        	if ($image) {
        		var index = $image.indexOf(':/') + 1;
        		while ($image.substr(index, 2) == '//') index++;
        		attachments.push($image.substr(index));
        	}
        	if ($audio) {
        		var index = $audio.indexOf(':/') + 1;
        		while ($audio.substr(index, 2) == '//') index++;
        		attachments.push($audio.substr(index));
        	}
        	alert("Sending email with " + attachments.length + " attachments.");

        	window.plugins.emailComposer.showEmailComposerWithCallback(
				function (arg) { },// <- Note: Function never called. See documentation.
				subject, body, [to], [], [], false, attachments);
        });
    }

    $(document).on("deviceready", init);

    function deviceAudioExtension() {
    	switch(device.platform) {
    		case "Android":
    		case "BlackBerry":
    			return "amr";
    		case "iOS":
    			return "wav";
    		case "Tizen":
    			throw "Tizen";// No support for Tizen
    		default:
    			return "wav";
    	}
    }

    function recordAudio() {
    	if (typeof recordAudio.take == 'undefined') recordAudio.take = 1;// 'Static' variable
    	$audio = "VoiceRecording" + recordAudio.take + "." + deviceAudioExtension();
    	$recording = new Media($audio,
			function () { recordAudio.take++; },
			function (error) { fail(error); });
    	$recording.startRecord();
    	alert($audio);
    }

	// Helper function for getting file paths
    function getRootDirectory(callback) {
    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {
    		callback(fileSys.root.fullPath);
    	});
    }

    function createFileEntry(imageURI) { window.resolveLocalFileSystemURI(imageURI, copyPhotoToTemp, fail); }

    function copyPhotoToTemp(fileEntry) {
    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {
    		fileSys.root.getDirectory("photos", { create: true, exclusive: false }, function (dir) {
    			var fileName = "temp.jpg";

    			// Check if the file exists first. If so, delete it.
    			dir.getFile(fileName, { create: false }, function (toDelete) {
    				toDelete.remove(function () {
    					fileEntry.copyTo(dir, fileName, onTempCopySuccess, fail);
    				}, function () { console.log('Failed to delete existing file'); });
    			},
				function (e) { fileEntry.copyTo(dir, fileName, onTempCopySuccess, fail); });
    		}, fail);
    	}, fail);
    }

    function copyPhotoToPersistent(fileEntry) {
    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {
    		fileSys.root.getDirectory("photos", { create: true, exclusive: false }, function (dir) {

    			var fileName = localStorage['fileDestinationURL'];
    			// Check if the file exists first. If so, delete it.
    			dir.getFile(fileName, { create: false }, function (toDelete) {
    				toDelete.remove(function () {
    					fileEntry.copyTo(dir, fileName, onPersistentCopySuccess, fail);
    				}, function () { alert('Failed to delete existing file'); });
    			},
				function (e) { fileEntry.copyTo(dir, fileName, onPersistentCopySuccess, fail); });
    		}, fail);
    	}, fail);
    }

    function onTempCopySuccess(entry) {
    	// Append the time so we're guaranteed to get the latest version
    	document.getElementById('photo').src = ($image = entry.fullPath) + '?' + new Date().getTime();
    }

    function onPersistentCopySuccess(entry) { alert($image = entry.fullPath); }

    function fail(e) {
    	var msg = '';
    	switch (e.code) {
    		case FileError.QUOTA_EXCEEDED_ERR: msg = 'QUOTA_EXCEEDED_ERR'; break;
    		case FileError.NOT_FOUND_ERR: msg = 'NOT_FOUND_ERR'; break;
    		case FileError.SECURITY_ERR: msg = 'SECURITY_ERR'; break;
    		case FileError.INVALID_MODIFICATION_ERR: msg = 'INVALID_MODIFICATION_ERR'; break;
    		case FileError.INVALID_STATE_ERR: msg = 'INVALID_STATE_ERR'; break;
    		case FileError.ENCODING_ERR: msg = "ENCODING_ERR: The URL is malformed"; break;
    		default: msg = e.code; break;
    	};
    	alert('Error: ' + msg);
    }
})(window);