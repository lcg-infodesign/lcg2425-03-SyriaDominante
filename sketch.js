// variabili e colori
let data; 
let pageColor = "#000032";
let textColor = "#ffc9dd";
let circleColor = "#ffc9dd";
let padding = 100; 
let scrollOffset = 0; // scorrimento
let tooltipText = ""; // testo del tooltip
let tooltipX, tooltipY; // posizione del tooltip

function preload() {
  data = loadTable("data.csv", "csv", "header", () => {
    console.log("Dati caricati con successo!");
    console.log("Numero di righe:", data.getRowCount());
  }, (error) => {
    console.error("Errore nel caricamento dei dati: ", error);
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(LEFT, TOP);
  textFont('Arial');  
  smooth();
}

function draw() {
  background(pageColor); 

  // Titolo
  textStyle(BOLD);
  textSize(40);
  fill(textColor);
  text("RIVERS IN THE WORLD", 100, 70 - scrollOffset);
  
  let x = padding; 
  let y = padding + 60 - scrollOffset; 

  let foundTooltip = false;

  if (data && data.getRowCount() > 0) {
    for (let i = 0; i < data.getRowCount(); i++) {
      let rowData = data.rows[i].obj; 

      if (y > height || y + 100 < 0) {
        y += 100;
        continue;
      }

      // Disegna nome del fiume e dei paesi
      textStyle(BOLD);
      textSize(16);
      fill(textColor);
      text(`${rowData.name}`, x, y);

      textStyle(NORMAL);
      textSize(13); 
      fill(textColor);
      text(`${rowData.countries}`, x, y + 20);

      // Calcola le dimensioni dei cerchi
      let lengthSize = map(rowData.length, 0, 7000, 10, 100); 
      let areaSize = map(rowData.area, 0, 1000000, 10, 100); 
      let dischargeSize = map(rowData.discharge, 0, 100000, 10, 100); 
      let tributariesSize = map(rowData.tributaries, 0, 50, 10, 100); 
      let avgTempSize = map(rowData.avg_temp, -10, 40, 10, 100); 

      lengthSize = min(lengthSize, 50);
      areaSize = min(areaSize, 50);
      dischargeSize = min(dischargeSize, 50);
      tributariesSize = min(tributariesSize, 50);
      avgTempSize = min(avgTempSize, 50);

      // Posizioni e dettagli dei cerchi
      let circles = [
        { x: x + 1000, size: lengthSize, category: "Length", value: rowData.length },
        { x: x + 1050, size: areaSize, category: "Area", value: rowData.area },
        { x: x + 1100, size: dischargeSize, category: "Discharge", value: rowData.discharge },
        { x: x + 1150, size: tributariesSize, category: "Tributaries", value: rowData.tributaries },
        { x: x + 1200, size: avgTempSize, category: "Avg Temp", value: rowData.avg_temp },
      ];

      // Disegna i cerchi e verifica se il mouse è sopra uno di essi --> far apparire targa con valore e categoria
      for (let circle of circles) {
        fill(circleColor);
        stroke(0);
        ellipse(circle.x, y + 10, circle.size, circle.size);

        if (dist(mouseX, mouseY, circle.x, y + 10) < circle.size / 2) {
          tooltipText = `${circle.category}: ${circle.value}`; 
          tooltipX = mouseX + 10;
          tooltipY = mouseY - 10;
          foundTooltip = true;
        }
      }
      
      // linea che attraversa i pallini (non ha funzioni per la rappresentazione, è puramente estetica)
      fill(circleColor);
      stroke(circleColor);
      strokeWeight(1);
      line(x + 950, y + 10, x + 1250, y + 10); 

      y += 100;
    }
  } else {
    fill(textColor);
    textSize(20);
    text("Caricamento dei dati non riuscito o file vuoto.", x, y);
  }

  // mostra il tooltip se necessario
  if (foundTooltip) {
    fill(255);
    stroke(0);
    rect(tooltipX, tooltipY, textWidth(tooltipText) + 10, 25, 5);
    fill(0);
    noStroke();
    textAlign(LEFT, CENTER);
    text(tooltipText, tooltipX + 5, tooltipY + 12);
  }
}

// funzione di scorrimento verso il basso
function mouseWheel(event) {
  scrollOffset += event.delta * 0.1; 
  scrollOffset = constrain(scrollOffset, 0, data.getRowCount() * 100 - height + 120); 
}

// adattabilità quando lo schermo viene rimpicciolino o ingrandito
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

