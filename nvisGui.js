// pushbutton click callback functions

function myTest1() { 
  console.log("myTest1()"); 
  //antennaTest2(4, 2, 44);
}

function myTest2() { 
  console.log("myTest2()"); 
  //antennaTest2(7, 2, 66);
}
  
function selUpdate(nvis) {    // selection has changed
  var sel, inx;
  sel=document.getElementById("selAct").value; 
  inx = parseInt(sel);
  if(inx < 5)   nvis.viewMode=inx; 
  sel=document.getElementById("state").value; 
  nvis.lat=parseFloat(sel);
  sel=document.getElementById("month").value;   
  nvis.month=parseInt(sel);
  sel=document.getElementById("year").value;  
  nvis.year=parseInt(sel);
  sel=document.getElementById("hiF2").value; 
  nvis.hF2=parseFloat(sel);  
  sel=document.getElementById("mast").value; 
  nvis.mast=parseFloat(sel);
  sel=document.getElementById("antenna").value; 
  nvis.antenna=parseInt(sel);
  sel=document.getElementById("mast2").value; 
  nvis.mast2=parseFloat(sel);
  sel=document.getElementById("antenna2").value; 
  nvis.antenna2=parseInt(sel);
  sel=document.getElementById("power").value; 
  nvis.power=parseInt(sel);
  sel=document.getElementById("elmin").value; 
  nvis.elevMin=parseInt(sel);
  sel=document.getElementById("dist").value;  
  nvis.distance=parseFloat(sel);
  sel=document.getElementById("loc").value;   
  nvis.location=parseInt(sel);
  sel=document.getElementById("storm").value; 
  nvis.storm=parseInt(sel);
  sel=document.getElementById("grx").value; 
  nvis.grxMode=parseInt(sel);
  console.log("selChange() ViewMode="+nvis.viewMode+",grxMode="+nvis.grxMode); 
  //nvis.gain=3.0;    
  //nvis.eirp = nvis.power + (nvis.gain*2);  
   
  nvisPredict(nvis);
  plotDraw(nvis);
}

function plotDraw(nvis) {
  if(nvis.viewMode==1)  plotTable(nvis);
  if(nvis.viewMode==2)  plotSNR(nvis);
  if(nvis.viewMode==3)  plotSkip(nvis);
  if(nvis.viewMode==4)  plotSLM(nvis);
}

function canvasDraw(nvis) {    // drawing on canvas
  console.log("canvasDraw(1)"); 
  //nvisCheck(nvis);
  var canvas = document.getElementById("myCanvas");  // find canvas element
  var ctx = canvas.getContext("2d");      // get drawing object
  ctx.clearRect(0, 0, 900, 1100);
  ctx.fillStyle = "#FF0000";      // set fill style to red color
  ctx.font = "20px Arial";        // draw text
  var y=0, s;
  s=showfoF2(nvis); 
  ctx.fillStyle= "blue"; ctx.fillText(s,1, y+=20);
  s=showMuf(nvis);  
  ctx.fillText(s,1, y+=20);
  if(nvis.viewMode==1)  canvasTable(nvis);
  if(nvis.viewMode==2)  canvasPlot(nvis);
  if(nvis.viewMode==3)  canvasSkip(nvis);
  if(nvis.viewMode==4)  canvasSlm(nvis);
}

function plotTable(nvis) {
	console.log("Plotting table...")
	console.log(nvis)
	let table = document.getElementById("plotTable")
	table.innerHTML = ""
	let row = table.insertRow(0)
	row.style.fontWeight = 600
  let rows = ["f", "Eirp", "Grx", "Fspl", "Drap", "Lt", "N", "SnrM", "SnrD", "SnrN"]
  for (let i=0; i<rows.length;i++) {
    row.insertCell(i).innerHTML = rows[i]
  }

	for (let i=0; i<nvis.Eii.length; i++) {
    row = table.insertRow(i+1);
		let f = 1.5 + i*0.5; // Indexing 1 MHz 
    //if(i>8) { f = 8 + (i-11)*1; } // Don't do this
		if (i>8 && i%2==0 ) {continue;} // Do this
		row.insertCell(0).innerHTML = f  // f
		if(f > nvis.muf3) { row.classList.add("warn") }; // Sets whole row
    if(f > nvis.muf3 * 1.18) { row.classList.add("alert") };  // Sets whole row
		row.insertCell(1).innerHTML = Math.round(nvis.Eii[i]) // EIRP
		row.insertCell(2).innerHTML = Math.round(nvis.Lii[i]) // FSLP
		row.insertCell(3).innerHTML = Math.round(nvis.Ldd[i]) // DRAP
		row.insertCell(4).innerHTML = Math.round(nvis.Ldd[i] + nvis.Lii[i]) // Total Loss (Lt)
		row.insertCell(5).innerHTML = Math.round(nvis.Nnn[i]) // N
		row.insertCell(6).innerHTML = Math.round(nvis.snrM[i]) // SNRM
		row.insertCell(7).innerHTML = Math.round(nvis.snrD[i]) // SnrD
		if(f > nvis.muf3*1.01) { row.cells[7].classList.add("alert") };
		row.insertCell(8).innerHTML = Math.round(nvis.snrN[i]) // SnrN
		if(f > nvis.muf1*1.18) { row.cells[8].classList.add("alert") };
  }  
	document.getElementById("tooltip").innerHTML = `Eirp is transmitted signal power at origin in dBm units.
	  <br>Fspl is signal loss over signal path in dB units (daily maximum).
	  <br>Drap is signal loss in D layer in dB (daily maximum).
	  <br>Lt is total signal loss(Fspl+Drap) in dB (daily maximum).
	  <br>N is noise power at receive location in dBm units, for BW=3kHz.
	  <br>Snr is ratio of signal S and noise N in dB units.
	  <br>SnrM/D/N are Snr levels for midday/day/night.
	  <br>Signal must overcome noise, in order to be received.
	  <br>Minimum SNR is 10 dB for SSB voice, and 6 dB for data.`
}

