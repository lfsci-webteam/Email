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
        $audio = $("#audio");
        $email = $("#send-email");
        $image = $audioFile = null;

		// TODO: Picture isn't working either
        $picture.on("click", function () {
        	navigator.camera.getPicture(
				function onSuccess(imageURI) {
					getRootDirectory(function (root) { alert($image = imageURI.replace(root, '')); });
					$image = imageURI.substr(8);
				},
				function onFail(message) {
					alert('Failed because: ' + message);
				},
				{
					destinationType: Camera.DestinationType.FILE_URI,
					encodingType: Camera.EncodingType.JPEG,
				});
        });

		// TODO: Can't attach audio
        $audio.on("click", function () {
        	switch ($audio.text()) {
        		case "Record":
        			$audio.text("Stop").button("refresh");
        			recordAudio();
        			break;
        		case "Stop":
        			$audio.text("Record").button("refresh");
        			$recording.stopRecord();
        			break;
        	}
        });

        $email.on("click", function () {
        	var to = $to.val().trim(),
				subject = $subject.val().trim(),
				body = $body.val().trim();

        	var attachments = [];
        	if ($image) attachments.push($image);
        	//if ($audioFile) attachments.push($audioFile);
        	alert("Sending email with " + attachments.length + " attachments.");

        	window.plugins.emailComposer.showEmailComposerWithCallback(
				function (arg) { },// <- Note: Function never called. See documentation.
				subject, body, [to], [], [], false, attachments);
			alert("Success");
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
    	$audioFile = "VoiceRecording" + recordAudio.take + "." + deviceAudioExtension();
    	$recording = new Media($audioFile,
			function () {
				recordAudio.take++;
			}, function (error) { alert("Recording failed."); });
    	$audioFile = $audioFile;
    }

	// Helper function for getting file paths
    function getRootDirectory(callback) {
    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {
    		callback(fileSys.root.fullPath);
    	});
    }

})(window);