import { NextRequest, NextResponse } from 'next/server'
import ExcelJS from 'exceljs'
import path from 'path'
import fs from 'fs/promises'

export async function POST(req: NextRequest) {
  try {
    const { invoiceNumber, description, company, template } = await req.json()

    // Load the template Excel file
    const templatePath = path.join(process.cwd(), 'public', `${company}-${template}.xlsx`)
      try {
        await fs.access(templatePath, fs.constants.R_OK | fs.constants.W_OK);
        console.log('can access');
      } catch {
        console.error('cannot access');
        return NextResponse.json({ error: `No Template configured for Company(${company}) - Client(${template}).` }, { status: 300 })
      }

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(templatePath)

    // Get the first worksheet
    const worksheet = workbook.worksheets[0]

    // Update cell C11 with the invoice number
    const cell = worksheet.getCell('F7')
    cell.value = invoiceNumber

    // Write the updated workbook to a buffer
    const buffer = await workbook.xlsx.writeBuffer()

    // Set the appropriate headers for file download
    const headers = new Headers()
    headers.append('Content-Disposition', `attachment; filename="Invoice-${invoiceNumber}-${company}-${template}.xlsx"`)
    headers.append('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

    // Return the file as a downloadable response
    return new NextResponse(buffer, { status: 200, headers })
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 })
  }
}