function canvasTable(nvis) {    // drawing on canvas
  console.log("canvasTable(1)"); 
  //nvisCheck(nvis);
  var canvas = document.getElementById("myCanvas");  // find canvas element
  var ctx = canvas.getContext("2d");      // get drawing object
  ctx.clearRect(0, 80, 900, 1100);
  ctx.fillStyle = "#FF0000";      // set fill style to red color
  ctx.font = "25px Arial";        // draw text
  var i, x=0, y=43, s, li, ld, n;
  for(i=0; i<27; i++) {  // Draw horizontal grid lines
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(900, y);
    ctx.strokeStyle="yellow"; 
    ctx.stroke();
    y+=30;
  } 
  x=60; y=43;
  for(i=0; i<8; i++) { // Draw vertical grid lines
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, 820);
    ctx.strokeStyle="yellow"; 
    ctx.stroke();
    x+=96;
    if(i==5)  x+=20;
  }
  y=19;
  s= " f        Eirp       Fspl       Drap      Lt           N            SnrM       SnrD      SnrN"; 
  ctx.fillText(s, 1, y+=50);
  ctx.fillStyle= "black";
  nvis.freq=1.5;
  var inx=0;
  var mf=nvis.muf1*1.18;
  for ( i=0; i<25; i++) {
    nvisCheck(nvis);
    y += 30;    
    ctx.fillStyle="black";
    mf = nvis.muf3 * 1.18;
    if(nvis.freq > nvis.muf3) ctx.fillStyle="orange";
    if(nvis.freq > mf) ctx.fillStyle="red";
    s = nvis.freq.toFixed(1);                     // Frequency field
    if(nvis.freq > 9.5) s=Math.round(nvis.freq);
    ctx.fillText(s, 1, y);    
    antennaGain(nvis);          // Eirp field
    li =nvis.Eii[inx]; 
    s=Math.round(li);     
    ctx.fillText(s, 75, y);
    li= nvis.Lii[inx];          // FSPL loss
    s=Math.round(li);     
    ctx.fillText(s, 175, y);
    ld= nvis.Ldd[inx];          // DRAP loss
    s=Math.round(ld);      
    ctx.fillText(s, 280, y);
    s=Math.round(li+ld);        // Total loss (FSPL+DRAP)
    ctx.fillText(s, 370, y);
    n = calcNoise(nvis);        // Noise at Rx site, per ITU recommendation
    s=Math.round(n);     
    ctx.fillText(s, 460, y);
    s=Math.round(nvis.snrM[inx]); // MidDay Snr
    ctx.fillText(s, 570, y);
    mf = nvis.muf3*1.01;        // Day SNR
    if(nvis.freq > mf) ctx.fillStyle="red";
    s=Math.round(nvis.snrD[inx]); 
    ctx.fillText(s, 680, y);  
    mf = nvis.muf1*1.18;        // Night SNR
    if(nvis.freq > mf) ctx.fillStyle="red";
    s=Math.round(nvis.snrN[inx]); 
    ctx.fillText(s, 790, y); 
    nvis.freq+=0.5; inx++;              // Indexing 0.5 MHz
    if(i>8) { nvis.freq+=0.5; inx++;}   // Indexing 1 MHz
    if(i>14) { nvis.freq+=1.0; inx+=2;} // Indexing 2 MHz
  }  
  y=850;
  ctx.fillStyle="blue";      // Add text bellow y=820
  ctx.fillText("Eirp is transmitted signal power at origin in dBm units.", 1, y); y+=30;
  ctx.fillText("Fspl is signal loss over signal path in dB units (daily maximum).", 1, y); y+=30;
  ctx.fillText("Drap is signal loss in D layer in dB (daily maximum).", 1, y); y+=30;
  ctx.fillText("Lt is total signal loss(Fspl+Drap) in dB (daily maximum).", 1, y); y+=30;
  ctx.fillText("N is noise power at receive location in dBm units, for BW=3kHz.", 1, y); y+=30;
  ctx.fillText("Snr is ratio of signal S and noise N in dB units.", 1, y); y+=30;
  ctx.fillText("SnrM/D/N are Snr levels for midday/day/night.", 1, y); y+=30;
  ctx.fillText("Signal must overcome noise, in order to be received.", 1, y); y+=30;
  ctx.fillText("Minimum SNR is 10 dB for SSB voice, and 6 dB for data.", 1, y); y+=30;
}

