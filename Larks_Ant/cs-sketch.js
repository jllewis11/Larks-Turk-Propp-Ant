// cs-sketch.js; P5 key animation fcns.  // CF p5js.org/reference
// Time-stamp: <2021-08-28 22:20:02 Chuck Siska>

// ============================================================
// Class Number CPSC 335-03
// Project 1 Lark's Ant
// Contributors: Nguyen Le, Jerry Liu, Austin Sohn
// September 21, 2021
//
// TOC of Things
// var g_canvas 
// var g_frame_cnt
// var g_frame_mod
// var g_stop
// var count
// 
// function setup() // P5 Setup Fcn, must be called for Anim to work.
// function move_bot( ) // Move the bot in new direction & update color.
// function get_rgb( cpix ) // Get RGB integer color at canvas pixel pos.
// function paint_cell_interior( cell ) // Paint grid-cell insides, with pre-set color.
// function draw_bot( ) // Convert bot pos to grid pos & draw bot cell.
// function draw_update()  // Update our display, move & draw bot cell.
// function draw()  // P5 Frame Anim-draw Fcn, Called for Every Frame at Frame-rate.
// function keyPressed( ) // P5 fcn, called for every keypress.
// function set_bot_pos( ) // Update bot cell pos based on mouse's canvas pixel pos.
// function mousePressed( ) // P5 fcn, called for every mouse-press.
// ============================================================


// Make our own global, g_canvas, JS 'object': a key-value 'dictionary'.
  // (Our g_canvas is just a suitcase - the P5 canvas has the pixels, themselves.)
var g_canvas = { cell_size:10, wid:64, hgt:48 }; // JS Global var, w canvas size info.
var g_frame_cnt = 0; // Setup a P5 display-frame counter, to do anim
var g_frame_mod = 24; // Update ever 'mod' frames.
var g_stop = 0; // Go by default.
var fsm_counter = 0;  // Decrement in countdown mode
var normal_mode = true;  //FSM bool
var step_count = 0;

function setup() // P5 Setup Fcn, must be called for Anim to work.
{
    let sz = g_canvas.cell_size;
    let width = sz * g_canvas.wid;  // Our 'canvas' uses cells of given size, not 1x1 pixels.
    let height = sz * g_canvas.hgt;
    createCanvas( width, height );  // Make a P5 canvas.
    draw_grid( 10, 50, 'blue', 'black' ); // Calls fcn in another (loaded) file.
}
// Here are some more simple multi-slot objects we use.
var g_bot = { dir:0, x:20, y:20, color:100 }; // Dir is 0..7 clock, w 0 up.
var g_box = { t:1, hgt:47, l:1, wid:63 }; // Box in which bot can move.
  
function move_bot( ) // Move the bot in new direction & update color.
{
    let dir = g_bot.dir;
    let dx = 0;
    let dy = 0;
    // A simple way to change bot direction, with a "compass direction ptr".
    console.log(dir);
    let sz = g_canvas.cell_size;
    let x_in = 1+ g_bot.x*sz; // Set x one pixel inside the sz-by-sz cell.
    let y_in = 1+ g_bot.y*sz;
    let cpix = { x:x_in, y:y_in }; // cell-interior pixel pos, new obj.
    let cpix_rgb = get_rgb( cpix );

    if (!normal_mode)  //Count is positive we are in countdown mode
    {
        fsm_counter -= 1;
        if (fsm_counter < 0) { normal_mode = true; }
    }
    else    //Normal mode
    {
        switch( cpix_rgb )
        {
            case 0 : {}
            case 12566467 : { dir -= 2; fsm_counter += 0; break; } //Turn Left on Black
            case 16760767 : { dir -= 2; fsm_counter += 1; break; }  //Turn Left on Blue
            case 12582911 : { normal_mode = false; break; }  //Turn Right on Yellow
            case 12566527 : { dir = (dir  + 2)%8; fsm_counter += 1; break; }  //Turn Right on Red
        }

        if (dir < 0) { dir = 6; } //When facing north and turning left dir will be neg. this fixes that.
    }

    switch (dir)
    { // Convert dir to x,y deltas: dir = clock w 0=Up,2=Rt,4=Dn,6=Left.
        case 0 : {         dy = -1; break; } // up, N.
        case 1 : { dx = 1; dy = -1; break; } // NE.
        case 2 : { dx = 1; break; } // right, E.
        case 3 : { dx = 1; dy = 1; break; } // SE ...
        case 4 : {         dy = 1; break; } // South
        case 5 : { dx = -1; dy = 1; break; } // SW
        case 6 : { dx = -1; break; } // W
        case 7 : { dx = -1; dy = -1; break; } //NW
        default: { dx = 0; dy = 0; break; } // Straight, no change in direction.
    }

    let x = (dx + g_bot.x + g_box.wid) % g_box.wid; // Move-x.  Ensure positive b4 mod.
    let y = (dy + g_bot.y + g_box.hgt) % g_box.hgt; // Ditto y.
    let color =  100 + (1 + g_bot.color) % 156; // Incr color in nice range.
    g_bot.x = x; // Update bot x.
    g_bot.y = y;
    g_bot.dir = dir;
    //g_bot.color = '0000ff';
    //console.log( "bot x,y,dir,clr = " + x + "," + y + "," + dir + "," +  color );
}

