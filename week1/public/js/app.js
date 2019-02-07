'use strict'

var
    userData,
    beatmapData,
    metaData,
    userInput = document.querySelector('#userInput'),
    workingTxts = ['Pushing buttons','Smacking the server','Putting minions to work','Clicking circles','Juicy flavor text'], //Setting flavor text for when the script loads the data
    getData = {
        user:function(){
            //Funtction to fetch the user data
            console.log('Getting userdata')
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                handleData.user(this.responseText)
            }
            }
            xhttp.open("GET", "public/helpers/getData.php?u=" + userInput.value  + "&m=" + work.getMode() + "&type=string&limit=10")
            xhttp.send()
        },
        beatmap:function(){
            //Function to fetch the beatmap data from the user
            console.log('Getting beatmap data')
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                handleData.beatmap(this.responseText)
            }
            }
            xhttp.open("GET", "public/helpers/getMaps.php?u=" + userInput.value + "&m=" + work.getMode(), true)
            xhttp.send()
        },
        metadata:function(beatmaps){
            //Fuction to get the metadata of played beatmaps from current user
            console.log('Getting metadata')
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                handleData.meta(this.responseText)
            }
            }
            xhttp.open("GET", "public/helpers/getMeta.php?b=" + beatmaps + "&m=" + work.getMode(), true)
            xhttp.send()
        }
        },
        handleData = {
        user:function(data){
            //Store the recieved data into the localstorage for later usage
            window.localStorage.setItem('userData',data)
            userData = JSON.parse(data)
            console.log('Userdata recieved: ' + userData[0].username  )
        },
        beatmap:function(data){
            //Store the recieved data into the localstorage for later usage
            window.localStorage.setItem('beatmapData',data)
            beatmapData = JSON.parse(data)
            console.log('Beatmapdata recieved')
            work.beatmaps(beatmapData)
        },
        meta:function(data){
            //Store the recieved data into the localstorage for later usage
            window.localStorage.setItem('metaData',data)
            metaData = JSON.parse(data)
            console.log('Metadata recieved')
            app.create(userData,beatmapData,metaData)
        }
        },
        work = {
        beatmaps:function(obj){
            //Get the ids from the beatmaps and push them to an array
            var ids = [];
            for (var i = 0; i < obj.length; i++) {
            ids.push(obj[i].beatmap_id)
            }
            getData.metadata(ids)
        },
        rank:function(rank){
            //Api returns "abnormal" ranks, this returns the correct values
            switch (rank) {
            case "X":
                return "SS"
                break;
            case "XH":
                return "SSH"
                break;
            default:
                return rank
            }
        },
        getMode:function(){
            // Gets the currently seleted mode for searching
            return document.querySelector('input:checked').value
        }
        },
        app = {
        init:function(){
            document.querySelector('#working h1').innerHTML = workingTxts[Math.floor(Math.random()*(workingTxts.length))]
            document.querySelector('main').className = 'working'
            document.querySelector('#working h1').classList.remove('failed')
            getData.user()
            getData.beatmap()
        },
        create:function(u,b,m){
            if (u == "") {
                document.querySelector('#working h1').innerHTML = "User wasn't found :/"
                document.querySelector('#working h1').classList.add('failed')
            } else{
                u = u[0]
                document.querySelector('main').classList.remove('working')
                // fill in the userData
                var
                    userCont= document.querySelector('.userContainer'),
                    userImg = userCont.querySelector('img'),
                    userName= userCont.querySelector('.username'),
                    userGlob= userCont.querySelector('.globalRank'),
                    userLoca= userCont.querySelector('.countryRank'),
                    userCoun= userCont.querySelector('.country'),
                    userLvl = userCont.querySelector('.level'),
                    userProg= userCont.querySelector('.progress');

                userImg.src        = "https://a.ppy.sh/" + u.user_id
                userName.innerHTML = u.username
                userGlob.innerHTML = "Rank #" + u.pp_rank + " - " + Math.trunc(u.pp_raw)+ "pp"
                userLoca.innerHTML = "#" + u.pp_country_rank
                userCoun.src       = "https://www.countryflags.io/"+ u.country.toUpperCase() +"/flat/64.png"
                userLvl.innerHTML  = Math.trunc(u.level)

                userProg.setAttribute('style','width:'+Math.floor((u.level%1)*100)+"%")

                //beatsies
                var
                    playCont = document.querySelector('.playContainer')

                playCont.innerHTML = null

            for (var i = 0; i < b.length; i++) {
                    var
                    newLi = document.createElement('li'),
                    newGra= document.createElement('div'),
                    newRan= document.createElement('span'),
                    newH1 = document.createElement('h1'),
                    newH2 = document.createElement('h2'),
                    newPp = document.createElement('span')

                    newLi.setAttribute('style','background-image:url(https://assets.ppy.sh/beatmaps/' + m[i][0].beatmapset_id + '/covers/cover.jpg);animation-delay:'+ (i/10) +'s')
                    newLi.setAttribute('data-preview',m[i][0].beatmapset_id)
                    newLi.setAttribute('data-listN', i)
                    newGra.classList.add('gradient')
                    newRan.innerHTML = work.rank(b[i].rank)
                    newH1.innerHTML  = m[i][0].title
                    newH2.innerHTML  = "[" + m[i][0].version + "] - MaxCombo: " + b[i].maxcombo
                    newPp.innerHTML  = Math.trunc(b[i].pp) + "<span>pp</span>"
                    newPp.classList.add('pp')
                    // TODO - add link to beatmaps?
                    // newAnc.href      = "https://osu.ppy.sh/beatmapsets/"+  m[i][0].beatmapset_id +"#osu/"

                    newLi.addEventListener('click',function(){
                    var
                        n = this.getAttribute('data-listN')
                    if (this.classList.contains('active')) {
                        this.classList.remove('active')
                    }else{
                        var active = document.querySelectorAll('.active')
                        for (var i = 0; i < active.length; i++) {
                            active[i].classList.remove('active')
                        }
                        this.classList.add('active')
                        app.enhance(m[n][0],b[n])
                    }
                })
                    playCont.appendChild(newLi)
                    newLi.appendChild(newGra)
                    newLi.appendChild(newH1)
                    newLi.appendChild(newH2)
                    newGra.appendChild(newPp)
                    newGra.appendChild(newRan)
                }
                console.log('--Finished Building--')
            }
        },
        "enhance":function(m,b){
            // TODO - use metadata and beatmapdata to display userdata against the globalplayer data
            console.log(m,b)
        }
    }
// Restart the script for a new user/query
document.querySelector("button").addEventListener('click',function(){
    app.init()
})
// Starts the applet onload of thescript
app.init()
  