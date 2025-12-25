const fs = require('fs');
const path = require('path');

async function main() {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  
  const documentsPath = path.join(__dirname, '../public/assets/documents');
  const files = fs.readdirSync(documentsPath).filter(f => f.endsWith('.pdf'));
  
  console.log(`Found ${files.length} PDF files\n`);
  
  let output = '';
  
  for (const file of files) {
    const filePath = path.join(documentsPath, file);
    console.log(`Processing: ${file}`);
    
    try {
      const data = new Uint8Array(fs.readFileSync(filePath));
      const loadingTask = pdfjsLib.getDocument({ data });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      
      // Extract text from all pages to find résumé
      const pagesToRead = Math.min(pdf.numPages, 15);
      
      for (let i = 1; i <= pagesToRead; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += `\n--- PAGE ${i} ---\n${pageText}`;
      }
      
      output += '\n' + '='.repeat(80) + '\n';
      output += 'FILE: ' + file + '\n';
      output += '='.repeat(80) + '\n';
      output += fullText + '\n\n';
      
    } catch (error) {
      output += `Error processing ${file}: ${error.message}\n`;
    }
  }
  
  // Write to file
  fs.writeFileSync(path.join(__dirname, 'pdf-full-text.txt'), output, 'utf8');
  console.log('\nOutput written to scripts/pdf-full-text.txt');
}

main().catch(console.error);
