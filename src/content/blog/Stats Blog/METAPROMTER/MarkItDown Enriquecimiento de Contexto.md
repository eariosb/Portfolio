**Integración de MarkItDown para Enriquecimiento de Contexto**

**1. Introducción**

[MarkItDown](https://github.com/microsoft/markitdown) es una herramienta de código abierto de Microsoft que convierte diversos formatos de documentos (PDF, Word, Excel, PowerPoint, imágenes, audio, etc.) en **Markdown estructurado**. Su integración en MetaPrompter permite a los usuarios **subir documentos de referencia** (especificaciones técnicas, papers académicos, documentación de APIs, etc.) y convertirlos automáticamente en **contexto enriquecido** que se inyecta en el prompt final, mejorando la calidad y precisión de las respuestas de los agentes de IA.

**2. Beneficios para MetaPrompter**

| Beneficio | Descripción |
| --- | --- |
| **Contexto preciso** | Los agentes de IA reciben información exacta de documentos oficiales, no solo resúmenes vagos. |
| **Reducción de alucinaciones** | Al proporcionar fuentes concretas, el agente se basa en hechos en lugar de inferencias. |
| **Ahorro de tiempo** | El usuario no necesita resumir manualmente documentos largos. |
| **Formato unificado** | Todo el contenido se convierte a Markdown, consistente con el resto del prompt. |
| **Soporte multi-formato** | PDF, DOCX, PPTX, XLSX, imágenes (con OCR), HTML, etc. |

**3. Instalación y Configuración en MetaPrompter**

**3.1 Instalación**

bash

pnpm add markitdown # o npm install markitdown

Alternativamente, se puede usar la versión CLI o como servicio separado.

**3.2 Integración en el Backend (API Route)**

Creamos un endpoint /api/upload-document que recibe un archivo, lo procesa con MarkItDown y devuelve el Markdown resultante.

typescript

// app/api/upload-document/route.ts

import { NextRequest, NextResponse } from 'next/server';

import { MarkItDown } from 'markitdown';

import { writeFile, unlink } from 'fs/promises';

import { join } from 'path';

import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {

try {

const formData = await request.formData();

const file = formData.get('file') as File;

if (!file) {

return NextResponse.json({ error: 'No file provided' }, { status: 400 });

}

// Guardar temporalmente

const bytes = await file.arrayBuffer();

const buffer = Buffer.from(bytes);

const tempPath = join('/tmp', `${randomUUID()}-${file.name}`);

await writeFile(tempPath, buffer);

// Procesar con MarkItDown

const markitdown = new MarkItDown();

const result = await markitdown.convert(tempPath);

// Limpiar archivo temporal

await unlink(tempPath);

return NextResponse.json({

success: true,

markdown: result.textContent,

fileName: file.name,

fileSize: file.size,

});

} catch (error) {

console.error('Error processing document:', error);

return NextResponse.json(

{ error: 'Failed to process document' },

{ status: 500 }

);

}

}

**3.3 Componente de UI para Subida de Documentos**

tsx

// components/shared/DocumentUploader.tsx

"use client";

import { useState } from 'react';

import { useStore } from '@/lib/store';

import { Button } from '@/components/ui/button';

import { Card, CardContent } from '@/components/ui/card';

import { Input } from '@/components/ui/input';

import { Loader2, Upload, FileText, X } from 'lucide-react';

export function DocumentUploader() {

const [uploading, setUploading] = useState(false);

const [docs, setDocs] = useState<{ name: string; content: string }[]>([]);

const addDocumentContext = useStore((state) => state.addDocumentContext);

const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

const file = e.target.files?.[0];

if (!file) return;

setUploading(true);

const formData = new FormData();

formData.append('file', file);

try {

const res = await fetch('/api/upload-document', {

method: 'POST',

body: formData,

});

const data = await res.json();

if (data.success) {

const newDoc = { name: data.fileName, content: data.markdown };

setDocs([...docs, newDoc]);

addDocumentContext(newDoc);

}

} catch (error) {

console.error('Upload failed:', error);

} finally {

setUploading(false);

e.target.value = ''; // reset input

}

};

const removeDoc = (index: number) => {

const newDocs = docs.filter((\_, i) => i !== index);

setDocs(newDocs);

// Actualizar store

};

return (

<Card className="w-full">

<CardContent className="p-4 space-y-4">

<div className="flex items-center gap-4">

<Input

type="file"

accept=".pdf,.docx,.pptx,.xlsx,.png,.jpg,.html,.txt"

onChange={handleUpload}

disabled={uploading}

className="flex-1"

/>

<Button variant="outline" disabled={uploading}>

{uploading ? <Loader2 className="animate-spin" /> : <Upload />}

Upload

</Button>

</div>

{docs.length > 0 && (

<div className="space-y-2">

{docs.map((doc, i) => (

<div key={i} className="flex items-center justify-between p-2 bg-muted rounded">

<div className="flex items-center gap-2">

<FileText className="h-4 w-4" />

<span className="text-sm truncate max-w-xs">{doc.name}</span>

</div>

<Button

variant="ghost"

size="sm"

onClick={() => removeDoc(i)}

className="h-6 w-6 p-0"

>

<X className="h-4 w-4" />

</Button>

</div>

))}

</div>

)}

</CardContent>

</Card>

);

}

