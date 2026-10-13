const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const docx = process.argv[2];
const tmp = path.join(os.tmpdir(), `cl-verify-${Date.now()}`);
const zip = `${tmp}.zip`;
fs.rmSync(tmp, { recursive: true, force: true });
fs.mkdirSync(tmp, { recursive: true });
fs.copyFileSync(docx, zip);

const ps = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory('${zip.replace(/\\/g, "\\\\")}', '${tmp.replace(/\\/g, "\\\\")}')
`;
execFileSync("powershell.exe", ["-NoProfile", "-Command", ps], { stdio: "inherit" });
const xml = fs.readFileSync(path.join(tmp, "word", "document.xml"), "utf8");
const checks = [
  "aplicación",
  "información",
  "Marroquín",
  "especificación",
  "Justificación",
  "aplicaciÃ³n",
];
for (const c of checks) console.log(xml.includes(c) ? "OK" : "NO", c);
const accents = [...xml.matchAll(/[áéíóúñÁÉÍÓÚÑüÜ][\wÁÉÍÓÚÑáéíóúñüÜ]{0,20}/g)]
  .slice(0, 25)
  .map((m) => m[0]);
console.log("accents:", accents.join(" | "));