function get_rgb( cpix ) // Get RGB integer color at canvas pixel pos.
{ // Cpix needs slots .x, .y, (canvas pixel coords).
    let acolors = get( cpix.x, cpix.y ); // Get pixel color [RGBA] array.
    let pix_rgb =  // Ignore A = acolors[3], the transparency.
        (256 // Compose via Horner's Method.
         * (256 * (acolors[ 2 ]) // B
            +  acolors[ 1 ])) // G
        + acolors[ 0 ]; // R
    //console.log( "acolors,pix_rgb = " + acolors + ", " + pix_rgb );
    return pix_rgb;
}

function increment_color( num ) // Increment cell color to the next color
{  //Black > Blue > Yellow > Red
    switch( num )
    {
        case 0        : { g_bot.color = '0000FF'; break; } //Black to Blue
        case 12566467 : { g_bot.color = '0000FF'; break; } //Also Black to Blue because the canvas black != bot's black
        case 16760767 : { g_bot.color = 'ffff00'; break; } //Blue to Yellow
        case 12582911 : { g_bot.color = 'ff0000'; break; } //Yellow to Red
        case 12566527 : { g_bot.color = '000000'; break; } //Red to Black
    }
    console.log( "g_bot.color = " + g_bot.color);
}

function paint_cell_interior( cell ) // Paint grid-cell insides, with pre-set color.
{ // Skip cell 1-pixel border, just paint insides.
    // Cell needs slots .x, .y, (canvas pixel coords) and .cell_size (in pixels);
    let sz = cell.cell_size;
    let x_in = 1 + (cell.x * sz); // Interior is one pixel inside cell, from top-left.
    let y_in = 1 + (cell.y * sz);
    let wid = sz -2; // Get width inside cell walls.
    rect( x_in, y_in, wid, wid );
}

function draw_bot( ) // Convert bot pos to grid pos & draw bot cell.
{
    let sz = g_canvas.cell_size;
    let x_in = 1+ g_bot.x*sz; // Set x one pixel inside the sz-by-sz cell.
    let y_in = 1+ g_bot.y*sz;
    let cpix = { x:x_in, y:y_in }; // cell-interior pixel pos, new obj.
    // Set drawing color for cell interior (fill) to bot's current painting color.
    let cpix_rgb = get_rgb( cpix );
    increment_color(cpix_rgb);
    console.log( "cpix_rgb = " + cpix_rgb);
    // Fill 'color': its a keystring, or a hexstring like "#5F", etc.  See P5 docs.
    fill( "#" + g_bot.color ); // Concat string, auto-convert the number to string.
    //console.log( "x_in,y_in = " + x + "," + y );
    //let cpix_rgb = get_rgb( cpix );
    //increment_color(cpix_rgb); 
    // (*) Here is how to detect what's at the pixel location.  See P5 docs for fancier...
    if (0 != cpix_rgb) // This cell has color?
    { // Turn off color, both interior (fill) and border (stroke).
        //fill( 0 );
        //stroke( 0 );
    }
    else { stroke( 'white' ); } // Else none, Bot is visiting, so color border white.

    // Paint the cell.
    let cell = { x:g_bot.x, y:g_bot.y, cell_size:sz }; // new obj.
    paint_cell_interior( cell );
}

function draw_update()  // Update our display, move & draw bot cell.
{
    //console.log( "step_count: " + step_count );
    if(step_count < 2000)
    {
        step_count += 1;
        move_bot( );
        draw_bot( );
    }
}

function draw() // P5 Frame Anim-draw Fcn, Called for Every Frame at Frame-rate.
{
    ++g_frame_cnt; // Count each P5 frame-draw request.
    if (0 == g_frame_cnt % g_frame_mod) // Skip most frames.
    {
        if (!g_stop) draw_update(); // Draw bot only if it is moving.
    }
}

function keyPressed( ) // P5 fcn, called for every keypress.
{ // Any keypress, we don't distinguish.  See P5 docs for using keys.
    g_stop = ! g_stop; // Toggle the bot move-paint on/off.
}

function set_bot_pos( ) // Update bot cell pos based on mouse's canvas pixel pos.
{  //  Req's cell-to-pixel tranlation.
    let x = mouseX;  // Get P5 mouse canvas pixel coords.
    let y = mouseY;
    //console.log( "mouse x,y = " + x + "," + y );
    // Convert canvas coords to the "fatter" grid-cell coords.
    let sz = g_canvas.cell_size;
    let gridx = round( (x-0.5) / sz );
    let gridy = round( (y-0.5) / sz );
    //console.log( "grid x,y = " + gridx + "," + gridy );
    //console.log( "box wid,hgt = " + g_box.wid + "," + g_box.hgt );
    g_bot.x = gridx + g_box.wid; // Ensure its positive.
    //console.log( "bot x = " + g_bot.x );
    g_bot.x %= g_box.wid; // Wrap to fit grid-box.
    g_bot.y = gridy + g_box.hgt;
    //console.log( "bot y = " + g_bot.y );
    g_bot.y %= g_box.hgt; // Wrap to fit grid-box.
    //console.log( "bot x,y = " + g_bot.x + "," + g_bot.y );
}

function mousePressed( ) // P5 fcn, called for every mouse-press.
{
    set_bot_pos( );
    draw_bot( );
}
