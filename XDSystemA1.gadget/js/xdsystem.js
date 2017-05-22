var cpuCount = 1;
var sysCCHs = "";
var sysCCTs = "";
var sysMBCnt = "";

var cpuHis = new Array();
var cpuDivisor = 1;
var memDivisor = 1;

var stdColor = "aaaaab";
var alertColor = "d7363c";
var alertValue = 95;

var starTime = 0;
var styleTime = 24;
var memLastAval = 100000000;

function loadGadget(){
 setGadget();
 runGadget();
}

function setGadget(){

 cpuCount = System.Machine.CPUs.count;
 //cpuCount = 1;
 
 resetUptime();
 
 switch (cpuCount) {
  case 1  : sysCCH = 143;
			sysCCTs = new Array(64,64); 
			cpuDivisor = 68 / 100;
			sysMBCnt = 20;
			memDivisor = sysMBCnt / 100;
			smuPos = 127;
			break;
  case 2  : sysCCH = 197;
			sysCCTs = new Array(47,118); 
			cpuDivisor = 51 / 100;
			sysMBCnt = 38;
			memDivisor = sysMBCnt / 100;
			smuPos = 181;
			break;
  case 4  : sysCCH = 299;
			sysCCTs = new Array(37,98,159,220); 
			cpuDivisor = 41 / 100;
			sysMBCnt = 72;
			memDivisor = sysMBCnt / 100;
			smuPos = 283;
			break;
  case 8  : sysCCH = 479;
			sysCCTs = new Array(29,82,135,188,241,294,347,400); 
			cpuDivisor = 33 / 100;
			sysMBCnt = 132;
			memDivisor = sysMBCnt / 100;
			smuPos = 463;
			break;
  case 12 : sysCCH = 689;
			sysCCTs = new Array(29,82,135,188,241,294,347,400,453,506,559,612); 
			cpuDivisor = 33 / 100;
			sysMBCnt = 203;
			memDivisor = sysMBCnt / 100;
			smuPos = 676;
			break;
  case 16 : sysCCH = 901;
			sysCCTs = new Array(29,82,135,188,241,294,347,400,453,506,559,612,665,718,771,824); 
			cpuDivisor = 33 / 100;
			sysMBCnt = 274;
			memDivisor = sysMBCnt / 100;
			smuPos = 888;
			break;
  default : sysCCH = 143;
			sysCCTs = new Array(64,64); 
			cpuDivisor = 68 / 100;
			sysMBCnt = 20;
			memDivisor = sysMBCnt / 100;
			smuPos = 127;
			break;
 }
 
 sysBody.style.height = sysCCH + "px";
 sysBg.src = "skins/Clear_Line/bg_clockcpu" + cpuCount + ".png";
 sysBg.style.height = sysCCH + "px";
 
 for (var cpu = 0; cpu < cpuCount; cpu++){
  cpuHis[cpu] = new Array(1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1);
  var obj = document.getElementById("cpu" + cpu);
  var bars = "";
  obj.style.top = sysCCTs[cpu] + "px";
  obj.style.display = "block";
  for (var bar = 1; bar <= 30; bar++){
   bars += "<div id=\"pbcpu" + cpu + "_" + bar + "\" class=\"pbar\" style=\"left:" + (3*bar) + "px;\"></div>";
  }
  bars += "<div id=\"cpuPercent" + cpu + "\" class=\"percent\">0%</div>";
  obj.innerHTML = bars;
 }
 
 var mems = "";
 for (var m = sysMBCnt; m>=1; m--){
  mems += "<div id=\"mem" + m + "\" class=\"memory\"></div>";
 }
 document.getElementById("sysMem").innerHTML = mems;
 document.getElementById("sysMemUsed").style.top = smuPos + "px";
}

function runGadget(){
 makeSysTime();
 runProgress();
 runMem();
}

