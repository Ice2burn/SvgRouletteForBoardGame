// Генератор псевдослучайных чисел ( https://github.com/pigulla/mersennetwister )
var mt = new MersenneTwister(); 

// Системный объект рулетки для работы с векторной графикой ( http://dmitrybaranovskiy.github.io/raphael/ )
var paper;      
var arcs  = []; // svg-объекты секторов
var texts = []; // svg-объекты текста

// Входной набор заданий
var pieText2= [
  'Один Дома 1',
  'Один Дома 2',
  'Повар, его жена и её любовник',
  'Frozen',
  'Девушка с татуировкой дракона',
  'Служанка',
  'P.S. Я люблю тебя',
  'Шерлок Гномс',
  'Любовь по правилам и без',
  'Рок-волна',
  'Девушка из Дании',
  'Величайший шоумэн',
  'Кошмар перед Рождеством',
  'Вверх',
  'Одержимость'
];

// Входной набор заданий
var pieText= [
  'Выпей х1',
  'Опустоши стакан или\nПропусти ход',
  'Выпей x5',
  'Выпей х2',
  'ДЖЕКПОТ!\nОпустоши стакан',
  'Укажи на двоих,\nкто пьет х2',
  'Укажи на двоих,\nкто пьет х3',
  'Выпей и кидай\nкубик снова!',
  'Получи чёрную метку\nдо следующего хода',
  'Выпей х3',
  'Выпей х2 и\nКрути вновь',
  'Ничего'
];

// Параметры рулетки
// Параметры функции плавного вращения ( http://cubic-bezier.com/#.42,0,.58,1 )
//var easing = 'cubic-bezier(.28,-0.21,0,.46)';
var easing = 'cubic-bezier(.27,-0.21,.078,1.02)';   // ок = .28,-0.21,.07,1.01
var center = {'x':300, 'y':300};                    // центр рулетки
var diameter = 280;                                 // диаметр рулетки

var rotateAngle = 0;                          // число оборотов (в градусах)
var rotateArcs = 0;

var fontWidth;
var durationMin = 0;                                    // время вращения (мс)
var durationMax = 0; 
var rotateMin = 0;
var rotateMax = 0;
var roulette;


// Вычисляем центр окна и перерисовываем
function refreshUi(){ 
	rotateAngle = 0;                          // число оборотов (в градусах)
	rotateArcs = 0;
	fontWidth = document.getElementById("pwidth").value;
	durationMin = parseInt(document.getElementById("pspintimemin").value) * 1000;
	durationMax = parseInt(document.getElementById("pspintimemax").value) * 1000;
	rotateMin = parseInt(document.getElementById("pspinmin").value);
	rotateMax = parseInt(document.getElementById("pspinmax").value);
	fontWidth = parseInt(document.getElementById("pwidth").value);
	
    var blockWidth  = document.getElementById("holder").clientWidth;
    var blockHeight = document.getElementById("holder").clientHeight;
    var squaredSize = Math.min(blockWidth, blockHeight);
    if (squaredSize == blockWidth) {
        XShift = 0;
        YShift = (blockHeight-squaredSize)/2;
    }
    else {
        XShift = (blockWidth-squaredSize)/2;
        YShift = 0;
    }
    squaredSize = squaredSize/2;
    center = {'x':squaredSize+XShift, 'y':squaredSize+YShift};
    diameter = squaredSize - 25;
}

//
function init(){
    paper = Raphael("holder");
    //roulette = paper.set(arcs);
    roulette = null;
    drawRouletteShadow();   // Тень под рулеткой
    drawArcs();             // Секции и текст
    drawPointer();          // Стрелка
}   

// Тень под рулеткой
function drawRouletteShadow(){
    var c = paper.circle(center.x, center.y, diameter);
    c.attr("fill", "black");
    c.glow({width:15, offsetx:2.5, offsety:2.5});
}

// Секции и текст
function drawArcs(){
    var startAngle, endAngle = 0;
    var x1, x2, y1, y2 = 0;
    for( var i=0; i < multiplyList(pieText).length; i++ ){
        startAngle = endAngle;
        endAngle = startAngle + 360/multiplyList(pieText).length;

        x1 = parseInt(center.x + diameter * Math.cos(Math.PI * startAngle/180));
        y1 = parseInt(center.y + diameter * Math.sin(Math.PI * startAngle/180));

        x2 = parseInt(center.x + diameter * Math.cos(Math.PI * endAngle/180));
        y2 = parseInt(center.y + diameter * Math.sin(Math.PI * endAngle/180));                

        var d = "M" + center.x + "," + center.y + "L" + x1 + "," + y1 + " A" + diameter + "," + diameter + " 0 0,1 " + x2 + "," + y2 + " z"; //1 means clockwise
        arc = paper.path(d);
        arc.attr("fill", getColor(i, multiplyList(pieText).length));
        arcs.push(arc);
        
        var $text = paper.text(center.x + diameter/2 + 50, center.y, multiplyList(pieText)[i]);
        $text.attr({
			fill: "#fff",
			"font-size": fontWidth + "px",
			"font-familystring": "sans-serif"
		});
		
		$text.node.setAttribute("class", "arctext");
        $text.transform('r' + (startAngle + endAngle)/2 + ' ' + center.x + ' ' + center.y);
		
        texts.push($text);
    }
}

