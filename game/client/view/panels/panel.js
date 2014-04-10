/**
 * This represents a panel for the user interface.
 * @param x The top x position of the panel.
 * @param y The top y position of the panel.
 * @param w The width of the panel.
 * @param h The height of the panel.
 * @param backCol The background color.
 * @param updateFun The function that is called when updating.
 * @param ctx The canvas draw object.
 * @constructor
 */
function Panel(x,y,w,h,backCol,ctx){
    this.ctx=ctx;
    this.refresh=function(){
        ctx.fillStyle=backCol;
        ctx.fillRect(x,y,w,h);
    }

}