function makeSysTime(){
 var date = new Date();
 with (date){
  var hours = getHours();
  var minutes = getMinutes();
  var seconds = getSeconds();
  var upTime = getTime() - starTime;
 }
 if(styleTime == 12 && hours > 12) hours = hours - 12;
 sysTime.innerText = timeFormat(hours) + ":" + timeFormat(minutes) + ":" + timeFormat(seconds);
 sysUpTime.innerText = (upTime >= 1000) ? upFormat(upTime/1000) : "000:00:00:00";
 gadgetTimeOut = setTimeout("makeSysTime()", 1000);
}

function timeFormat(num){
 if (num == null || num == 0) return "00";
 else if (num != null && num < 10) return "0" + num;
 else return num;
}

function upFormat(sec){
 
 var days = 0;
 var hours = 0;
 var minutes = 0;
 
 if(sec >= 86400){
  days = Math.floor(sec / 86400);
  sec = sec - (days * 86400);
 }
 if(sec >= 3600){
  hours = Math.floor(sec / 3600);
  sec = sec - (hours * 3600);
 }
 if(sec >= 60){
  minutes = Math.floor(sec / 60);
  sec = sec - (minutes * 60);
 }
 sec = Math.round(sec);
 
 return ((days<10)?("00"):((days<100)?("0"):(""))) + days + ":" + ((hours<10)?("0"):("")) + ( hours>=24 ? "00" : hours ) + ":" + ((minutes<10)?("0"):("")) + ( minutes>=60 ? "00" : minutes)  + ":" + ((sec<10)?("0"):("")) + ( sec>=60 ? "00" : sec );
 
}


function runProgress(){
 for (var cpu = 0; cpu < cpuCount; cpu++){
  var cpuCurr = Math.round(System.Machine.CPUs.item(cpu).usagePercentage);
  //if(cpu<=1) var cpuCurr = Math.round(System.Machine.CPUs.item(cpu).usagePercentage);
  if(cpuCurr <= 1) cpuCurr = 1;
  else if(cpuCurr > 100) cpuCurr = 100;
  var objPerc = document.getElementById("cpuPercent" + cpu);
  objPerc.innerText = cpuCurr + "%";
  objPerc.style.color = "#" + (cpuCurr >= alertValue ? alertColor : stdColor);
  setBars(cpu,cpuCurr);
 }
 gadgetTimeOut = setTimeout("runProgress()", 1000); // Refresh rate (1000)
}

function setBars(cpu,cpuCurr){
 var cpuBefore = "";
 var cpuNext = cpuCurr;
 for(var bar=1;bar<=30;bar++){
  cpuBefore = cpuNext;
  cpuNext = cpuHis[cpu][bar];
  cpuHis[cpu][bar] = cpuBefore;
  var obj = document.getElementById("pbcpu" + cpu + "_" + bar); // run left with (31-bar)
  var bHeight = Math.round(cpuBefore*cpuDivisor);
  obj.style.height = ((bHeight<=1)?(1):(bHeight)) + "px";
  obj.style.backgroundColor = "#" + ((cpuBefore >= alertValue)?(alertColor):(stdColor));
 }
}


function runMem(){
 
 var memTotal = System.Machine.totalMemory;
 var memAval = System.Machine.availableMemory;
 
 if(memAval != memLastAval){
  memLastAval = memAval;
  var memUsed = 0;
  var memPerc = 0;
 
  if((memTotal > 0) && (memTotal > memAval)){
   memUsed = memTotal - memAval;
   memPerc = Math.round(Math.min(100 - (memAval / memTotal * 100), 100));
  }
  sysMemFree.innerText = memAval;
  sysMemUsed.innerText = memUsed;
 
  for(m=1;m<=sysMBCnt;m++){
   var obj = document.getElementById("mem" + m);
   if((memPerc * memDivisor) >= m) obj.style.backgroundColor = "#" + alertColor;
   else obj.style.backgroundColor = "#" + stdColor;
  }
 }
 
 gadgetTimeOut = setTimeout("runMem()", 1000);
}

function resetUptime(){
 var date = new Date();
 starTime = date.getTime();
}

function seTimeStyle(){
 if(styleTime == 24) styleTime = 12;
 else styleTime = 24;
}