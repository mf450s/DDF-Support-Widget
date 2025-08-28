let fm = FileManager.iCloud();
let ordnername = "Drei Fragezeichen";
let ordnerPfad = fm.joinPath(fm.documentsDirectory(), ordnername);

// Stelle sicher, dass Ordner existiert
if (!fm.fileExists(ordnerPfad)) {
  throw new Error(`Ordner '${ordnername}' nicht gefunden.`);
}

// Alle PNG-Dateien im Ordner sammeln
let dateien = fm.listContents(ordnerPfad).filter((name) => {
  let pfad = fm.joinPath(ordnerPfad, name);
  return name.toLowerCase().endsWith(".png") && !fm.isDirectory(pfad);
});

if (dateien.length === 0) {
  throw new Error("Keine PNG-Dateien im Ordner gefunden.");
}

// Zufällige Datei auswählen
let zufallsDatei = dateien[Math.floor(Math.random() * dateien.length)];
let bildPfad = fm.joinPath(ordnerPfad, zufallsDatei);

// iCloud-Datei sicherstellen
await fm.downloadFileFromiCloud(bildPfad);
let bild = fm.readImage(bildPfad);

// Widget erstellen
let widget = new ListWidget();
widget.backgroundImage = bild;

// Shortcut-URL setzen (mit Dateiname als input-Parameter)
let shortcutName = "Scr DDF Folge abspielen"; // Ändern!
let url =
  "shortcuts://run-shortcut?name=" +
  encodeURIComponent(shortcutName) +
  "&input=" +
  encodeURIComponent(zufallsDatei);

// Ganz am Ende deines Scripts:
let scriptName = Script.name(); // Holt den aktuellen Skriptnamen
let url2 = "scriptable:///run?scriptName=" + encodeURIComponent(scriptName);

widget.url = url; // aktuell wird url genutzt, nicht url2

Script.setWidget(widget);
Script.complete();