function plotSNR(nvis) {
	console.log("Plotting SNR...")
	var farr = [0]
	var snrD = [0]
	var snrM = [0]
	var snrN = [0]
	for (var i=0; i<nvis.Eii.length; i++) {
		var f = 1.5 + i*0.5; // Indexing 1 MHz 
		farr.push(f);
		// Cap at 0
		if (nvis.snrD[i] < 0) { snrD.push(0) } else { snrD.push(nvis.snrD[i]) }
		if (nvis.snrM[i] < 0) { snrM.push(0) } else { snrM.push(nvis.snrM[i]) }
		if (nvis.snrN[i] < 0) { snrN.push(0) } else { snrN.push(nvis.snrN[i]) }
  }  

	console.log("HERE WE GO")
	console.log(f)
	var snrDSeries = {
		x: farr, 
		y: snrD, 
		textfont: {family: 'Times New Roman'},
		textposition: 'bottom center',
		marker: {size: 12},
		mode: 'lines',
		type: 'scatter',
		name: "Day",
 		line: {color: '#43228f',  width: 2}
	};

	var snrMSeries = {
		x: farr, 
		y: snrM, 
		textfont: {family: 'Times New Roman'},
		textposition: 'bottom center',
		marker: {size: 12},
		mode: 'lines',
		type: 'scatter',
		name: "Midday",
	};

	var snrNSeries = {
		x: farr, 
		y: snrN, 
		textfont: {family: 'Times New Roman'},
		textposition: 'bottom center',
		marker: {size: 12},
		mode: 'lines',
		type: 'scatter',
		name: "Night",
	};

	// Generic data for table
	var layout = {
    autosize: true,
		xaxis: {
			range: [ 0, 26 ],
			title: { text: "MHz" }
		},
		yaxis: {
			range: [0, 60],
			title: { text: "%" }
		},
		legend: {
			y: 0.5,
			yref: 'paper',
			font: {
				family: 'Arial, sans-serif',
				size: 20,
				color: 'black',
			}
		},
		title:'Signal to Noise Ratio 10 dB/div'
	};
	var config = {
		displayModeBar: false,
		responsive: true
	}
	var data = [ snrDSeries, snrMSeries, snrNSeries ];
	Plotly.newPlot('SNRPlot', data, layout,  config);
	document.getElementById("tooltip").innerHTML = `Eirp is transmitted signal power at origin in dBm units.
	  <br>Fspl is signal loss over signal path in dB units (daily maximum).
	  <br>Drap is signal loss in D layer in dB (daily maximum).
	  <br>Lt is total signal loss(Fspl+Drap) in dB (daily maximum).
	  <br>N is noise power at receive location in dBm units, for BW=3kHz.
	  <br>Snr is ratio of signal S and noise N in dB units.
	  <br>SnrM/D/N are Snr levels for midday/day/night.
	  <br>Signal must overcome noise, in order to be received.
	  <br>Minimum SNR is 10 dB for SSB voice, and 6 dB for data.`
}

