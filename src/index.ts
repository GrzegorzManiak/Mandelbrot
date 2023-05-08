
import init, { Complex, Mandelbrot, calc_mandelbrot } from './wasm/mandelbrot';
import GUI from 'lil-gui'; 
init().then(() => main());

// -- Get the main mandelbrot container and add a canvas element
const mandelbrot_parent_elm = document.querySelector('[mandelbrot="main"]'),
    mandelbrot_elm = mandelbrot_parent_elm.appendChild(document.createElement('canvas')),
    color_modes = [ 'black_white', 'rainbow' ];

async function main() {
    const mandelbrot = new Mandelbrot(
        new Complex(-2.4, 1.75),
        new Complex(1.2, -1.8)
    );

    let ctrl = {
        color_mode: color_modes[1],
        min_r: mandelbrot.min.r,
        min_i: mandelbrot.min.i,
        max_r: mandelbrot.max.r,
        max_i: mandelbrot.max.i,
        max_iter: 50,
        pixel_scale: 0.5
    };

    const gui = new GUI({
        title: "Mandelbrot",
        width: 300,
    });
    

    const calc = async() => calc_mandelbrot(
        new Mandelbrot(
            new Complex(ctrl.min_r, ctrl.min_i),
            new Complex(ctrl.max_r, ctrl.max_i)
        ),
        mandelbrot_elm, 
        ctrl.max_iter, 
        ctrl.pixel_scale,
        ctrl.color_mode
    );
    

    gui.add(ctrl, "min_r", -5, 5, 0.01).onChange(() => {
        mandelbrot.min.r = ctrl.min_r; calc(); });

    gui.add(ctrl, "min_i", -5, 5, 0.01).onChange(() => {
        mandelbrot.min.i = ctrl.min_i; calc(); });

    gui.add(ctrl, "max_r", -5, 5, 0.01).onChange(() => {
        mandelbrot.max.r = ctrl.max_r; calc(); });

    gui.add(ctrl, "max_i", -5, 5, 0.01).onChange(() => {
        mandelbrot.max.i = ctrl.max_i; calc(); });

    gui.add(ctrl, "max_iter", 1, 1000, 1).onChange(() => {
        calc(); });

    gui.add(ctrl, "pixel_scale", 0.01, 1, 0.01).onChange(() => {
        calc(); });


    // -- Color mode
    gui.add(ctrl, "color_mode", color_modes).onChange(() => {
        calc();
    });


    // -- Save
    gui.add({
        save: () => {
            const link = document.createElement('a');
            link.download = 'mandelbrot.png';
            link.href = mandelbrot_elm.toDataURL();
            link.click();
        }
    }, "save");

    // -- Calc
    gui.add({ calc: () => calc() }, "calc");

    // -- Reset
    gui.add({
        reset: () => {
            mandelbrot.min.r = -2.4;
            mandelbrot.min.i = 1.75;
            mandelbrot.max.r = 1.2;
            mandelbrot.max.i = -1.8;
            ctrl.min_r = mandelbrot.min.r;
            ctrl.min_i = mandelbrot.min.i;
            ctrl.max_r = mandelbrot.max.r;
            ctrl.max_i = mandelbrot.max.i;

            calc();
        }
    }, "reset");

    calc();
}