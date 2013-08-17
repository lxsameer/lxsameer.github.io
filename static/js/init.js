if (typeof jQuery == 'undefined') {
    document.write("<script src='/static/js/jquery.min.js'></script>");
}

function link_helper (resource) {
    return "<a href='https://www.github.com/" + resource + "'> " + resource + "</a>";
}

function date_helper(result) {
    var datetime = new Date(result.created_at);
    return datetime.toUTCString();
}

function push_event(result) {
    var user = result.actor.login;
    var repo = result.repo.name;
    var ref = result.payload.ref.split("/");

    var str = "<div class='pushevent event'> [ " + date_helper(result) + " ] " + link_helper(user) + " pushed to <span class='green'>" + ref[ref.length -1] + "</span> at " + link_helper(repo);

    result.payload.commits.forEach(function(commit){
	str = str + "<div class='commit'><span title='" +user  + "'><img class='avatar' src='" + result.actor.avatar_url + "'></span>" + " <a href='https://www.github.com/" + repo + "/commit/" + commit.sha + "'>" + commit.sha.substr(0, 15) + "</a> " + commit.message + "</div>";

    });

    str = str + "</div>";
    return str;
}


function create_event(result){
    var user = result.actor.login;
    var repo = result.repo.name;

    var str = "<div class='createevent event'> [ " + date_helper(result) + " ] " + link_helper(user) + " create a new <b>" + result.payload.ref_type + "</b> at " + link_helper(repo);
    if (result.payload.ref != null) {
	str = str + "<div class='desc'><b>" + result.payload.ref + ":</b> " + result.payload.description + "</div>";
    }
    else {
	str = str + "<div class='desc'><b>" + repo + ":</b> " + result.payload.description + "</div>";
    }
    str = str + "</div>";
    return str;
}

event_handlers = {
    PushEvent: push_event,
    CreateEvent: create_event
}


function loadgithub(){
    var loading = $("#loading");
    var atom = $("#atom");
    var loadicon = $("#loadicon");
    var msg = $("#msg");
    var retry = $("#retry");

    loadicon.removeClass();
    loadicon.addClass("icon-refresh icon-spin icon-3x");
    msg.removeClass();
    msg.html("Loading . . .");
    retry.hide();

    loading.fadeIn(800);

    $.ajax({url: "https://api.github.com/users/lxsameer/events",
	   dataType: "json"})

	.fail(function (){
	    msg.text("Faild to load activity from github, ");
	    msg.addClass("err");
	    loadicon.removeClass("icon-spin icon-refresh").addClass("icon-remove err");
	    retry.show();
	})
	.done(function(data, status, xhr){
	    var results = data;
	    results.forEach(function(result) {
		if (event_handlers[result.type] !== undefined) {
		    handler = event_handlers[result.type];
		    atom.append(handler(result));
		}

	    });

	    loading.hide();
	    atom.show();
	})
}

window.onload = function() {
    loadgithub();
}