function canvasPlot(nvis) {    // drawing on canvas
  console.log("canvasPlot(1)"); 
  nvisCheck(nvis);
  var canvas = document.getElementById("myCanvas");  // find canvas element
  var ctx = canvas.getContext("2d");      // get drawing object
  ctx.clearRect(0, 45, 00, 1100);
  ctx.fillStyle = "#FF0000";      // set fill style to red color
  ctx.font = "20px Arial";        // draw text
  var i,s;
  s="SNR 10 dB/div";  
  ctx.fillText(s, 750, 65);

  // Plot SNR data
  // Canvas x=0 to 900 => frequency =0 to 30  => x= 30 * frequency
  // Canvas y=45 to 525 => SNR 0 to 60  => x = 525 - SNR * 8
  var sg, x, y;
  //ctx.clearRect(1, 45, 890, 1000);
  ctx.lineWidth=1;
  ctx.beginPath();
  ctx.rect(1, 45, 900, 510);
  ctx.strokeStyle="black"; ctx.stroke();

  for(i=0; i<15; i++) { // Draw 2 MHz lines
    ctx.beginPath();
    ctx.moveTo(60*i, 45);
    ctx.lineTo(60*i, 525);
    ctx.strokeStyle="yellow"; ctx.stroke();
  } 
  ctx.fillStyle="black"; // Number 2 MHz lines
  for(i=1; i<15; i++) { 
    s = 2*i;
    if(i==14) s="MHz";
    ctx.fillText(s, 60*i-10, 550);
  }

  for(i=0; i<7; i++) { // Draw 10 dB SNR lines
    ctx.beginPath();
    ctx.moveTo(1, 45+80*i);
    ctx.lineTo(898, 45+80*i);
    ctx.strokeStyle="yellow"; ctx.stroke();
  }
  ctx.fillStyle="black"; // Number 10 dB SNR lines
  for(i=1; i<6; i++) { 
    s = Math.round (10*i);
    ctx.fillText(s, 5, 535-80*i);
  }

  ctx.lineWidth=2;
  ctx.beginPath();     // Plot SNR midday data 
  ctx.moveTo(30,525);   //lineTo(30,698);
  x=45; y=525;
  for ( i=0; i<58; i++) {   
    sg = nvis.snrM[i];
    if(sg<0.0)  sg=0.0;
    if(sg>60)  sg=50;
    y=Math.round(525 - 8*sg);
    ctx.lineTo(x,y);  
    x+=15;  // f += 0.5
  }
  ctx.strokeStyle = "red"; ctx.stroke();
  ctx.fillStyle="red"; ctx.fillText("Midday", 5, 65); 

  ctx.beginPath();      // Plot SNR day data
  ctx.moveTo(30, 525);
  x=45; y=700; 
  for ( i=0; i<58; i++) {    
    sg = nvis.snrD[i];
    if(sg<0.0)  sg=0.0;
    if(sg>60)  sg=60;
    y=Math.round(525 - 8*sg);  
    ctx.lineTo(x,y);  
    x+=15;
  }
  ctx.strokeStyle = "green"; ctx.stroke();
  ctx.fillStyle="green"; ctx.fillText("Day", 120, 65); 

  ctx.beginPath();    // Plot SNR night data
  ctx.moveTo(30, 525);
  x=45; y=700; 
  for ( i=0; i<58; i++) {     
    sg = nvis.snrN[i];
    if(sg<0.0)  sg=0.0;
    if(sg>60)  sg=60;
    y=Math.round(525 - 8*sg);  
    ctx.lineTo(x,y);  
    x+=15; 
  }
  ctx.strokeStyle="blue"; ctx.stroke();
  ctx.fillStyle="blue"; ctx.fillText("Night", 200, 65); 
  // Add text bellow y=550
  ctx.fillStyle="blue";      y=580;
  ctx.fillText("Eirp is transmitted signal power at origin in dBm units.", 1, y); y+=30;
  ctx.fillText("Fspl is signal loss over signal path in dB units (daily maximum).", 1, y); y+=30;
  ctx.fillText("Drap is signal loss in D layer in dB (daily maximum).", 1, y); y+=30;
  ctx.fillText("Lt is total signal loss(Fspl+Drap) in dB (daily maximum).", 1, y); y+=30;
  ctx.fillText("N is noise power at receive location in dBm units, for BW=3kHz.", 1, y); y+=30;
  ctx.fillText("Snr is ratio of signal S and noise N in dB units.", 1, y); y+=30;
  ctx.fillText("SnrM/D/N are Snr levels for midday/day/night.", 1, y); y+=30;
  ctx.fillText("Signal must overcome noise, in order to be received.", 1, y); y+=30;
  ctx.fillText("Minimum SNR is 10 dB for SSB voice, and 6 dB for data.", 1, y); y+=30;
}

