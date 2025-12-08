export interface ParsedData {
    headers: string[]
    rows: Record<string, string>[]
  }
  
  export async function parseCSV(file: File): Promise<ParsedData> {
    const text = await file.text()
    const lines = text.trim().split("\n")
  
    if (lines.length === 0) {
      throw new Error("Le fichier est vide")
    }
  
    // Parse headers - handle quoted values
    const headers = parseCSVLine(lines[0])
  
    // Parse rows
    const rows: Record<string, string>[] = []
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === "") continue
      const values = parseCSVLine(lines[i])
      const row: Record<string, string> = {}
      headers.forEach((header, index) => {
        row[header.toLowerCase().trim()] = values[index] || ""
      })
      rows.push(row)
    }
  
    return { headers, rows }
  }
  
  export async function parseExcel(file: File): Promise<ParsedData> {
    // For Excel files, we can use a CSV parser if it's exported as CSV
    // Or use a library like xlsx for true Excel support
    // For now, we'll assume Excel files are CSV format
    return parseCSV(file)
  }
  
  export async function parseFile(file: File): Promise<ParsedData> {
    const extension = file.name.split(".").pop()?.toLowerCase()
  
    if (!extension || !["csv", "xlsx", "xls"].includes(extension)) {
      throw new Error("Seuls les fichiers CSV et Excel sont autorisés")
    }
  
    if (extension === "csv") {
      return parseCSV(file)
    } else {
      return parseExcel(file)
    }
  }
  
  function parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ""
    let insideQuotes = false
  
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]
  
      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          current += '"'
          i++
        } else {
          insideQuotes = !insideQuotes
        }
      } else if (char === "," && !insideQuotes) {
        result.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }
  
    result.push(current.trim())
    return result
  }
  