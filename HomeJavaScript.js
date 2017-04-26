
var mLoop = setInterval(MainLoop, 35);

var slide = document.getElementsByClassName('slide'); // Get Slides
for (var i = 0; i < slide.length; i++) {if(i != 0) {slide[i].style.visibility = "hidden";}}

var ExpansionButton = document.getElementById('ExpansionButton'); // Get Expansion Button
ExpansionButton.addEventListener("click", ExpansionClick);

var SlideContent = document.getElementById('SlideContent');




var MouseX, MouseY;
var keyPressed, keyBounce;

var CurrentSlide = 0;
var PrevSlide = 3;
var SlideTransDir;
var PageState = 0; // 0 = Slide Stable, 1 = Slide Moving, 2 = Text Pop Out Moving, 3 = Text Pop Out Stable

var ExpansionDir = 0; // -1 = Closing, 1 = Opening
var blurAmount = 0;
var blurTarget = 0;

var blurSpeed = 1.25;
var blurSnapTol = 2;

var snapTol = 2;
var MoveSpeed = 6.00;

document.addEventListener("mousemove", mousePos);
function mousePos() {
    MouseX = event.clientX;
    MouseY = event.clientY;
}
document.addEventListener("keydown", SlideKeyShift);
function SlideKeyShift() {
    keyPressed = event.keyCode;
    if(keyPressed == 39 && keyBounce == 0) { // Right Arrow
        keyBounce = 1;
        ChangeSlide(1);
    }
    if(keyPressed == 37 && keyBounce == 0) { // Left Arrow
        keyBounce = 1;
        ChangeSlide(-1);
    }
}
document.addEventListener("keyup", keyB);
function keyB() {
    keyBounce = 0;
}
document.addEventListener("click", mClick);
function mClick() {
    ChangeSlide(1);
}

function ExpansionClick() {
    switch (PageState) {
        case 0:
            PageState = 2;
            ExpansionDir = 1;
            blurTarget = 15; // Blur to 15 pixels
            break;
        case 3:
            PageState = 2;
            ExpansionDir = -1;
            blurTarget = 0; // Reset Blur
            break;
    }
}




function MainLoop() {
    // console.log("CSlide:");
    // console.log(CurrentSlide);
    // console.log("PSlide");
    // console.log(PrevSlide);
    switch (PageState) {
        case 0: // Slide Stable
            slide[CurrentSlide].style.visibility = "visible";
        break;
        case 1: // Slide Moving
            AnimateSlideTransition(SlideTransDir);
        break;
        case 2: // Text Pop Out Moving
            AnimateContentExpansion(ExpansionDir);
        break;
        case 3: // Text Pop Out Stable
            // for (var i = 0; i < slide.length; i++) { // Cycle through slides
            //     slide[i].style.visibility = "hidden"; // Set All slides to hidden
            // }
            slide[CurrentSlide].style.visibility = "visible";
        break;
    }
}



function ChangeSlide(LR) {
    if (PageState == 0) {
        PrevSlide = CurrentSlide;
        if (LR > 0 && CurrentSlide < slide.length-1) { // Pan Left
            CurrentSlide += LR;
            SlideTransDir = 1;

            midline = window.innerWidth;
            midlineTarget = 0;
        }
        else if (LR > 0 && CurrentSlide == slide.length-1) { // Pan Left
            CurrentSlide = 0;
            SlideTransDir = 1;

            midline = window.innerWidth;
            midlineTarget = 0;
        }
        else if (LR < 0 && CurrentSlide > 0) { // Pan Right
            CurrentSlide += LR;
            SlideTransDir = -1;

            midline = 0;
            midlineTarget = window.innerWidth;
        }
        else if (LR < 0 && CurrentSlide == 0) { // Pan Right
            CurrentSlide = slide.length-1;
            SlideTransDir = -1;

            midline = 0;
            midlineTarget = window.innerWidth;
        }
        PageState = 1;
    }
}


var midline;
var midlineTarget;
function AnimateSlideTransition(LR) {

    for (var i = 0; i < slide.length; i++) { // Cycle through slides
        if (i != CurrentSlide && i != PrevSlide) {slide[i].style.visibility = "hidden";} // Set All slides but current and previous slides to hidden
    }

    slide[CurrentSlide].style.visibility = "visible"; // Set used slides to visable
    slide[PrevSlide].style.visibility = "visible";

    switch (LR) {
        case -1: // Pan Right
            slide[CurrentSlide].style.right = ""; // Remove Values from right
            slide[PrevSlide].style.right = "";

            midline += (midlineTarget - midline)/MoveSpeed;

            slide[CurrentSlide].style.left = String(midline - window.innerWidth) + "px";
            slide[PrevSlide].style.left = String(midline) + "px";

            if (midline >= window.innerWidth - snapTol) {
                midline = midlineTarget;

                slide[CurrentSlide].style.left = String(midline - window.innerWidth) + "px";
                slide[PrevSlide].style.left = String(midline) + "px";
    
                slide[PrevSlide].style.visibility = "hidden";
                PageState = 0;
            }
        break;
        case 1: // Pan Left
            slide[CurrentSlide].style.left = ""; // Remove Values from left
            slide[PrevSlide].style.left = "";

            
            midline += (midlineTarget - midline)/MoveSpeed;

            slide[CurrentSlide].style.right = String(-1 * midline) + "px";
            slide[PrevSlide].style.right = String((-1 * midline) + window.innerWidth) + "px";

            if (midline <= snapTol) {
                midline = midlineTarget;

                slide[CurrentSlide].style.right = String(-1 * midline) + "px";
                slide[PrevSlide].style.right = String((-1 * midline) + window.innerWidth) + "px";

                slide[PrevSlide].style.visibility = "hidden";
                PageState = 0;
            }
        break;
    }
}

function AnimateContentExpansion(ExpDir) { // -1 for closing, 1 for opening
    switch (ExpDir) {
        case -1:
            if (blurAmount > blurTarget) {
                blurAmount -= blurSpeed;
                slide[CurrentSlide].style.webkitFilter = ("blur(" + String(blurAmount) + "px)");
                if (blurAmount < blurTarget+blurSnapTol) {
                    blurAmount = blurTarget;
                    PageState = 0;
                    slide[CurrentSlide].style.webkitFilter = "";
                }
            }
            
            break;
        case 1:
            // slide[CurrentSlide].style.webkitFilter = "";
            if (blurAmount < blurTarget) {
                blurAmount += blurSpeed;
                if (blurAmount > (blurTarget-blurSnapTol)) {
                    blurAmount = blurTarget;
                    PageState = 3;
                }
                slide[CurrentSlide].style.webkitFilter = ("blur(" + String(blurAmount) + "px)");
            }
            
            break;
    }
}