function plotSkip(nvis) {
	console.log("Plotting Skip...")
	var skipX = []
	var skipD = []
	var skipM = []
	var skipN = []

  // SkipM Calculation
  // Note: I'm not sure how 30 was originally chosen for x. Set to 1 for no particular reason.
  var x=1; var y=700; var fr=1.5; var started = false;
  for (var i=0; i<500; i++) {   // loop HF frequencies
    var skdi=0.0; var skslm=1.0;   // assume no skip zone
    var frrat = fr/nvis.fc3;    // ratio of frequency and critical foF2
    if(frrat > 1.05) {      // if over => we have skip
      for (var el=0; el<90; el++) { // loop over elevation angles
        skslm = nvis.skipSlm[el];
        if(skslm>frrat) skdi=nvis.skipDist[el];
      }
    }
    // Finding graph size limit
    if (skdi > 0) {
      started = true;
      console.log("Started is true")
    }
    if (started && skdi <= 0) {
      console.log("LIMIT HIT")
      var limit = i+20;
      for (var j=0;j<20;j++) {skipM.push(0);x+=5/30;skipX.push(x)}
      break;
    }

    if(skdi<0.0)  skdi=0.0;
    if(skdi>5000.0)  skdi=5000.0;
    // y=Math.round(525 - skdi*0.096);
    skipM.push(skdi)
    skipX.push(x)
    // No idea why 5/30
    x += 5/30;
    fr += 0.166667;
  }

  // SkipD Calculation
  x=1; y=700; fr=1.5;
  for ( i=0; i<limit; i++) {   // loop HF frequencies
    skdi=0.0; skslm=1.0;   // assume no skip zone
    frrat = fr/nvis.fc2;    // ratio of frequency and critical foF2
    if(frrat > 1.01) {      // if over => we have skip
      for (el=0; el<90; el++) { // loop over elevation angles
        skslm = nvis.skipSlm[el];
        if(skslm>frrat) skdi=nvis.skipDist[el];
      }
    }
    if(skdi<0.0)  skdi=0.0;
    if(skdi>5000.0)  skdi=5000.0;
    // y=Math.round(525 - skdi * 0.096);   // 5000 km into 480 pixels
    skipD.push(skdi)
    x+=5/30;
    fr+= 0.16666667;
  }

  // SkipN Calculation
  x=1; y=700; fr=1.5;
  for ( i=0; i<limit; i++) {   // loop HF frequencies
    skdi=0.0; skslm=1.0;   // assume no skip zone
    frrat = fr/nvis.fc1;    // ratio of frequency and critical foF2
    if(frrat > 1.05) {      // if over => we have skip
      for (el=0; el<90; el++) { // loop over elevation angles
        skslm = nvis.skipSlm[el];
        if(skslm>frrat) skdi=nvis.skipDist[el];
      }
    }
    if(skdi<0.0)  skdi=0.0;
    if(skdi>5000.0)  skdi=5000.0;
    skipN.push(skdi)
    x+=5/30;
    fr+= 0.1666667;
  }

  skipX = skipX.slice(0, limit)
  skipD = skipD.slice(0, limit)
  skipM = skipM.slice(0, limit)
  skipN = skipN.slice(0, limit)


	var skipDSeries = {
		x: skipX,
		y: skipD,
		textfont: {family: 'Times New Roman'},
		textposition: 'bottom center',
		marker: {size: 12},
		mode: 'lines',
		type: 'scatter',
		name: "Day",
 		line: {color: '#43228f',  width: 2}
	};

	var skipMSeries = {
		x: skipX, 
		y: skipM, 
		textfont: {family: 'Times New Roman'},
		textposition: 'bottom center',
		marker: {size: 12},
		mode: 'lines',
		type: 'scatter',
		name: "Midday",
	};

	var skipNSeries = {
		x: skipX,
		y: skipN,
		textfont: {family: 'Times New Roman'},
		textposition: 'bottom center',
		marker: {size: 12},
		mode: 'lines',
		type: 'scatter',
		name: "Night",
	};
	//
	// Generic data for table
	var layout = {
    autosize: true,
		xaxis: {
			// range: [ 0, 26 ],
			title: { text: "MHz" }
		},
		yaxis: {
			// range: [0, 60],
			title: { text: "km" }
		},
		legend: {
			y: 0.5,
			yref: 'paper',
			font: {
				family: 'Arial, sans-serif',
				size: 20,
				color: 'black',
			}
		},
		title:'Skip Zone 500km/div'
	};
	var config = {
		displayModeBar: false,
		responsive: true
	}
	var data = [skipDSeries, skipMSeries, skipNSeries];
	Plotly.newPlot('SNRPlot', data, layout,  config);
	document.getElementById("tooltip").innerHTML = `Graph shows skip zone for day, midday and night.<br>Skip zone is zone around transmiter without signal coverage.
<br>Skip zone is big problem for NVIS use, but OK for SkyWave.</p>
<p style="color: red;">If we use frequency below critical foF2, there will be no skip zone.
<br>Using frequency over critical creates skip zone with no coverage.
<br>Higher the frequency, larger the skip zone (up to 5,000 km).</p>
Frequencies above 10 MHz are used for long distance (1,000 to 30,000 km).
<br>Low frequencies are used for 0 to 500 km.
<br>Good NVIS freqs are 2-4 MHz during night, and 4-8 MHz during day.`
}

