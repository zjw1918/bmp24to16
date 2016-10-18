// var Jimp = require("jimp");

// // open a file called "lenna.png"
// Jimp.read("0.bmp", function (err, lenna) {
//     if (err) throw err;
//     console.log(lenna);
//     lenna.dither565()
//          .write("xx.bmp"); // save
// });


// console.log(process.argv);

"use strict"
var fs = require('fs');
var pixelBitmap= require('pixel-bmp');


fs.readdir('./', function(err,files){
    if(err) throw err;
    // console.log(files);

    // console.log(collectBmps(files));
    var sourcesFiles = collectBmps(files);
    for (let i = 0; i < sourcesFiles.length; i++) {
        var file = sourcesFiles[i];
        myParse(file);
        // pixelBitmap.parse(file).then(function(images){
        // //   console.log(images[0].data);
        //     var u8arr = images[0].data;

        //     // console.log(u8arr);

        //     var blocks = bufferToBlocks(u8arr);
        //     // console.log(bufferToBlocks(u8arr));
        //     var cArray = bmpToArr(blocks);
        //     fs.writeFile(file.split('.').shift() + '.log', cArray.toString(), function (err) {
        //         if (err) throw err;
        //         console.log('It\'s saved!');
        //     });

        //     // var buffer = new Buffer();
        //     // fs.writeFile('ttt.log', buffer, function (err) {
        //     //     if (err) throw err;
        //     //     console.log('It\'s saved!');
        //     // });
        // });

    }


})


function myParse (file) {
    return new Promise(function (resolve, reject) {
        pixelBitmap.parse(file).then(function(images){
            var u8arr = images[0].data;
            var blocks = bufferToBlocks(u8arr);
            var cArray = bmpToArr(blocks);
            fs.writeFile(file.split('.').shift() + '.log', cArray.toString(), function (err) {
                if (err) throw err;
                console.log(file + ' is saved!');
                resolve(1);
            });
        });
    });
}

function collectBmps(arr) {
    var res = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].split('.').pop() === 'bmp') {
            res.push(arr[i]);
        }
    }
    return res;
}


// var pixelBitmap= require('pixel-bmp');
// var fs = require("fs");
// var file= 'bike.bmp';

// pixelBitmap.parse(file).then(function(images){
// //   console.log(images[0].data);
//     var u8arr = images[0].data;

//     // console.log(u8arr);

//     blocks = bufferToBlocks(u8arr);
//     // console.log(bufferToBlocks(u8arr));
//     var cArray = bmpToArr(blocks);
//     fs.writeFile(file.split('.').shift() + '.log', cArray.toString(), function (err) {
//         if (err) throw err;
//         console.log('It\'s saved!');
//     });

//     // var buffer = new Buffer();
//     // fs.writeFile('ttt.log', buffer, function (err) {
//     //     if (err) throw err;
//     //     console.log('It\'s saved!');
//     // });
// });



/**
 * 取出bmp的原始pixels，去掉透明度，只取r,g,b
 * 组合成二维数组， 提供给后面转换为rgb565
 */
function bufferToBlocks(u8arr) {
    var res = [];
    var counts = u8arr.length / 4;
    for (var i = 0; i < counts; i++) {
        var tmp3 = [ u8arr[i * 4], u8arr[i * 4 + 1], u8arr[i * 4 + 2] ];
        res.push(tmp3);
    }
    return res;
}

function byteToBits(octet) {
    var bits = [];
    for (var i = 7; i >= 0; i--) {
        var bit = octet & (1 << i) ? 1 : 0;
        bits.push(bit);
    }
    return bits;
}

function bitsToByte(bits) {
    var res = 0;
    for (var i = 7, j = 0; i >= 0; i--, j++) {
        res = (res | (bits[i] << j) );
    }
    return res;
}

function bmpToArr(origin) {
    var res = [];
    for (var i = 0; i < origin.length; i++) {
        var a = origin[i];
        var tmp = byteToBits(a[0]).slice(0, 5);
        tmp = tmp.concat(byteToBits(a[1]).slice(0, 6));
        tmp = tmp.concat(byteToBits(a[2]).slice(0, 5));
        
        res = res.concat(bitsArr8ToBytes2(tmp));
    }
    return res;
}

function bitsArr8ToBytes2(arr) {
    var a = arr.slice(0, 8);
    var b = arr.slice(8, 16);
    return [bitsToByte(a), bitsToByte(b)];
}












