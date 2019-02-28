import * as helper from "../modules/helper.js"
const
    user = (data)=>{ // renders user data
        if(data){
            data = data[0]
            console.log("Building userdata for", data.username)

            let
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
        }else{
            let
                userCont= document.querySelector(".userContainer")
            userCont.innerHTML = `
            <div>
                <img src="" alt="" width="260" height="260">
                <h1 class="username">Username</h1>
                <h2 class="globalRank">#Global Rank</h2>
            </div>
            <div>
                <h2 class="countryRank">#ranking</h2>
                <img class="country" src="https://www.countryflags.io/NL/flat/64.png" alt="country" placeholder="country">
                <h2>Lv.<span class="level">0</span></h2>
            </div>
                <div class="bar">
                <div class="progress"></div>
            </div>
            `
        }
    },
    beatList = (beatmap,metaData,clearN = 15,i)=>{ // render each beatmap
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
            newSub= document.createElement("h2"),
            newDif= document.createElement("span"),
            ratingCalc = Math.trunc(metaData.difficultyrating*100)/100,
            ratingPart = ratingCalc%Math.trunc(ratingCalc),
            ratingWhole = ratingCalc - ratingPart


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

        for (let i = 0; i < ratingWhole; i++) {
            let newStar = document.createElement("div")
            newStar.classList.add("star")
            newDif.appendChild(newStar)          
        }
        if(ratingPart > 0){
            let newStar = document.createElement("div")
            newStar.classList.add("star")
            newStar.style.setProperty("width",ratingPart*1.5 + "rem")
            newDif.appendChild(newStar)  
        }
        newDif.classList.add("difficulty")

        newLi.appendChild(newGra)
        newLi.appendChild(newTtl)
        newLi.appendChild(newSub)
        newLi.appendChild(newDif)
        newGra.appendChild(newPp)
        newGra.appendChild(newRan)
        beatmapsCont.appendChild(newLi)

        if(clearN-1 == nItems){
            console.log("-- Finised building beatmaps")
            beatmapsCont.classList.add('build')
            helper.loading(false)
        }
    },
    score = (data)=>{
        window.location.hash = "osu-user-xenica/beatmap-" + data.meta.beatmapset_id + "-" + data.beat.beatmap_id
        var
            beat = data.beat,
            meta = data.meta,
            user = data.user
    }
export {user,beatList,score}
