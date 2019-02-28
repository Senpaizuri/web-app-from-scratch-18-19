import * as waveForm from "../modules/waveForm.js"
const 
    getRank = (rank)=>{ // Remap rank values to legible values
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
    setActive = (target)=>{
        var
            active = document.querySelector(".active")
        if (active == target) {
            target.classList.remove("active")
            waveForm.previewSound(target.getAttribute("data-preview"),false)
        } else if(active == null){
            target.classList.add("active")
            waveForm.previewSound(target.getAttribute("data-preview"))        } else{
            active.classList.remove("active")
            target.classList.add("active")
            waveForm.previewSound(target.getAttribute("data-preview"))
        }
    },
    checkExcisting = (mainString,id,subString = "")=>{
        var dataPoint = window.localStorage.getItem(mainString + id + subString)
        if(dataPoint){
            return true
        } else{
            return false
        }
    },
    errorMsg = (user,beat)=>{
        const errMessage = document.querySelector(".error")
        loading(false)
        if(user && beat == false){
            beat = 'beatmap'
        } else {
            beat = ''
        }
        if(user){
            errMessage.innerHTML = `the user ${user} ${beat} isn't found`
            errMessage.classList.remove("hidden")
        } else{
            errMessage.classList.add("hidden")
        }
    },
    loading = (state)=>{
        const loader = document.querySelector(".loader")
        if(state){
            loader.classList.add("loading")
        }else{
            loader.classList.remove("loading")
        }
    }
export {getRank,setActive,checkExcisting,errorMsg,loading}