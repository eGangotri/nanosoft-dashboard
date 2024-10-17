'use client'

import React, { useState, useEffect } from 'react'
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'
import { COMPANIES, COMPANIES_AND_TEMPLATES } from '@/global'

export default function Home() {
    const [invoiceNumber, setInvoiceNumber] = useState('')
    const [description, setDescription] = useState('')
    const [company, setCompany] = useState<keyof typeof COMPANIES_AND_TEMPLATES | ''>('')
    const [template, setTemplate] = useState('')

    useEffect(() => {
        // Reset template when company changes
        setTemplate('')
    }, [company])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const response = await fetch('/api/generate-invoice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ invoiceNumber, description, company, template }),
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
                const _resp = await response.json()
                console.error('Failed to generate Invoice. ' + _resp?.error)
                alert('Failed to generate Invoice.\n' + _resp?.error)
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
                        <InputLabel id="company-select-label">Company</InputLabel>
                        <Select
                            labelId="company-select-label"
                            value={company}
                            label="Company"
                            onChange={(e: SelectChangeEvent) => setCompany(e.target.value as keyof typeof COMPANIES_AND_TEMPLATES)}
                            className="bg-gray-50"
                        >
                            {COMPANIES.map((option: string) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth required disabled={!company}>
                        <InputLabel id="template-select-label">Template</InputLabel>
                        <Select
                            labelId="template-select-label"
                            value={template}
                            label="Template"
                            onChange={(e: SelectChangeEvent) => setTemplate(e.target.value)}
                            className="bg-gray-50"
                        >
                            {company && COMPANIES_AND_TEMPLATES[company].map((option: string) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
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