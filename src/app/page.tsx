'use client'

import React, { useState } from 'react'
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'
import { SAFFRON_TEMPLATES } from '../global';

//C:\ws\nanosoft-dashboard\src\public\template_T1.xlsx

export default function Home() {
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [description, setDescription] = useState('')
  const [template, setTemplate] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const response = await fetch('/api/generate-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invoiceNumber, description, template }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invoice_${invoiceNumber}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        console.error('Failed to generate invoice')
      }
    } catch (error) {
      console.error('Error generating invoice:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Typography variant="h4" component="h1" className="mb-6 text-center text-gray-800">
          Invoice Generator
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Invoice Number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            required
            className="bg-gray-50"
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="bg-gray-50"
          />
          <FormControl fullWidth required>
            <InputLabel id="template-select-label">Template</InputLabel>
            <Select
              labelId="template-select-label"
              value={template}
              label="Template"
              onChange={(e: SelectChangeEvent) => setTemplate(e.target.value)}
              className="bg-gray-50"
            >
              {SAFFRON_TEMPLATES.map((template: string) => (
                <MenuItem value={template}>{template}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md transition duration-300"
          >
            Generate Invoice
          </Button>
        </form>
      </div>
    </div>
  )
}