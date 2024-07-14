
window.onresize = (e)=>{
    const b = document.querySelector("body");
    if(b.classList.contains('is-collapsed')){
        b.classList.remove('is-collapsed')
    }
}

window.onload = (e)=>{
    const b = document.querySelector("body");
    if(b.classList.contains('is-collapsed')){
        b.classList.remove('is-collapsed')
    }
}