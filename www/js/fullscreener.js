function addCanvasFullscreenButton(){
    
    button = createButton('fullscreen');
    button.mousePressed(goFullScreen);

}

function goFullScreen() {
    let cs = document.getElementsByTagName("CANVAS");
    if (cs && cs.length === 1) {
        const canvas = cs[0];
        if (canvas.requestFullScreen)
            canvas.requestFullScreen();
        else if (canvas.webkitRequestFullScreen)
            canvas.webkitRequestFullScreen();
        else if (canvas.mozRequestFullScreen)
            canvas.mozRequestFullScreen();
    }
}