function canvasSkip(nvis) {    // drawing skip on canvas
  console.log("canvasSkip(1)"); 
  //nvisCheck(nvis);
  var canvas = document.getElementById("myCanvas");  // find canvas element
  var ctx = canvas.getContext("2d");      // get drawing object
  ctx.clearRect(0, 45, 900, 600);
  ctx.fillStyle = "#FF0000";      // set fill style to red color
  ctx.font = "20px Arial";        // draw text
  var i, s;
  s="Skip Zone  500 km/div";  
  ctx.fillText(s,700, 65);

  // Plot skip data using slm(el) and dist(el)
  // Canvas x=0 to 900 => frequency =0 to 30  => x= 30 * frequency
  // Canvas y=100 to 700 => skip 0 to 5000 km  => x = 700 - skip* 0.0833333
  var fr, frrat, el, el2, v1, v2, v3;
  var skdi=0, skslm=1.0, sg, x, y;
  //ctx.clearRect(1, 100, 890, 1000);
  ctx.lineWidth=1;
  ctx.beginPath();
  ctx.rect(1, 45, 900, 525);
  ctx.strokeStyle="black"; ctx.stroke();

  for(i=0; i<15; i++) { // Draw 2 MHz lines
    ctx.beginPath();
    ctx.moveTo(60*i, 45);
    ctx.lineTo(60*i, 525);
    ctx.strokeStyle="yellow"; ctx.stroke();
  } 
  ctx.fillStyle="black"; // Number 2 MHz lines
  for(i=1; i<15; i++) { 
    s = 2*i;
    if(i==14) s="MHz";
    ctx.fillText(s, 60*i-10, 545);
  }

  for(i=0; i<11; i++) { // Draw 500 km lines at spacing 48
    ctx.beginPath();
    ctx.moveTo(1, 45+48*i);
    ctx.lineTo(898, 45+48*i);
    ctx.strokeStyle="yellow"; ctx.stroke(); // y= 500 to 45
  }
  ctx.fillStyle="black"; // Number 500 km lines
  for(i=1; i<10; i++) { 
    s = (500*i)+" km";
    ctx.fillText(s, 5, 535-48*i);
  }

  ctx.lineWidth=2;
  ctx.beginPath();    // Plot midday skip
  ctx.moveTo(30, 525);
  x=30; y=700; fr=1.5;
  for ( i=0; i<174; i++) {   // loop HF frequencies
    skdi=0.0; skslm=1.0;   // assume no skip zone
    frrat = fr/nvis.fc3;    // ratio of frequency and critical foF2
    if(frrat > 1.05) {      // if over => we have skip
      for (el=0; el<90; el++) { // loop over elevation angles
        skslm = nvis.skipSlm[el];
        if(skslm>frrat) skdi=nvis.skipDist[el];
      }
    }
    if(skdi<0.0)  skdi=0.0;
    if(skdi>5000.0)  skdi=5000.0;
    y=Math.round(525 - skdi*0.096);
    ctx.lineTo(x,y);  
    x+=5;
    fr+= 0.166667;
  }
  ctx.strokeStyle = "red"; ctx.stroke();
  ctx.fillStyle="red"; ctx.fillText("Midday", 5, 65);

  ctx.beginPath();    // Plot day skip
  ctx.moveTo(30, 525);
  x=30; y=700; fr=1.5;
  for ( i=0; i<174; i++) {   // loop HF frequencies
    skdi=0.0; skslm=1.0;   // assume no skip zone
    frrat = fr/nvis.fc2;    // ratio of frequency and critical foF2
    if(frrat > 1.01) {      // if over => we have skip
      for (el=0; el<90; el++) { // loop over elevation angles
        skslm = nvis.skipSlm[el];
        if(skslm>frrat) skdi=nvis.skipDist[el];
      }
    }
    if(skdi<0.0)  skdi=0.0;
    if(skdi>5000.0)  skdi=5000.0;
    y=Math.round(525 - skdi * 0.096);   // 5000 km into 480 pixels
    ctx.lineTo(x,y);  
    x+=5;
    fr+= 0.16666667;
  }
  ctx.strokeStyle = "green"; ctx.stroke();
  ctx.fillStyle="green"; ctx.fillText("Day", 120, 65);

  ctx.beginPath();    // Plot night skip
  ctx.moveTo(30, 525);
  x=30; y=700; fr=1.5;
  for ( i=0; i<174; i++) {   // loop HF frequencies
    skdi=0.0; skslm=1.0;   // assume no skip zone
    frrat = fr/nvis.fc1;    // ratio of frequency and critical foF2
    if(frrat > 1.05) {      // if over => we have skip
      for (el=0; el<90; el++) { // loop over elevation angles
        skslm = nvis.skipSlm[el];
        if(skslm>frrat) skdi=nvis.skipDist[el];
      }
    }
    if(skdi<0.0)  skdi=0.0;
    if(skdi>5000.0)  skdi=5000.0;
    y=Math.round(525 - skdi*0.096);
    ctx.lineTo(x,y);  
    x+=5;
    fr+= 0.1666667;
  }
  ctx.strokeStyle="blue"; ctx.stroke();
  ctx.fillStyle="blue"; ctx.fillText("Night", 200, 65);
  // Add text bellow y=600
  ctx.fillStyle="blue";      y=600;
  ctx.fillText("Skip zone is zone around transmiter without signal coverage.", 1, y); y+=30;
  ctx.fillText("Skip zone is big problem for NVIS use, but OK for SkyWave.", 1, y); y+=30; 
  ctx.fillText("If we use frequency below critical foF2, there will be no skip zone.", 1, y); y+=30;
  ctx.fillText("Using frequency over critical creates skip zone with no coverage.", 1, y); y+=30;
  ctx.fillText("Higher the frequency, larger the skip zone (up to 5,000 km).", 1, y); y+=30;  
  ctx.fillText("Frequencies above 10 MHz are used for long distance (1,000 to 30,000 km).", 1, y); y+=30; 
  ctx.fillText("Low frequencies are used for 0 to 500 km.", 1, y); y+=30;
  ctx.fillText("Good NVIS freqs are 2-4 MHz during night, and 4-8 MHz during day.", 1, y); y+=30;  
}

