(()=>{
    var
        app = {
            init:()=>{
                var
                    userName = document.getElementById("userInput").value
                getData.user(apiConfig,userName)
                getData.beatmap(apiConfig,userName,15)
            }
        },
        getData = {
            user:async (config,userName)=>{
                console.log("Getting user data: " + userName)

                var userData = window.localStorage.getItem("osu-user-" + userName)
                if(!userData){
                    console.log("new user: " + userName)
                    userData = await getData.req(config.baseUrl + config.endpoint.user + config.key + "&u=" + userName)
                    window.localStorage.setItem("osu-user-" + userName, JSON.stringify(userData))
                    console.log("new userData for " + userName + " recieved")
                    render.user(userData,userName)
                } else{
                    console.log("excisting user: " + userName )
                    render.user(JSON.parse(userData))
                }
            },
            beatmap:async (config,userName,limit)=>{
                console.log("Getting beatmap data: " + userName)

                var beatData = window.localStorage.getItem("osu-user-" + userName + "-beatmaps")
                if(!beatData){
                    console.log("new beatmaps")
                    beatData = await getData.req(config.baseUrl + config.endpoint.beatmap + config.key + "&u=" + userName + "&limit=" + limit)
                    window.localStorage.setItem("osu-user-" + userName + "-beatmaps", JSON.stringify(beatData))
                    console.log("new beatmaps for " + userName + " recieved")
                    getData.meta(config,beatData)
                }else{
                    console.log("excisting beat data")
                    getData.meta(config,JSON.parse(beatData))
                }
            },
            meta:async (config,data)=>{
                var
                    beatIds = data.map(mapId => mapId.beatmap_id)

                beatIds.forEach((beatId,i) => (async () => {
                    console.log("Getting metadata for " + beatId)

                    var metaData = window.localStorage.getItem('osu-beatmap-' + beatId)
                    if(!metaData){
                        console.log("new metadata:" + beatId)
                        metaData = await getData.req(config.baseUrl + config.endpoint.meta + config.key + "&b=" + beatId)
                        window.localStorage.setItem('osu-beatmap-' + beatId, JSON.stringify(metaData))
                        console.log("new metadata for " + beatId + " recieved")
                        render.beatList(data[i],metaData,data.length)
                    }else{
                        console.log("excisting meta data")
                        render.beatList(data[i],JSON.parse(metaData),data.length)
                    }
                })())
            },
            req:(url,beatmaps)=>{
                return new Promise(resolve => {
                    fetch(url)
                    .then(res => res.json())
                    .then(response => resolve(response))
                    .catch(err => console.log("ERROR:" + err))
                })
            }
        },
        render = {
            user:(data)=>{
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
            beatList:(beatmap,metaData,clearN)=>{
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

                if(clearN == nItems){
                    while(beatmapsCont.firstChild){
                        beatmapsCont.removeChild(beatmapsCont.firstChild)
                    }
                }

                newLi.setAttribute("style","background-image:url(https://assets.ppy.sh/beatmaps/" + metaData.beatmapset_id + "/covers/cover.jpg);animation-delay:"+(nItems/15)+"s")
                newLi.id = beatmap.beatmap_id
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
                }

            }
        },
        helper = {
            getRank:(rank)=>{
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
                    active = document.querySelector('.active')
                if (active == target) {
                    target.classList.remove('active')
                } else if(active == null){
                    target.classList.add('active')
                    helper.logData(target.id)
                } else{
                    active.classList.remove('active')
                    target.classList.add('active')
                    helper.logData(target.id)
                }
            },
            logData:(beatId)=>{
                console.log(JSON.parse(window.localStorage.getItem('osu-beatmap-' + beatId)))
            }
        }

    app.init()

    document.querySelector("button").addEventListener("click",()=>{
        app.init()
    })

})()

// Dev purposes
const storageClear = ()=>{
    window.localStorage.clear()
}
