function makeExcerpt(str,matches){
	matches = str.match(re)
	padding = 100
	first_match = str.indexOf(matches[Math.round((matches.length - 1) / 2)])
	start_index = Math.max(0,first_match - padding)
	end_index = Math.min(str.length, first_match + padding)
	excerpt = str.substring(start_index,end_index + 100)
	if (start_index != 0)
		excerpt = "..." + excerpt
	if (end_index != str.length)
		excerpt += "..."

	excerpt = excerpt.replace(re,"<b>$1</b>")
	excerpt = excerpt.replace()
	
	return excerpt
}

function hashCode(string){
    var hash = 0;
    for (var i = 0; i < string.length; i++) {
        var code = string.charCodeAt(i);
        hash = ((hash<<5)-hash)+code;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}


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

function print_results(result_list){
	results_element=document.getElementById('resultsDiv')
	results_element.innerHTML = ""

	if(result_list.length==0){
		results_element.innerHTML = "Aucun document ne correspond aux termes de recherche spécifiés. Vous pouvez vérifier l'orthographe, essayer d'autres termes ou utiliser des mots clés plus généraux."
		return
	}

	
	for (var i=0;i<result_list.length;i++){
		var entry=result_list[i]
		id= hashCode(entry[4])

		var a = document.createElement("a");
		a.setAttribute("id",id)
		a.setAttribute("class","resultDiv")
		//a.setAttribute("target","_blank")
		a.setAttribute("rel","noopener noreferrer")
		a.href="./pdfjs/web/viewer.html?file=../../pdf/" + entry[0] + ".pdf&q=" + query + "#page=" + entry[1]; 
		results_element.appendChild(a)
		var resultA = document.getElementById(id)
		
		//title
		var div = document.createElement("div");
		div.setAttribute("class","titleDiv")
		title = entry[0] + ", page " + entry[1]
		if (entry[2]!=undefined)
			title = entry[2] + ", " + title
		div.innerHTML = "<b><u>" + title + "</u></b>"
		resultA.appendChild(div)

		//excerpt
		var div = document.createElement("div");
		div.setAttribute("class","excerpt")
		div.innerHTML = entry[4] 
		resultA.appendChild(div)

	}
}

function titleCase (str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
}

function compareFn(a, b) {
	if (a[3]<b[3])
		return 1
	if (a[3]>b[3])
		return -1
	if (a[3]==b[3])
		return 0
}

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

function getMinOfArray(numArray) {
  return Math.min.apply(null, numArray);
}

function search(){
	query = document.getElementById("searchField").value


	files = Object.keys(courscommuns)
	obj = courscommuns
	titles = null



	regexText=query.toLowerCase()
			.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
			.replace(/(\w)s\b/g, '$1 ')
			.replace(/['\\#{}\[\]-_\(\)`"\.\+\*]/g,' ')
			.replace(/\b(de|du|[a-z]{1}\b|la|le|un|leur)\b/g,' ')
			.replace(/\s+/g, ' ').trim()
			.replace(/([a-z])\1+/g,"$1")
			.replace(/([a-z])/g,"$1+")
			.replace(/e/g,"[éèêe]")
			.replace(/a/g,"[àa]")
			.replace(/i/g,"[ïi]")
			.replace(/c/g,"[çc]")
			.replace(/u/g,"[uù]")

	necessaryText=query.toLowerCase()
			.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
			.replace(/['\\#{}\[\]-_\(\)`\.\+\*]/g,' ')
			.replace(/\s+/g, ' ').trim()
			.replace(/e/g,"[éèêe]")
			.replace(/a/g,"[àa]")
			.replace(/i/g,"[ïi]")
			.replace(/c/g,"[çc]")
			.replace(/u/g,"[uù]")
	necessary = []
	quotere = /"/g 
	quotes = [...necessaryText.matchAll(quotere)] 
	necessary_num = Math.floor(quotes.length / 2) 
	if (necessary_num > 0){
		for (var i=0;i<necessary_num;i++){
			word = necessaryText.substring(quotes[(i*2)].index+1,quotes[(i*2)+1].index) 
			if (word.length>0){
				necessary.push(word)
			}
		}
	}

	if (regexText.length==""){
		results = []
		print_results(results)
		return
	}
	words = regexText.split(" ")
	re = new RegExp("(" + words.join("|") + ")","gi")
	
	n=0
	results = []
	
	for (var i=0; i<files.length; i++){
		for (var j=0; j<obj[files[i]].length; j++){
			counters = []
			matches = obj[files[i]][j].match(re)
			if(matches != null){
				n+=1
				//title
				if((titles!=null) && (Object.keys(titles).includes(files[i]))){
					var title = "Plan"
					title_pages = Object.keys(titles[files[i]])
					for(var b=0; b<title_pages.length; b++){
						if (j<title_pages[b])
							break;
						title = titles[files[i]][title_pages[b]]
					}
					title = titleCase(title)
				}
				// eliminate results not containing necessary words
				discarded = false
				for (var y=0;y<necessary.length;y++){
					necessary_re = new RegExp( "\\b" + necessary[y] + "\\b" ,"gi")
					if (obj[files[i]][j].search(necessary_re) == -1){
						if (title!=undefined){
							if (title.search(necessary_re) == -1){
								discarded = true
								break
							}
						} else {
							discarded = true
							break
						}
					}
				}
				if(discarded){
					continue
				}
				//excerpt
				excerpt = makeExcerpt(obj[files[i]][j],matches)
				//page
				page=j+1
				//niveau
                niveau = "ECN"
				//calculate score
				for (var k=0; k<words.length; k++){
					wordre = new RegExp("(" + words[k]+ ")" ,"gi") 
					textmatches = obj[files[i]][j].match(wordre) || ""
					if (title!=undefined) {
						titlematches = title.match(wordre) || ""
					} else {
						titlematches = ""
					}
					bookmatches = files[i].match(wordre) || ""
					counters.push(textmatches.length + bookmatches.length + titlematches.length)
				}
				len = counters.length
				max = getMaxOfArray(counters)
				min = getMinOfArray(counters)
				diff = max - min + 1
				sum = 0
				for (var a=0; a<counters.length; a++){
					sum+=counters[a]
				}
				score = (sum * Math.pow(10,len)) / diff
				results.push([files[i],page,title,score,excerpt,niveau])
			}
		}
	}
	results.sort(compareFn)
	results = results.splice(0,49)
	console.log("matches = " + n)
	print_results(results)
}

function buttonPress(){
	//history management
	hlist = getCookie("PShistory")
	if (hlist.length == 0)
		hlist = []

	query = document.getElementById("searchField").value

	
	hlist.unshift([query])
	if (hlist.length>50)
		hlist.pop()
	setCookie("PShistory",hlist,30)

	url = new URL(window.location.href)
	document.title = query + ' - Polysearch';
	uquery = url.searchParams.get("q");
	url.searchParams.set("q",query)
	if (uquery==null){
		history.replaceState(null, query + ' - Polysearch', url.href);
	} else {
		history.pushState(null, query + ' - Polysearch', url.href);
	}

	search()
}

function initSearch(){
	url = new URL(window.location.href)
	uquery = url.searchParams.get("q");
	if (uquery!=null){
		document.title = uquery + ' - Polysearch';
		document.getElementById("searchField").value = uquery
		search()
	}
}


// init


initSearch()


//events
var input = document.getElementById("searchField");
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("searchButton").click();
  }
});

window.onpopstate = function(event) {
	event.preventDefault();
	initSearch()
};
