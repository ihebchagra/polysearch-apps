function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	if (Array.isArray(cvalue)){
		cvalue = JSON.stringify(cvalue);
		cvalue = cvalue.replaceAll("%","%25")
	}
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
} 

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			c = c.substring(name.length, c.length);
			try {
				array_c = JSON.parse(c)
			} catch {
				return c
			}
			if(Array.isArray(array_c)){
				return array_c
			} else {
				return c
			}
		}
	}
	return "";
} 

function generateHistory(){
	hlist = getCookie("PShistory")
	if (hlist.length == 0)
		hlist = []
	historyElement=document.getElementById('history')
	historyElement.innerHTML = ""
	for (var i=0;i<hlist.length;i++){
		var div = document.createElement("div");
		div.setAttribute("class","history")
		href="./index.html?q=" + hlist[i][0]
		div.innerHTML = "- <a href='" + href + "'><u>" + hlist[i][0]  + "</u></a>"
		historyElement.appendChild(div)
	}
}

function deleteHistory(){
	setCookie("PShistory",[],30)
	generateHistory()
}


// init
generateHistory()
