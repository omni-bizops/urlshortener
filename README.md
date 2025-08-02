# 🔗 URL Shortener

Ein moderner, schöner URL-Shortener mit QR-Code Generation und lokaler Speicherung.

## ✨ Features

- **URL Verkürzung**: Verkürze lange URLs zu kurzen, benutzerfreundlichen Links
- **QR-Code Generation**: Automatische QR-Code Erstellung für jeden verkürzten Link
- **Lokale Speicherung**: Alle Links werden im Browser gespeichert (keine Server-Datenbank nötig)
- **Kopieren**: Ein-Klick Kopieren der verkürzten URLs
- **Verlauf**: Anzeige der kürzlich verkürzten Links
- **Responsive Design**: Funktioniert perfekt auf Desktop und Mobile
- **Moderne UI**: Schönes, animiertes Design mit Gradient-Hintergrund

## 🚀 Installation & Verwendung

### Einfache Verwendung
1. Öffne die `index.html` Datei in deinem Browser
2. Das war's! Die App funktioniert sofort ohne Installation

### Oder mit lokaler Server (empfohlen)
```bash
# Mit Python 3
python3 -m http.server 8000

# Oder mit Node.js (falls installiert)
npx serve .

# Dann öffne: http://localhost:8000
```

## 📱 Wie es funktioniert

1. **URL eingeben**: Füge eine lange URL in das Eingabefeld ein
2. **Verkürzen**: Klicke auf "Verkürzen" oder drücke Enter
3. **Kopieren**: Kopiere den verkürzten Link mit einem Klick
4. **QR-Code**: Lade den QR-Code herunter oder scanne ihn direkt
5. **Verwaltung**: Siehe und verwalte deine kürzlich erstellten Links

## 🛠️ Technische Details

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **QR-Codes**: QRCode.js Library
- **Icons**: Font Awesome
- **Schriftart**: Inter (Google Fonts)
- **Speicherung**: LocalStorage API
- **Keine Abhängigkeiten**: Funktioniert komplett offline

## 📁 Projektstruktur

```
url-shortener/
├── index.html          # Haupt-HTML-Datei
├── style.css           # CSS-Styles
├── script.js           # JavaScript-Funktionalität
└── README.md           # Diese Datei
```

## 🔧 Anpassungen

### Eigene Domain
Um eine eigene Domain zu verwenden, ändere in `script.js`:

```javascript
// Zeile 89: Ändere diese Zeile
const shortUrl = `https://deine-domain.com/#${shortCode}`;
```

### Andere Farben
Die Hauptfarben können in `style.css` angepasst werden:

```css
/* Haupt-Gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Button-Farben */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## 🌟 Erweiterte Features

### Geplante Features
- [ ] Klick-Statistiken
- [ ] Benutzerdefinierte Kurzlinks
- [ ] Link-Ablaufdatum
- [ ] Passwort-geschützte Links
- [ ] API für externe Integration

### Browser-Kompatibilität
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 📄 Lizenz

Dieses Projekt ist Open Source und unter der MIT-Lizenz verfügbar.

## 🤝 Beitragen

Verbesserungen und Bug-Reports sind willkommen! Erstelle einfach ein Issue oder Pull Request.

---

**Viel Spaß beim Verkürzen deiner URLs! 🎉** 