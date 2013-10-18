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
        $button = $("#send-email");

        //$to.on("blur", updateAnchor);
        //$subject.on("blur", updateAnchor);
        //$body.on("blur", updateAnchor);
    	//$anchor.on("click", updateAnchor);
        $button.on("click", function () {
        	var to = $to.val().trim(),
				subject = $subject.val().trim(),
				body = $body.val().trim();

        	if (to.length === 0 && subject.length === 0 && body.length === 0) return false;
        	//var email = "mailto:" + to;
        	//if (subject.length !== 0 || body.length !== 0) {
        	//	$anchor.attr("href", $anchor.attr("href") + '?');
        	//	if (subject.length !== 0) $anchor.attr("href", $anchor.attr("href") + "subject=" + subject);
        	//	if (subject.length !== 0 && body.length !== 0) $anchor.attr("href", $anchor.attr("href") + '&');
        	//	if (body.length !== 0) $anchor.attr("href", $anchor.attr("href") + "body=" + body);
        	//}
        	var args = {
        		subject: subject,
        		body: body,
        		toRecipients: to
        	};
        	cordova.exec(null, null, "EmailComposer", "showEmailComposer", [args]);
        });
    }

    $(document).on("deviceready", init);

    function updateAnchor() {
    	var to = $to.val().trim(),
    		subject = $subject.val().trim(),
    		body = $body.val().trim();

    	if (to.length === 0) return false;
    	$anchor.attr("href", "mailto:" + to);
    	if (subject.length === 0 && body.length === 0) return true;
    	$anchor.attr("href", $anchor.attr("href") + '?');
    	if (subject.length !== 0) $anchor.attr("href", $anchor.attr("href") + "subject=" + subject);
    	if (subject.length !== 0 && body.length !== 0) $anchor.attr("href", $anchor.attr("href") + '&');
    	if (body.length !== 0) $anchor.attr("href", $anchor.attr("href") + "body=" + body);
    }

})(window);