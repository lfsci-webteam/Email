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
        $audio = $("#audio");
        $email = $("#send-email");

        $audio.on("click", function () {
        	switch ($audio.text()) {
        		case "Record Audio":
        			$audio.text("Stop").button("refresh");
        			recordAudio();
        			break;
        		case "Stop":
        			$audio.text("Record Audio").button("refresh");
        			$recording.stopRecord();
        			break;
        	}
        });

        $email.on("click", function () {
        	var to = $to.val().trim(),
				subject = $subject.val().trim(),
				body = $body.val().trim();

        	if (to.length === 0 && subject.length === 0 && body.length === 0) return false;
        	window.plugins.emailComposer.showEmailComposerWithCallback(function (arg) { console.log("Returned:", arg); },
				subject, body, [to], [], [], false, $recording ? [$recording] : []);
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
    	var filename = "VoiceRecording" + recordAudio.take + "." + deviceAudioExtension();
    	$recording = new Media(filename,
			function () {
				recordAudio.take++;
			}, function (error) { alert("Recording failed."); });
    }

})(window);