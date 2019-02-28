import * as render from "../modules/render.js"
import * as helper from "../modules/helper.js"
const 
    user = async (config,userName)=>{ // Checks the localStorage for data
        console.log("Getting user data: " + userName)
        var userData = window.localStorage.getItem("osu-user-" + userName)
        if(!userData){ // If the data doens't excist it starts the await for the async funct
            userData = await req(config.baseUrl + config.endpoint.user + config.key + "&u=" + userName)
            if(userData.length == 0){
                helper.errorMsg(userName)
                render.user(false)
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
    beatmap = async (config,userName,limit)=>{
        console.log("Getting beatmap data: " + userName)

        var beatData = window.localStorage.getItem("osu-user-" + userName + "-beatmaps")
        if(!beatData){
            beatData = await req(config.baseUrl + config.endpoint.beatmap + config.key + "&u=" + userName + "&limit=" + limit)
            if(beatData.length == 0){
                console.log("Non Excisting beatdata")
                helper.loading(false)
                helper.errorMsg(userName,false)
                document.querySelector(".playContainer").innerHTML = ""
                document.querySelector(".playContainer").classList.remove('build')
            } else{
                window.localStorage.setItem("osu-user-" + userName + "-beatmaps", JSON.stringify(beatData))
                console.log("new beatmaps for " + userName + " recieved")
                meta(config,beatData)
            }
        }else{
            console.log("excisting beat data")
            meta(config,JSON.parse(beatData))
        }
    },
    meta = (config,data)=>{
        var
            beatIds = data.map(mapId => mapId.beatmap_id) // remap all beatmaps to array for metaData call

        beatIds.forEach((beatId,i) => (async () => { // Gets meta data for each beatmap played

            var metaData = window.localStorage.getItem('osu-beatmap-' + beatId)
            if(!metaData){
                metaData = await req(config.baseUrl + config.endpoint.meta + config.key + "&b=" + beatId)
                window.localStorage.setItem('osu-beatmap-' + beatId, JSON.stringify(metaData))
                console.log("new metadata for " + beatId + " recieved")
                render.beatList(data[i],metaData,data.length,i)
            }else{
                console.log("excisting meta data")
                render.beatList(data[i],JSON.parse(metaData),beatIds.length,i)
            }
        })())
    },
    score = async (beatId,userName)=>{
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
    req = (url)=>{
        return new Promise(resolve => { // Promise for the fetching of all the data
            fetch(url)
            .then(res => res.json())
            .then(response => resolve(response))
            .catch(err => console.log("ERROR:" + err))
        })
    }
export {user,beatmap,meta,score,req}