**3.4 Inyección en el Prompt Final**

El contenido Markdown de los documentos subidos se añade como una sección adicional en el prompt generado.

typescript

// lib/prompt/generator.ts

export function generatePrompt(state: MetaPrompterState): string {

let prompt = baseTemplate(state);

// Añadir documentos si existen

if (state.documents && state.documents.length > 0) {

prompt += '\n\n## Documentos de Referencia (Contexto Adicional)\n\n';

for (const doc of state.documents) {

prompt += `### ${doc.name}\n\n${doc.content}\n\n`;

}

}

return prompt;

}

**4. Experiencia de Usuario**

El flujo integrado en MetaPrompter:

1. **Usuario** llega al paso correspondiente (ej. "Arquitectura" o "Seguridad").
2. **Opción** "Cargar documento de referencia" en el panel de configuración o en el panel lateral de referencias.
3. **Selecciona** un archivo desde su equipo.
4. **MarkItDown** convierte el documento a Markdown en el servidor.
5. **El contenido** se añade al estado global y aparece en el panel de "Documentos cargados".
6. **El prompt final** incluye todo el contenido Markdown en la sección "Contexto Adicional".
7. **El agente IA** recibe este contexto enriquecido al generar el código.

**5. Consideraciones Técnicas**

| Aspecto | Solución |
| --- | --- |
| **Tamaño de archivo** | Limitar a 10 MB por documento (configurable). |
| **Formato de salida** | MarkItDown devuelve texto plano Markdown. Se puede sanitizar para evitar inyección de código malicioso. |
| **Rendimiento** | Procesar en segundo plano con cola de tareas si los documentos son grandes. |
| **Privacidad** | Los documentos se procesan en el servidor y no se almacenan permanentemente (solo en memoria durante la sesión). |
| **Compatibilidad** | MarkItDown soporta PDF, DOCX, PPTX, XLSX, imágenes (con OCR), HTML, y más. |

**6. Mejoras Futuras**

* **Resumen automático**: Usar un LLM para resumir documentos largos antes de inyectarlos.
* **Extracción de términos clave**: Identificar automáticamente conceptos relevantes para el proyecto.
* **Carga por URL**: Permitir cargar documentos desde URLs públicas.
* **Soporte para múltiples idiomas**: MarkItDown ya maneja varios idiomas en OCR.

**7. Enlaces de Referencia**

* [Repositorio oficial de MarkItDown](https://github.com/microsoft/markitdown)
* [Documentación de uso](https://github.com/microsoft/markitdown?tab=readme-ov-file#documentation)
* [Ejemplos de conversión](https://github.com/microsoft/markitdown/tree/main/examples)

**8. Conclusión**

La integración de MarkItDown en MetaPrompter convierte la herramienta en un **sistema de gestión de conocimiento** que va más allá de un simple generador de prompts. Permite a los usuarios **alimentar a los agentes de IA con información precisa y contextualizada**, mejorando drásticamente la calidad del código generado. Esta funcionalidad es especialmente valiosa para equipos que trabajan con documentación técnica extensa, estándares de cumplimiento o especificaciones detalladas.