function plotSLM(nvis) {
	console.log("Plotting SLM...")
	var slmX = []
	var SLM = []
	var slmB = []

  // Calculate SLM
  var x=1;
  for (var el=0; el<90; el++) {   // loop elevation
    var skslm = nvis.skipSlm[el];
    if(skslm<1.0)  skslm=1.0;
    if(skslm>9.0)  skslm=9.0;
    // var y=Math.round(525 - skslm*96);
    SLM.push(skslm)
    slmX.push(x)
    x+=1;
  }

  // Calculate B
  var B;
  var x = 1;
  for (el=0; el<90; el++) {   // loop elevation
    B = nvis.skipB[el];
    if(B<0)  B=0;
    if(B>90.0)  B=90.0;
    //console.log("DrawSLM  El="+el+", B="+B);
    // y=Math.round(525 - B*4.8);
    slmB.push(B)
    x+=1;
  }

	var slmSeries = {
		x: slmX,
		y: SLM,
		textfont: {family: 'Times New Roman'},
		textposition: 'bottom center',
		marker: {size: 12},
		mode: 'lines',
		type: 'scatter',
		name: "Day",
 		line: {color: '#43228f',  width: 2},
		yaxis: 'y2'
	};

	var slmBSeries = {
		x: slmX,
		y: slmB,
		textfont: {family: 'Times New Roman'},
		textposition: 'bottom center',
		marker: {size: 12},
		mode: 'lines',
		type: 'scatter',
		name: "Midday",
	};

	// Generic data for table
	var layout = {
    autosize: true,
		xaxis: {
			// range: [ 0, 26 ],
			title: { text: "EL\xB0" }
		},
		yaxis: {
			range: [0, 100],
			ticksuffix: "\xB0"
		},
		yaxis2: {
		  range: [0, 5],
		  title: 'SLM',
		  overlaying: 'y',
      side: 'right'
		},
		legend: {
			y: 1,
			yref: 'paper',
			font: {
				family: 'Arial, sans-serif',
				size: 20,
				color: 'black',
			}
		},
		title:'Secant Law Multiplier'
	};
	var config = {
		displayModeBar: false,
		responsive: true
	}
	var data = [slmSeries, slmBSeries];
	Plotly.newPlot('SNRPlot', data, layout,  config);
	document.getElementById("tooltip").innerHTML = `Critical frequency is the highest frequency Ionosphere will reflect back.
<br>Frequencies above critical will pass through Ionosphere without reflection.
<br>foF2 is critical frequency for layer F2 at vertical wave incidence.
<br>F2 will reflect vertical wave if frequency is not over foF2.
<br>Waves entering F2 layer at lower angles will have higher critical frequency fc.
<br>red
<br>This relationship is called Secant Law => fc = foF2 * sec (B).
<br>Wave is sent at elevation angle EL (horizon is 0, up is 90 degrees).
<br>Wave enters F2 layer at angle B (perpendicular is 90 degrees).
<br>blue
<br>Secant Law Multiplier SLM increases critical frequency by factor of 1 to 6.
<br>For wave entering F2 at 30 degrees critical frequency fc = 2 * foF2.`
}

