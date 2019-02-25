// apiConfig is set in key.js
(()=>{
    'use strict'
    var
        app = {
            init:()=>{ // Initialze the app
                var
                    userInput = document.getElementById("userInput")

                document.querySelector("button").addEventListener("click",()=>{
                    app.reboot()
                })

                userInput.addEventListener("keypress",(e)=>{
                    console.log(e)
                    if(e.charCode == 0 || e.code == "Enter"){
                        app.reboot()
                    }
                })

                // Init the router
                routie({
                    'osu-user-*/beatmap-*':(user,beatId)=>{
                        var
                            userName = user.toLowerCase(),
                            userHash = "osu-user-",
                            beatHash = "osu-beatmap-",
                            userExcists = helper.checkExcisting(userHash,userName),
                            beatExcists = helper.checkExcisting(beatHash,beatId.split("-")[1])

                        if(userExcists && beatExcists){
                            var
                                userData = JSON.parse(window.localStorage.getItem(userHash + userName)),
                                beatData = JSON.parse(window.localStorage.getItem(beatHash + beatId.split("-")[1])),
                                metaData = JSON.parse(window.localStorage.getItem(userHash + userName + "-beatmaps"))
                            
                            metaData.forEach(meta => {
                                if(meta.beatmap_id == beatId.split("-")[1]){
                                    metaData = meta
                                }
                            });

                            userInput.value = userName

                            getData.score(beatId,userName)
                            render.user(userData,userName)
                            render.beatList(metaData,beatData,1)
                        } else if(userExcists){
                            console.log("user excists")
                        } else if(beatExcists){
                            console.log("beatmap excists")
                        } else{
                            window.location.hash = ""
                        }
                    },
                    'osu-user-*':(user)=>{
                        var
                            userName = user.replace("/","").toLowerCase(),
                            userHash = "osu-user-",
                            excists = helper.checkExcisting(userHash,userName)

                        console.log(user)

                        if(excists){
                            var
                                userData = JSON.parse(window.localStorage.getItem(userHash + userName))

                            console.log("Excisting user: " + userName)

                            userInput.value = userName.toLowerCase()
                            render.user(userData,userName)
                            getData.beatmap(apiConfig,userName,15)

                        } else{
                            console.log("New user:" + userName)

                            userInput.value = userName.toLowerCase()
                            getData.user(apiConfig,userName)
                            getData.beatmap(apiConfig,userName,15)
                        }
                    },
                    '*':()=>{
                        console.log('Nothing to see here')
                    }
                })
            },
            reboot:()=>{
                var
                    userInput = document.getElementById("userInput"),
                    userName = userInput.value.toLowerCase()

                    window.location.hash = "osu-user-" + userName
            }
        },
        getData = {
            user:async (config,userName)=>{ // Checks the localStorage for data
                console.log("Getting user data: " + userName)

                var userData = window.localStorage.getItem("osu-user-" + userName)
                if(!userData){ // If the data doens't excist it starts the await for the async funct
                    userData = await getData.req(config.baseUrl + config.endpoint.user + config.key + "&u=" + userName)
                    if(userData.length == 0){
                        console.log("Non Excisting user")
                    } else{
                        window.localStorage.setItem("osu-user-" + userName, JSON.stringify(userData))
                        console.log("new userData for " + userName + " recieved")
                        render.user(userData,userName)
                    }
                } else{ // If the data does excist the data is immediatly parsed and send to the render function
                    console.log("excisting user: " + userName )
                    render.user(JSON.parse(userData))
                }
            },
            beatmap:async (config,userName,limit)=>{
                console.log("Getting beatmap data: " + userName)

                var beatData = window.localStorage.getItem("osu-user-" + userName + "-beatmaps")
                if(!beatData){
                    beatData = await getData.req(config.baseUrl + config.endpoint.beatmap + config.key + "&u=" + userName + "&limit=" + limit)
                    if(beatData.length == 0){
                        console.log("Non Excisting user")
                    } else{
                        window.localStorage.setItem("osu-user-" + userName + "-beatmaps", JSON.stringify(beatData))
                        console.log("new beatmaps for " + userName + " recieved")
                        getData.meta(config,beatData)
                    }
                }else{
                    console.log("excisting beat data")
                    console.log(JSON.parse(beatData).length)
                    getData.meta(config,JSON.parse(beatData))
                }
            },
            meta:(config,data)=>{
                var
                    beatIds = data.map(mapId => mapId.beatmap_id) // remap all beatmaps to array for metaData call

                beatIds.forEach((beatId,i) => (async () => { // Gets meta data for each beatmap played

                    var metaData = window.localStorage.getItem('osu-beatmap-' + beatId)
                    if(!metaData){
                        metaData = await getData.req(config.baseUrl + config.endpoint.meta + config.key + "&b=" + beatId)
                        window.localStorage.setItem('osu-beatmap-' + beatId, JSON.stringify(metaData))
                        console.log("new metadata for " + beatId + " recieved")
                        render.beatList(data[i],metaData,data.length,i)
                    }else{
                        console.log("excisting meta data")
                        render.beatList(data[i],JSON.parse(metaData),beatIds.length,i)
                    }
                })())
            },
            score:async (beatId,userName)=>{
                var
                    beatSet = beatId.split("-")[0],
                    beatmap = beatId.split("-")[1],
                    userData = JSON.parse(window.localStorage.getItem("osu-user-" + userName))[0],
                    metaData = JSON.parse(window.localStorage.getItem("osu-beatmap-" + beatmap))[0],
                    beatData = JSON.parse(window.localStorage.getItem("osu-user-" + userName +"-beatmaps")),
                    scoreData = await false

                beatData.forEach(curMap => {
                    if(curMap.beatmap_id == beatmap){
                        beatData = curMap
                    }
                })

                render.score(
                    {
                        user: userData,
                        meta: metaData,
                        beat: beatData,
                        score: scoreData
                    }
                )
            },
            req:(url)=>{
                return new Promise(resolve => { // Promise for the fetching of all the data
                    fetch(url)
                    .then(res => res.json())
                    .then(response => resolve(response))
                    .catch(err => console.log("ERROR:" + err))
                })
            }
        },
        render = {
            user:(data)=>{ // renders user data
                data = data[0]
                console.log("Building userdata for", data.username)

                var
                    userCont= document.querySelector(".userContainer"),
                    userImg = userCont.querySelector("img"),
                    userName= userCont.querySelector(".username"),
                    userGlob= userCont.querySelector(".globalRank"),
                    userLoca= userCont.querySelector(".countryRank"),
                    userCoun= userCont.querySelector(".country"),
                    userLvl = userCont.querySelector(".level"),
                    userProg= userCont.querySelector(".progress")

                userImg.src        = "https://a.ppy.sh/" + data.user_id
                userName.innerHTML = data.username
                userGlob.innerHTML = "Rank #" + data.pp_rank + " - " + Math.trunc(data.pp_raw)+ "pp"
                userLoca.innerHTML = "#" + data.pp_country_rank
                userCoun.src       = "https://www.countryflags.io/"+ data.country.toUpperCase() +"/flat/64.png"
                userLvl.innerHTML  = Math.trunc(data.level)

                userProg.setAttribute("style","width:"+Math.floor((data.level%1)*100)+"%")

                console.log("-- Finished building userData for", data.username)
            },
            beatList:(beatmap,metaData,clearN = 15,i)=>{ // render each beatmap
                const
                    beatmapsCont = document.querySelector(".playContainer")
                var
                    metaData = metaData[0],
                    nItems = beatmapsCont.querySelectorAll('li').length,
                    newLi = document.createElement("li"),
                    newGra= document.createElement("div"),
                    newPp = document.createElement("span"),
                    newRan= document.createElement("span"),
                    newTtl= document.createElement("h1"),
                    newSub= document.createElement("h2")

                if(beatmapsCont.classList.contains('build')){ // checks the number of items in the list, clears the list for a new build
                    beatmapsCont.classList.remove('build')
                    while(beatmapsCont.firstChild){
                        beatmapsCont.removeChild(beatmapsCont.firstChild)
                    }
                }

                newLi.setAttribute("style","background-image:url(https://assets.ppy.sh/beatmaps/" + metaData.beatmapset_id + "/covers/cover.jpg);animation-delay:"+(nItems/15)+"s; order:"+ i +";")
                newLi.setAttribute('data-preview',"https://b.ppy.sh/preview/"+ metaData.beatmapset_id +".mp3")
                newLi.id = [metaData.beatmapset_id,beatmap.beatmap_id].join('-')
                newLi.addEventListener('click',()=>{
                    helper.setActive(newLi)
                })

                newGra.classList.add("gradient")
                newRan.textContent = helper.getRank(beatmap.rank)
                newPp.classList.add("pp")
                newPp.innerHTML = Math.trunc(beatmap.pp) + "<span>pp</span>"

                newTtl.textContent = metaData.title
                newSub.textContent = "["+ metaData.version +"] - Pass Percentage: " + Math.trunc((metaData.passcount/metaData.playcount)*100) + "%"

                newLi.appendChild(newGra)
                newLi.appendChild(newTtl)
                newLi.appendChild(newSub)
                newGra.appendChild(newPp)
                newGra.appendChild(newRan)
                beatmapsCont.appendChild(newLi)

                if(clearN-1 == nItems){
                    console.log("-- Finised building beatmaps")
                    beatmapsCont.classList.add('build')
                }
            },
            score:(data)=>{
                window.location.hash = "osu-user-xenica/beatmap-" + data.meta.beatmapset_id + "-" + data.beat.beatmap_id
                var
                    beat = data.beat,
                    meta = data.meta,
                    user = data.user
            }
        },
        helper = {
            getRank:(rank)=>{ // Remap rank values to legible values
                switch (rank) {
                    case "X":
                        return "SS"
                        break
                    case "XH":
                        return "SSH"
                        break
                    default:
                        return rank
                    }
            },
            setActive:(target)=>{
                var
                    active = document.querySelector(".active")
                if (active == target) {
                    target.classList.remove("active")
                    waveForm.previewSound(target.getAttribute("data-preview"),false)
                } else if(active == null){
                    target.classList.add("active")
                    waveForm.previewSound(target.getAttribute("data-preview"))
                    // getData.score(target.id,document.querySelector("#userInput").value)
                } else{
                    active.classList.remove("active")
                    target.classList.add("active")
                    waveForm.previewSound(target.getAttribute("data-preview"))
                    // getData.score(target.id,document.querySelector("#userInput").value)
                }
            },
            checkExcisting:(mainString,id,subString = "")=>{
                var dataPoint = window.localStorage.getItem(mainString + id + subString)
                if(dataPoint){
                    return true
                } else{
                    return false
                }
            }
        },
        waveForm = {
            previewSound:(url,state = true)=>{
                const
                    audio = document.querySelector("audio")
                if (state) {
                    audio.setAttribute("src",url)
                    audio.play()
                }else{
                    audio.pause()
                }
            }
        }
    app.init()
})()