// Стрелка
function drawPointer(){
    var pcmd = "M" + center.x + "," + center.y + " m" + diameter + ",0" + " m-20,0 l35,-5 l0,10 z"; 
    var p = paper.path(pcmd); 
    p.attr("fill", "#F0F0F0");
    p.glow({width:5, offsetx:2.5, offsety:2.5});
}

// Сброс рулетки
function reset(){
    texts = [];
    arcs = [];
    paper.remove();
    /*
    texts.forEach(function(text){
        text.remove();
    });*/
}

// ПУСК!
function randomSpin(){
    // Пусть крутиться от 8 до 11 оборотов
    // rotateAngle = 360 * (8 + getRandom(1)) + getRandom(360); 
	var a1 = getRandom(rotateMax);
	var a2 = getRandom(360);
	
	rotateAngle = 360 * (rotateMin + getRandom(rotateMax)) + getRandom(360); 
	rotateArcs = rotateArcs + rotateAngle;
	
    // Пусть крутиться от 7 до 9 секунд
    // duration = 7000 + getRandom(2000);
	duration = durationMin + getRandom(durationMax); // время вращения (мс)

	
    //winnerId = getRandom(multiplyList(pieText).length - 1); // от 0
    //spinToId(winnerId);
	spinToId();
}

function returnSpin(){
    
}

// Магия
function getQueryStringByName(name){
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// После загрузки контента, читаем варианты и вычисляем центр окна
document.body.onload = function(){
	var query = getQueryStringByName('items');
	if (query !== ""){
		pieText = query.split(',');
	}
	document.getElementById('items').value = pieText.join("\n");
    document.getElementById('bookmarklink').href = "./index.html?items=" + pieText.join(',');
    refreshUi();
    init();

    document.getElementById('genBtn').onclick = function(){
        // reset();
        // init();
        randomSpin();
        // refreshUi();
    };

    document.getElementById('refreshBtn').onclick = function(){
		pieText = parseList();
        reset();
        init();
		refreshUi();
    };
};

// При ресайзе окна, перерисовываем рулетку
window.onresize = function(event) {
    refreshUi();
    reset();
    init();
};

// -------------------------------------------------------------------- Остальное --------------------------------------------------------------------

function getRandom(max){
  var min = 0;
  return Math.floor(mt.random() * (max - min + 1)) + min; // от 0 до max - 1
}

function multiplyList(rawList){
  var list = rawList;
  // Убираем пустышки
  while (list.indexOf("") > 0){
    list.splice(list.indexOf(""),1);
  }
  // Добавляем дубли, если элементов меньше 8
  while (list.length < 8){
    list = list.concat(list);
  }
  return list ;
}

function getAngleFromID(arcId, arcsCount){ // Нужен ли arcsCount?
  var arcAngle = 360/arcsCount;
  return (arcAngle * arcId + arcAngle/2);
}

function getRandomDriftDeg(multipliedItems){
  var arcAngle = 360/multipliedItems.length;
  return Math.floor(0.9* (Math.random() * arcAngle - arcAngle/2)) ;
}


function spinToId(){
    texts.forEach(function(text){
        var fromAngle = parseInt(text.transform()[0][1]);
        var toAngle = fromAngle + rotateAngle;
		
        text.stop().animate({transform: "r" + toAngle + " " + center.x + " " + center.y}, duration, easing); 
    });
    
	if (roulette == null) {
		roulette = paper.set(arcs);
	}
    roulette.stop().animate({transform: "r" + rotateArcs + " " + center.x + " " + center.y}, duration, easing);
}

function getColor(i, total){
  var h = i/(total);
  return "hsl(" + h + ", .65, 0.5)"; // rainbow
}

function parseList(){
    var list = document.getElementById('items').value.split("\n");
    return list;
}

window.onkeydown = function(event){
    if(event.keyCode === 32) {
        event.preventDefault();
        document.querySelector('genBtn').click(); //This will trigger a click on the first <a> element.
    }
};