function canvasSlm(nvis) {    // drawing Secant law multiplier
  console.log("canvasSlm(1)"); 
  //nvisCheck(nvis);
  var canvas = document.getElementById("myCanvas");  // find canvas element
  var ctx = canvas.getContext("2d");      // get drawing object
  ctx.clearRect(0, 45, 900, 600);
  ctx.fillStyle = "#FF0000";      // set fill style to red color
  ctx.font = "20px Arial";        // draw text
  var i, s;
  s="Secant Law Multiplier";  
  s2 = '\xB0';
  ctx.fillText(s,350, 65);

  // Plot SLM data using slm(el) and dist(el)
  // Axes x 0 to 900 => elevation =-10 to 90  => x= -100 + 10 * elevation
  // Axes y 45 to 525 (480) => angles 0-90  => y = 525 - angle* 5.33333
  // Axes y 45 to 525 (480) => SLM 0-9  => y = 525 - angle* 53.3333
  var el;
  var skslm=1.0, x, y;
  //ctx.clearRect(1, 100, 890, 1000);
  ctx.lineWidth=1;
  ctx.beginPath();
  ctx.rect(1, 45, 900, 525);
  ctx.strokeStyle="black"; ctx.stroke();

  for(i=0; i<11; i++) { // Draw 10 degrees x grid lines
    ctx.beginPath();
    ctx.moveTo(90*i, 45);
    ctx.lineTo(90*i, 525);
    ctx.strokeStyle="yellow"; ctx.stroke();
  } 
  ctx.fillStyle="black"; // Number x axes
  for(i=0; i<9; i++) { 
    s = 10*i;
    if(i==14) s="MHz";
    ctx.fillText(s, 90*i+80, 545);
  }
  s="EL ["+s2+"]"; ctx.fillText(s, 850, 545);

  for(i=0; i<11; i++) { // Draw y grid lines at spacing 48
    ctx.beginPath();
    ctx.moveTo(1, 45+48*i);
    ctx.lineTo(898, 45+48*i);
    ctx.strokeStyle="yellow"; ctx.stroke(); // y= 500 to 45
  }
  ctx.fillStyle="black"; // Number y axes
  for(i=1; i<10; i++) { 
    s = (10*i)+s2; ctx.fillText(s, 5, 535-48*i);
    s = (0.5*i).toFixed(1); ctx.fillText(s, 870, 535-48*i);
  }

  ctx.lineWidth=2;
  ctx.beginPath();    // Plot SLM
  ctx.moveTo(90, 525);
  x=90;
  for (el=0; el<90; el++) {   // loop elevation
    skslm = nvis.skipSlm[el];
    if(skslm<1.0)  skslm=1.0;
    if(skslm>9.0)  skslm=9.0;
    y=Math.round(525 - skslm*96);
    ctx.lineTo(x,y);  
    x+=9;
  }
  ctx.strokeStyle = "red";    ctx.stroke();
  ctx.fillStyle="red";        ctx.fillText("SLM", 855, 65);

  ctx.lineWidth=2;
  ctx.beginPath();    // Plot B
  ctx.moveTo(90, 525);
  x=90;
  var B;
  for (el=0; el<90; el++) {   // loop elevation
    B = nvis.skipB[el];
    if(B<0)  B=0;
    if(B>90.0)  B=90.0;
    //console.log("DrawSLM  El="+el+", B="+B);
    y=Math.round(525 - B*4.8);
    ctx.lineTo(x,y);  
    x+=9;
  }
  ctx.strokeStyle = "green"; ctx.stroke();
  ctx.fillStyle="green"; ctx.fillText("B", 5, 65);

  // Add text bellow y=600
  ctx.fillStyle="blue";      y=600; 
  ctx.fillText("Critical frequency is the highest frequency Ionosphere will reflect back.", 1, y); y+=30;
  ctx.fillText("Frequencies above critical will pass through Ionosphere without reflection.", 1, y); y+=30;
  ctx.fillText("foF2 is critical frequency for layer F2 at vertical wave incidence.", 1, y); y+=30;
  ctx.fillText("F2 will reflect vertical wave if frequency is not over foF2.", 1, y); y+=30;
  ctx.fillText("Waves entering F2 layer at lower angles will have higher critical frequency fc.", 1, y); y+=30;
  ctx.fillStyle="red";
  ctx.fillText("This relationship is called Secant Law => fc = foF2 * sec (B).", 1, y); y+=30;
  ctx.fillText("Wave is sent at elevation angle EL (horizon is 0, up is 90 degrees).", 1, y); y+=30; 
  ctx.fillText("Wave enters F2 layer at angle B (perpendicular is 90 degrees).", 1, y); y+=30; 
  ctx.fillStyle="blue";  
  ctx.fillText("Secant Law Multiplier SLM increases critical frequency by factor of 1 to 6.", 1, y); y+=30; 
  ctx.fillText("For wave entering F2 at 30 degrees critical frequency fc = 2 * foF2.", 1, y); y+=30; 
}
