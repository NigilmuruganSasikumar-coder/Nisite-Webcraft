/*=========================================
        BACCKGROUND MOUSE GLOW
=========================================*/
const glow = document.getElementById("glow");

document.addEventListener("mousemove",(e)=>{
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
});

const header = document.querySelector(".header");

window.addEventListener("scroll",()=>{

    if(window.scrollY>40){

        header.classList.add("scrolled");

    }else{

        header.classList.remove("scrolled");

    }

});
/*==============================
        CUSTOM CURSOR
==============================*/

const cursor=document.querySelector(".cursor");

const ring=document.querySelector(".cursor-ring");

let mouseX=0;
let mouseY=0;

let ringX=0;
let ringY=0;

document.addEventListener("mousemove",(e)=>{

    mouseX=e.clientX;
    mouseY=e.clientY;

    cursor.style.left=mouseX+"px";
    cursor.style.top=mouseY+"px";

});

function animateRing(){

    ringX+=(mouseX-ringX)*0.18;
    ringY+=(mouseY-ringY)*0.18;

    ring.style.left=ringX+"px";
    ring.style.top=ringY+"px";

    requestAnimationFrame(animateRing);

}

animateRing();

/* Hover */

const hoverItems=document.querySelectorAll(
"a,button,.primary-btn,.secondary-btn,.service-card,.project-card,.feature-box,.header-btn"
);

hoverItems.forEach(item=>{

    item.addEventListener("mouseenter",()=>{

        cursor.classList.add("active");
        ring.classList.add("active");

    });

    item.addEventListener("mouseleave",()=>{

        cursor.classList.remove("active");
        ring.classList.remove("active");

    });

});

/* Click */

document.addEventListener("mousedown",()=>{

    cursor.classList.add("click");
    ring.classList.add("click");

});

document.addEventListener("mouseup",()=>{

    cursor.classList.remove("click");
    ring.classList.remove("click");

});
const magnetic=document.querySelectorAll(".primary-btn,.secondary-btn,.header-btn");

magnetic.forEach(btn=>{

    btn.addEventListener("mousemove",(e)=>{

        const rect=btn.getBoundingClientRect();

        const x=e.clientX-rect.left-rect.width/2;
        const y=e.clientY-rect.top-rect.height/2;

        btn.style.transform=`translate(${x*0.18}px,${y*0.18}px)`;

    });

    btn.addEventListener("mouseleave",()=>{

        btn.style.transform="translate(0,0)";

    });

});
/*=========================
      SCROLL EFFECTS
=========================*/

const progressBar = document.getElementById("progressBar");

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll",()=>{

    const scrollTop =
        document.documentElement.scrollTop;

    const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const progress =
        (scrollTop / scrollHeight) * 100;

    progressBar.style.width = progress + "%";

    if(scrollTop > 350){

        topBtn.classList.add("show");

    }

    else{

        topBtn.classList.remove("show");

    }

});

/*=========================
      GO TO TOP
=========================*/

topBtn.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});
/*=========================================
        MENU BAR APPLICATION
=========================================*/
const menuToggle = document.getElementById("menuToggle");

const mobileMenu = document.getElementById("mobileMenu");

menuToggle.addEventListener("click",()=>{

    menuToggle.classList.toggle("active");

    mobileMenu.classList.toggle("active");

});

document.querySelectorAll(".mobile-menu a").forEach(link=>{

    link.addEventListener("click",()=>{

        menuToggle.classList.remove("active");

        mobileMenu.classList.remove("active");

    });

});
/*=========================================
        FAQ ACCORDION
=========================================*/

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {

        const isActive = item.classList.contains("active");

        // Close all FAQs
        faqItems.forEach(faq => {
            faq.classList.remove("active");
        });

        // Open clicked FAQ
        if(!isActive){
            item.classList.add("active");
        }

    });

});

/*=========================================
        CONTACT FORM EMAIL SENDING
=========================================*/
emailjs.init("YOUR_PUBLIC_KEY");

const form = document.getElementById("contactForm");

const button = document.getElementById("sendBtn");

const text = document.getElementById("btnText");

form.addEventListener("submit", function(e){

    e.preventDefault();

    text.innerHTML="Sending...";

    button.disabled=true;

    const params={

        name:document.getElementById("name").value,

        email:document.getElementById("email").value,

        phone:document.getElementById("phone").value,

        company:document.getElementById("company").value,

        service:document.getElementById("service").value,

        message:document.getElementById("message").value

    };

    emailjs.send(

        "YOUR_SERVICE_ID",

        "YOUR_TEMPLATE_ID",

        params

    )

    .then(function(){

        text.innerHTML="Message Sent ✓";

        document.getElementById("popup").classList.add("show");

        form.reset();

        setTimeout(function(){

            text.innerHTML="Send Message";

            button.disabled=false;

        },2000);

    })

    .catch(function(){

        text.innerHTML="Try Again";

        button.disabled=false;

        alert("Unable to send message.");

    });

});

function closePopup(){

    document.getElementById("popup").classList.remove("show");

}