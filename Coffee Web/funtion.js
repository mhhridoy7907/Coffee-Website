// Drag Scroll
function enableDragScroll(containerClass) {
    const slider = document.querySelector(containerClass);
    if(!slider) return;
    let isDown=false, startX, scrollLeft;
    slider.addEventListener('mousedown', e => { isDown=true; slider.classList.add('active'); startX=e.pageX-slider.offsetLeft; scrollLeft=slider.scrollLeft; });
    slider.addEventListener('mouseleave', ()=>{ isDown=false; slider.classList.remove('active'); });
    slider.addEventListener('mouseup', ()=>{ isDown=false; slider.classList.remove('active'); });
    slider.addEventListener('mousemove', e => { if(!isDown) return; e.preventDefault(); const x=e.pageX-slider.offsetLeft; slider.scrollLeft=scrollLeft-(x-startX)*2; });
}
// Button Scroll
document.querySelectorAll(".scroll-btn").forEach(button=>{
    button.addEventListener("click",()=>{
        const container = document.querySelector(button.dataset.target);
        const dir = button.dataset.dir;
        const scrollAmount = 250;
        container.scrollBy({left: dir==="left"? -scrollAmount : scrollAmount, behavior:"smooth"});
    });
});
const containers = ['.milkshakes-container','.blogs-container','.order-container'];
containers.forEach(enableDragScroll);

// 3D Carousel
const carousel = document.getElementById("carousel");
let rotY=0, drag=false, startX;
const panels = carousel.querySelectorAll(".panel");
document.addEventListener("mousedown", e=>{ drag=true; startX=e.clientX; });
document.addEventListener("mouseup", ()=> drag=false );
document.addEventListener("mousemove", e=>{
    if(!drag) return;
    rotY += (e.clientX-startX)*0.4;
    carousel.style.transform=`rotateY(${rotY}deg)`;
    startX = e.clientX;
    updatePanels();
});
function auto() {
    if(!drag){ rotY+=0.25; carousel.style.transform=`rotateY(${rotY}deg)`; updatePanels();}
    requestAnimationFrame(auto);
}
auto();
function updatePanels(){
    const totalPanels=panels.length;
    panels.forEach((panel,index)=>{
        const angle = (index*(360/totalPanels)+rotY)%360;
        const delta = Math.min(Math.abs(angle%360),Math.abs((angle%360)-360));
        const blurFactor=Math.min(delta/60,1);
        panel.style.filter=`brightness(${1-0.88*blurFactor})`;
    });
}

// Search
document.addEventListener("DOMContentLoaded",()=>{
    const searchInput=document.getElementById("search-input");
    const notFound=document.getElementById("not-found");
    const allCards=document.querySelectorAll(".milkshake-card, .order-card, .blog-card");

    searchInput.addEventListener("input",()=>{
        const query=searchInput.value.toLowerCase();
        let found=false;
        allCards.forEach(card=>{
            const h3=card.querySelector("h3");
            if(!h3) return;
            const text=h3.textContent.toLowerCase();
            if(text.includes(query)){
                card.style.display="block";
                found=true;
            } else { card.style.display="none"; }
        });
        notFound.style.display = (!found && query.trim()!=="") ? "block" : "none";
    });
});





// copyright image modal
const modal = document.getElementById("img-modal");
const modalImg = document.getElementById("modal-img");
const copyrightImg = document.getElementById("copyright-img");
const closeBtn = modal.querySelector(".close");

// Open modal on image click
copyrightImg.onclick = function(){
    modal.style.display = "flex";
    modalImg.src = this.src;
}

// Close modal on click X
closeBtn.onclick = function(){
    modal.style.display = "none";
}

// Close modal if user clicks outside the image
modal.onclick = function(e){
    if(e.target === modal) modal.style.display = "none";
}
