import * as helper from "../modules/helper.js"
import * as render from "../modules/render.js"
import * as getData from "../modules/getData.js"
const init = ()=>{
    // Init the router
    routie({
        'osu-user-*/beatmap-*':(user,beatId)=>{
            // Render detailed score page :TODO
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
            
            helper.errorMsg(false)
            helper.loading(true)

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
}   
export {init}